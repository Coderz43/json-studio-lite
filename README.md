# JSON Studio Lite — Text → JSON, CSV → JSON

Fast, private, in-browser converters inspired by jsonstudio.io — but lightweight and focused on two core tools:

- **TEXT → JSON** (Key–Value / List / Table autodetect + manual override)
- **CSV → JSON** (Papa Parse with dynamic typing)

Nothing leaves your device. Works offline (PWA).

---

## ✨ Features

- 2-pane editor (input ↔ output) with toolbars
- Autoconvert on type (debounced) + **Convert** button
- TEXT mode options: **Mode** (KV/List/Table) & **Delimiter** (Auto, comma, pipe, tab, semicolon)
- CSV parsing with quotes/newlines, header toggle (default on)
- Copy / Download (`.json`) / Upload (`.txt`, `.csv`)
- Pretty / Minify JSON
- History (last 10 conversions, stored in `localStorage`)
- Dark/Light theme (persisted)
- Fullscreen per pane
- Keyboard shortcut: **Ctrl/⌘ + Enter** to convert
- PWA: offline cache via `sw.js`

---

## 🗂 Project Structure

```
jsonstudio-lite/
├─ index.html
├─ assets/
│  ├─ styles.css
│  ├─ favicon.ico
│  └─ icons/                # (add later)
├─ styles/
│  └─ theme.css
├─ js/
│  ├─ app.js
│  ├─ converters.js
│  ├─ storage.js
│  ├─ ui.js
│  └─ vendor/
│     ├─ papaparse.min.js
│     ├─ filesaver.min.js
│     ├─ dompurify.min.js
│     ├─ dayjs.min.js
│     ├─ codemirror.min.js
│     └─ codemirror-json.min.js
├─ manifest.webmanifest
├─ sw.js
└─ README.md
```

---

## ⚙️ Local Development

### 1) Open in VS Code
- Install **Live Server** extension (or use a static server).

### 2) Run a static server
Any of these works:

```bash
# option A (npx serve)
npx serve -p 5173

# option B (http-server)
npx http-server -p 5173 -c-1

# option C (Python)
python -m http.server 5173
```

Open: `http://localhost:5173/`

> Service worker (`sw.js`) only activates over HTTP/HTTPS (not file://).

---

## 🚀 Deploy (choose one)

> App is static (HTML/CSS/JS). No backend or build step required.

### Option 1 — **Netlify**
1. Create a new site → **Deploy manually** (drag-and-drop the folder), or connect Git.
2. **Publish directory:** repo root (contains `index.html`).
3. Enable HTTPS. Done.

### Option 2 — **Vercel**
1. `vercel` (CLI) or import the repo on vercel.com.
2. Framework preset: **Other** (static).
3. Output directory: repo root. Deploy.

### Option 3 — **GitHub Pages**
1. Push repo to GitHub.
2. Settings → Pages → **Deploy from branch**, Branch: `main`, Folder: `/root`.
3. Your URL will be `https://<username>.github.io/<repo>/`.

> If you deploy under a **subpath** (e.g., GitHub Pages), update the cached paths in `sw.js` (`CORE_ASSETS`) to include the base path, and change the first entry from `"/"` to `"/<repo>/"`.

### Option 4 — **Firebase Hosting** (Google CDN)
```bash
npm i -g firebase-tools
firebase login
firebase init hosting         # select existing project or create new
# ? public directory: .
# ? configure as a single-page app: N
# ? set up automatic builds/deploys with GitHub: (optional)
firebase deploy
```

### Option 5 — **Cloudflare Pages**
1. Create new project → connect Git repo.
2. Build command: *(empty)*, Output folder: `/`.
3. Deploy.

---

## 🔧 Configuration Notes

- **Base path**:  
  If the site isn’t at the domain root, set your base in `sw.js`:
  ```js
  const CORE_ASSETS = [
    "/your-base/",              // e.g. "/jsonstudio-lite/"
    "/your-base/index.html",
    "/your-base/assets/styles.css",
    ...
  ];
  ```
  Also register the service worker with the correct path in `index.html`:
  ```html
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/your-base/sw.js').catch(()=>{});
    }
  </script>
  ```

- **CodeMirror vendor**: This project assumes UMD-style bundles named:
  `codemirror.min.js` and `codemirror-json.min.js`.  
  If you swap builds, adjust `js/app.js` where editors are created.

- **Icons/Logo**: Add your PNGs/SVGs to `assets/` and reference them in `index.html` & `manifest.webmanifest`.

---

## 🔐 Privacy & Security

- All parsing runs **entirely in the browser**.
- No analytics by default.
- DOM rendering (history list) sanitized with **DOMPurify**.
- Clipboard, file access, and downloads use browser APIs.

---

## 🧪 QA Checklist

- TEXT modes:
  - KV: lines with `key: value`
  - List: one item per line
  - Table: header row with delimiter (auto detection works, manual override available)
- CSV:
  - Multiline quoted fields
  - Commas/semicolons/tabs/pipes inside quotes
  - Header on/off (currently default **on**)
- Large files (MBs) — check performance in Chrome/Firefox/Edge
- Mobile view (≤960px) — editors stack vertically

---

## ⌨️ Shortcuts

- **Convert**: `Ctrl/⌘ + Enter`

---

## ❓ Troubleshooting

- **“Service worker not updating”**  
  Hard refresh (Ctrl/Cmd + Shift + R) or bump `VERSION` in `sw.js`.

- **“On GitHub Pages output is blank”**  
  Ensure all script and CSS paths include the repo base path. Update `sw.js` `CORE_ASSETS` too.

- **“CodeMirror not loading”**  
  Check that your vendor files exist at:
  `js/vendor/codemirror.min.js` and `js/vendor/codemirror-json.min.js`.

- **“CSV fields with commas break”**  
  Ensure the source CSV uses quotes correctly. Papa Parse is configured to handle quoted fields.

---

## 📄 License

MIT — do what you like, attribution appreciated.
