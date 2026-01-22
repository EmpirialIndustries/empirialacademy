import { Home, Users, Calendar, Search, User, Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/tutors', icon: Search, label: 'Tutors' },
  { to: '/groups', icon: Users, label: 'Classes' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
];

export function MobileNav() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-smooth',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'rounded-lg p-1.5 transition-smooth',
                    isActive && 'bg-primary/10'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Profile Link */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-smooth',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  'rounded-lg p-1.5 transition-smooth',
                  isActive && 'bg-primary/10'
                )}
              >
                <User className="h-5 w-5" />
              </div>
              <span>Profile</span>
            </>
          )}
        </NavLink>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-smooth hover:text-foreground"
        >
          <div className="rounded-lg p-1.5 transition-smooth">
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </div>
          <span>Theme</span>
        </button>
      </div>
    </nav>
  );
}
