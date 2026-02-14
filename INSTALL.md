# Installing Novel Writer to Your Desktop

This app can be installed as a Progressive Web App (PWA) on your desktop. Here's how:

## Method 1: Install from Browser (Recommended)

1. **Make sure the app is running:**
   ```bash
   npm run dev
   ```

2. **Open the app in your browser:**
   - Go to `http://localhost:5173` (or the URL shown in terminal)

3. **Install the app:**
   
   **Chrome/Edge:**
   - Look for the install icon (➕ or ⬇️) in the address bar
   - Or go to the menu (three dots) → "Install Novel Writer"
   - Or use `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
   
   **Firefox:**
   - Go to menu → "Install Site as App"
   - Or use `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac)
   
   **Safari (Mac):**
   - Go to File → "Add to Dock"
   - Or use Share button → "Add to Home Screen"

4. **The app will appear on your desktop/launcher** and can be opened like a native app!

## Method 2: Build and Deploy

For a permanent installation that works offline:

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **The built files will be in the `dist` folder**

3. **Serve the dist folder** using any web server:
   ```bash
   npx serve dist
   ```

4. **Follow Method 1** to install from the served URL

## Creating Better Icons

The current setup uses placeholder icons. To create proper app icons:

1. Create two PNG images:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

2. Use an online tool like:
   - https://favicon.io/
   - https://realfavicongenerator.net/
   - Or design them in any image editor

3. Place the files in the `public/` folder

4. Rebuild the app:
   ```bash
   npm run build
   ```

## Features of Installed PWA

✅ Opens in its own window (no browser UI)
✅ Works offline (after first load)
✅ Can be pinned to taskbar/dock
✅ Appears in application launcher
✅ Auto-updates when you rebuild

Enjoy your desktop writing app!