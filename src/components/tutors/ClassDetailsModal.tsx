import { TutorClass } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, BookOpen, GraduationCap, Users } from 'lucide-react';

interface ClassDetailsModalProps {
  tutorClass: TutorClass | null;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (classId: string) => void;
  isSubscribing: boolean;
}

export function ClassDetailsModal({
  tutorClass,
  isOpen,
  onClose,
  onSubscribe,
  isSubscribing,
}: ClassDetailsModalProps) {
  if (!tutorClass) return null;

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{tutorClass.title}</DialogTitle>
          <DialogDescription>
            Monthly subscription class details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tutor Info */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              <AvatarImage src={tutorClass.tutor?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {getInitials(tutorClass.tutor?.full_name || 'T')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">
                {tutorClass.tutor?.full_name || 'Tutor'}
              </h4>
              <p className="text-sm text-muted-foreground">Tutor</p>
            </div>
          </div>

          {/* Class Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Subject:</span>
              <Badge variant="secondary">{tutorClass.subject}</Badge>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Grade Level:</span>
              <Badge variant="outline">Grade {tutorClass.grade}</Badge>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Schedule:</span>
              <span className="font-medium">Every {formatSchedule(tutorClass.schedule_days)}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{formatTime(tutorClass.start_time)}</span>
            </div>

            {tutorClass.enrollment_count !== undefined && (
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Students Enrolled:</span>
                <span className="font-medium">{tutorClass.enrollment_count}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
            <span className="text-sm text-muted-foreground">Monthly Subscription</span>
            <span className="text-2xl font-bold text-primary">
              R{tutorClass.monthly_price}
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </span>
          </div>

          <Button
            className="w-full gradient-primary"
            size="lg"
            onClick={() => onSubscribe(tutorClass.id)}
            disabled={isSubscribing}
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
