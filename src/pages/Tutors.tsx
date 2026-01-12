import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TutorCard } from '@/components/tutors/TutorCard';
import { TutorFilters } from '@/components/tutors/TutorFilters';
import { ClassDetailsModal } from '@/components/tutors/ClassDetailsModal';
import { TutorClass } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';

export default function Tutors() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<TutorClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<TutorClass | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [priceRange, setPriceRange] = useState('All Prices');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchTerm, selectedSubject, selectedGrade, priceRange]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          tutor:profiles!classes_tutor_id_fkey(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get enrollment counts
      const classIds = data?.map(c => c.id) || [];
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('class_id')
        .in('class_id', classIds)
        .eq('is_active', true);

      const enrollmentCounts = enrollments?.reduce((acc, e) => {
        acc[e.class_id] = (acc[e.class_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const classesWithCounts = data?.map(c => ({
        ...c,
        enrollment_count: enrollmentCounts[c.id] || 0,
      })) as TutorClass[];

      setClasses(classesWithCounts || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = [...classes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.subject.toLowerCase().includes(term) ||
          c.tutor?.full_name?.toLowerCase().includes(term)
      );
    }

    if (selectedSubject !== 'All Subjects') {
      filtered = filtered.filter((c) => c.subject === selectedSubject);
    }

    if (selectedGrade !== 'All Grades') {
      filtered = filtered.filter((c) => c.grade === parseInt(selectedGrade));
    }

    if (priceRange !== 'All Prices') {
      filtered = filtered.filter((c) => {
        const price = c.monthly_price;
        switch (priceRange) {
          case 'Under R300':
            return price < 300;
          case 'R300 - R500':
            return price >= 300 && price <= 500;
          case 'R500 - R800':
            return price > 500 && price <= 800;
          case 'Over R800':
            return price > 800;
          default:
            return true;
        }
      });
    }

    setFilteredClasses(filtered);
  };

  const handleSubscribe = async (classId: string) => {
    if (!profile) {
      toast({
        title: 'Login Required',
        description: 'Please log in to subscribe to classes',
        variant: 'destructive',
      });
      return;
    }

    if (profile.role !== 'student') {
      toast({
        title: 'Not Allowed',
        description: 'Only students can subscribe to classes',
        variant: 'destructive',
      });
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase.from('enrollments').insert({
        student_id: profile.id,
        class_id: classId,
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already Subscribed',
            description: 'You are already subscribed to this class',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Success!',
          description: 'You have successfully subscribed to this class',
        });
        setSelectedClass(null);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to subscribe to class',
        variant: 'destructive',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find a Tutor</h1>
          <p className="text-muted-foreground">
            Browse classes and subscribe to learn from the best tutors
          </p>
        </div>

        <TutorFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No classes found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your filters or search term
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((tutorClass) => (
              <TutorCard
                key={tutorClass.id}
                tutorClass={tutorClass}
                onViewDetails={setSelectedClass}
              />
            ))}
          </div>
        )}

        <ClassDetailsModal
          tutorClass={selectedClass}
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
          onSubscribe={handleSubscribe}
          isSubscribing={isSubscribing}
        />
      </div>
    </AppLayout>
  );
}
