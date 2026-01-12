import { Star } from 'lucide-react';
import { GITHUB_REPO } from '@/lib/constants';

export function GitHubStar() {
  return (
    <a
      href={`https://github.com/${GITHUB_REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
    >
      <Star className="h-4 w-4" />
      <span className="text-sm font-medium">Star</span>
    </a>
  );
}
