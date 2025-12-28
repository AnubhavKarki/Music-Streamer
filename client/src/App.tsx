import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import { AudioPlayer } from "@/components/AudioPlayer";

// Pages
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Upload from "@/pages/Upload";
import NowPlaying from "@/pages/NowPlaying";
import PlaylistDetail from "@/pages/PlaylistDetail";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/upload" component={Upload} />
      <Route path="/tracks" component={Home} />
      <Route path="/now-playing" component={NowPlaying} />
      <Route path="/playlist/:id" component={PlaylistDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden font-body">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative bg-background">
          <Router />
        </main>
        <AudioPlayer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
