import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-2xl bg-muted/50 p-6 md:p-8 space-y-3">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-8 w-64" />
        <Shimmer className="h-4 w-80" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Shimmer className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Shimmer className="h-6 w-16" />
                  <Shimmer className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shimmer className="h-5 w-5 rounded" />
                <Shimmer className="h-5 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex gap-3 items-center">
                  <Shimmer className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Shimmer className="h-4 w-3/4" />
                    <Shimmer className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ClassListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3 items-center rounded-lg border border-border p-3">
          <Shimmer className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
          </div>
          <Shimmer className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function ResourceGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Shimmer className="h-4 w-3/4" />
                <Shimmer className="h-3 w-1/2" />
              </div>
            </div>
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-2/3" />
            <div className="flex gap-2 pt-1">
              <Shimmer className="h-6 w-16 rounded-full" />
              <Shimmer className="h-6 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-6 w-32" />
          <div className="flex gap-2">
            <Shimmer className="h-8 w-8 rounded-md" />
            <Shimmer className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <Shimmer key={`h-${i}`} className="h-4 w-full" />
          ))}
          {[...Array(35)].map((_, i) => (
            <Shimmer key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
