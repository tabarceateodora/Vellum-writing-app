import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Trash2,
  Edit2,
  X,
  User,
  Globe,
  Zap,
  Sparkles,
  Folder,
  Archive,
  Upload
} from 'lucide-react';
import { Domain, DomainItem, DomainType } from '../types';
import CharacterDetail from './CharacterDetail';
import GenericItemDetail from './GenericItemDetail';

const DOMAIN_ICONS: Record<DomainType, React.ReactNode> = {
  character: <User size={18} />,
  world: <Globe size={18} />,
  powers: <Zap size={18} />,
  magic: <Sparkles size={18} />,
  custom: <Folder size={18} />
};

interface IdeasPageProps {
  domains: Domain[];
  domainItems: DomainItem[];
  onBackup: () => void;
  onRestore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddDomain: (name: string, type: DomainType) => void;
  onUpdateDomain: (id: string, updates: Partial<Domain>) => void;
  onDeleteDomain: (id: string) => void;
  onAddDomainItem: (domainId: string) => void;
  onUpdateDomainItem: (id: string, updates: Partial<DomainItem>) => void;
  onDeleteDomainItem: (id: string) => void;
  onBack: () => void;
}

export default function IdeasPage({
  domains,
  domainItems,
  onBackup,
  onRestore,
  onAddDomain,
  onUpdateDomain,
  onDeleteDomain,
  onAddDomainItem,
  onUpdateDomainItem,
  onDeleteDomainItem,
  onBack
}: IdeasPageProps) {
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showNewDomainModal, setShowNewDomainModal] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainType, setNewDomainType] = useState<DomainType>('custom');

  const selectedDomain = domains.find((d) => d.id === selectedDomainId);
  const selectedItem = domainItems.find((i) => i.id === selectedItemId);
  const itemsInDomain = domainItems.filter((i) => i.domainId === selectedDomainId);

  const handleCreateDomain = () => {
    if (!newDomainName.trim()) return;
    onAddDomain(newDomainName.trim(), newDomainType);
    setNewDomainName('');
    setNewDomainType('custom');
    setShowNewDomainModal(false);
  };

  const sortedDomains = [...domains].sort((a, b) => a.order - b.order);

  return (
    <div className="ideas-page">
      <div className="ideas-sidebar">
        <div className="ideas-sidebar-header">
          <Lightbulb size={20} />
          <h2>Idea Domains</h2>
          <div className="ideas-header-actions">
            <button className="icon-button" onClick={onBackup} title="Backup everything">
              <Archive size={18} />
            </button>
            <label className="icon-button" title="Restore from backup">
              <Upload size={18} />
              <input type="file" accept=".json" onChange={onRestore} style={{ display: 'none' }} />
            </label>
            <button className="icon-button" onClick={onBack} title="Back to Writing">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="domains-list">
          {sortedDomains.map((domain) => (
            <div
              key={domain.id}
              className={`domain-item ${selectedDomainId === domain.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedDomainId(domain.id);
                setSelectedItemId(null);
              }}
            >
              {DOMAIN_ICONS[domain.type]}
              <span className="domain-name">{domain.name}</span>
            </div>
          ))}
        </div>

        <button className="new-domain-button" onClick={() => setShowNewDomainModal(true)}>
          <Plus size={18} />
          <span>New Domain</span>
        </button>
      </div>

      <div className="ideas-main">
        {selectedDomain ? (
          <>
            <div className="ideas-content">
              <div className="domain-items-panel">
                <div className="domain-header">
                  <h3>{selectedDomain.name}</h3>
                  <button
                    className="add-item-button"
                    onClick={() => onAddDomainItem(selectedDomain.id)}
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
                <div className="domain-items-list">
                  {itemsInDomain.length === 0 ? (
                    <div className="empty-domain">
                      <p>No items yet. Click "Add" to create one.</p>
                    </div>
                  ) : (
                    itemsInDomain.map((item) => (
                      <div
                        key={item.id}
                        className={`domain-item-card ${selectedItemId === item.id ? 'active' : ''}`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        {item.image && (
                          <div className="item-card-thumb">
                            <img src={item.image} alt="" />
                          </div>
                        )}
                        <div className="item-card-info">
                          <span className="item-card-name">{item.name}</span>
                          {item.powerLevel && (
                            <span className="item-card-power">Power: {item.powerLevel}/10</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="item-detail-panel">
                {selectedItem ? (
                  <div className="item-detail-content">
                    <div className="item-detail-header">
                      <h3>Edit</h3>
                      <button
                        className="delete-item-button"
                        onClick={() => {
                          onDeleteDomainItem(selectedItem.id);
                          setSelectedItemId(null);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                    {selectedDomain.type === 'character' ? (
                      <CharacterDetail
                        item={selectedItem}
                        onUpdate={(updates) => onUpdateDomainItem(selectedItem.id, updates)}
                        onDelete={() => {
                          onDeleteDomainItem(selectedItem.id);
                          setSelectedItemId(null);
                        }}
                      />
                    ) : (
                      <GenericItemDetail
                        item={selectedItem}
                        onUpdate={(updates) => onUpdateDomainItem(selectedItem.id, updates)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="no-item-selected">
                    <p>Select an item to view and edit</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="ideas-welcome">
            <Lightbulb size={64} />
            <h2>Idea Domains</h2>
            <p>Select a domain from the sidebar or create a new one.</p>
            <p className="ideas-hint">
              Domains help organize your ideas: Characters, World Building, Powers, and more.
            </p>
          </div>
        )}
      </div>

      {showNewDomainModal && (
        <div className="modal-overlay" onClick={() => setShowNewDomainModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Domain</h2>
              <button className="icon-button" onClick={() => setShowNewDomainModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="setting-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  placeholder="e.g., Locations"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateDomain()}
                />
              </div>
              <div className="setting-group">
                <label>Type</label>
                <select
                  value={newDomainType}
                  onChange={(e) => setNewDomainType(e.target.value as DomainType)}
                >
                  <option value="character">Character (image, power level, traits)</option>
                  <option value="world">World Building</option>
                  <option value="powers">Powers & Abilities</option>
                  <option value="magic">Magic System</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <button className="save-button full-width" onClick={handleCreateDomain}>
                Create Domain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
