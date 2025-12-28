import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dbPromise } from "@/lib/db";
import { nanoid } from "nanoid";
import * as musicMetadata from 'music-metadata-browser';
import { Buffer } from 'buffer';

// Polyfill Buffer for music-metadata-browser
window.Buffer = window.Buffer || Buffer;

export interface Track {
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
}

export function useTracks() {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const db = await dbPromise;
      return db.getAllFromIndex('tracks', 'by-created');
    },
  });
}

export function useTrack(id: string) {
  return useQuery({
    queryKey: ['track', id],
    queryFn: async () => {
      const db = await dbPromise;
      return db.get('tracks', id);
    },
    enabled: !!id,
  });
}

export function useTrackBlobUrl(blobId?: string) {
  return useQuery({
    queryKey: ['blob', blobId],
    queryFn: async () => {
      if (!blobId) return null;
      const db = await dbPromise;
      const blob = await db.get('blobs', blobId);
      return blob ? URL.createObjectURL(blob) : null;
    },
    enabled: !!blobId,
    // Keep blob URLs cached but garbage collect them eventually if component unmounts?
    // React Query doesn't automatically revoke Object URLs. We handle this via manual cleanup or specific component logic.
    staleTime: Infinity, 
  });
}

export function useUploadTracks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const db = await dbPromise;
      const results = [];

      for (const file of files) {
        try {
          const metadata = await musicMetadata.parseBlob(file);
          const audioId = nanoid();
          const artworkId = metadata.common.picture?.[0] ? nanoid() : undefined;
          
          // Store Audio
          await db.put('blobs', file, audioId);

          // Store Artwork if exists
          if (artworkId && metadata.common.picture?.[0]) {
            const pic = metadata.common.picture[0];
            const blob = new Blob([pic.data], { type: pic.format });
            await db.put('blobs', blob, artworkId);
          }

          const track: Track = {
            id: nanoid(),
            title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: metadata.common.artist || "Unknown Artist",
            album: metadata.common.album || "Unknown Album",
            duration: metadata.format.duration || 0,
            year: metadata.common.year,
            genre: metadata.common.genre?.[0],
            audioBlobId: audioId,
            artworkBlobId: artworkId,
            createdAt: new Date().toISOString(),
          };

          await db.put('tracks', track);
          results.push(track);
        } catch (err) {
          console.error(`Failed to parse ${file.name}`, err);
        }
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    },
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trackId: string) => {
      const db = await dbPromise;
      const track = await db.get('tracks', trackId);
      if (!track) return;

      // Delete blobs
      await db.delete('blobs', track.audioBlobId);
      if (track.artworkBlobId) {
        await db.delete('blobs', track.artworkBlobId);
      }
      
      // Delete track
      await db.delete('tracks', trackId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
    }
  });
}

export function usePlaylists() {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const db = await dbPromise;
      return db.getAll('playlists');
    }
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const db = await dbPromise;
      const playlist = {
        id: nanoid(),
        name,
        trackIds: [],
        createdAt: new Date().toISOString()
      };
      await db.put('playlists', playlist);
      return playlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    }
  });
}
