import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarView } from '@/components/schedule/CalendarView';
import { TutorClass } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Schedule() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<TutorClass[]>([]);

  useEffect(() => {
    if (profile) {
      fetchUserClasses();
    }
  }, [profile]);

  const fetchUserClasses = async () => {
    if (!profile) return;

    try {
      if (profile.role === 'tutor') {
        // Fetch tutor's own classes
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('tutor_id', profile.id)
          .eq('is_active', true);

        if (error) throw error;
        setClasses(data as TutorClass[] || []);
      } else {
        // Fetch student's enrolled classes
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            class:classes(*)
          `)
          .eq('student_id', profile.id)
          .eq('is_active', true);

        if (error) throw error;

        const enrolledClasses = data
          ?.map((e) => e.class)
          .filter(Boolean) as TutorClass[];
        setClasses(enrolledClasses || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load schedule',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (date: Date, events: TutorClass[]) => {
    setSelectedDay(date);
    setDayEvents(events);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Please log in to view your schedule</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground">
            View your upcoming classes and lessons
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <CalendarView classes={classes} onDayClick={handleDayClick} />
        )}

        <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedDay && format(selectedDay, 'EEEE, MMMM d, yyyy')}
              </DialogTitle>
              <DialogDescription>
                Classes scheduled for this day
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {dayEvents.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{cls.title}</h4>
                    <p className="text-sm text-muted-foreground">{cls.subject}</p>
                  </div>
                  <Badge variant="secondary">{formatTime(cls.start_time)}</Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
