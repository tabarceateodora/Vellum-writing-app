import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import BooksMenu from './components/BooksMenu';
import IdeaHub from './components/IdeaHub';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import NotesPanel from './components/NotesPanel';
import SettingsModal from './components/SettingsModal';
import SearchModal from './components/SearchModal';
import BookPickerModal from './components/BookPickerModal';
import IdeasPage from './components/IdeasPage';
import { Document, Book, Idea, EditorSettings, Workspace, Domain, DomainItem, DomainType } from './types';
import { loadWorkspace, saveWorkspace, createDefaultWorkspace, exportWorkspaceAsBackup, importWorkspaceFromBackup } from './storage';
import { countWords, countCharacters, exportToMarkdown, exportToPlainText } from './utils';
import './App.css';

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 16,
  lineHeight: 1.8,
  fontFamily: "'Georgia', serif",
  focusMode: false,
  typewriterMode: false,
  wordWrap: true
};

export default function App() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [showBooksMenu, setShowBooksMenu] = useState(false);
  const [showIdeaHub, setShowIdeaHub] = useState(false);
  const [currentView, setCurrentView] = useState<'writing' | 'ideas'>('writing');
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [currentLine, setCurrentLine] = useState(1);
  const [navigateToLine, setNavigateToLine] = useState<number | undefined>(undefined);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const workspaceRef = useRef<Workspace | null>(null);

  // Keep ref in sync for save-on-close
  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

  useEffect(() => {
    const loaded = loadWorkspace();
    if (loaded) {
      setWorkspace(loaded);
      setShowBookPicker(true);
    } else {
      const defaultWorkspace = createDefaultWorkspace();
      setWorkspace(defaultWorkspace);
      setCurrentBookId(defaultWorkspace.currentBookId);
      setCurrentDocId(defaultWorkspace.books[0]?.documents[0]?.id || null);
      saveWorkspace(defaultWorkspace);
    }
  }, []);

  const currentBook = workspace?.books.find(b => b.id === currentBookId);
  const currentDoc = currentBook?.documents.find(d => d.id === currentDocId);

  const saveWorkspaceWithTimer = useCallback((updated: Workspace) => {
    setWorkspace(updated);
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    const timer = setTimeout(() => {
      saveWorkspace(updated);
    }, 300);
    setAutoSaveTimer(timer);
  }, [autoSaveTimer]);

  const updateDocument = useCallback(
    (id: string, updates: Partial<Document>) => {
      if (!workspace || !currentBookId) return;

      const updated: Workspace = {
        ...workspace,
        books: workspace.books.map((book) =>
          book.id === currentBookId
            ? {
                ...book,
                documents: book.documents.map((doc) =>
                  doc.id === id ? { ...doc, ...updates, updatedAt: Date.now() } : doc
                ),
                updatedAt: Date.now()
              }
            : book
        )
      };

      saveWorkspaceWithTimer(updated);
    },
    [workspace, currentBookId, saveWorkspaceWithTimer]
  );

  const handleContentChange = (content: string) => {
    if (!currentDocId) return;

    const wordCount = countWords(content);
    const characterCount = countCharacters(content);

    updateDocument(currentDocId, {
      content,
      wordCount,
      characterCount
    });
  };

  const handleSave = () => {
    if (workspace) {
      saveWorkspace(workspace);
    }
  };

  const handleBackup = () => {
    if (workspace) {
      exportWorkspaceAsBackup(workspace);
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importWorkspaceFromBackup(file)
      .then((restored) => {
        saveWorkspace(restored);
        setWorkspace(restored);
        setCurrentBookId(restored.currentBookId || restored.books[0]?.id || null);
        const book = restored.books.find(b => b.id === (restored.currentBookId || restored.books[0]?.id));
        setCurrentDocId(book?.documents[0]?.id || null);
        setShowBookPicker(true);
        e.target.value = '';
      })
      .catch((err) => {
        alert('Failed to restore backup: ' + (err.message || 'Invalid file'));
        e.target.value = '';
      });
  };

  const handleExport = () => {
    if (!currentDoc) return;

    const markdown = exportToMarkdown(currentDoc.content, currentDoc.title);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewDoc = () => {
    if (!workspace || !currentBookId) return;
    const currentBook = workspace.books.find(b => b.id === currentBookId);
    if (!currentBook) return;

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: `Chapter ${currentBook.documents.length + 1}`,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wordCount: 0,
      characterCount: 0,
      type: 'chapter'
    };

    const updated: Workspace = {
      ...workspace,
      books: workspace.books.map(book =>
        book.id === currentBookId
          ? {
              ...book,
              documents: [...book.documents, newDoc],
              updatedAt: Date.now()
            }
          : book
      )
    };

    saveWorkspaceWithTimer(updated);
    setCurrentDocId(newDoc.id);
  };

  const handleDeleteDoc = (id: string) => {
    if (!workspace || !currentBookId) return;
    const currentBook = workspace.books.find(b => b.id === currentBookId);
    if (!currentBook || currentBook.documents.length === 1) return;

    const updated: Workspace = {
      ...workspace,
      books: workspace.books.map(book =>
        book.id === currentBookId
          ? {
              ...book,
              documents: book.documents.filter((d) => d.id !== id),
              updatedAt: Date.now()
            }
          : book
      )
    };

    saveWorkspaceWithTimer(updated);
    if (currentDocId === id) {
      const updatedBook = updated.books.find(b => b.id === currentBookId);
      setCurrentDocId(updatedBook?.documents[0]?.id || null);
    }
  };

  const handleRenameDoc = (id: string, newTitle: string) => {
    updateDocument(id, { title: newTitle });
  };

  const handleAddNote = (lineNumber: number, note: string) => {
    if (!currentDocId || !currentDoc) return;
    const notes = currentDoc.notes || {};
    updateDocument(currentDocId, {
      notes: { ...notes, [lineNumber]: note }
    });
  };

  const handleUpdateNote = (lineNumber: number, note: string) => {
    if (!currentDocId || !currentDoc) return;
    const notes = currentDoc.notes || {};
    updateDocument(currentDocId, {
      notes: { ...notes, [lineNumber]: note }
    });
  };

  const handleDeleteNote = (lineNumber: number) => {
    if (!currentDocId || !currentDoc) return;
    const notes = { ...(currentDoc.notes || {}) };
    delete notes[lineNumber];
    updateDocument(currentDocId, { notes });
  };

  const handleNavigateToLine = (lineNumber: number) => {
    setNavigateToLine(lineNumber);
    setTimeout(() => setNavigateToLine(undefined), 100);
  };

  // Book management
  const handleNewBook = () => {
    if (!workspace) return;
    const now = Date.now();
    const newBook: Book = {
      id: `book-${now}`,
      name: `Book ${workspace.books.length + 1}`,
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

    const updated: Workspace = {
      ...workspace,
      books: [...workspace.books, newBook],
      currentBookId: newBook.id
    };

    saveWorkspaceWithTimer(updated);
    setCurrentBookId(newBook.id);
    setCurrentDocId(newBook.documents[0].id);
  };

  const handleSelectBook = (id: string) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      currentBookId: id
    };
    saveWorkspaceWithTimer(updated);
    setCurrentBookId(id);
    const book = workspace.books.find(b => b.id === id);
    setCurrentDocId(book?.documents[0]?.id || null);
    setShowBooksMenu(false);
  };

  const handleDeleteBook = (id: string) => {
    if (!workspace || workspace.books.length === 1) return;
    const updated: Workspace = {
      ...workspace,
      books: workspace.books.filter(b => b.id !== id),
      currentBookId: workspace.currentBookId === id
        ? workspace.books.find(b => b.id !== id)?.id || null
        : workspace.currentBookId
    };
    saveWorkspaceWithTimer(updated);
    if (currentBookId === id) {
      const newCurrentId = updated.currentBookId;
      setCurrentBookId(newCurrentId);
      const newBook = updated.books.find(b => b.id === newCurrentId);
      setCurrentDocId(newBook?.documents[0]?.id || null);
    }
  };

  const handleRenameBook = (id: string, newName: string) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      books: workspace.books.map(book =>
        book.id === id ? { ...book, name: newName, updatedAt: Date.now() } : book
      )
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleBookPickerSelect = (id: string) => {
    setCurrentBookId(id);
    const book = workspace?.books.find(b => b.id === id);
    setCurrentDocId(book?.documents[0]?.id || null);
    setShowBookPicker(false);
  };

  // Domain & Domain Item management
  const handleAddDomain = (name: string, type: DomainType) => {
    if (!workspace) return;
    const now = Date.now();
    const maxOrder = Math.max(0, ...workspace.domains.map(d => d.order));
    const newDomain: Domain = {
      id: `domain-${now}`,
      name,
      type,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now
    };
    const updated: Workspace = {
      ...workspace,
      domains: [...workspace.domains, newDomain]
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleUpdateDomain = (id: string, updates: Partial<Domain>) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      domains: workspace.domains.map(d =>
        d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d
      )
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleDeleteDomain = (id: string) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      domains: workspace.domains.filter(d => d.id !== id),
      domainItems: workspace.domainItems.filter(i => i.domainId !== id)
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleAddDomainItem = (domainId: string) => {
    if (!workspace) return;
    const domain = workspace.domains.find(d => d.id === domainId);
    if (!domain) return;
    const now = Date.now();
    const newItem: DomainItem = {
      id: `item-${now}`,
      domainId,
      name: 'Untitled',
      description: '',
      powerLevel: domain.type === 'character' ? 5 : undefined,
      traits: domain.type === 'character' ? [] : undefined,
      createdAt: now,
      updatedAt: now
    };
    const updated: Workspace = {
      ...workspace,
      domainItems: [...workspace.domainItems, newItem]
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleUpdateDomainItem = (id: string, updates: Partial<DomainItem>) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      domainItems: workspace.domainItems.map(i =>
        i.id === id ? { ...i, ...updates, updatedAt: Date.now() } : i
      )
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleDeleteDomainItem = (id: string) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      domainItems: workspace.domainItems.filter(i => i.id !== id)
    };
    saveWorkspaceWithTimer(updated);
  };

  // Idea management
  const handleAddIdea = (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!workspace) return;
    const now = Date.now();
    const newIdea: Idea = {
      id: `idea-${now}`,
      ...ideaData,
      createdAt: now,
      updatedAt: now
    };
    const updated: Workspace = {
      ...workspace,
      ideas: [...workspace.ideas, newIdea]
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleUpdateIdea = (id: string, updates: Partial<Idea>) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      ideas: workspace.ideas.map(idea =>
        idea.id === id ? { ...idea, ...updates, updatedAt: Date.now() } : idea
      )
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleDeleteIdea = (id: string) => {
    if (!workspace) return;
    const updated: Workspace = {
      ...workspace,
      ideas: workspace.ideas.filter(idea => idea.id !== id)
    };
    saveWorkspaceWithTimer(updated);
  };

  const handleInsertIdeaToEditor = (content: string) => {
    if (!currentDoc) return;
    const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = currentDoc.content;
      const newContent =
        currentContent.substring(0, start) +
        content +
        '\n\n' +
        currentContent.substring(end);
      handleContentChange(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + content.length + 2, start + content.length + 2);
      }, 0);
    }
  };

  // Save when leaving the page (close tab, refresh, navigate away)
  useEffect(() => {
    const saveBeforeLeave = () => {
      const current = workspaceRef.current;
      if (current) {
        saveWorkspace(current);
      }
    };

    const handleBeforeUnload = () => {
      saveBeforeLeave();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveBeforeLeave();
      }
    };

    const handlePageHide = () => {
      saveBeforeLeave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  // Periodic save every 30 seconds as safety net
  useEffect(() => {
    const interval = setInterval(() => {
      const current = workspaceRef.current;
      if (current) {
        saveWorkspace(current);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSettings(false);
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!workspace) {
    return <div className="loading">Loading...</div>;
  }

  if (showBookPicker) {
    return (
      <BookPickerModal
        books={workspace.books}
        onSelectBook={handleBookPickerSelect}
        onNewBook={() => {
          handleNewBook();
          setShowBookPicker(false);
        }}
      />
    );
  }

  if (currentView === 'ideas') {
    return (
      <div className="app ideas-view">
        <div className="app-top-bar">
          <div className="main-nav">
            <button
              className={`nav-tab ${currentView === 'writing' ? 'active' : ''}`}
              onClick={() => setCurrentView('writing')}
            >
              Writing
            </button>
            <button
              className={`nav-tab ${currentView === 'ideas' ? 'active' : ''}`}
              onClick={() => setCurrentView('ideas')}
            >
              Ideas
            </button>
          </div>
        </div>
        <div className="app-body">
        <IdeasPage
          domains={workspace.domains}
          domainItems={workspace.domainItems}
          onBackup={handleBackup}
          onRestore={handleRestore}
          onAddDomain={handleAddDomain}
          onUpdateDomain={handleUpdateDomain}
          onDeleteDomain={handleDeleteDomain}
          onAddDomainItem={handleAddDomainItem}
          onUpdateDomainItem={handleUpdateDomainItem}
          onDeleteDomainItem={handleDeleteDomainItem}
          onBack={() => setCurrentView('writing')}
        />
        </div>
      </div>
    );
  }

  if (!currentBook || !currentDoc) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app writing-view">
      <div className="app-top-bar">
        <div className="main-nav">
          <button
            className={`nav-tab ${currentView === 'writing' ? 'active' : ''}`}
            onClick={() => setCurrentView('writing')}
          >
            Writing
          </button>
          <button
            className={`nav-tab ${currentView === 'ideas' ? 'active' : ''}`}
            onClick={() => setCurrentView('ideas')}
          >
            Ideas
          </button>
        </div>
      </div>
      <div className="app-body">
      <BooksMenu
        books={workspace.books}
        currentBookId={currentBookId}
        onSelectBook={handleSelectBook}
        onNewBook={handleNewBook}
        onDeleteBook={handleDeleteBook}
        onRenameBook={handleRenameBook}
        onToggle={() => setShowBooksMenu(!showBooksMenu)}
        isOpen={showBooksMenu}
      />
      <IdeaHub
        ideas={workspace.ideas}
        onAddIdea={handleAddIdea}
        onUpdateIdea={handleUpdateIdea}
        onDeleteIdea={handleDeleteIdea}
        onToggle={() => setShowIdeaHub(!showIdeaHub)}
        isOpen={showIdeaHub}
        onInsertToEditor={handleInsertIdeaToEditor}
      />
      <Sidebar
        documents={currentBook.documents}
        currentDocId={currentDocId}
        onSelectDoc={setCurrentDocId}
        onNewDoc={handleNewDoc}
        onDeleteDoc={handleDeleteDoc}
        onRenameDoc={handleRenameDoc}
      />
      <div className="main-content">
        <Toolbar
          wordCount={currentDoc.wordCount}
          characterCount={currentDoc.characterCount}
          onSave={handleSave}
          onExport={handleExport}
          onBackup={handleBackup}
          onRestore={handleRestore}
          onSearch={() => setShowSearch(true)}
          onSettings={() => setShowSettings(true)}
          focusMode={settings.focusMode}
          onToggleFocus={() =>
            setSettings((s) => ({ ...s, focusMode: !s.focusMode }))
          }
          typewriterMode={settings.typewriterMode}
          onToggleTypewriter={() =>
            setSettings((s) => ({ ...s, typewriterMode: !s.typewriterMode }))
          }
          showNotes={showNotes}
          onToggleNotes={() => setShowNotes(!showNotes)}
        />
        <div className="book-name-header">
          <span className="book-name-label">{currentBook.name}</span>
        </div>
        <div className="editor-wrapper">
          <h1 className="document-title-header">{currentDoc.title}</h1>
          <div className="editor-notes-container">
            <Editor
              content={currentDoc.content}
              onChange={handleContentChange}
              focusMode={settings.focusMode}
              typewriterMode={settings.typewriterMode}
              fontSize={settings.fontSize}
              lineHeight={settings.lineHeight}
              fontFamily={settings.fontFamily}
              wordWrap={settings.wordWrap}
              notes={currentDoc.notes || {}}
              currentLine={navigateToLine}
              onLineChange={setCurrentLine}
            />
            {showNotes && (
              <NotesPanel
                notes={currentDoc.notes || {}}
                currentLine={currentLine}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                content={currentDoc.content}
                onNavigateToLine={handleNavigateToLine}
              />
            )}
          </div>
        </div>
      </div>
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(updates) =>
            setSettings((s) => ({ ...s, ...updates }))
          }
          onClose={() => setShowSettings(false)}
        />
      )}
      {showSearch && (
        <SearchModal
          content={currentDoc.content}
          onClose={() => setShowSearch(false)}
        />
      )}
      </div>
    </div>
  );
}