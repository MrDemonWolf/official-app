import { WordPressPost } from '../../services/wordpressApi';

export interface NavigationTab {
  name: string;
  component: React.ComponentType<any>;
  icon: string;
  label: string;
}

export interface BlogCardProps {
  post: WordPressPost;
  onPress: () => void;
  formatDate: (date: string) => string;
  stripHtml: (html: string) => string;
}

export interface BlogPostDetailProps {
  post: WordPressPost;
  onBack: () => void;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  icon: string;
}

export interface DebugInfo {
  icon: string;
  label: string;
  value: string;
  color: string;
}
