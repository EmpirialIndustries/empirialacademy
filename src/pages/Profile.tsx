import { User, Mail, GraduationCap, LogOut, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';

export default function Profile() {
  const { user, profile, signOut } = useAuth();
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

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden shadow-card">
          <div className="h-24 gradient-hero" />
          <CardContent className="relative pt-0">
            <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
              <Avatar className="h-24 w-24 border-4 border-card">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
                <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 flex-1 sm:ml-6 sm:mt-0">
                <h1 className="text-2xl font-bold text-foreground">{profile.full_name}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge className="capitalize">{profile.role}</Badge>
                  {profile.grade && (
                    <Badge variant="secondary">Grade {profile.grade}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize text-foreground">{profile.role}</p>
              </div>
            </div>

            {profile.grade && (
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Grade Level</p>
                  <p className="font-medium text-foreground">Grade {profile.grade}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">
                  {format(parseISO(profile.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
}
