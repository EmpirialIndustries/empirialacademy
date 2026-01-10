import { Video, Mic, MicOff, VideoOff, PhoneOff, MonitorUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoContainerProps {
  roomUrl?: string;
  sessionTitle?: string;
}

export function VideoContainer({ roomUrl, sessionTitle }: VideoContainerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Placeholder UI for video integration
  if (!roomUrl) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-muted/50 p-8 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <Video className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Ready to Learn?</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Select a session from your schedule or wait for your tutor to start the class.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Video Area */}
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-foreground/95">
        {/* Session title overlay */}
        <div className="absolute left-4 top-4 z-10">
          <div className="flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-white">{sessionTitle || 'Live Session'}</span>
          </div>
        </div>

        {/* Participant count */}
        <div className="absolute right-4 top-4 z-10">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <Users className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">2</span>
          </div>
        </div>

        {/* Main video placeholder */}
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white/70">
            <Video className="mx-auto mb-4 h-16 w-16" />
            <p className="text-lg font-medium">Video call in progress</p>
            <p className="mt-1 text-sm text-white/50">
              Daily.co or Jitsi integration would go here
            </p>
          </div>
        </div>

        {/* Self view (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 z-10 h-32 w-44 overflow-hidden rounded-lg bg-card shadow-lg">
          <div className="flex h-full items-center justify-center bg-muted">
            {isVideoOff ? (
              <VideoOff className="h-8 w-8 text-muted-foreground" />
            ) : (
              <div className="text-center">
                <div className="mb-1 text-2xl">👤</div>
                <span className="text-xs text-muted-foreground">You</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          variant={isMuted ? 'destructive' : 'secondary'}
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button
          variant={isVideoOff ? 'destructive' : 'secondary'}
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={() => setIsVideoOff(!isVideoOff)}
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="h-12 w-12 rounded-full p-0"
        >
          <MonitorUp className="h-5 w-5" />
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="h-12 w-12 rounded-full p-0"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
