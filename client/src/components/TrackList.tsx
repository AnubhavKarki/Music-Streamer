import { usePlayerStore } from "@/hooks/use-player";
import { Track, useTrackBlobUrl } from "@/hooks/use-library";
import { Play, Pause, Clock, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

function TrackRow({ track, index, onClick }: { track: Track; index: number; onClick: () => void }) {
  const { currentTrackId, isPlaying } = usePlayerStore();
  const isCurrent = currentTrackId === track.id;
  const { data: artworkUrl } = useTrackBlobUrl(track.artworkBlobId);
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group flex items-center gap-4 p-3 rounded-md hover:bg-white/10 transition-colors cursor-pointer group",
        isCurrent && "bg-white/10"
      )}
    >
      <div className="w-8 flex justify-center text-sm text-muted-foreground font-mono">
        {isHovered ? (
          <button className="text-white">
            {isCurrent && isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
          </button>
        ) : (
          isCurrent && isPlaying ? (
            <div className="flex gap-0.5 items-end h-3">
              <div className="w-0.5 bg-primary animate-[bounce_1s_infinite] h-2"></div>
              <div className="w-0.5 bg-primary animate-[bounce_1.2s_infinite] h-3"></div>
              <div className="w-0.5 bg-primary animate-[bounce_0.8s_infinite] h-1"></div>
            </div>
          ) : (
            <span>{index + 1}</span>
          )
        )}
      </div>

      <div className="w-10 h-10 rounded bg-secondary overflow-hidden flex-shrink-0">
        {artworkUrl ? <img src={artworkUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-800" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className={cn("font-medium truncate", isCurrent ? "text-primary" : "text-white")}>
          {track.title}
        </div>
        <div className="text-xs text-muted-foreground truncate group-hover:text-white transition-colors">
          {track.artist}
        </div>
      </div>

      <div className="hidden md:block w-1/4 text-sm text-muted-foreground truncate hover:text-white">
        {track.album}
      </div>

      <div className="hidden sm:block text-sm text-muted-foreground font-mono w-16 text-right">
        {formatDuration(track.duration)}
      </div>
      
      <div className="w-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal size={16} className="text-muted-foreground hover:text-white" />
      </div>
    </div>
  );
}

export function TrackList({ tracks }: { tracks: Track[] }) {
  const { playTrack } = usePlayerStore();

  if (!tracks.length) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p>No tracks found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center gap-4 px-3 py-2 border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        <div className="w-8 text-center">#</div>
        <div className="w-10"></div>
        <div className="flex-1">Title</div>
        <div className="hidden md:block w-1/4">Album</div>
        <div className="hidden sm:block w-16 text-right"><Clock size={14} className="ml-auto" /></div>
        <div className="w-8"></div>
      </div>
      
      {tracks.map((track, i) => (
        <TrackRow 
          key={track.id} 
          track={track} 
          index={i} 
          onClick={() => playTrack(track.id, tracks.map(t => t.id))}
        />
      ))}
    </div>
  );
}
