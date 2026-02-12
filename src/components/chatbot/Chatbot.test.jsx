import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PixelDots from './PixelDots';
import ChatMessage from './ChatMessage';
import ChatWindow from './ChatWindow';
import Chatbot from './Chatbot';

// Mock useChatbot so Chatbot.jsx never touches fetch in unit tests
vi.mock('../../utils/useChatbot', () => ({
  useChatbot: () => ({
    messages: [{ role: 'assistant', content: 'Greetings, adventurer!' }],
    isTyping: false,
    isLimitReached: false,
    error: null,
    sendMessage: vi.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// PixelDots
// ---------------------------------------------------------------------------
describe('PixelDots', () => {
  it('renders three bouncing dots', () => {
    const { container } = render(<PixelDots />);
    const dots = container.querySelectorAll('span');
    expect(dots).toHaveLength(3);
  });

  it('has an accessible aria-label', () => {
    render(<PixelDots />);
    expect(screen.getByLabelText('Thinking...')).toBeInTheDocument();
  });

  it('applies staggered animation delays to each dot', () => {
    const { container } = render(<PixelDots />);
    const dots = container.querySelectorAll('span');
    expect(dots[0].style.animationDelay).toBe('0s');
    expect(dots[1].style.animationDelay).toBe('0.15s');
    expect(dots[2].style.animationDelay).toBe('0.3s');
  });
});

// ---------------------------------------------------------------------------
// ChatMessage
// ---------------------------------------------------------------------------
describe('ChatMessage', () => {
  it('renders SALIM BOT label for assistant role', () => {
    render(<ChatMessage role="assistant" content="Hello!" />);
    expect(screen.getByText('⚔ SALIM BOT')).toBeInTheDocument();
  });

  it('renders PLAYER label for user role', () => {
    render(<ChatMessage role="user" content="Hi there" />);
    expect(screen.getByText('▶ PLAYER')).toBeInTheDocument();
  });

  it('shows message content when provided', () => {
    render(<ChatMessage role="assistant" content="I know React!" />);
    expect(screen.getByText('I know React!')).toBeInTheDocument();
  });

  it('shows PixelDots when bot message has empty content (streaming pending)', () => {
    render(<ChatMessage role="assistant" content="" />);
    // PixelDots renders a div with aria-label "Thinking..."
    expect(screen.getByLabelText('Thinking...')).toBeInTheDocument();
  });

  it('does not show PixelDots for non-empty bot message', () => {
    render(<ChatMessage role="assistant" content="Done thinking!" />);
    expect(screen.queryByLabelText('Thinking...')).not.toBeInTheDocument();
  });

  it('does not show PixelDots for empty user message', () => {
    render(<ChatMessage role="user" content="" />);
    expect(screen.queryByLabelText('Thinking...')).not.toBeInTheDocument();
  });

  it('aligns bot messages to the left', () => {
    const { container } = render(<ChatMessage role="assistant" content="Hi" />);
    expect(container.firstChild).toHaveClass('items-start');
  });

  it('aligns player messages to the right', () => {
    const { container } = render(<ChatMessage role="user" content="Hi" />);
    expect(container.firstChild).toHaveClass('items-end');
  });
});

// ---------------------------------------------------------------------------
// ChatWindow
// ---------------------------------------------------------------------------
describe('ChatWindow', () => {
  const defaultProps = {
    messages: [{ role: 'assistant', content: 'Greetings!' }],
    isTyping: false,
    isLimitReached: false,
    error: null,
    onSend: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the SALIM BOT header', () => {
    render(<ChatWindow {...defaultProps} />);
    expect(screen.getByText('SALIM BOT')).toBeInTheDocument();
  });

  it('renders existing messages', () => {
    render(<ChatWindow {...defaultProps} />);
    expect(screen.getByText('Greetings!')).toBeInTheDocument();
  });

  it('calls onClose when [X] button is clicked', async () => {
    render(<ChatWindow {...defaultProps} />);
    await userEvent.click(screen.getByLabelText('Close chat'));
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  it('renders the text input field', () => {
    render(<ChatWindow {...defaultProps} />);
    expect(screen.getByPlaceholderText('Ask your question...')).toBeInTheDocument();
  });

  it('calls onSend with trimmed message on form submit', async () => {
    render(<ChatWindow {...defaultProps} />);
    const input = screen.getByPlaceholderText('Ask your question...');
    await userEvent.type(input, 'What is your stack?');
    await userEvent.click(screen.getByRole('button', { name: /▶/i }));
    expect(defaultProps.onSend).toHaveBeenCalledWith('What is your stack?');
  });

  it('does not call onSend when input is empty', async () => {
    render(<ChatWindow {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: /▶/i }));
    expect(defaultProps.onSend).not.toHaveBeenCalled();
  });

  it('disables input while isTyping is true', () => {
    render(<ChatWindow {...defaultProps} isTyping={true} />);
    expect(screen.getByPlaceholderText('Ask your question...')).toBeDisabled();
  });

  it('shows session-limit message when isLimitReached is true', () => {
    render(<ChatWindow {...defaultProps} isLimitReached={true} />);
    expect(screen.getByText(/QUEST COMPLETE/i)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Ask your question...')).not.toBeInTheDocument();
  });

  it('shows error banner when error prop is provided', () => {
    render(<ChatWindow {...defaultProps} error="Connection lost. Please try again." />);
    expect(screen.getByText('Connection lost. Please try again.')).toBeInTheDocument();
  });

  it('does not show error banner when error is null', () => {
    render(<ChatWindow {...defaultProps} error={null} />);
    expect(screen.queryByText(/connection lost/i)).not.toBeInTheDocument();
  });

  it('clears input after successful submit', async () => {
    render(<ChatWindow {...defaultProps} />);
    const input = screen.getByPlaceholderText('Ask your question...');
    await userEvent.type(input, 'Hello');
    await userEvent.click(screen.getByRole('button', { name: /▶/i }));
    expect(input).toHaveValue('');
  });

  it('calls onClose when swiped down more than 80px', () => {
    const { container } = render(<ChatWindow {...defaultProps} />);
    const chatDiv = container.firstChild;

    fireEvent.touchStart(chatDiv, { touches: [{ clientY: 100 }] });
    fireEvent.touchEnd(chatDiv, { changedTouches: [{ clientY: 190 }] });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not call onClose when swiped down less than 80px', () => {
    const { container } = render(<ChatWindow {...defaultProps} />);
    const chatDiv = container.firstChild;

    fireEvent.touchStart(chatDiv, { touches: [{ clientY: 100 }] });
    fireEvent.touchEnd(chatDiv, { changedTouches: [{ clientY: 150 }] });

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Chatbot (orchestrator)
// ---------------------------------------------------------------------------
describe('Chatbot', () => {
  it('renders the avatar button', () => {
    render(<Chatbot />);
    expect(screen.getByLabelText('Open chatbot')).toBeInTheDocument();
  });

  it('shows the coding emoji when chat is closed', () => {
    render(<Chatbot />);
    expect(screen.getByText('🧑‍💻')).toBeInTheDocument();
  });

  it('shows the pulsing notification dot when chat is closed', () => {
    const { container } = render(<Chatbot />);
    // The pulsing dot has animate-pulse class
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('opens the chat window when avatar is clicked', async () => {
    render(<Chatbot />);
    await userEvent.click(screen.getByLabelText('Open chatbot'));
    expect(screen.getByText('SALIM BOT')).toBeInTheDocument();
  });

  it('hides the pulsing dot when chat is open', async () => {
    const { container } = render(<Chatbot />);
    await userEvent.click(screen.getByLabelText('Open chatbot'));
    expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
  });

  it('closes the chat window when avatar is clicked again', async () => {
    render(<Chatbot />);
    const button = screen.getByLabelText('Open chatbot');
    await userEvent.click(button);
    expect(screen.getByText('SALIM BOT')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Close chatbot'));
    expect(screen.queryByText('SALIM BOT')).not.toBeInTheDocument();
  });

  it('closes the chat window via the ChatWindow [X] button', async () => {
    render(<Chatbot />);
    await userEvent.click(screen.getByLabelText('Open chatbot'));
    await userEvent.click(screen.getByLabelText('Close chat'));
    expect(screen.queryByText('SALIM BOT')).not.toBeInTheDocument();
  });
});