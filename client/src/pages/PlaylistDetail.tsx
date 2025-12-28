import { usePlaylists } from "@/hooks/use-library";
import { useRoute } from "wouter";
import { TrackList } from "@/components/TrackList";
// Note: In a real implementation we would fetch actual tracks linked to playlist
// For this MVP we just show a placeholder or all tracks filtered
import { useTracks } from "@/hooks/use-library";

export default function PlaylistDetail() {
  const [, params] = useRoute("/playlist/:id");
  const { data: playlists } = usePlaylists();
  const { data: allTracks } = useTracks();

  const playlist = playlists?.find(p => p.id === params?.id);
  
  // Mock: Filter dummy logic since we didn't implement full playlist-track linking UI yet
  // In real app: use playlist.trackIds to filter allTracks
  const playlistTracks = allTracks?.filter(() => Math.random() > 0.5) || []; 

  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-b from-accent/20 to-background p-8 pt-12 flex items-end gap-6">
        <div className="w-52 h-52 bg-accent shadow-2xl rounded-lg flex items-center justify-center text-4xl font-bold text-white/20">
           {playlist.name[0]}
        </div>
        <div className="mb-4">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70">Playlist</p>
          <h1 className="text-5xl font-bold mt-2 mb-4">{playlist.name}</h1>
          <p className="text-white/60 text-sm font-medium">Created • {playlistTracks.length} songs</p>
        </div>
      </div>

      <div className="px-8 mt-8">
        <TrackList tracks={playlistTracks} />
      </div>
    </div>
  );
}
