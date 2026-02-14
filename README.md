# Novel Writer

A modern, dark-themed novel writing application with all the features a writer needs.

## Features

- **Modern Dark Design**: Beautiful, distraction-free dark theme optimized for long writing sessions
- **Rich Text Editor**: Clean, full-featured text editor with customizable typography
- **Document Management**: Organize your novel into chapters and documents
- **Auto-Save**: Your work is automatically saved as you type
- **Word & Character Count**: Real-time statistics tracking
- **Focus Mode**: Distraction-free writing with centered content
- **Typewriter Mode**: Classic typewriter experience with a visual cursor line
- **Export**: Export your work as Markdown or plain text
- **Search**: Powerful search functionality throughout your document
- **Customizable Settings**: Adjust font size, line height, font family, and more
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + S` - Save
  - `Ctrl/Cmd + F` - Search
  - `Escape` - Close modals

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

- Click "New Document" in the sidebar to create a new chapter
- Start writing in the main editor area
- Use the toolbar to access features like save, export, search, and settings
- Toggle Focus Mode for distraction-free writing
- Toggle Typewriter Mode for a classic writing experience
- Add notes to any line by clicking the + button in the Notes Panel
- All your work is automatically saved to your browser's local storage

## Install to Desktop

This app can be installed as a Progressive Web App (PWA) on your desktop!

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open in your browser** (usually `http://localhost:5173`)

3. **Install the app:**
   - **Chrome/Edge:** Look for the install icon (➕) in the address bar, or go to Menu → "Install Novel Writer"
   - **Firefox:** Menu → "Install Site as App"
   - **Safari (Mac):** File → "Add to Dock" or Share → "Add to Home Screen"

4. **The app will appear on your desktop** and can be opened like a native app!

   See [INSTALL.md](INSTALL.md) for detailed installation instructions.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory and can be served with any web server.

## Tech Stack

- React 18
- TypeScript
- Vite
- Lucide React (icons)
- CSS3 with CSS Variables for theming

## License

MIT# Vellum-writing-app
