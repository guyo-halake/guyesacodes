# Hashlist Full Website Replica & Design System

An exact, 1:1 scraped and fully functional replica of [hashlist.com](https://hashlist.com/).

## 📁 Project Structure

```
hashlist-site/
├── index.html         # 100% self-contained standalone page (open directly in any browser)
├── modular.html       # Clean modular version with separated CSS and JS files
├── css/
│   ├── site-css.css   # Main design system styles, reset, layout, tokens, typography
│   ├── ent-css.css    # Enterprise solutions styling and tables
│   ├── mdc-css.css    # Markdown content formatting and interactive charts
│   └── tk-css.css     # 2D schematic simulator styles and visual controls
├── js/
│   └── site.js        # Core client router, markdown parser, SVG schematic canvas engine
├── data/
│   └── state.json     # All website content, copy, pages, navigation, and datasets in clean JSON
└── README.md
```

## 🚀 How to Run

### Option 1: Direct File
Double-click `index.html` to open directly in Google Chrome, Edge, Safari, or Firefox.

### Option 2: Local HTTP Server
Run a local web server:
```bash
python -m http.server 8765
```
Then visit: `http://localhost:8765/index.html` or `http://localhost:8765/modular.html`.

## 🎨 Design System & Tokens

* **Aesthetic**: Technical Blueprint / Engineering Ledger Neo-Brutalist Minimalism
* **Fonts**:
  - Primary Sans: `Funnel Sans`
  - Technical Mono: `Martian Mono`
* **Color Palette**:
  - `--paper`: `#EDEDE7` (Parchment background)
  - `--ink`: `#151815` (Deep charcoal ink)
  - `--board`: `#22362E` (Circuit board green container)
  - `--limit`: `#BF3B2A` (Technical accent red)
  - `--rule`: `#C9CCC4` (Hairline 1px border)
* **Borders**: Sharp `0px` radius on all primary cards and buttons; strict `1px` hairlines.

## 🧭 Pages & Routes
All routes are managed client-side via URL hash (`#`):
- `#/home` — Main hero, interactive chip simulator, benchmark cards, client showcase
- `#/about` — Company mission, team, and background
- `#/research` — Benchmark charts, technical evaluations, research papers
- `#/engineering` — Architecture, RTL pipeline simulators, compiler toolchains
- `#/careers` — Open engineering roles, modal detail view, application forms
- `#/enterprise` — Custom deployment, compute SLAs, and contact form
