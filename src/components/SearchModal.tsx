import React, { useState, useEffect } from 'react';
import { X, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface SearchModalProps {
  content: string;
  onClose: () => void;
}

export default function SearchModal({ content, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState<number[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  useEffect(() => {
    if (!searchTerm) {
      setMatches([]);
      setCurrentMatch(0);
      return;
    }

    const regex = new RegExp(searchTerm, 'gi');
    const newMatches: number[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      newMatches.push(match.index);
    }

    setMatches(newMatches);
    setCurrentMatch(newMatches.length > 0 ? 0 : -1);
  }, [searchTerm, content]);

  const handleNext = () => {
    if (matches.length > 0) {
      setCurrentMatch((prev) => (prev + 1) % matches.length);
    }
  };

  const handlePrevious = () => {
    if (matches.length > 0) {
      setCurrentMatch((prev) => (prev - 1 + matches.length) % matches.length);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Search</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search in document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {matches.length > 0 && (
              <>
                <span className="search-count">
                  {currentMatch + 1} / {matches.length}
                </span>
                <button className="icon-button" onClick={handlePrevious}>
                  <ChevronUp size={18} />
                </button>
                <button className="icon-button" onClick={handleNext}>
                  <ChevronDown size={18} />
                </button>
              </>
            )}
          </div>
          {searchTerm && matches.length === 0 && (
            <p className="search-no-results">No matches found</p>
          )}
        </div>
      </div>
    </div>
  );
}