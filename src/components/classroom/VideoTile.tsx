import { DailyVideo, useParticipant } from '@daily-co/daily-react';
import { MicOff, VideoOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoTileProps {
  sessionId: string;
  isLocal?: boolean;
  isLarge?: boolean;
}

export function VideoTile({ sessionId, isLocal = false, isLarge = false }: VideoTileProps) {
  const participant = useParticipant(sessionId);

  if (!participant) return null;

  const { video, audio, user_name } = participant;
  const displayName = user_name || (isLocal ? 'You' : 'Participant');

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-muted',
        isLarge ? 'h-full w-full' : 'h-32 w-44 md:h-40 md:w-56'
      )}
    >
      {video ? (
        <DailyVideo
          sessionId={sessionId}
          type="video"
          automirror={isLocal}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-semibold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Name label */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
        {!audio && <MicOff className="h-3 w-3 text-red-400" />}
        {!video && <VideoOff className="h-3 w-3 text-red-400" />}
        <span className="text-xs font-medium text-white">
          {isLocal ? 'You' : displayName}
        </span>
      </div>
    </div>
  );
}
