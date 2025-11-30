# CodeCore Sandbox

A production-ready split-pane code editor for Three.js and vanilla JavaScript with full error handling, auto-detection, and sandboxed execution.

## Features
- **Split-pane layout** with resizable divider
- **Three.js auto-detection** and CDN injection
- **Comprehensive error handling** with stack traces
- **Console output** in preview
- **LocalStorage persistence**
- **Fullscreen preview mode**
- **Framework presets** (Three.js, Vanilla JS, Auto)
- **Mobile responsive**
- **Iframe sandboxing** for security

## Quick Start
```bash
git clone <repo-url>
cd codecoresandbox
open index.html  # or any modern browser
```

## Given your Three.js spaceship interiors interest [memory:1], try:
1. Paste sparkxrstart code
2. Hit ▶ Run
3. Resize preview with drag divider
4. Use ⛶ for fullscreen

## Keyboard Shortcuts
- Ctrl/Cmd + Enter: Run
- Ctrl/Cmd + S: Save

## Tech Stack
- Vanilla JS (no build step)
- Sandboxed iframe execution
- Resizable CSS Flexbox
- LocalStorage persistence

## Customization
Edit `app.js`:
- `detectFramework()`: Add React, Babylon.js, etc.
- `generateBoilerplate()`: Add new framework templates
- `style.css`: Theme customization

Ready for production deployment!
