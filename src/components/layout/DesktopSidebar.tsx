import { Home, Video, BookOpen, User, LogOut, GraduationCap } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/classroom', icon: Video, label: 'Classroom' },
  { to: '/resources', icon: BookOpen, label: 'Resources' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function DesktopSidebar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">EduConnect</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      {profile && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {profile.full_name}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {profile.role}
                {profile.grade && ` • Grade ${profile.grade}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
