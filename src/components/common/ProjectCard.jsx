import { Card, Button } from './index';

const ProjectCard = ({ project }) => {
  const { title, category, difficulty, description, features, techStack, demoUrl, githubUrl, image } = project;

  const getDifficultyStars = (diff) => {
    return '⭐'.repeat(diff);
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      gaming: '🎮',
      enterprise: '💼',
      ai: '🤖',
      mobile: '📱',
      web: '🌐'
    };
    return icons[cat] || '💻';
  };

  return (
    <Card className="flex flex-col h-full hover:transform hover:scale-105 transition-transform duration-200 group">
      {/* Project Image/Preview */}
      {image && (
        <div className="mb-4 w-full h-48 bg-[var(--bg-primary)] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden pixel-corners">
          {/* Placeholder for project screenshot */}
          <div className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">
            {getCategoryIcon(category)}
          </div>
        </div>
      )}

      {/* Quest Type Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-pixel text-[8px] text-[var(--accent)] bg-[var(--accent)] bg-opacity-20 px-2 py-1 inline-block">
          {difficulty <= 3 ? 'SIDE QUEST' : 'MAIN QUEST'}
        </span>
        <span className="font-mono text-xs text-[var(--accent)]">
          {getDifficultyStars(difficulty)}
        </span>
      </div>

      {/* Project Title */}
      <h3 className="font-pixel text-sm text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent)] transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="font-mono text-xs text-[var(--text-secondary)] mb-4 flex-grow">
        {description}
      </p>

      {/* Features */}
      {features && features.length > 0 && (
        <div className="mb-4">
          <p className="font-pixel text-[8px] text-[var(--accent)] mb-2">KEY FEATURES:</p>
          <ul className="space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="font-mono text-[10px] text-[var(--text-secondary)] flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">▸</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Stack */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="font-mono text-[10px] px-2 py-1 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        {demoUrl && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => window.open(demoUrl, '_blank')}
          >
            <span className="text-xs">🎮</span> Demo
          </Button>
        )}
        {githubUrl && (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => window.open(githubUrl, '_blank')}
          >
            <span className="text-xs">💻</span> Code
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
