import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { Resource } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResources(data as Resource[]);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGrade =
        selectedGrade === 'all' || resource.grade_level === parseInt(selectedGrade);
      
      const matchesSubject =
        selectedSubject === 'all' || resource.subject === selectedSubject;

      return matchesSearch && matchesGrade && matchesSubject;
    });
  }, [resources, searchQuery, selectedGrade, selectedSubject]);

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
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredResources.length > 0 ? (
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
              {resources.length === 0
                ? 'No resources have been uploaded yet'
                : 'Try adjusting your filters or search query'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
