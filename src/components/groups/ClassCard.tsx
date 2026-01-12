import { TutorClass } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassCardProps {
  tutorClass: TutorClass;
  role: 'student' | 'tutor';
  enrollmentCount?: number;
  isLive?: boolean;
  onJoinSession?: (classId: string) => void;
  onViewStudents?: (classId: string) => void;
}

export function ClassCard({
  tutorClass,
  role,
  enrollmentCount = 0,
  isLive = false,
  onJoinSession,
  onViewStudents,
}: ClassCardProps) {
  const formatSchedule = (days: string[]) => {
    return days.join(', ');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card className={cn(
      "transition-smooth hover:shadow-lg",
      isLive && "ring-2 ring-green-500 border-green-500/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground line-clamp-1">
              {tutorClass.title}
            </h3>
            {role === 'student' && tutorClass.tutor && (
              <p className="text-sm text-muted-foreground">
                by {tutorClass.tutor.full_name}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary">{tutorClass.subject}</Badge>
            {isLive && (
              <Badge className="bg-green-500 text-white animate-pulse">
                Live Now
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatSchedule(tutorClass.schedule_days)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>{formatTime(tutorClass.start_time)}</span>
          </div>
        </div>

        {role === 'tutor' && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {enrollmentCount} student{enrollmentCount !== 1 ? 's' : ''} enrolled
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {role === 'student' && (
            <Button
              className={cn("flex-1", isLive && "gradient-primary")}
              disabled={!isLive}
              onClick={() => onJoinSession?.(tutorClass.id)}
            >
              <Video className="h-4 w-4 mr-2" />
              {isLive ? 'Join Session' : 'Not Live'}
            </Button>
          )}
          {role === 'tutor' && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onViewStudents?.(tutorClass.id)}
              >
                <Users className="h-4 w-4 mr-2" />
                Students
              </Button>
              <Button
                className="flex-1 gradient-primary"
                onClick={() => onJoinSession?.(tutorClass.id)}
              >
                <Video className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
