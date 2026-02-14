# Quick Install Guide

## Step 1: Install the PWA Plugin

First, install the required package:

```bash
npm install
```

This will install the `vite-plugin-pwa` package that enables desktop installation.

## Step 2: Start the App

```bash
npm run dev
```

## Step 3: Install to Desktop

1. Open `http://localhost:5173` in your browser

2. **Look for the install prompt:**
   - **Chrome/Edge:** Install icon (➕) in the address bar, or Menu (⋮) → "Install Novel Writer"
   - **Firefox:** Menu → "Install Site as App"  
   - **Safari (Mac):** File → "Add to Dock"

3. **Click Install** - The app will be added to your desktop!

## For Production Build

To build a production version:

```bash
npm run build
npx serve dist
```

Then install from the served URL.

That's it! Your Novel Writer app is now on your desktop! 🎉