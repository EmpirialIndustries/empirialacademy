import { ReactNode, useState, useEffect } from 'react';
import { MobileNav } from './MobileNav';
import { DesktopSidebar } from './DesktopSidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sidebar-collapsed');
      setIsCollapsed(saved === 'true');
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for same-tab changes (since storage event doesn't fire for same tab)
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      <DesktopSidebar />
      <main
        className={cn(
          'flex-1 pb-20 transition-all duration-300 md:pb-0',
          isCollapsed ? 'md:ml-[72px]' : 'md:ml-64'
        )}
      >
        <div className="mx-auto max-w-6xl p-4 md:p-6">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
