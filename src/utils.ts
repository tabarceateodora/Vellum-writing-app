export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(word => word.length > 0).length;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function exportToMarkdown(content: string, title: string): string {
  return `# ${title}\n\n${content}`;
}

export function exportToPlainText(content: string): string {
  return content;
}