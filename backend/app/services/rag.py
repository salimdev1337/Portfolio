
import asyncio
import logging
from pathlib import Path
from typing import List

import chromadb
import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# Path to the knowledge base directory (relative to the backend/ folder)
KNOWLEDGE_DIR = Path(__file__).parent.parent.parent / "knowledge"

# Google Generative Language REST endpoint for text-embedding-004.
# batchEmbedContents only exists on Vertex AI; the public API only exposes
# embedContent (single). We fan out concurrent single calls for batch work.
_EMBED_URL = (
    "https://generativelanguage.googleapis.com"
    "/v1beta/models/text-embedding-004:embedContent"
)

# ChromaDB collection name
COLLECTION_NAME = "portfolio_knowledge"


class RAGService:
    """
    Handles document loading, embedding, and similarity search.

    Uses Gemini's text-embedding-004 REST API instead of a local model,
    which avoids the ~500MB PyTorch dependency on deployment.

    Usage:
        rag = RAGService()
        await rag.initialize()          # call once at startup
        chunks = await rag.query("your stack?", n_results=3)
    """

    def __init__(self):
        self._chroma = None       # ChromaDB in-memory client
        self._collection = None   # ChromaDB collection holding our vectors
        self._initialized = False

    # ------------------------------------------------------------------
    # Embedding helpers (direct REST — bypasses SDK version quirks)
    # ------------------------------------------------------------------

    async def _embed(self, text: str) -> List[float]:
        """Embed a single text via the embedContent REST endpoint."""
        payload = {"content": {"parts": [{"text": text}]}}
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                _EMBED_URL,
                headers={"x-goog-api-key": settings.gemini_api_key},
                json=payload,
            )
            response.raise_for_status()
        return list(response.json()["embedding"]["values"])

    async def _embed_many(self, texts: List[str]) -> List[List[float]]:
        """
        Embed multiple texts concurrently.
        batchEmbedContents is Vertex-AI-only; we fan out single calls instead.
        """
        return list(await asyncio.gather(*[self._embed(t) for t in texts]))

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def initialize(self) -> None:
        """
        Load knowledge files, embed all chunks, and populate ChromaDB.
        This runs once at application startup via the lifespan handler.
        """
        logger.info("Initializing RAG service — using Gemini text-embedding-004...")

        # Create an in-memory ChromaDB client (no disk writes)
        self._chroma = chromadb.EphemeralClient()

        # Create the collection — we provide our own embeddings so ChromaDB
        # doesn't try to run its own local embedding function
        self._collection = self._chroma.create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},  # cosine similarity for semantic search
        )

        # Load and chunk all markdown files from the knowledge directory
        chunks, chunk_ids, sources = self._load_knowledge_base()

        if not chunks:
            logger.warning("No knowledge chunks found — chatbot will have no context!")
            return

        # Embed all chunks via concurrent embedContent calls
        logger.info(f"Embedding {len(chunks)} chunks via Gemini REST API...")
        embeddings = await self._embed_many(chunks)

        # Store chunks + their embeddings in ChromaDB
        self._collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=chunk_ids,
            metadatas=[{"source": s} for s in sources],
        )

        self._initialized = True
        logger.info(
            f"RAG service ready — {len(chunks)} chunks indexed from {KNOWLEDGE_DIR}"
        )

    def _load_knowledge_base(self) -> tuple[List[str], List[str], List[str]]:
        """
        Read all .md files from the knowledge directory and split into chunks.

        Each paragraph (separated by a blank line) becomes one chunk.
        This works well because the knowledge files were written
        with one idea per paragraph — a natural semantic unit.

        Returns:
            chunks:    list of text strings (one per paragraph)
            chunk_ids: unique ID for each chunk (used by ChromaDB)
            sources:   filename each chunk came from (for debugging)
        """
        chunks: List[str] = []
        chunk_ids: List[str] = []
        sources: List[str] = []

        if not KNOWLEDGE_DIR.exists():
            logger.error(f"Knowledge directory not found: {KNOWLEDGE_DIR}")
            return chunks, chunk_ids, sources

        for md_file in sorted(KNOWLEDGE_DIR.glob("*.md")):
            file_name = md_file.stem  # e.g. "personal", "professional"
            text = md_file.read_text(encoding="utf-8")

            # Split on double newlines — each paragraph = one chunk
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

            for i, paragraph in enumerate(paragraphs):
                # Skip very short chunks (less than 20 chars — likely blank/headers)
                if len(paragraph) < 20:
                    continue

                chunk_id = f"{file_name}_{i}"
                chunks.append(paragraph)
                chunk_ids.append(chunk_id)
                sources.append(file_name)

            logger.debug(f"Loaded {len(paragraphs)} chunks from {md_file.name}")

        return chunks, chunk_ids, sources

    async def query(self, question: str, n_results: int = 3) -> List[str]:
        """
        Find the most semantically relevant chunks for a given question.

        How it works:
          1. Embed the question via Gemini REST API (same model as stored chunks)
          2. ChromaDB computes cosine similarity between the question vector
             and all stored chunk vectors
          3. Return the top-N closest chunks as plain text strings

        Args:
            question:  The user's question (already sanitized)
            n_results: How many chunks to return (default 3)

        Returns:
            List of relevant text chunks to inject into the Gemini prompt
        """
        if not self._initialized:
            logger.warning("RAG service queried before initialization")
            return []

        # Embed the question (same model = compatible vector space)
        question_vector = await self._embed(question)

        results = self._collection.query(
            query_embeddings=[question_vector],
            n_results=min(n_results, self._collection.count()),
        )

        # results["documents"] is a list of lists — we want the inner list
        documents = results.get("documents", [[]])[0]
        return list(documents)
