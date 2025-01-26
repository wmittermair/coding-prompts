export interface TextBlock {
  id: string;
  title: string;
  content: string;
  versions: {
    version: number;
    content: string;
    createdAt: string;
  }[];
  tags: string[];
  isFavorite: boolean;
  shortcut?: string;
  lastUsed: string;
  useCount: number;
}

export interface Feature {
  id: string;
  name: string;
  enabled: boolean;
}

export interface PromptManagerData {
  version: string;
  lastModified: string;
  categories: Category[];
  settings: Settings;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  tags: string[];
  isFavorite: boolean;
  textBlocks: TextBlock[];
}

export interface Settings {
  theme: 'light' | 'dark';
  globalShortcut: string;
  autoBackup: boolean;
  aiIntegration: {
    enabled: boolean;
    apiKey: string;
    endpoint: string;
  };
} 