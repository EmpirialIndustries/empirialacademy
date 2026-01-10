import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { Resource } from '@/types';

// Mock data for immediate UI
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Quadratic Equations Complete Guide',
    description: 'Master quadratic equations with step-by-step solutions and practice problems.',
    subject: 'Mathematics',
    grade_level: 10,
    file_url: '/resources/quadratic.pdf',
    file_type: 'PDF',
    uploaded_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    description: 'Understanding the fundamental laws that govern motion and forces.',
    subject: 'Physics',
    grade_level: 11,
    file_url: '/resources/newton.pdf',
    file_type: 'PDF',
    uploaded_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Organic Chemistry Basics',
    description: 'Introduction to carbon compounds and organic reactions.',
    subject: 'Chemistry',
    grade_level: 12,
    file_url: '/resources/organic.pdf',
    file_type: 'PDF',
    uploaded_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Cell Biology & Genetics',
    description: 'Explore the building blocks of life and hereditary mechanisms.',
    subject: 'Biology',
    grade_level: 10,
    file_url: '/resources/biology.pdf',
    file_type: 'PDF',
    uploaded_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Shakespeare\'s Hamlet Analysis',
    description: 'In-depth literary analysis of themes, characters, and symbolism.',
    subject: 'English',
    grade_level: 12,
    file_url: '/resources/hamlet.pdf',
    file_type: 'PDF',
    uploaded_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Trigonometry Made Easy',
    description: 'Sin, cos, tan explained with real-world applications.',
    subject: 'Mathematics',
    grade_level: 11,
    file_url: '/resources/trig.pdf',
    file_type: 'PDF',
    uploaded_by: null,
    created_at: new Date().toISOString(),
  },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredResources = useMemo(() => {
    return mockResources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGrade =
        selectedGrade === 'all' || resource.grade_level === parseInt(selectedGrade);
      
      const matchesSubject =
        selectedSubject === 'all' || resource.subject === selectedSubject;

      return matchesSearch && matchesGrade && matchesSubject;
    });
  }, [searchQuery, selectedGrade, selectedSubject]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <BookOpen className="h-7 w-7 text-primary" />
            Resource Library
          </h1>
          <p className="mt-1 text-muted-foreground">
            Browse and download study materials for your courses
          </p>
        </div>

        {/* Filters */}
        <ResourceFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
        />

        {/* Resource Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="font-medium text-foreground">No resources found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
