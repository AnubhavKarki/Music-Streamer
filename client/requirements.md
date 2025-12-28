## Packages
idb | IndexedDB wrapper for local-first data storage
music-metadata-browser | Extract ID3 tags and cover art from audio files
react-dropzone | Drag and drop file uploads
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind classes safely
lucide-react | Beautiful icons
framer-motion | Smooth animations for player and transitions
buffer | Required by music-metadata-browser

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
Local-First Architecture:
- Using IndexedDB (via 'idb') for all storage (tracks, playlists, images, audio blobs)
- No backend API calls for data
- Audio playback happens directly from Blob URLs created from IndexedDB data
