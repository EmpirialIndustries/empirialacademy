import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TutorClass } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, ShoppingBag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardTutorMarketplace() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== 'student') return;

    const fetch = async () => {
      try {
        const [{ data: allClasses }, { data: myEnrollments }] = await Promise.all([
          supabase
            .from('classes')
            .select('*, tutor:profiles!classes_tutor_id_fkey(*)')
            .eq('is_active', true)
            .neq('tutor_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(8),
          supabase
            .from('enrollments')
            .select('class_id')
            .eq('student_id', profile.id)
            .eq('is_active', true),
        ]);

        setEnrolledIds(new Set(myEnrollments?.map(e => e.class_id) || []));
        setClasses((allClasses as TutorClass[]) || []);
      } catch (err) {
        console.error('Error fetching marketplace:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [profile]);

  if (!profile || profile.role !== 'student') return null;

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Find Tutors
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary hover:text-primary"
            onClick={() => navigate('/tutors')}
          >
            See All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-64 shrink-0 animate-pulse rounded-xl border border-border p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : classes.length > 0 ? (
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {classes.map((cls) => {
                const enrolled = enrolledIds.has(cls.id);
                return (
                  <div
                    key={cls.id}
                    className={cn(
                      'group w-64 shrink-0 rounded-xl border border-border p-4 transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer bg-card',
                      enrolled && 'border-success/30 bg-success/5'
                    )}
                    onClick={() => navigate('/tutors')}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                        <AvatarImage src={cls.tutor?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(cls.tutor?.full_name || 'T')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {cls.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {cls.tutor?.full_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                        <BookOpen className="h-2.5 w-2.5" />
                        {cls.subject}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Grade {cls.grade}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(cls.start_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {cls.schedule_days.slice(0, 2).join(', ')}
                        {cls.schedule_days.length > 2 && '...'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {enrolled ? (
                        <Badge className="bg-success/15 text-success border-success/30 text-xs">
                          Enrolled
                        </Badge>
                      ) : (
                        <Badge className="gradient-primary text-primary-foreground text-xs font-bold">
                          R{cls.monthly_price}/pm
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant={enrolled ? 'outline' : 'default'}
                        className="h-7 text-xs px-3"
                        onClick={(e) => { e.stopPropagation(); navigate('/tutors'); }}
                      >
                        {enrolled ? 'View' : 'Details'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No tutors available right now</p>
            <Button variant="link" className="mt-2 text-primary" onClick={() => navigate('/tutors')}>
              Browse all tutors
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
