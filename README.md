
```markdown
# 🌿 Universal Wisdom Cross

[![GitHub Pages](https://img.shields.io/badge/Live-Demo-brightgreen)](https://pigletpeakkung.github.io/Ezekielbless/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An interactive multi-faith wisdom tool featuring quotes from:
- Christianity • Islam • Hinduism  
- Buddhism • Taoism • Rumi  
- Alan Watts • Conversations with God  
- Seth Speaks • Law of One (Ra Material)

![Wisdom Cross Screenshot](preview.png)

## ✨ Features

- **Sacred Geometry Animations**  
  Tradition-specific visual effects (Flower of Life, Dharma Wheel, etc.)
  
- **Text-to-Speech**  
  Hear wisdom quotes spoken aloud (browser-supported)

- **Daily Wisdom Cycle**  
  Automatically rotates through traditions

- **Dark/Light Mode**  
  Eye-friendly theme switching

- **Cloudflare-Powered API**  
  CORS-protected quote fetching

## 🛠️ Setup

### Local Development
```bash
git clone https://github.com/Pigletpeakkung/Ezekielbless.git
cd Ezekielbless
python -m http.server 8000
```
Open `http://localhost:8000`

### Requirements
- Python 3.10+ (for scraper)
- Node.js 20+ (for Cloudflare Worker)

## 📂 File Structure
```
Ezekielbless/
├── index.html            # Main application
├── css/
│   └── styles.css        # All styles
├── js/
│   ├── main.js           # Core logic
│   ├── sacred-geometry.js # Animations
│   └── tts.js            # Speech synthesis
├── quotes/               # Quote database
├── scraper.py            # Web scraping tool
└── worker.js             # Cloudflare Worker
```

## 🌐 Deployment
1. **GitHub Pages**  
   - Automatic via `main` branch

2. **Cloudflare Worker**  
   ```bash
   npm install -g wrangler
   wrangler publish
   ```

## 📜 Ethical Usage
For copyrighted materials (CwG, Seth, Law of One):
- Only includes short excerpts
- Contains full attribution
- Recommends purchasing original books

## 🤝 Contributing
1. Fork the repository
2. Add new quotes to `/quotes`
3. Submit a PR with:
   - Source attribution
   - ISBN/page references

## 📄 License
MIT © [Your Name]

---
```

### Key Sections Included:
1. **Live Demo Badge** - Links to GitHub Pages
2. **Visual Preview** - Add a `preview.png` screenshot
3. **Setup Instructions** - Both local and cloud deployment
4. **Ethical Guidelines** - For copyrighted materials
5. **File Structure** - Clear directory overview
6. **License Info** - MIT license recommended

To add a screenshot:
1. Take a screenshot of your project
2. Save as `preview.png` in root
3. Update the markdown image link if needed

