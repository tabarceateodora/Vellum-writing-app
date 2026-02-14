import React, { useRef } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { DomainItem } from '../types';

interface GenericItemDetailProps {
  item: DomainItem;
  onUpdate: (updates: Partial<DomainItem>) => void;
}

export default function GenericItemDetail({ item, onUpdate }: GenericItemDetailProps) {
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

  return (
    <div className="generic-item-detail">
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

      <div className="detail-field">
        <label>Name</label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Name"
        />
      </div>
      <div className="detail-field">
        <label>Description</label>
        <textarea
          value={item.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe..."
          rows={8}
        />
      </div>
    </div>
  );
}
