import { z } from "zod";

// Domain types for IndexedDB storage
// Note: We are using string dates for serialization compatibility

export const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  duration: z.number(), // in seconds
  year: z.number().optional(),
  genre: z.string().optional(),
  artworkBlobId: z.string().optional(), // Reference to blob store
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Track = z.infer<typeof trackSchema>;

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  trackIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Playlist = z.infer<typeof playlistSchema>;

export const appSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  repeatMode: z.enum(['off', 'all', 'one']).default('off'),
  shuffle: z.boolean().default(false),
  volume: z.number().default(1),
  lastQueue: z.array(z.string()).default([]),
  lastTrackId: z.string().optional(),
  lastPosition: z.number().default(0),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;
