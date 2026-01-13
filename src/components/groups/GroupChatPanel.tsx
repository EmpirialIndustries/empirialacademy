import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message, TutorClass } from '@/types';
import { format, parseISO } from 'date-fns';

interface GroupChatPanelProps {
  selectedClass: TutorClass | null;
  onJoinSession?: (classId: string) => void;
}

export function GroupChatPanel({ selectedClass, onJoinSession }: GroupChatPanelProps) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages and subscribe to realtime
  useEffect(() => {
    if (!selectedClass) return;

    const fetchMessages = async () => {
      // Use raw query to fetch messages by class_id (not yet in generated types)
      const { data, error } = await (supabase
        .from('messages') as any)
        .select(`
          *,
          sender:profiles!sender_id(*)
        `)
        .eq('class_id', selectedClass.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data as Message[]);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`class-messages:${selectedClass.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `class_id=eq.${selectedClass.id}`,
        },
        async (payload) => {
          // Fetch the full message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!sender_id(*)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClass?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedClass || !profile) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        class_id: selectedClass.id,
        sender_id: profile.id,
        content: newMessage.trim(),
      } as any);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!selectedClass) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center bg-card">
        <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <p className="text-lg font-medium text-foreground">Select a Class</p>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Choose a class from the sidebar to view the group chat and communicate with your tutor or classmates
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">
              {selectedClass.subject.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{selectedClass.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {selectedClass.subject}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Grade {selectedClass.grade}
              </span>
            </div>
          </div>
        </div>
        {selectedClass.meeting_link && onJoinSession && (
          <Button
            onClick={() => onJoinSession(selectedClass.id)}
            size="sm"
            className="gradient-primary"
          >
            <Video className="h-4 w-4 mr-2" />
            Join Video
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first to start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === profile?.id;
              const sender = message.sender;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={sender?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {sender ? getInitials(sender.full_name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                    <div className={`mb-1 flex items-center gap-2 ${isOwn ? 'justify-end' : ''}`}>
                      <span className="text-xs font-medium text-foreground">
                        {isOwn ? 'You' : sender?.full_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(message.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${selectedClass.title}...`}
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
