# Music Streamer

A **Spotify-style local music web app** built with **React, TypeScript, and Vite**. Users can upload MP3s, manage playlists, and play music offline using IndexedDB. Fully responsive and PWA-ready.

---

## Features

* **Upload Songs:** Drag-and-drop or file input, batch import, deduplication by filename/duration or content hash.
* **Library:** Browse, search, filter, and sort local songs.
* **Playlists:** Create, rename, delete playlists; add/remove/reorder tracks.
* **Now Playing:** Full-featured player with play/pause, next/prev, shuffle, repeat, collapsible queue, and timeline scrubbing.
* **Artwork Handling:** Extract embedded album art from MP3s or generate placeholders.
* **Offline Support:** Uses IndexedDB and PWA caching for offline playback.
* **Backup/Restore:** Export and import library and playlists as JSON.

---

## Tech Stack

* **Frontend:** React + Vite + TypeScript
* **Styling:** Tailwind CSS / shadcn/ui
* **Data Storage:** IndexedDB (Dexie.js)
* **Audio Handling:** `<audio>` element, Media Session API
* **Routing:** React Router
* **PWA:** Service Worker for offline caching

---

## Project Structure

```
Music-Streamer/
├─ public/
│  ├─ icons/
│  └─ manifest.webmanifest
├─ src/
│  ├─ components/       # UI components (PlayerBar, QueueDrawer, SongList, etc.)
│  ├─ hooks/            # Custom hooks (usePlayer, useIndexedDb)
│  ├─ lib/              # Helpers (audio, ID3 parsing)
│  ├─ pages/            # Upload, Songs, Playlists, NowPlaying
│  ├─ db/               # IndexedDB setup
│  ├─ styles/           # Tailwind CSS
│  └─ main.tsx          # App entry point
├─ server/              # Optional Express server for future API
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/AnubhavKarki/Music-Streamer.git
cd Music-Streamer
```

2. Install dependencies:

```bash
npm install
```

3. Run locally:

```bash
npm run dev
```

4. Open in browser at `http://localhost:5173`.

---

## Build & Deploy

1. Build for production:

```bash
npm run build
```

Output will be in `dist/public`.

2. Deploy to Vercel:

* Connect your GitHub repo to Vercel
* Set **Build Command:** `npm run build`
* Set **Output Directory:** `dist/public`
* Deploy and access via your Vercel URL.

---

## Known Limitations

* Some niche features **not yet fully functional**.

---

## Contributing

Contributions are welcome! Please open issues or PRs for bug fixes, feature requests, or improvements.

---

## License

MIT License © 2025 Anubhav Karki
