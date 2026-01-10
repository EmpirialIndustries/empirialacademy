import { Calendar, Clock, Video, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Session } from '@/types';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface UpcomingClassCardProps {
  session: Session | null;
}

export function UpcomingClassCard({ session }: UpcomingClassCardProps) {
  const navigate = useNavigate();

  if (!session) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Class
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No upcoming classes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your next scheduled session will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const startTime = parseISO(session.start_time);
  const dateLabel = isToday(startTime)
    ? 'Today'
    : isTomorrow(startTime)
    ? 'Tomorrow'
    : format(startTime, 'EEEE, MMM d');

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Class
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {session.subject}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">{session.title}</h3>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(startTime, 'h:mm a')}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {dateLabel}
            </span>
          </div>
        </div>

        {session.tutor && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">with</span>
            <span className="font-medium">{session.tutor.full_name}</span>
          </div>
        )}

        <Button
          className="w-full"
          onClick={() => navigate(`/classroom?session=${session.id}`)}
        >
          <Video className="mr-2 h-4 w-4" />
          Join Class
        </Button>
      </CardContent>
    </Card>
  );
}
