import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ClassCard } from '@/components/groups/ClassCard';
import { CreateClassForm } from '@/components/groups/CreateClassForm';
import { StudentListModal } from '@/components/groups/StudentListModal';
import { Button } from '@/components/ui/button';
import { TutorClass, Profile, Enrollment } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Search, Users } from 'lucide-react';

export default function Groups() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [students, setStudents] = useState<Profile[]>([]);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (profile) {
      if (profile.role === 'tutor') {
        fetchTutorClasses();
      } else {
        fetchStudentEnrollments();
      }
    }
  }, [profile]);

  const fetchTutorClasses = async () => {
    if (!profile) return;
    
    try {
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
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your classes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentEnrollments = async () => {
    if (!profile) return;

    try {
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
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your classes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClass = async (formData: {
    title: string;
    subject: string;
    grade: string;
    monthly_price: string;
    schedule_days: string[];
    start_time: string;
  }) => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      // Create Daily.co room first
      const roomResponse = await supabase.functions.invoke('create-daily-room', {
        body: { className: formData.title },
      });

      if (roomResponse.error) {
        throw new Error('Failed to create video room');
      }

      const meetingLink = roomResponse.data?.url;

      // Insert the class
      const { error } = await supabase.from('classes').insert({
        tutor_id: profile.id,
        title: formData.title,
        subject: formData.subject,
        grade: parseInt(formData.grade),
        monthly_price: parseFloat(formData.monthly_price),
        schedule_days: formData.schedule_days,
        start_time: formData.start_time,
        meeting_link: meetingLink,
      });

      if (error) throw error;

      toast({
        title: 'Class Created!',
        description: 'Your class has been created successfully',
      });

      setIsCreateOpen(false);
      fetchTutorClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: 'Failed to create class. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewStudents = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          student:profiles!enrollments_student_id_fkey(*)
        `)
        .eq('class_id', classId)
        .eq('is_active', true);

      if (error) throw error;

      const studentList = data?.map(e => e.student).filter(Boolean) as Profile[];
      setStudents(studentList);
      setSelectedClassId(classId);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to load students',
        variant: 'destructive',
      });
    }
  };

  const handleJoinSession = (classId: string) => {
    const cls = classes.find(c => c.id === classId) || 
                enrollments.find(e => e.class_id === classId)?.class;
    
    if (cls?.meeting_link) {
      navigate(`/classroom?room=${encodeURIComponent(cls.meeting_link)}`);
    } else {
      toast({
        title: 'No Session Available',
        description: 'This class does not have an active session',
        variant: 'destructive',
      });
    }
  };

  const selectedClassName = classes.find(c => c.id === selectedClassId)?.title || '';

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Please log in to view your classes</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
            <p className="text-muted-foreground">
              {profile.role === 'tutor'
                ? 'Manage your classes and students'
                : 'Your subscribed classes'}
            </p>
          </div>
          {profile.role === 'tutor' && (
            <Button onClick={() => setIsCreateOpen(true)} className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : profile.role === 'tutor' ? (
          classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No classes yet</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Create your first class to start teaching
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Class
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <ClassCard
                  key={cls.id}
                  tutorClass={cls}
                  role="tutor"
                  enrollmentCount={enrollmentCounts[cls.id] || 0}
                  onJoinSession={handleJoinSession}
                  onViewStudents={handleViewStudents}
                />
              ))}
            </div>
          )
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              No subscriptions yet
            </h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Find a tutor and subscribe to start learning
            </p>
            <Button onClick={() => navigate('/tutors')} className="gradient-primary">
              Find a Tutor
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              enrollment.class && (
                <ClassCard
                  key={enrollment.id}
                  tutorClass={enrollment.class}
                  role="student"
                  isLive={false}
                  onJoinSession={handleJoinSession}
                />
              )
            ))}
          </div>
        )}

        <CreateClassForm
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateClass}
          isSubmitting={isSubmitting}
        />

        <StudentListModal
          isOpen={!!selectedClassId}
          onClose={() => setSelectedClassId(null)}
          className={selectedClassName}
          students={students}
        />
      </div>
    </AppLayout>
  );
}
