import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ClassSidebar } from '@/components/groups/ClassSidebar';
import { GroupChatPanel } from '@/components/groups/GroupChatPanel';
import { CreateClassForm } from '@/components/groups/CreateClassForm';
import { StudentListModal } from '@/components/groups/StudentListModal';
import { TutorClass, Profile, Enrollment } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Groups() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TutorClass | null>(null);
  const [selectedClassIdForStudents, setSelectedClassIdForStudents] = useState<string | null>(null);
  const [students, setStudents] = useState<Profile[]>([]);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

      const classesData = data as TutorClass[] || [];
      setClasses(classesData);
      
      // Auto-select first class if none selected
      if (classesData.length > 0 && !selectedClass) {
        setSelectedClass(classesData[0]);
      }
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

      const enrollmentsData = data as Enrollment[] || [];
      setEnrollments(enrollmentsData);
      
      // Auto-select first class if none selected
      if (enrollmentsData.length > 0 && !selectedClass && enrollmentsData[0].class) {
        setSelectedClass(enrollmentsData[0].class);
      }
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
      const { data, error } = await supabase.from('classes').insert({
        tutor_id: profile.id,
        title: formData.title,
        subject: formData.subject,
        grade: parseInt(formData.grade),
        monthly_price: parseFloat(formData.monthly_price),
        schedule_days: formData.schedule_days,
        start_time: formData.start_time,
        meeting_link: meetingLink,
      }).select().single();

      if (error) throw error;

      toast({
        title: 'Class Created!',
        description: 'Your class has been created successfully',
      });

      setIsCreateOpen(false);
      fetchTutorClasses();
      
      // Select the newly created class
      if (data) {
        setSelectedClass(data as TutorClass);
      }
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
      setSelectedClassIdForStudents(classId);
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

  const handleSelectClass = (cls: TutorClass) => {
    setSelectedClass(cls);
    setIsMobileSidebarOpen(false);
  };

  const selectedClassName = classes.find(c => c.id === selectedClassIdForStudents)?.title || '';

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Please log in to view your classes</p>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const sidebarContent = (
    <ClassSidebar
      classes={classes}
      enrollments={enrollments}
      selectedClassId={selectedClass?.id || null}
      onSelectClass={handleSelectClass}
      onCreateClass={() => setIsCreateOpen(true)}
      onBrowseTutors={() => navigate('/tutors')}
      role={profile.role}
      enrollmentCounts={enrollmentCounts}
    />
  );

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] flex flex-col md:flex-row -m-4 md:-m-6">
        {/* Mobile Header with Menu Button */}
        <div className="flex items-center gap-3 p-4 border-b border-border md:hidden">
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-foreground">
              {selectedClass?.title || 'My Classes'}
            </h1>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 h-full">
          {sidebarContent}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 h-full overflow-hidden">
          <GroupChatPanel
            selectedClass={selectedClass}
            onJoinSession={handleJoinSession}
          />
        </div>
      </div>

      <CreateClassForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateClass}
        isSubmitting={isSubmitting}
      />

      <StudentListModal
        isOpen={!!selectedClassIdForStudents}
        onClose={() => setSelectedClassIdForStudents(null)}
        className={selectedClassName}
        students={students}
      />
    </AppLayout>
  );
}
