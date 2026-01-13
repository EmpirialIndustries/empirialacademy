import { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, LogOut, Calendar, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setGrade(profile.grade?.toString() || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (profile.role === 'student') {
        updates.grade = grade ? parseInt(grade) : null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                <AvatarImage src={avatarUrl || undefined} alt={fullName} />
                <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                  {getInitials(fullName || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 flex-1 sm:ml-6 sm:mt-0">
                <h1 className="text-2xl font-bold text-foreground">{fullName || 'User'}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge className="capitalize">{profile.role === 'tutor' ? '👨‍🏫 Tutor' : '🎓 Student'}</Badge>
                  {profile.role === 'student' && grade && (
                    <Badge variant="secondary">Grade {grade}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Edit Profile
            </CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your profile picture
              </p>
            </div>

            {/* Grade - Only for Students */}
            {profile.role === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Save Button */}
            <Button 
              onClick={handleSaveProfile} 
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Info (Read-only) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-primary" />
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
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium capitalize text-foreground">{profile.role}</p>
              </div>
            </div>

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
