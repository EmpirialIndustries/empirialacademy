import { TutorClass } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Clock, Calendar, Users, CheckCircle2 } from 'lucide-react';

interface TutorCardProps {
  tutorClass: TutorClass;
  onViewDetails: (tutorClass: TutorClass) => void;
  isEnrolled?: boolean;
  enrolledCount?: number;
}

export function TutorCard({ tutorClass, onViewDetails, isEnrolled = false, enrolledCount }: TutorCardProps) {
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
      {/* Enrolled Badge */}
      {isEnrolled && (
        <div className="absolute right-3 top-3 z-10">
          <Badge className="bg-success text-success-foreground gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Enrolled
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10 transition-transform group-hover:scale-105">
              <AvatarImage src={tutorClass.tutor?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(tutorClass.tutor?.full_name || 'T')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {tutorClass.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tutorClass.tutor?.full_name || 'Tutor'}
              </p>
            </div>
          </div>
          {!isEnrolled && (
            <Badge className="gradient-primary text-primary-foreground font-bold shrink-0">
              R{tutorClass.monthly_price}/pm
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {tutorClass.subject}
          </Badge>
          <Badge variant="outline">Grade {tutorClass.grade}</Badge>
          {enrolledCount !== undefined && (
            <Badge variant="outline" className="gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {enrolledCount} students
            </Badge>
          )}
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatSchedule(tutorClass.schedule_days)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{formatTime(tutorClass.start_time)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full group-hover:gradient-primary transition-all" 
          variant={isEnrolled ? 'outline' : 'default'}
          onClick={() => onViewDetails(tutorClass)}
        >
          {isEnrolled ? 'View Class' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
}
