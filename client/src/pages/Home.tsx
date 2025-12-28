import { useTracks } from "@/hooks/use-library";
import { TrackList } from "@/components/TrackList";
import { usePlayerStore } from "@/hooks/use-player";
import { Play } from "lucide-react";

export default function Home() {
  const { data: tracks, isLoading } = useTracks();
  const { playTrack } = usePlayerStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const playAll = () => {
    if (tracks && tracks.length > 0) {
      playTrack(tracks[0].id, tracks.map(t => t.id));
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading your library...</div>;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/20 to-background p-8 pt-10">
        <h1 className="text-4xl font-bold mb-6">{getGreeting()}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-emerald-700 rounded-lg shadow-2xl flex items-center justify-center">
            <span className="text-4xl">🎵</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">All Songs</h2>
            <p className="text-muted-foreground mt-1">{tracks?.length || 0} tracks in your library</p>
            <button 
              onClick={playAll}
              className="mt-4 px-6 py-2 bg-primary text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
            >
              <Play size={18} className="fill-current" />
              Play
            </button>
          </div>
        </div>
      </div>

      <div className="px-8">
        <h3 className="text-xl font-bold mb-4">Recently Added</h3>
        <TrackList tracks={tracks || []} />
      </div>
    </div>
  );
}
