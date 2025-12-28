import { openDB, type DBSchema } from 'idb';

interface MusicDB extends DBSchema {
  tracks: {
    key: string;
    value: {
      id: string;
      title: string;
      artist: string;
      album: string;
      duration: number;
      year?: number;
      genre?: string;
      artworkBlobId?: string;
      audioBlobId: string;
      createdAt: string;
    };
    indexes: { 'by-title': string; 'by-artist': string; 'by-album': string; 'by-created': string };
  };
  blobs: {
    key: string;
    value: Blob;
  };
  playlists: {
    key: string;
    value: {
      id: string;
      name: string;
      trackIds: string[];
      createdAt: string;
    };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'music-app-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB<MusicDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Tracks store
      const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
      trackStore.createIndex('by-title', 'title');
      trackStore.createIndex('by-artist', 'artist');
      trackStore.createIndex('by-album', 'album');
      trackStore.createIndex('by-created', 'createdAt');

      // Blobs store (audio files and images)
      db.createObjectStore('blobs');

      // Playlists store
      db.createObjectStore('playlists', { keyPath: 'id' });

      // Settings store
      db.createObjectStore('settings');
    },
  });
}

export const dbPromise = initDB();
