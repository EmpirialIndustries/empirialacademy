import { ReactNode } from 'react';
import { MobileNav } from './MobileNav';
import { DesktopSidebar } from './DesktopSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <DesktopSidebar />
      <main className="flex-1 pb-20 md:ml-64 md:pb-0">
        <div className="mx-auto max-w-6xl p-4 md:p-6">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
