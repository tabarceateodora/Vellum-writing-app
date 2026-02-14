import { Document, Project, Book, Workspace, Idea, Domain, DomainItem } from './types';

const STORAGE_KEY = 'novel-writer-workspace';
const LEGACY_KEY = 'novel-writer-project'; // For migration from old version

export function saveWorkspace(workspace: Workspace): void {
  try {
    const data = JSON.stringify(workspace);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save workspace:', error);
  }
}

export function exportWorkspaceAsBackup(workspace: Workspace): void {
  const data = JSON.stringify(workspace, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `novel-writer-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importWorkspaceFromBackup(file: File): Promise<Workspace> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workspace = JSON.parse(reader.result as string) as Workspace;
        if (!workspace.books || !Array.isArray(workspace.books)) {
          throw new Error('Invalid backup file');
        }
        // Ensure required fields exist
        workspace.domains = workspace.domains || getDefaultDomains();
        workspace.domainItems = workspace.domainItems || [];
        workspace.ideas = workspace.ideas || [];
        resolve(workspace);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function loadWorkspace(): Workspace | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const workspace: Workspace = JSON.parse(data);
      // Migrate: add domains if missing
      if (!workspace.domains || workspace.domains.length === 0) {
        workspace.domains = getDefaultDomains();
      }
      if (!workspace.domainItems) {
        workspace.domainItems = [];
      }
      return workspace;
    }
    
    // Migrate from old format
    const oldProject = localStorage.getItem(LEGACY_KEY);
    if (oldProject) {
      const project: Project = JSON.parse(oldProject);
      const book: Book = {
        id: project.id || 'default',
        name: project.name || 'My Novel',
        documents: project.documents,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      };
      const workspace: Workspace = {
        books: [book],
        currentBookId: book.id,
        ideas: [],
        domains: getDefaultDomains(),
        domainItems: []
      };
      saveWorkspace(workspace);
      localStorage.removeItem(LEGACY_KEY);
      return workspace;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load workspace:', error);
    return null;
  }
}

function getDefaultDomains(): Domain[] {
  const now = Date.now();
  return [
    { id: 'domain-char', name: 'Characters', type: 'character', order: 0, createdAt: now, updatedAt: now },
    { id: 'domain-world', name: 'World Building', type: 'world', order: 1, createdAt: now, updatedAt: now },
    { id: 'domain-powers', name: 'Powers & Abilities', type: 'powers', order: 2, createdAt: now, updatedAt: now },
    { id: 'domain-magic', name: 'Magic System', type: 'magic', order: 3, createdAt: now, updatedAt: now }
  ];
}

export function createDefaultWorkspace(): Workspace {
  const now = Date.now();
  const defaultBook: Book = {
    id: `book-${now}`,
    name: 'My Novel',
    documents: [
      {
        id: `doc-${now}`,
        title: 'Chapter 1',
        content: '',
        createdAt: now,
        updatedAt: now,
        wordCount: 0,
        characterCount: 0,
        type: 'chapter'
      }
    ],
    createdAt: now,
    updatedAt: now
  };
  
  return {
    books: [defaultBook],
    currentBookId: defaultBook.id,
    ideas: [],
    domains: getDefaultDomains(),
    domainItems: []
  };
}

// Legacy functions for backward compatibility
export function saveProject(project: Project): void {
  const workspace = loadWorkspace() || createDefaultWorkspace();
  const existingBookIndex = workspace.books.findIndex(b => b.id === project.id);
  const book: Book = {
    id: project.id,
    name: project.name,
    documents: project.documents,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  };
  
  if (existingBookIndex >= 0) {
    workspace.books[existingBookIndex] = book;
  } else {
    workspace.books.push(book);
  }
  workspace.currentBookId = book.id;
  saveWorkspace(workspace);
}

export function loadProject(): Project | null {
  const workspace = loadWorkspace();
  if (!workspace || !workspace.currentBookId) return null;
  const book = workspace.books.find(b => b.id === workspace.currentBookId);
  if (!book) return null;
  return {
    id: book.id,
    name: book.name,
    documents: book.documents,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
  };
}

export function createDefaultProject(): Project {
  const workspace = createDefaultWorkspace();
  const book = workspace.books[0];
  return {
    id: book.id,
    name: book.name,
    documents: book.documents,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt
  };
}