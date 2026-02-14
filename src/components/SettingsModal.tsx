import React from 'react';
import { X } from 'lucide-react';
import { EditorSettings } from '../types';

interface SettingsModalProps {
  settings: EditorSettings;
  onUpdateSettings: (settings: Partial<EditorSettings>) => void;
  onClose: () => void;
}

export default function SettingsModal({
  settings,
  onUpdateSettings,
  onClose
}: SettingsModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="setting-group">
            <label>Font Size</label>
            <input
              type="range"
              min="12"
              max="24"
              value={settings.fontSize}
              onChange={(e) =>
                onUpdateSettings({ fontSize: parseInt(e.target.value) })
              }
            />
            <span>{settings.fontSize}px</span>
          </div>
          <div className="setting-group">
            <label>Line Height</label>
            <input
              type="range"
              min="1.2"
              max="2.5"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) =>
                onUpdateSettings({ lineHeight: parseFloat(e.target.value) })
              }
            />
            <span>{settings.lineHeight.toFixed(1)}</span>
          </div>
          <div className="setting-group">
            <label>Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
            >
              <option value="'Georgia', serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Palatino', serif">Palatino</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Arial', sans-serif">Arial</option>
              <option value="'Helvetica', sans-serif">Helvetica</option>
            </select>
          </div>
          <div className="setting-group">
            <label>
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={(e) => onUpdateSettings({ wordWrap: e.target.checked })}
              />
              Word Wrap
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}