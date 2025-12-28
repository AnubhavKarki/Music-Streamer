import { useState } from "react";
import { Search as SearchIcon, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTracks } from "@/hooks/use-library";
import { TrackList } from "@/components/TrackList";

export default function Search() {
  const [query, setQuery] = useState("");
  const { data: tracks, isLoading } = useTracks();

  const filteredTracks = tracks?.filter((track) => {
    const s = query.toLowerCase();
    return (
      track.title.toLowerCase().includes(s) ||
      track.artist.toLowerCase().includes(s) ||
      track.album.toLowerCase().includes(s)
    );
  }) || [];

  return (
    <div className="p-8 pb-32">
      <div className="max-w-2xl mb-8 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for songs, artists, or albums"
          className="pl-10 h-12 bg-white/5 border-none focus-visible:ring-primary/50 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {query ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Search results</h2>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Searching...
            </div>
          ) : filteredTracks.length > 0 ? (
            <TrackList tracks={filteredTracks} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Music className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg">No songs found for "{query}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-muted-foreground opacity-50">
          <SearchIcon className="w-16 h-16 mb-4" />
          <p className="text-xl">Start typing to search</p>
        </div>
      )}
    </div>
  );
}
