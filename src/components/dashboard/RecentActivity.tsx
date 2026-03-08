import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen, UserPlus, Video, FileText, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  icon: typeof BookOpen;
  text: string;
  time: string;
  color: string;
}

export function RecentActivity() {
  const { profile } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!profile) return;
      try {
        const items: ActivityItem[] = [];

        if (profile.role === 'tutor') {
          // Recent enrollments in tutor's classes
          const { data: classes } = await supabase
            .from('classes')
            .select('id, title')
            .eq('tutor_id', profile.id)
            .eq('is_active', true);

          const classIds = classes?.map(c => c.id) || [];
          if (classIds.length > 0) {
            const { data: enrollments } = await supabase
              .from('enrollments')
              .select('id, subscribed_at, class_id, student:profiles!enrollments_student_id_fkey(full_name)')
              .in('class_id', classIds)
              .eq('is_active', true)
              .order('subscribed_at', { ascending: false })
              .limit(5);

            enrollments?.forEach(e => {
              const cls = classes?.find(c => c.id === e.class_id);
              items.push({
                id: e.id,
                icon: UserPlus,
                text: `${(e.student as any)?.full_name || 'A student'} enrolled in ${cls?.title || 'a class'}`,
                time: e.subscribed_at,
                color: 'text-success',
              });
            });
          }

          // Recently created classes
          const { data: recentClasses } = await supabase
            .from('classes')
            .select('id, title, created_at')
            .eq('tutor_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(3);

          recentClasses?.forEach(c => {
            items.push({
              id: `class-${c.id}`,
              icon: BookOpen,
              text: `You created "${c.title}"`,
              time: c.created_at,
              color: 'text-primary',
            });
          });
        } else {
          // Student: recent enrollments
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select('id, subscribed_at, class:classes(title, tutor:profiles!classes_tutor_id_fkey(full_name))')
            .eq('student_id', profile.id)
            .eq('is_active', true)
            .order('subscribed_at', { ascending: false })
            .limit(5);

          enrollments?.forEach(e => {
            const cls = e.class as any;
            items.push({
              id: e.id,
              icon: BookOpen,
              text: `You enrolled in "${cls?.title}" with ${cls?.tutor?.full_name || 'a tutor'}`,
              time: e.subscribed_at,
              color: 'text-primary',
            });
          });
        }

        // Sort by time, take 5
        items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setActivities(items.slice(0, 5));
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [profile]);

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-1">
            {activities.map((item, i) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent/50 transition-colors"
              >
                <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted', item.color)}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground line-clamp-1">{item.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
