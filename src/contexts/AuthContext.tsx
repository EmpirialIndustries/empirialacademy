import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session as SupabaseSession } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: SupabaseSession | null;
  loading: boolean;
  isDemo: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole, grade?: number) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  demoSignIn: (role: UserRole) => void;
}

const DEMO_PROFILES: Record<UserRole, { user: Partial<User>; profile: Profile }> = {
  student: {
    user: {
      id: 'demo-student-001',
      email: 'demo.student@educonnect.com',
    },
    profile: {
      id: 'demo-profile-student-001',
      user_id: 'demo-student-001',
      full_name: 'Alex Johnson',
      role: 'student',
      grade: 11,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  tutor: {
    user: {
      id: 'demo-tutor-001',
      email: 'demo.tutor@educonnect.com',
    },
    profile: {
      id: 'demo-profile-tutor-001',
      user_id: 'demo-tutor-001',
      full_name: 'Dr. Sarah Williams',
      role: 'tutor',
      grade: null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile | null;
  };

  useEffect(() => {
    // Check for demo session in localStorage
    const demoRole = localStorage.getItem('educonnect-demo-role') as UserRole | null;
    if (demoRole && DEMO_PROFILES[demoRole]) {
      setUser(DEMO_PROFILES[demoRole].user as User);
      setProfile(DEMO_PROFILES[demoRole].profile);
      setIsDemo(true);
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }, 0);
        } else if (!localStorage.getItem('educonnect-demo-role')) {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!localStorage.getItem('educonnect-demo-role')) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id).then(setProfile);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const demoSignIn = (role: UserRole) => {
    const demo = DEMO_PROFILES[role];
    localStorage.setItem('educonnect-demo-role', role);
    setUser(demo.user as User);
    setProfile(demo.profile);
    setIsDemo(true);
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole, grade?: number) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          role: role,
          grade: grade,
        },
      },
    });

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem('educonnect-demo-role');
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsDemo(false);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, isDemo, signUp, signIn, signOut, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
