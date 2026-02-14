export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  characterCount: number;
  type: 'chapter' | 'note' | 'outline';
  notes?: { [lineNumber: number]: string };
}

export interface Project {
  id: string;
  name: string;
  documents: Document[];
  createdAt: number;
  updatedAt: number;
}

export interface EditorSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  focusMode: boolean;
  typewriterMode: boolean;
  wordWrap: boolean;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  category: 'character' | 'plot' | 'world' | 'scene' | 'dialogue' | 'other';
}

export interface Book {
  id: string;
  name: string;
  documents: Document[];
  createdAt: number;
  updatedAt: number;
}

// Idea Domains - user-created categories
export type DomainType = 'character' | 'world' | 'powers' | 'magic' | 'custom';

export interface Domain {
  id: string;
  name: string;
  type: DomainType;
  order: number;
  createdAt: number;
  updatedAt: number;
}

// Domain items - entries within each domain
export interface DomainItem {
  id: string;
  domainId: string;
  name: string;
  description: string;
  image?: string; // base64 data URL
  // Character-specific
  powerLevel?: number;
  traits?: string[];
  // Flexible attributes for other domain types
  attributes?: Record<string, string | number | boolean>;
  createdAt: number;
  updatedAt: number;
}

export interface Workspace {
  books: Book[];
  currentBookId: string | null;
  ideas: Idea[];
  domains: Domain[];
  domainItems: DomainItem[];
}