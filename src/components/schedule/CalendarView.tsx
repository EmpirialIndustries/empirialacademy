import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TutorClass } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  classes: TutorClass[];
  onDayClick?: (date: Date, events: TutorClass[]) => void;
}

const dayIndexMap: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function CalendarView({ classes, onDayClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getEventsForDay = (date: Date): TutorClass[] => {
    const dayOfWeek = getDay(date);
    return classes.filter((cls) =>
      cls.schedule_days.some((day) => dayIndexMap[day] === dayOfWeek)
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const firstDayOfMonth = getDay(startOfMonth(currentMonth));

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {days.map((day) => {
            const events = getEventsForDay(day);
            const hasEvents = events.length > 0;

            return (
              <button
                key={day.toISOString()}
                onClick={() => hasEvents && onDayClick?.(day, events)}
                className={cn(
                  "aspect-square p-1 rounded-lg text-sm transition-smooth flex flex-col items-center justify-start",
                  !isSameMonth(day, currentMonth) && "text-muted-foreground/50",
                  isToday(day) && "bg-primary/10 font-bold",
                  hasEvents && "hover:bg-muted cursor-pointer",
                  !hasEvents && "cursor-default"
                )}
              >
                <span className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-full",
                  isToday(day) && "bg-primary text-primary-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                {hasEvents && (
                  <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                    {events.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Upcoming Classes Legend */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Your Classes This Month
          </h4>
          <div className="space-y-2">
            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes scheduled</p>
            ) : (
              classes.slice(0, 5).map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium flex-1">{cls.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {cls.schedule_days.join(', ')} • {formatTime(cls.start_time)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
