import React, { useState } from 'react';
import { Book as BookIcon, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Book } from '../types';

interface BooksMenuProps {
  books: Book[];
  currentBookId: string | null;
  onSelectBook: (id: string) => void;
  onNewBook: () => void;
  onDeleteBook: (id: string) => void;
  onRenameBook: (id: string, newName: string) => void;
  onToggle: () => void;
  isOpen: boolean;
}

export default function BooksMenu({
  books,
  currentBookId,
  onSelectBook,
  onNewBook,
  onDeleteBook,
  onRenameBook,
  onToggle,
  isOpen
}: BooksMenuProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (book: Book) => {
    setEditingId(book.id);
    setEditValue(book.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onRenameBook(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditValue('');
    }
  };

  if (!isOpen) {
    return (
      <button className="books-menu-toggle" onClick={onToggle} title="Books Menu">
        <BookIcon size={20} />
      </button>
    );
  }

  return (
    <div className="books-menu">
      <div className="books-menu-header">
        <BookIcon size={20} />
        <h2>Books</h2>
        <button className="icon-button" onClick={onToggle} title="Close">
          <X size={18} />
        </button>
      </div>
      <div className="books-menu-content">
        <button className="new-book-button" onClick={onNewBook}>
          <Plus size={18} />
          <span>New Book</span>
        </button>
        <div className="books-list">
          {books.map((book) => (
            <div
              key={book.id}
              className={`book-item ${currentBookId === book.id ? 'active' : ''}`}
              onClick={() => onSelectBook(book.id)}
            >
              <BookIcon size={16} />
              {editingId === book.id ? (
                <input
                  className="book-name-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(book.id)}
                  onKeyDown={(e) => handleKeyDown(e, book.id)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <span className="book-name">{book.name}</span>
              )}
              <div className="book-actions" onClick={(e) => e.stopPropagation()}>
                {editingId !== book.id && (
                  <>
                    <button
                      className="icon-button-small"
                      onClick={() => handleStartEdit(book)}
                      title="Rename"
                    >
                      <Edit2 size={14} />
                    </button>
                    {books.length > 1 && (
                      <button
                        className="icon-button-small"
                        onClick={() => onDeleteBook(book.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}