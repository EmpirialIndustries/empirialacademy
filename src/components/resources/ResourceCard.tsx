import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
}

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-500/10 text-blue-600',
  Physics: 'bg-purple-500/10 text-purple-600',
  Chemistry: 'bg-green-500/10 text-green-600',
  Biology: 'bg-emerald-500/10 text-emerald-600',
  English: 'bg-amber-500/10 text-amber-600',
  History: 'bg-orange-500/10 text-orange-600',
  Geography: 'bg-teal-500/10 text-teal-600',
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const colorClass = subjectColors[resource.subject] || 'bg-muted text-muted-foreground';

  return (
    <Card className="overflow-hidden shadow-card transition-smooth hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-4">
          <div className={`rounded-lg p-3 ${colorClass}`}>
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-foreground">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {resource.subject}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Grade {resource.grade_level}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {resource.file_type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none border-r border-border"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 rounded-none">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
