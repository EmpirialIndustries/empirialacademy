import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TutorClass, Enrollment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, BookOpen, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      try {
        if (profile.role === 'tutor') {
          // Fetch tutor's classes
          const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('tutor_id', profile.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Get enrollment counts
          const classIds = data?.map(c => c.id) || [];
          if (classIds.length > 0) {
            const { data: enrollmentData } = await supabase
              .from('enrollments')
              .select('class_id')
              .in('class_id', classIds)
              .eq('is_active', true);

            const counts = enrollmentData?.reduce((acc, e) => {
              acc[e.class_id] = (acc[e.class_id] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {};

            setEnrollmentCounts(counts);
          }

          setClasses(data as TutorClass[] || []);
        } else {
          // Fetch student's enrollments
          const { data, error } = await supabase
            .from('enrollments')
            .select(`
              *,
              class:classes(
                *,
                tutor:profiles!classes_tutor_id_fkey(*)
              )
            `)
            .eq('student_id', profile.id)
            .eq('is_active', true);

          if (error) throw error;
          setEnrollments(data as Enrollment[] || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  const getDayAbbreviation = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
  };

  const todayDay = getDayAbbreviation();
  
  // Get today's classes
  const todaysClasses = profile?.role === 'tutor'
    ? classes.filter(c => c.schedule_days.includes(todayDay))
    : enrollments.filter(e => e.class?.schedule_days.includes(todayDay)).map(e => e.class!);

  const handleJoinClass = (cls: TutorClass) => {
    if (cls.meeting_link) {
      navigate(`/classroom?room=${encodeURIComponent(cls.meeting_link)}&title=${encodeURIComponent(cls.title)}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <WelcomeCard />
        
        {/* Stats Section */}
        <DashboardStats />
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today's Classes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : todaysClasses.length > 0 ? (
                <div className="space-y-3">
                  {todaysClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3 bg-card/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{cls.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {cls.subject}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(`2000-01-01T${cls.start_time}`), 'h:mm a')}
                            </span>
                            {profile?.role === 'tutor' && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {enrollmentCounts[cls.id] || 0} students
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {cls.meeting_link && (
                        <Button
                          size="sm"
                          onClick={() => handleJoinClass(cls)}
                          className="gradient-primary gap-1"
                        >
                          {profile?.role === 'tutor' ? (
                            <>
                              <Play className="h-4 w-4" />
                              Start
                            </>
                          ) : (
                            <>
                              <Video className="h-4 w-4" />
                              Join
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No classes scheduled for today
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 text-primary"
                    onClick={() => navigate('/schedule')}
                  >
                    View full schedule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <QuickActions />
        </div>

        {/* All Classes Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              {profile?.role === 'tutor' ? 'Your Classes' : 'Enrolled Classes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (profile?.role === 'tutor' ? classes : enrollments.map(e => e.class!)).length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {(profile?.role === 'tutor' ? classes : enrollments.map(e => e.class!)).map((cls) => (
                  <div
                    key={cls.id}
                    className="rounded-lg border border-border p-3 bg-card/50 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/groups')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{cls.subject}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Grade {cls.grade}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">{cls.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {cls.schedule_days.join(', ')} at {format(new Date(`2000-01-01T${cls.start_time}`), 'h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {profile?.role === 'tutor'
                    ? "You haven't created any classes yet"
                    : "You're not enrolled in any classes yet"}
                </p>
                <Button
                  variant="link"
                  className="mt-2 text-primary"
                  onClick={() => navigate(profile?.role === 'tutor' ? '/groups' : '/tutors')}
                >
                  {profile?.role === 'tutor' ? 'Create a class' : 'Browse classes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
