import { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { VideoContainer } from '@/components/classroom/VideoContainer';
import { ChatPanel } from '@/components/classroom/ChatPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Classroom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomUrl = searchParams.get('room');
  const sessionTitle = searchParams.get('title') || 'Live Session';
  const sessionId = searchParams.get('session');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLeave = useCallback(() => {
    navigate('/groups');
  }, [navigate]);

  return (
    <AppLayout>
      <div className="relative flex h-[calc(100vh-8rem)] gap-4 md:h-[calc(100vh-6rem)]">
        {/* Video Section */}
        <div className={cn('flex-1 transition-all', isChatOpen && 'md:mr-80')}>
          <VideoContainer
            roomUrl={roomUrl || undefined}
            sessionTitle={sessionTitle}
            onLeave={handleLeave}
          />
        </div>

        {/* Chat Toggle Button (Mobile) */}
        <Button
          variant="default"
          size="icon"
          className={cn(
            'fixed bottom-24 right-4 z-50 h-12 w-12 rounded-full shadow-lg md:hidden',
            isChatOpen && 'hidden'
          )}
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        {/* Chat Panel */}
        <div
          className={cn(
            'fixed inset-y-0 right-0 z-50 w-full bg-card shadow-xl transition-transform duration-300 md:absolute md:w-80 md:rounded-2xl md:shadow-card',
            isChatOpen ? 'translate-x-0' : 'translate-x-full',
            'md:top-0 md:h-full'
          )}
        >
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 md:hidden"
            onClick={() => setIsChatOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          <ChatPanel sessionId={sessionId} />
        </div>

        {/* Desktop Chat Toggle */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'fixed right-4 top-20 z-40 hidden h-10 w-10 rounded-full md:flex',
            isChatOpen && 'right-[21rem]'
          )}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? <X className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        </Button>
      </div>
    </AppLayout>
  );
}
