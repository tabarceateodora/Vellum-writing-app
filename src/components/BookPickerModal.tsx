import React from 'react';
import { Book as BookIcon, Plus } from 'lucide-react';
import { Book } from '../types';

interface BookPickerModalProps {
  books: Book[];
  onSelectBook: (id: string) => void;
  onNewBook?: () => void;
}

export default function BookPickerModal({ books, onSelectBook, onNewBook }: BookPickerModalProps) {
  return (
    <div className="modal-overlay book-picker-overlay">
      <div className="modal-content book-picker-modal">
        <div className="modal-header">
          <h2>Choose a Book</h2>
        </div>
        <div className="modal-body book-picker-body">
          <p className="book-picker-subtitle">Select which book you want to work on:</p>
          <div className="book-picker-list">
            {books.map((book) => (
              <button
                key={book.id}
                className="book-picker-item"
                onClick={() => onSelectBook(book.id)}
              >
                <BookIcon size={24} />
                <div className="book-picker-item-info">
                  <span className="book-picker-item-name">{book.name}</span>
                  <span className="book-picker-item-meta">
                    {book.documents.length} chapter{book.documents.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {onNewBook && (
            <button className="book-picker-new" onClick={onNewBook}>
              <Plus size={18} />
              New Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
