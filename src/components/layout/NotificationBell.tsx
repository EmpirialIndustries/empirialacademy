import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, MessageSquare, UserPlus, Video, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const getNotificationIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('enroll') || lower.includes('join')) return UserPlus;
  if (lower.includes('message') || lower.includes('chat')) return MessageSquare;
  if (lower.includes('session') || lower.includes('class') || lower.includes('video')) return Video;
  if (lower.includes('resource') || lower.includes('upload')) return BookOpen;
  return Bell;
};

const getNotificationColor = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('enroll') || lower.includes('join')) return 'text-success bg-success/10';
  if (lower.includes('message') || lower.includes('chat')) return 'text-primary bg-primary/10';
  if (lower.includes('session') || lower.includes('video')) return 'text-accent-foreground bg-accent/20';
  return 'text-muted-foreground bg-muted';
};

export function NotificationBell() {
  const { profile, isDemo } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!profile || isDemo) return;

    const fetchNotifications = async () => {
      const { data } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) setNotifications(data);
    };

    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, isDemo]);

  const markAsRead = async (id: string) => {
    await (supabase as any)
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await (supabase as any)
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce-subtle">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllRead}>
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <Bell className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground">All caught up!</p>
              <p className="mt-1 text-xs text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => {
                const Icon = getNotificationIcon(n.title);
                const iconColor = getNotificationColor(n.title);
                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors group',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', iconColor)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-sm text-foreground line-clamp-1', !n.read && 'font-semibold')}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">
                          {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.read && (
                        <Check className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors mt-1 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
