import React from 'react';
import {
  Save,
  Download,
  Search,
  Settings,
  Focus,
  Type,
  FileText,
  StickyNote,
  Archive,
  Upload
} from 'lucide-react';

interface ToolbarProps {
  wordCount: number;
  characterCount: number;
  onSave: () => void;
  onExport: () => void;
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onSettings: () => void;
  focusMode: boolean;
  onToggleFocus: () => void;
  typewriterMode: boolean;
  onToggleTypewriter: () => void;
  showNotes: boolean;
  onToggleNotes: () => void;
}

export default function Toolbar({
  wordCount,
  characterCount,
  onSave,
  onExport,
  onBackup,
  onRestore,
  onSearch,
  onSettings,
  focusMode,
  onToggleFocus,
  typewriterMode,
  onToggleTypewriter,
  showNotes,
  onToggleNotes
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button className="toolbar-button" onClick={onSave} title="Save (Ctrl+S)">
          <Save size={18} />
          <span>Save</span>
        </button>
        <button className="toolbar-button" onClick={onExport} title="Export chapter as Markdown">
          <Download size={18} />
          <span>Export</span>
        </button>
        <button className="toolbar-button" onClick={onBackup} title="Backup everything (saves to file)">
          <Archive size={18} />
          <span>Backup</span>
        </button>
        <label className="toolbar-button" title="Restore from backup file">
          <Upload size={18} />
          <span>Restore</span>
          <input
            type="file"
            accept=".json"
            onChange={onRestore}
            style={{ display: 'none' }}
          />
        </label>
        <div className="toolbar-divider" />
        <button className="toolbar-button" onClick={onSearch} title="Search (Ctrl+F)">
          <Search size={18} />
        </button>
        <button
          className={`toolbar-button ${focusMode ? 'active' : ''}`}
          onClick={onToggleFocus}
          title="Focus Mode"
        >
          <Focus size={18} />
        </button>
        <button
          className={`toolbar-button ${typewriterMode ? 'active' : ''}`}
          onClick={onToggleTypewriter}
          title="Typewriter Mode"
        >
          <Type size={18} />
        </button>
        <button
          className={`toolbar-button ${showNotes ? 'active' : ''}`}
          onClick={onToggleNotes}
          title="Show/Hide Notes"
        >
          <StickyNote size={18} />
        </button>
      </div>
      <div className="toolbar-right">
        <div className="toolbar-stats">
          <span className="stat-item">
            <FileText size={14} />
            {wordCount.toLocaleString()} words
          </span>
          <span className="stat-item">
            {characterCount.toLocaleString()} chars
          </span>
        </div>
        <button className="toolbar-button" onClick={onSettings} title="Settings">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}