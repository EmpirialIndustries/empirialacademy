import { useCallback, useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MonitorUp, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DailyProvider,
  DailyAudio,
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useMeetingState,
  useScreenShare,
} from '@daily-co/daily-react';
import DailyIframe from '@daily-co/daily-js';
import { VideoTile } from './VideoTile';
import { cn } from '@/lib/utils';

interface VideoContainerProps {
  roomUrl?: string;
  sessionTitle?: string;
  onLeave?: () => void;
}

function VideoUI({ sessionTitle, onLeave }: { sessionTitle?: string; onLeave?: () => void }) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const participantIds = useParticipantIds({ filter: 'remote' });
  const meetingState = useMeetingState();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleAudio = useCallback(() => {
    if (daily) {
      daily.setLocalAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  }, [daily, isMuted]);

  const toggleVideo = useCallback(() => {
    if (daily) {
      daily.setLocalVideo(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  }, [daily, isVideoOff]);

  const toggleScreenShare = useCallback(() => {
    if (isSharingScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare]);

  const leaveCall = useCallback(() => {
    if (daily) {
      daily.leave();
      onLeave?.();
    }
  }, [daily, onLeave]);

  if (meetingState === 'joining-meeting') {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-muted/50 p-8 text-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Joining session...</h3>
        <p className="mt-2 text-muted-foreground">Please wait while we connect you</p>
      </div>
    );
  }

  if (meetingState === 'left-meeting' || meetingState === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-muted/50 p-8 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <Video className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {meetingState === 'error' ? 'Connection Error' : 'Session Ended'}
        </h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          {meetingState === 'error'
            ? 'There was an error connecting to the session. Please try again.'
            : 'You have left the video session.'}
        </p>
      </div>
    );
  }

  const allParticipants = localSessionId ? [localSessionId, ...participantIds] : participantIds;
  const totalParticipants = allParticipants.length;

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
            <span className="text-sm font-medium text-white">{totalParticipants}</span>
          </div>
        </div>

        {/* Main video grid */}
        <div className="flex h-full items-center justify-center p-4">
          {totalParticipants === 0 ? (
            <div className="text-center text-white/70">
              <Video className="mx-auto mb-4 h-16 w-16" />
              <p className="text-lg font-medium">Waiting for participants...</p>
            </div>
          ) : totalParticipants === 1 && localSessionId ? (
            <VideoTile sessionId={localSessionId} isLocal isLarge />
          ) : (
            <div
              className={cn(
                'grid gap-4 h-full w-full place-items-center',
                totalParticipants === 2 && 'grid-cols-2',
                totalParticipants >= 3 && totalParticipants <= 4 && 'grid-cols-2 grid-rows-2',
                totalParticipants > 4 && 'grid-cols-3 grid-rows-2'
              )}
            >
              {allParticipants.slice(0, 6).map((id) => (
                <VideoTile
                  key={id}
                  sessionId={id}
                  isLocal={id === localSessionId}
                  isLarge={totalParticipants <= 2}
                />
              ))}
            </div>
          )}
        </div>

        {/* Self view (picture-in-picture) - only when there are remote participants */}
        {participantIds.length > 0 && localSessionId && (
          <div className="absolute bottom-4 right-4 z-10 overflow-hidden rounded-lg shadow-lg">
            <VideoTile sessionId={localSessionId} isLocal />
          </div>
        )}
      </div>

      {/* Daily Audio */}
      <DailyAudio />

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          variant={isMuted ? 'destructive' : 'secondary'}
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={toggleAudio}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button
          variant={isVideoOff ? 'destructive' : 'secondary'}
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={toggleVideo}
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>

        <Button
          variant={isSharingScreen ? 'default' : 'secondary'}
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={toggleScreenShare}
        >
          <MonitorUp className="h-5 w-5" />
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="h-12 w-12 rounded-full p-0"
          onClick={leaveCall}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export function VideoContainer({ roomUrl, sessionTitle, onLeave }: VideoContainerProps) {
  const [callObject, setCallObject] = useState<ReturnType<typeof DailyIframe.createCallObject> | null>(null);

  useEffect(() => {
    if (!roomUrl) {
      setCallObject(null);
      return;
    }

    const daily = DailyIframe.createCallObject({
      url: roomUrl,
    });

    setCallObject(daily);

    daily.join({ url: roomUrl });

    return () => {
      daily.destroy();
    };
  }, [roomUrl]);

  if (!roomUrl || !callObject) {
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
    <DailyProvider callObject={callObject}>
      <VideoUI sessionTitle={sessionTitle} onLeave={onLeave} />
    </DailyProvider>
  );
}
