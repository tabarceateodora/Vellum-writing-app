import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, X, Edit2 } from 'lucide-react';

interface NotesPanelProps {
  notes: { [lineNumber: number]: string };
  currentLine: number;
  onAddNote: (lineNumber: number, note: string) => void;
  onUpdateNote: (lineNumber: number, note: string) => void;
  onDeleteNote: (lineNumber: number) => void;
  content: string;
  onNavigateToLine: (lineNumber: number) => void;
}

export default function NotesPanel({
  notes,
  currentLine,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  content,
  onNavigateToLine
}: NotesPanelProps) {
  const [editingLine, setEditingLine] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newNoteLine, setNewNoteLine] = useState<number | null>(null);
  const [newNoteValue, setNewNoteValue] = useState('');

  const getLineText = (lineNumber: number): string => {
    const lines = content.split('\n');
    return lines[lineNumber - 1]?.trim().substring(0, 50) || '(empty line)';
  };

  const sortedLines = Object.keys(notes)
    .map(Number)
    .sort((a, b) => a - b);

  const handleStartEdit = (lineNumber: number) => {
    setEditingLine(lineNumber);
    setEditValue(notes[lineNumber] || '');
  };

  const handleSaveEdit = (lineNumber: number) => {
    if (editValue.trim()) {
      onUpdateNote(lineNumber, editValue.trim());
    } else {
      onDeleteNote(lineNumber);
    }
    setEditingLine(null);
    setEditValue('');
  };

  const handleStartNewNote = (lineNumber: number) => {
    setNewNoteLine(lineNumber);
    setNewNoteValue('');
  };

  const handleSaveNewNote = (lineNumber: number) => {
    if (newNoteValue.trim()) {
      onAddNote(lineNumber, newNoteValue.trim());
    }
    setNewNoteLine(null);
    setNewNoteValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, lineNumber: number, isNew: boolean = false) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (isNew) {
        handleSaveNewNote(lineNumber);
      } else {
        handleSaveEdit(lineNumber);
      }
    } else if (e.key === 'Escape') {
      if (isNew) {
        setNewNoteLine(null);
        setNewNoteValue('');
      } else {
        setEditingLine(null);
        setEditValue('');
      }
    }
  };

  // Show note input for current line if it doesn't have a note yet
  const showCurrentLineInput = currentLine > 0 && !notes[currentLine] && newNoteLine !== currentLine;

  return (
    <div className="notes-panel">
      <div className="notes-panel-header">
        <StickyNote size={18} />
        <h3>Line Notes</h3>
      </div>
      <div className="notes-panel-content">
        {showCurrentLineInput && (
          <div className="note-item current-line-note">
            <div className="note-line-header">
              <span className="note-line-number">Line {currentLine}</span>
              <span className="note-line-preview">{getLineText(currentLine)}</span>
              <button
                className="icon-button-small"
                onClick={() => handleStartNewNote(currentLine)}
                title="Add note to this line"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {newNoteLine && (
          <div className="note-item editing">
            <div className="note-line-header">
              <span className="note-line-number">Line {newNoteLine}</span>
              <button
                className="icon-button-small"
                onClick={() => {
                  setNewNoteLine(null);
                  setNewNoteValue('');
                }}
              >
                <X size={14} />
              </button>
            </div>
            <textarea
              className="note-textarea"
              value={newNoteValue}
              onChange={(e) => setNewNoteValue(e.target.value)}
              onBlur={() => handleSaveNewNote(newNoteLine)}
              onKeyDown={(e) => handleKeyDown(e, newNoteLine, true)}
              placeholder="Add a note for this line..."
              autoFocus
              rows={3}
            />
            <div className="note-hint">Press Ctrl/Cmd + Enter to save</div>
          </div>
        )}

        {sortedLines.map((lineNumber) => (
          <div
            key={lineNumber}
            className={`note-item ${lineNumber === currentLine ? 'current-line' : ''}`}
          >
            <div className="note-line-header">
              <span
                className="note-line-number clickable"
                onClick={() => onNavigateToLine(lineNumber)}
              >
                Line {lineNumber}
              </span>
              <span className="note-line-preview">{getLineText(lineNumber)}</span>
              <div className="note-actions">
                {editingLine !== lineNumber && (
                  <>
                    <button
                      className="icon-button-small"
                      onClick={() => handleStartEdit(lineNumber)}
                      title="Edit note"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="icon-button-small"
                      onClick={() => onDeleteNote(lineNumber)}
                      title="Delete note"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
            {editingLine === lineNumber ? (
              <>
                <textarea
                  className="note-textarea"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleSaveEdit(lineNumber)}
                  onKeyDown={(e) => handleKeyDown(e, lineNumber)}
                  autoFocus
                  rows={3}
                />
                <div className="note-hint">Press Ctrl/Cmd + Enter to save</div>
              </>
            ) : (
              <div className="note-content">{notes[lineNumber]}</div>
            )}
          </div>
        ))}

        {sortedLines.length === 0 && !showCurrentLineInput && newNoteLine === null && (
          <div className="notes-empty">
            <StickyNote size={32} />
            <p>No notes yet. Place your cursor on a line and click the + button to add a note.</p>
          </div>
        )}
      </div>
    </div>
  );
}