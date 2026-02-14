import React from 'react';
import { Document } from '../types';
import { BookOpen, FileText, Plus, Trash2, Edit2 } from 'lucide-react';

interface SidebarProps {
  documents: Document[];
  currentDocId: string | null;
  onSelectDoc: (id: string) => void;
  onNewDoc: () => void;
  onDeleteDoc: (id: string) => void;
  onRenameDoc: (id: string, newTitle: string) => void;
}

export default function Sidebar({
  documents,
  currentDocId,
  onSelectDoc,
  onNewDoc,
  onDeleteDoc,
  onRenameDoc
}: SidebarProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');

  const handleStartEdit = (doc: Document) => {
    setEditingId(doc.id);
    setEditValue(doc.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onRenameDoc(id, editValue.trim());
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

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <BookOpen size={20} />
        <h2>Documents</h2>
        <button className="icon-button" onClick={onNewDoc} title="New Document">
          <Plus size={18} />
        </button>
      </div>
      <div className="sidebar-content">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`document-item ${currentDocId === doc.id ? 'active' : ''}`}
            onClick={() => onSelectDoc(doc.id)}
          >
            <FileText size={16} />
            {editingId === doc.id ? (
              <input
                className="document-title-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveEdit(doc.id)}
                onKeyDown={(e) => handleKeyDown(e, doc.id)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <span className="document-title">{doc.title}</span>
            )}
            <div className="document-actions" onClick={(e) => e.stopPropagation()}>
              {editingId !== doc.id && (
                <>
                  <button
                    className="icon-button-small"
                    onClick={() => handleStartEdit(doc)}
                    title="Rename"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="icon-button-small"
                    onClick={() => onDeleteDoc(doc.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}