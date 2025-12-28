import { Link, useLocation } from "wouter";
import { Home, Search, Library, Plus, Music, Disc } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlaylists, useCreatePlaylist } from "@/hooks/use-library";

export function Sidebar() {
  const [location] = useLocation();
  const { data: playlists } = usePlaylists();
  const createPlaylist = useCreatePlaylist();

  const handleCreatePlaylist = () => {
    const name = `My Playlist #${(playlists?.length || 0) + 1}`;
    createPlaylist.mutate(name);
  };

  const NavItem = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
      location === href 
        ? "bg-white/10 text-white" 
        : "text-muted-foreground hover:text-white hover:bg-white/5"
    )}>
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  );

  return (
    <div className="w-64 bg-black h-full flex flex-col border-r border-white/10 hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent flex items-center gap-2">
          <Music className="w-8 h-8 text-primary" />
          Melody
        </h1>
      </div>

      <nav className="px-2 space-y-1">
        <NavItem href="/" icon={Home}>Home</NavItem>
        <NavItem href="/search" icon={Search}>Search</NavItem>
        <NavItem href="/upload" icon={Plus}>Add Music</NavItem>
      </nav>

      <div className="mt-8 px-6 mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Your Library
        </h2>
        <button 
          onClick={handleCreatePlaylist}
          className="text-muted-foreground hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        <nav className="space-y-1">
          <NavItem href="/tracks" icon={Disc}>All Tracks</NavItem>
          {playlists?.map(playlist => (
            <NavItem key={playlist.id} href={`/playlist/${playlist.id}`} icon={Library}>
              {playlist.name}
            </NavItem>
          ))}
        </nav>
      </div>
      
      {/* Spacer for player bar */}
      <div className="h-24" />
    </div>
  );
}
