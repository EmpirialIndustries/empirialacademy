import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { UpcomingClassCard } from '@/components/dashboard/UpcomingClassCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '@/types';

export default function Dashboard() {
  const { profile } = useAuth();
  const [upcomingSession, setUpcomingSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingSession = async () => {
      if (!profile) return;

      const now = new Date().toISOString();
      const column = profile.role === 'tutor' ? 'tutor_id' : 'student_id';

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          tutor:profiles!tutor_id(*),
          student:profiles!student_id(*)
        `)
        .eq(column, profile.id)
        .gte('start_time', now)
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setUpcomingSession(data as Session | null);
      }
      setLoading(false);
    };

    fetchUpcomingSession();
  }, [profile]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <WelcomeCard />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingClassCard session={upcomingSession} />
          <QuickActions />
        </div>
      </div>
    </AppLayout>
  );
}
