import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export function WelcomeCard() {
  const { profile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.full_name.split(' ')[0] || 'Student';

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-hero p-6 text-primary-foreground md:p-8">
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/80">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Welcome back!</span>
        </div>
        
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          {getGreeting()}, {firstName}!
        </h1>
        
        <p className="mt-2 max-w-md text-white/80">
          {profile?.role === 'tutor'
            ? 'Ready to inspire young minds today? Check your upcoming sessions.'
            : 'Ready to learn something new? Your next class is waiting.'}
        </p>
      </div>
    </div>
  );
}
