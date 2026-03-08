import { AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function DemoBanner() {
  const { isDemo, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isDemo) return null;

  const handleCreateAccount = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-3 bg-accent px-4 py-2 text-accent-foreground">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <p className="text-sm font-medium">
        You're in demo mode — data won't be saved.
      </p>
      <Button
        size="sm"
        variant="secondary"
        className="h-7 text-xs"
        onClick={handleCreateAccount}
      >
        Create an Account
      </Button>
    </div>
  );
}
