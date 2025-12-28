import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/hooks/use-player';
import { useTrack, useTrackBlobUrl } from '@/hooks/use-library';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer() {
  const { 
    currentTrackId, isPlaying, volume, togglePlay, setVolume, 
    nextTrack, prevTrack, toggleRepeat, toggleShuffle, repeat, shuffle 
  } = usePlayerStore();
  
  const { data: track } = useTrack(currentTrackId || '');
  const { data: audioUrl } = useTrackBlobUrl(track?.audioBlobId);
  const { data: artworkUrl } = useTrackBlobUrl(track?.artworkBlobId);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Media Session API for hardware keys
  useEffect(() => {
    if ('mediaSession' in navigator && track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: artworkUrl ? [{ src: artworkUrl, sizes: '512x512', type: 'image/png' }] : []
      });

      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
    }
  }, [track, artworkUrl, togglePlay, prevTrack, nextTrack]);

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-card border-t border-white/5 px-4 flex items-center justify-between z-50 backdrop-blur-lg bg-opacity-95">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={nextTrack}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-0">
        <div className="w-14 h-14 bg-secondary rounded-md overflow-hidden flex-shrink-0 shadow-lg relative group">
          {artworkUrl ? (
            <img src={artworkUrl} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
              <Disc size={24} />
            </div>
          )}
          <Link href="/now-playing" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Maximize2 className="text-white w-5 h-5" />
          </Link>
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-white truncate hover:underline cursor-pointer">
            <Link href="/now-playing">{track.title}</Link>
          </h4>
          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleShuffle}
            className={cn("text-muted-foreground hover:text-white transition-colors", shuffle && "text-primary")}
          >
            <Shuffle size={18} />
          </button>
          
          <button onClick={prevTrack} className="text-white hover:text-primary transition-colors">
            <SkipBack size={24} className="fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
          </button>
          
          <button onClick={nextTrack} className="text-white hover:text-primary transition-colors">
            <SkipForward size={24} className="fill-current" />
          </button>
          
          <button 
            onClick={toggleRepeat}
            className={cn("text-muted-foreground hover:text-white transition-colors relative", repeat !== 'off' && "text-primary")}
          >
            <Repeat size={18} />
            {repeat === 'one' && <span className="absolute -top-1 -right-1 text-[8px] font-bold">1</span>}
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>{formatTime(currentTime)}</span>
          <Slider 
            value={[currentTime]} 
            max={duration || 100}
            onValueChange={([val]) => {
              if (audioRef.current) audioRef.current.currentTime = val;
              setCurrentTime(val);
            }}
            className="flex-1 cursor-pointer" 
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="w-[30%] flex justify-end items-center gap-2">
        <Volume2 size={18} className="text-muted-foreground" />
        <div className="w-24">
          <Slider 
            value={[volume]} 
            max={1} 
            step={0.01}
            onValueChange={([val]) => setVolume(val)}
          />
        </div>
      </div>
    </div>
  );
}

function Disc({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
}
