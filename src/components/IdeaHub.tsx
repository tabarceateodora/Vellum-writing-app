import React, { useState, useMemo } from 'react';
import { Lightbulb, Plus, X, Edit2, Trash2, Search, Tag, Filter } from 'lucide-react';
import { Idea } from '../types';

interface IdeaHubProps {
  ideas: Idea[];
  onAddIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateIdea: (id: string, idea: Partial<Idea>) => void;
  onDeleteIdea: (id: string) => void;
  onToggle: () => void;
  isOpen: boolean;
  onInsertToEditor?: (content: string) => void;
}

const CATEGORIES: Idea['category'][] = ['character', 'plot', 'world', 'scene', 'dialogue', 'other'];
const CATEGORY_LABELS: Record<Idea['category'], string> = {
  character: 'Character',
  plot: 'Plot',
  world: 'World',
  scene: 'Scene',
  dialogue: 'Dialogue',
  other: 'Other'
};

export default function IdeaHub({
  ideas,
  onAddIdea,
  onUpdateIdea,
  onDeleteIdea,
  onToggle,
  isOpen,
  onInsertToEditor
}: IdeaHubProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Idea['category'] | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'other' as Idea['category']
  });

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [ideas, searchTerm, selectedCategory]);

  const handleAddIdea = () => {
    if (!formData.title.trim()) return;
    
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    
    onAddIdea({
      title: formData.title.trim(),
      content: formData.content,
      tags,
      category: formData.category
    });
    
    setFormData({ title: '', content: '', tags: '', category: 'other' });
    setShowAddForm(false);
  };

  const handleStartEdit = (idea: Idea) => {
    setEditingId(idea.id);
    setFormData({
      title: idea.title,
      content: idea.content,
      tags: idea.tags.join(', '),
      category: idea.category
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!formData.title.trim()) return;
    
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    
    onUpdateIdea(id, {
      title: formData.title.trim(),
      content: formData.content,
      tags,
      category: formData.category
    });
    
    setEditingId(null);
    setFormData({ title: '', content: '', tags: '', category: 'other' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ title: '', content: '', tags: '', category: 'other' });
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    ideas.forEach((idea) => idea.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [ideas]);

  if (!isOpen) {
    return (
      <button className="idea-hub-toggle" onClick={onToggle} title="Idea Hub">
        <Lightbulb size={20} />
      </button>
    );
  }

  return (
    <div className="idea-hub">
      <div className="idea-hub-header">
        <Lightbulb size={20} />
        <h2>Idea Hub</h2>
        <button className="icon-button" onClick={onToggle} title="Close">
          <X size={18} />
        </button>
      </div>
      
      <div className="idea-hub-controls">
        <div className="idea-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="idea-filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Idea['category'] | 'all')}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="idea-hub-content">
        {!showAddForm && editingId === null && (
          <button className="new-idea-button" onClick={() => setShowAddForm(true)}>
            <Plus size={18} />
            <span>New Idea</span>
          </button>
        )}

        {(showAddForm || editingId) && (
          <div className="idea-form">
            <input
              type="text"
              className="idea-title-input"
              placeholder="Idea title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              className="idea-content-input"
              placeholder="Describe your idea..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
            />
            <input
              type="text"
              className="idea-tags-input"
              placeholder="Tags (comma separated)..."
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <select
              className="idea-category-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Idea['category'] })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
            <div className="idea-form-actions">
              <button className="save-button" onClick={() => editingId ? handleSaveEdit(editingId) : handleAddIdea}>
                {editingId ? 'Save' : 'Add'}
              </button>
              <button className="cancel-button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="ideas-list">
          {filteredIdeas.length === 0 ? (
            <div className="ideas-empty">
              <Lightbulb size={32} />
              <p>{searchTerm || selectedCategory !== 'all' ? 'No ideas match your filters' : 'No ideas yet. Click "New Idea" to get started!'}</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div key={idea.id} className="idea-item">
                {editingId === idea.id ? (
                  <div className="idea-form">
                    <input
                      type="text"
                      className="idea-title-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <textarea
                      className="idea-content-input"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={4}
                    />
                    <input
                      type="text"
                      className="idea-tags-input"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                    <select
                      className="idea-category-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Idea['category'] })}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                    <div className="idea-form-actions">
                      <button className="save-button" onClick={() => handleSaveEdit(idea.id)}>
                        Save
                      </button>
                      <button className="cancel-button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="idea-header">
                      <div className="idea-title-row">
                        <h3 className="idea-title">{idea.title}</h3>
                        <span className="idea-category-badge">{CATEGORY_LABELS[idea.category]}</span>
                      </div>
                      <div className="idea-actions">
                        {onInsertToEditor && (
                          <button
                            className="icon-button-small"
                            onClick={() => onInsertToEditor(idea.content)}
                            title="Insert to editor"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                        <button
                          className="icon-button-small"
                          onClick={() => handleStartEdit(idea)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="icon-button-small"
                          onClick={() => onDeleteIdea(idea.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="idea-content">{idea.content || '(No description)'}</p>
                    {idea.tags.length > 0 && (
                      <div className="idea-tags">
                        {idea.tags.map((tag) => (
                          <span key={tag} className="idea-tag">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="idea-footer">
                      {new Date(idea.updatedAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}