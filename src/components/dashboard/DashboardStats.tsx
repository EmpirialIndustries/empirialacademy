import { useEffect, useState } from 'react';
import { BookOpen, Users, TrendingUp, Calendar, Clock, Video, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface StatsData {
  totalClasses: number;
  totalStudents: number;
  upcomingSessions: number;
  hoursLearned?: number;
}

export function DashboardStats() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalClasses: 0,
    totalStudents: 0,
    upcomingSessions: 0,
    hoursLearned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile) return;

      try {
        if (profile.role === 'tutor') {
          // Fetch tutor stats
          const { data: classes } = await supabase
            .from('classes')
            .select('id')
            .eq('tutor_id', profile.id)
            .eq('is_active', true);

          const classIds = classes?.map(c => c.id) || [];
          let totalStudents = 0;

          if (classIds.length > 0) {
            const { data: enrollments } = await supabase
              .from('enrollments')
              .select('id')
              .in('class_id', classIds)
              .eq('is_active', true);
            
            totalStudents = enrollments?.length || 0;
          }

          setStats({
            totalClasses: classes?.length || 0,
            totalStudents,
            upcomingSessions: classes?.length || 0, // Placeholder
          });
        } else {
          // Fetch student stats
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select('id, class:classes(*)')
            .eq('student_id', profile.id)
            .eq('is_active', true);

          setStats({
            totalClasses: enrollments?.length || 0,
            totalStudents: 0,
            upcomingSessions: enrollments?.length || 0, // Placeholder
            hoursLearned: (enrollments?.length || 0) * 2, // Placeholder calculation
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile]);

  const tutorStats = [
    {
      label: 'Total Classes',
      value: stats.totalClasses,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Calendar,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  const studentStats = [
    {
      label: 'Enrolled Classes',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Video,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Hours Learned',
      value: stats.hoursLearned || 0,
      icon: Clock,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  const displayStats = profile?.role === 'tutor' ? tutorStats : studentStats;

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {displayStats.map((stat, index) => (
        <Card
          key={stat.label}
          className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                  stat.bgColor
                )}
              >
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
