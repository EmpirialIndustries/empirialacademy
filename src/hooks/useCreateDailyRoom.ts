import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseCreateDailyRoomReturn {
  createRoom: (className?: string) => Promise<string | null>;
  isCreating: boolean;
  error: string | null;
}

export function useCreateDailyRoom(): UseCreateDailyRoomReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createRoom = async (className?: string): Promise<string | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-daily-room', {
        body: { className: className || 'Video Session' },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to create room');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.url) {
        throw new Error('No room URL returned');
      }

      return data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create video room';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { createRoom, isCreating, error };
}
