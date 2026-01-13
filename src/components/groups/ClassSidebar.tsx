import { Users, Plus, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TutorClass, Enrollment } from '@/types';
import { cn } from '@/lib/utils';

interface ClassSidebarProps {
  classes: TutorClass[];
  enrollments: Enrollment[];
  selectedClassId: string | null;
  onSelectClass: (cls: TutorClass) => void;
  onCreateClass?: () => void;
  onBrowseTutors?: () => void;
  role: 'tutor' | 'student';
  enrollmentCounts?: Record<string, number>;
}

export function ClassSidebar({
  classes,
  enrollments,
  selectedClassId,
  onSelectClass,
  onCreateClass,
  onBrowseTutors,
  role,
  enrollmentCounts = {},
}: ClassSidebarProps) {
  const displayClasses = role === 'tutor' 
    ? classes 
    : enrollments.map(e => e.class).filter(Boolean) as TutorClass[];

  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sidebar-foreground">My Classes</h2>
        </div>
        {role === 'tutor' && onCreateClass && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreateClass}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Class List */}
      <ScrollArea className="flex-1">
        {displayClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              {role === 'tutor' ? 'No classes yet' : 'No subscriptions'}
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              {role === 'tutor'
                ? 'Create your first class to get started'
                : 'Find a tutor to enroll in a class'}
            </p>
            {role === 'tutor' && onCreateClass ? (
              <Button size="sm" onClick={onCreateClass} className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Class
              </Button>
            ) : onBrowseTutors ? (
              <Button size="sm" onClick={onBrowseTutors} className="gradient-primary">
                <Search className="h-4 w-4 mr-2" />
                Find Tutors
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {displayClasses.map((cls) => (
              <button
                key={cls.id}
                onClick={() => onSelectClass(cls)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg p-3 text-left transition-smooth',
                  selectedClassId === cls.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                )}
              >
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                  selectedClassId === cls.id
                    ? 'gradient-primary'
                    : 'bg-primary/10'
                )}>
                  <span className={cn(
                    'font-semibold text-sm',
                    selectedClassId === cls.id
                      ? 'text-primary-foreground'
                      : 'text-primary'
                  )}>
                    {cls.subject.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{cls.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {cls.subject}
                    </Badge>
                    {role === 'tutor' && enrollmentCounts[cls.id] !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {enrollmentCounts[cls.id]} student{enrollmentCounts[cls.id] !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer Actions */}
      {role === 'student' && displayClasses.length > 0 && onBrowseTutors && (
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onBrowseTutors}
          >
            <Search className="h-4 w-4 mr-2" />
            Find More Classes
          </Button>
        </div>
      )}
    </div>
  );
}
