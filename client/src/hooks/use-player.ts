import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track } from './use-library';

interface PlayerState {
  currentTrackId: string | null;
  isPlaying: boolean;
  volume: number;
  queue: string[]; // List of track IDs
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  
  // Actions
  playTrack: (trackId: string, queue?: string[]) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (trackId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrackId: null,
      isPlaying: false,
      volume: 1,
      queue: [],
      shuffle: false,
      repeat: 'off',

      playTrack: (trackId, newQueue) => {
        set((state) => ({
          currentTrackId: trackId,
          isPlaying: true,
          queue: newQueue ? newQueue : state.queue.length > 0 ? state.queue : [trackId]
        }));
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setVolume: (volume) => set({ volume }),

      nextTrack: () => {
        const { queue, currentTrackId, repeat } = get();
        if (!currentTrackId || queue.length === 0) return;

        const currentIndex = queue.indexOf(currentTrackId);
        
        if (repeat === 'one') {
           // Should trigger seek to 0 in audio element, usually handled by component logic observing id change
           // For now, we simulate "next" as re-playing same track if triggered manually
           return; 
        }

        let nextIndex = currentIndex + 1;
        if (nextIndex >= queue.length) {
          if (repeat === 'all') nextIndex = 0;
          else {
            set({ isPlaying: false });
            return;
          }
        }
        
        set({ currentTrackId: queue[nextIndex], isPlaying: true });
      },

      prevTrack: () => {
        const { queue, currentTrackId } = get();
        if (!currentTrackId || queue.length === 0) return;
        
        const currentIndex = queue.indexOf(currentTrackId);
        const prevIndex = currentIndex - 1;
        
        if (prevIndex < 0) {
          // Restart current track or go to last? Usually restart if > 3s, but simple logic here:
          set({ currentTrackId: queue[0], isPlaying: true });
        } else {
          set({ currentTrackId: queue[prevIndex], isPlaying: true });
        }
      },

      addToQueue: (trackId) => set((state) => ({ queue: [...state.queue, trackId] })),
      
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })), // Real shuffle logic needs to reorder queue
      
      toggleRepeat: () => set((state) => {
        const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
        const nextIndex = (modes.indexOf(state.repeat) + 1) % modes.length;
        return { repeat: modes[nextIndex] };
      }),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        shuffle: state.shuffle, 
        repeat: state.repeat,
        currentTrackId: state.currentTrackId,
        queue: state.queue
      }), 
    }
  )
);
