import React, { useRef } from 'react';
import { ImagePlus, Trash2, Save } from 'lucide-react';
import { DomainItem } from '../types';

interface CharacterDetailProps {
  item: DomainItem;
  onUpdate: (updates: Partial<DomainItem>) => void;
  onDelete: () => void;
}

export default function CharacterDetail({ item, onUpdate, onDelete }: CharacterDetailProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onUpdate({ image: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTraitAdd = (trait: string) => {
    if (!trait.trim()) return;
    const traits = [...(item.traits || []), trait.trim()];
    onUpdate({ traits });
  };

  const handleTraitRemove = (index: number) => {
    const traits = [...(item.traits || [])];
    traits.splice(index, 1);
    onUpdate({ traits });
  };

  return (
    <div className="character-detail">
      <div className="character-image-section">
        <div className="character-image-wrapper">
          {item.image ? (
            <div className="character-image-container">
              <img src={item.image} alt={item.name} />
              <button
                className="character-image-remove"
                onClick={handleRemoveImage}
                title="Remove image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <button
              className="character-image-placeholder"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={48} />
              <span>Add Image</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden-file-input"
          />
        </div>
      </div>

      <div className="character-fields">
        <div className="detail-field">
          <label>Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Character name"
          />
        </div>

        <div className="detail-field">
          <label>Power Level (1-10)</label>
          <div className="power-level-input">
            <input
              type="range"
              min="1"
              max="10"
              value={item.powerLevel ?? 5}
              onChange={(e) => onUpdate({ powerLevel: parseInt(e.target.value) })}
            />
            <span className="power-level-value">{item.powerLevel ?? 5}</span>
          </div>
        </div>

        <div className="detail-field">
          <label>Description</label>
          <textarea
            value={item.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe the character..."
            rows={6}
          />
        </div>

        <div className="detail-field">
          <label>Traits</label>
          <div className="traits-input">
            <input
              type="text"
              placeholder="Add a trait and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTraitAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <div className="traits-list">
              {(item.traits || []).map((trait, i) => (
                <span key={i} className="trait-tag">
                  {trait}
                  <button onClick={() => handleTraitRemove(i)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
