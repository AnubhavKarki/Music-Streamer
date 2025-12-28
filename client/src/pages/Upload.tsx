import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, Music, FileAudio, CheckCircle, Loader2 } from 'lucide-react';
import { useUploadTracks } from '@/hooks/use-library';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Upload() {
  const uploadTracks = useUploadTracks();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    setCompleted(false);
    
    try {
      await uploadTracks.mutateAsync(acceptedFiles);
      setCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [uploadTracks]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.m4a', '.ogg']
    }
  });

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Add Music to Library</h1>
          <p className="text-muted-foreground">Drag and drop audio files here to process them locally.</p>
        </div>

        {completed ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-12 flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 text-black shadow-lg shadow-emerald-500/20">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-emerald-500 mb-2">Import Complete!</h2>
            <p className="text-muted-foreground mb-6">Your tracks have been added to the library.</p>
            <div className="flex gap-4">
              <Button onClick={() => setCompleted(false)} variant="outline">Upload More</Button>
              <Link href="/">
                <Button>Go to Library</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-3xl p-12 transition-all duration-200 cursor-pointer flex flex-col items-center gap-4 bg-card/50",
              isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10 hover:border-white/20 hover:bg-white/5",
              isProcessing && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            
            {isProcessing ? (
              <>
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-xl font-medium animate-pulse">Processing metadata...</p>
                <p className="text-sm text-muted-foreground">This happens entirely on your device.</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <UploadIcon size={40} />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-medium">Drop songs here</p>
                  <p className="text-sm text-muted-foreground">Supports MP3, FLAC, WAV, M4A</p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <FeatureCard 
            icon={Music} 
            title="Metadata Extraction" 
            desc="Automatically reads artist, album, and cover art." 
          />
          <FeatureCard 
            icon={FileAudio} 
            title="Local Storage" 
            desc="Files are stored in your browser. No uploads." 
          />
          <FeatureCard 
            icon={CheckCircle} 
            title="Offline Ready" 
            desc="Works perfectly without internet connection." 
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-white/5">
      <Icon className="w-8 h-8 text-primary mb-3" />
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
