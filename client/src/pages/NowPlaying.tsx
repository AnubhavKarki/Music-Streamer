import { usePlayerStore } from "@/hooks/use-player";
import { useTrack, useTrackBlobUrl } from "@/hooks/use-library";
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export default function NowPlaying() {
  const { currentTrackId, isPlaying, togglePlay, nextTrack, prevTrack, volume, setVolume, shuffle, toggleShuffle, repeat, toggleRepeat } = usePlayerStore();
  const { data: track } = useTrack(currentTrackId || '');
  const { data: artworkUrl } = useTrackBlobUrl(track?.artworkBlobId);
  const [, setLocation] = useLocation();

  if (!track) {
    setLocation('/');
    return null;
  }

  return (
    <div className="h-screen w-full bg-background relative overflow-hidden flex flex-col">
      {/* Background Blur */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-[100px] opacity-30 scale-110 transition-all duration-1000"
          style={{ backgroundImage: artworkUrl ? `url(${artworkUrl})` : undefined, backgroundColor: '#1a1a1a' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-12 p-8 max-w-7xl mx-auto w-full">
        {/* Artwork */}
        <div className="w-full max-w-md aspect-square rounded-2xl shadow-2xl overflow-hidden bg-zinc-900 border border-white/10 group relative">
           {artworkUrl ? (
             <img src={artworkUrl} alt={track.title} className="w-full h-full object-cover shadow-inner" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
               <MusicIcon className="w-32 h-32 opacity-20" />
             </div>
           )}
        </div>

        {/* Info & Controls */}
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
              {track.title}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              {track.artist}
            </p>
            <p className="text-sm text-muted-foreground/60">
              {track.album} • {track.year || 'Unknown Year'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Progress bar would sync with global audio element here, 
                but for now we just show controls as the progress is in the global player bar */}
            
            <div className="flex items-center justify-between gap-6">
              <button 
                onClick={toggleShuffle}
                className={cn("p-2 transition-colors", shuffle ? "text-primary" : "text-muted-foreground hover:text-white")}
              >
                <Shuffle size={24} />
              </button>

              <div className="flex items-center gap-6">
                <button onClick={prevTrack} className="text-white hover:text-primary transition-colors">
                  <SkipBack size={32} className="fill-current" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
                </button>
                
                <button onClick={nextTrack} className="text-white hover:text-primary transition-colors">
                  <SkipForward size={32} className="fill-current" />
                </button>
              </div>

              <button 
                onClick={toggleRepeat}
                className={cn("p-2 transition-colors relative", repeat !== 'off' ? "text-primary" : "text-muted-foreground hover:text-white")}
              >
                <Repeat size={24} />
                {repeat === 'one' && <span className="absolute top-1 right-1 text-[8px] font-bold">1</span>}
              </button>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4 text-muted-foreground bg-white/5 p-4 rounded-xl">
             <Volume2 size={20} />
             <Slider 
                value={[volume]} 
                max={1} 
                step={0.01}
                onValueChange={([val]) => setVolume(val)}
                className="flex-1"
             />
          </div>
        </div>
      </div>
    </div>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  );
}
