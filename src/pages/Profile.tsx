import { useState, useEffect, useRef } from 'react';
import { User, Mail, GraduationCap, LogOut, Calendar, Save, Loader2, Camera, BookOpen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TutorClass, Enrollment } from '@/types';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export default function Profile() {
  const { user, profile, signOut, isDemo } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');

  // Student subscriptions
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setGrade(profile.grade?.toString() || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio((profile as any).bio || '');
    }
  }, [profile]);

  useEffect(() => {
    if (profile?.role === 'student' && !isDemo) {
      fetchEnrollments();
    }
  }, [profile]);

  const fetchEnrollments = async () => {
    if (!profile) return;
    setLoadingEnrollments(true);
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`*, class:classes(*, tutor:profiles!classes_tutor_id_fkey(*))`)
        .eq('student_id', profile.id)
        .eq('is_active', true);
      if (error) throw error;
      setEnrollments(data as Enrollment[] || []);
    } catch (e) {
      console.error('Error fetching enrollments:', e);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || isDemo) return;

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(urlData.publicUrl);

      await supabase.from('profiles').update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() } as any).eq('id', profile.id);
      toast.success('Avatar updated!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || isDemo) return;
    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
        bio: bio.trim() || null,
      };
      if (profile.role === 'student') updates.grade = grade ? parseInt(grade) : null;

      const { error } = await supabase.from('profiles').update(updates as any).eq('id', profile.id);
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUnenroll = async (classId: string) => {
    if (!profile) return;
    try {
      const { error } = await supabase.from('enrollments').update({ is_active: false } as any).eq('class_id', classId).eq('student_id', profile.id);
      if (error) throw error;
      toast.success('Unenrolled successfully');
      fetchEnrollments();
    } catch (error) {
      console.error('Error unenrolling:', error);
      toast.error('Failed to unenroll');
    }
  };

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (!profile) {
    return (<AppLayout><div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AppLayout>);
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden shadow-card">
          <div className="h-24 gradient-hero" />
          <CardContent className="relative pt-0">
            <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-card">
                  <AvatarImage src={avatarUrl || undefined} alt={fullName} />
                  <AvatarFallback className="bg-primary/10 text-2xl text-primary">{getInitials(fullName || 'User')}</AvatarFallback>
                </Avatar>
                {!isDemo && (
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </button>
                )}
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <div className="mt-4 flex-1 sm:ml-6 sm:mt-0">
                <h1 className="text-2xl font-bold text-foreground">{fullName || 'User'}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge className="capitalize">{profile.role === 'tutor' ? '👨‍🏫 Tutor' : '🎓 Student'}</Badge>
                  {profile.role === 'student' && grade && <Badge variant="secondary">Grade {grade}</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary" />Edit Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder={profile.role === 'tutor' ? 'Tell students about your experience and teaching style...' : 'Tell us about yourself...'} rows={3} />
            </div>

            {profile.role === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger><SelectValue placeholder="Select your grade" /></SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (<SelectItem key={i + 1} value={(i + 1).toString()}>Grade {i + 1}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleSaveProfile} disabled={saving || isDemo} className="w-full">
              {saving ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : (<><Save className="h-4 w-4 mr-2" />Save Changes</>)}
            </Button>
          </CardContent>
        </Card>

        {/* Student Subscriptions */}
        {profile.role === 'student' && !isDemo && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="h-5 w-5 text-primary" />My Subscriptions</CardTitle>
              <CardDescription>Classes you're enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEnrollments ? (
                <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-6">
                  <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No active subscriptions</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/tutors')}>Find Tutors</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => {
                    const cls = enrollment.class;
                    if (!cls) return null;
                    return (
                      <div key={enrollment.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{cls.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-xs">{cls.subject}</Badge>
                            <span className="text-xs text-muted-foreground">Grade {cls.grade}</span>
                            {cls.tutor && <span className="text-xs text-muted-foreground">• {cls.tutor.full_name}</span>}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive shrink-0" onClick={() => handleUnenroll(cls.id)}>
                          <X className="h-4 w-4 mr-1" />Unsubscribe
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-5 w-5 text-primary" />Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium text-foreground">{user?.email}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div><p className="text-sm text-muted-foreground">Account Type</p><p className="font-medium capitalize text-foreground">{profile.role}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div><p className="text-sm text-muted-foreground">Member Since</p><p className="font-medium text-foreground">{format(parseISO(profile.created_at), 'MMMM d, yyyy')}</p></div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />Sign Out
        </Button>
      </div>
    </AppLayout>
  );
}
