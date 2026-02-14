import React from 'react';
import { DomainItem } from '../types';

interface GenericItemDetailProps {
  item: DomainItem;
  onUpdate: (updates: Partial<DomainItem>) => void;
}

export default function GenericItemDetail({ item, onUpdate }: GenericItemDetailProps) {
  return (
    <div className="generic-item-detail">
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
