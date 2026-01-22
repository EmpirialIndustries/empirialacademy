import { Video, BookOpen, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function QuickActions() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const actions = [
    {
      icon: Video,
      label: 'Join Class',
      description: 'Enter your next session',
      onClick: () => navigate('/classroom'),
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: BookOpen,
      label: 'Resources',
      description: 'Browse study materials',
      onClick: () => navigate('/resources'),
      color: 'bg-accent/20 text-accent-foreground',
    },
    ...(profile?.role === 'tutor'
      ? [
          {
            icon: Plus,
            label: 'New Session',
            description: 'Schedule a class',
            onClick: () => navigate('/classroom'),
            color: 'bg-success/10 text-success',
          },
        ]
      : [
          {
            icon: Users,
            label: 'Find Tutors',
            description: 'Browse available tutors',
            onClick: () => navigate('/tutors'),
            color: 'bg-secondary text-secondary-foreground',
          },
        ]),
  ];

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-smooth hover:border-primary/30 hover:shadow-md"
            >
              <div className={`rounded-lg p-2.5 ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
