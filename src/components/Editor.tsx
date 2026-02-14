import React, { useRef, useEffect, useState, useCallback } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  focusMode: boolean;
  typewriterMode: boolean;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  wordWrap: boolean;
  searchMatchIndex?: number;
  notes?: { [lineNumber: number]: string };
  currentLine?: number;
  onLineChange?: (lineNumber: number) => void;
}

export default function Editor({
  content,
  onChange,
  focusMode,
  typewriterMode,
  fontSize,
  lineHeight,
  fontFamily,
  wordWrap,
  searchMatchIndex,
  notes = {},
  currentLine: externalCurrentLine,
  onLineChange
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [showCursor, setShowCursor] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentLine, setCurrentLine] = useState(1);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const updateCurrentLine = useCallback((position: number) => {
    const textBeforeCursor = content.substring(0, position);
    const lineNumber = textBeforeCursor.split('\n').length;
    setCurrentLine(lineNumber);
    if (onLineChange) {
      onLineChange(lineNumber);
    }
  }, [content, onLineChange]);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const updateCursorPosition = () => {
        const pos = textarea.selectionStart;
        setCursorPosition(pos);
        updateCurrentLine(pos);
      };
      textarea.addEventListener('click', updateCursorPosition);
      textarea.addEventListener('keyup', updateCursorPosition);
      return () => {
        textarea.removeEventListener('click', updateCursorPosition);
        textarea.removeEventListener('keyup', updateCursorPosition);
      };
    }
  }, [content, onLineChange]);

  useEffect(() => {
    if (externalCurrentLine !== undefined && externalCurrentLine !== currentLine) {
      // Navigate to line
      const lines = content.split('\n');
      let position = 0;
      for (let i = 0; i < Math.min(externalCurrentLine - 1, lines.length); i++) {
        position += lines[i].length + 1; // +1 for newline
      }
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = position;
        textareaRef.current.focus();
        textareaRef.current.scrollTop = (externalCurrentLine - 1) * fontSize * lineHeight - 100;
      }
      setCursorPosition(position);
      setCurrentLine(externalCurrentLine);
    }
  }, [externalCurrentLine]);

  // Sync scroll between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;
    if (!textarea || !lineNumbers) return;

    const syncScroll = () => {
      lineNumbers.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener('scroll', syncScroll);
    return () => textarea.removeEventListener('scroll', syncScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    onChange(newContent);
    const pos = e.target.selectionStart;
    setCursorPosition(pos);
    updateCurrentLine(pos);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        setCursorPosition(start + 2);
      }, 0);
    }
  };

  const handleScroll = () => {
    // Force re-render on scroll for typewriter mode
    if (typewriterMode) {
      setShowCursor((prev) => prev);
    }
  };

  const editorStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
    fontFamily: fontFamily,
    whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
  };

  // Calculate typewriter line position based on cursor
  const getTypewriterLineTop = () => {
    if (!textareaRef.current || !containerRef.current) return '50%';
    
    const textarea = textareaRef.current;
    const container = containerRef.current;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length - 1;
    const lineHeightPx = fontSize * lineHeight;
    const scrollTop = textarea.scrollTop;
    
    // Approximate position based on line number
    const lineTop = currentLine * lineHeightPx - scrollTop;
    const viewportCenter = container.clientHeight / 2;
    
    return `${lineTop + viewportCenter}px`;
  };

  const lineCount = content.split('\n').length || 1;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div 
      ref={containerRef}
      className={`editor-container ${focusMode ? 'focus-mode' : ''}`}
      onScroll={handleScroll}
    >
      <div className="editor-line-numbers" ref={lineNumbersRef}>
        {lines.map((lineNum) => (
          <div
            key={lineNum}
            className={`line-number ${lineNum === currentLine ? 'active' : ''} ${notes[lineNum] ? 'has-note' : ''}`}
          >
            {lineNum}
          </div>
        ))}
      </div>
      <div className="editor-textarea-wrapper">
        {typewriterMode && (
          <div
            className="typewriter-line"
            style={{
              top: getTypewriterLineTop()
            }}
          />
        )}
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          style={editorStyle}
          placeholder="Start writing your novel..."
          spellCheck={false}
        />
        {typewriterMode && (
          <div
            className="typewriter-cursor"
            style={{
              top: getTypewriterLineTop(),
              opacity: showCursor ? 1 : 0
            }}
          />
        )}
      </div>
    </div>
  );
}