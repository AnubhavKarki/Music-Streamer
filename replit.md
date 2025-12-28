# Melody - Local-First Music Player

## Overview

Melody is a Spotify-style local music web application that allows users to upload MP3 files, extract ID3 metadata (including album art), and store everything in IndexedDB for offline playback. This is a local-first PWA where all data storage and audio playback happens entirely in the browser with no backend API required for core functionality.

Key features:
- Drag-and-drop MP3 upload with automatic ID3 tag extraction
- Local IndexedDB storage for tracks, playlists, artwork, and audio blobs
- Full audio player with queue management, shuffle, and repeat modes
- Playlist creation and management
- Search and filter functionality
- Media Session API integration for hardware controls
- Responsive dark theme UI inspired by Spotify

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - Zustand with persist middleware for player state (current track, queue, volume, shuffle/repeat)
  - TanStack React Query for data fetching and caching from IndexedDB
- **Styling**: Tailwind CSS with CSS variables for theming, shadcn/ui component library

### Local-First Data Layer
- **Database**: IndexedDB via the `idb` wrapper library
- **Schema**: 
  - `tracks` store: Contains track metadata (id, title, artist, album, duration, year, genre, artworkBlobId, audioBlobId, createdAt)
  - `blobs` store: Stores raw audio file blobs and artwork image blobs
  - `playlists` store: Contains playlist metadata and ordered track ID arrays
  - `settings` store: Persists app settings
- **Audio Metadata**: Uses `music-metadata-browser` to parse ID3 tags from uploaded files in the browser

### Backend Architecture
- **Server**: Express.js with minimal routes (serves static files only)
- **Database**: PostgreSQL with Drizzle ORM is provisioned but not actively used for this local-first app
- **Purpose**: The backend primarily serves the built frontend assets and could be extended for future features like cloud sync

### Audio Playback
- Native HTML5 `<audio>` element with programmatic controls
- Media Session API integration for lockscreen/hardware key controls
- Blob URLs created from IndexedDB data for playback

### Build System
- Development: `tsx` for running TypeScript server, Vite dev server for frontend
- Production: esbuild bundles server code, Vite builds frontend to `dist/public`

## External Dependencies

### Core Libraries
- `idb`: IndexedDB wrapper for local-first data storage
- `music-metadata-browser`: Extract ID3 tags and cover art from audio files in browser
- `react-dropzone`: Drag and drop file upload handling
- `zustand`: Lightweight state management for player state
- `@tanstack/react-query`: Data fetching and caching layer

### UI Components
- `shadcn/ui`: Pre-built accessible React components (based on Radix UI primitives)
- `tailwindcss`: Utility-first CSS framework
- `lucide-react`: Icon library
- `class-variance-authority` + `clsx` + `tailwind-merge`: Utility classes composition

### Database (Server-side, minimal use)
- `drizzle-orm` + `drizzle-kit`: PostgreSQL ORM and migrations
- `pg`: PostgreSQL client
- Database URL provided via `DATABASE_URL` environment variable

### Polyfills
- `buffer`: Required by music-metadata-browser for browser compatibility