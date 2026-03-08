import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const subjects = [
  'Mathematics', 'Physical Science', 'Life Sciences', 'English',
  'Afrikaans', 'Accounting', 'Business Studies', 'History', 'Geography',
];

interface UploadResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

export function UploadResourceForm({ isOpen, onClose, onUploaded }: UploadResourceFormProps) {
  const { profile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubject('');
    setGradeLevel('');
    setFile(null);
    setProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !profile || !subject || !gradeLevel || !title.trim()) return;

    setUploading(true);
    setProgress(20);

    try {
      const ext = file.name.split('.').pop();
      const filePath = `${profile.id}/${Date.now()}.${ext}`;

      setProgress(40);
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setProgress(70);
      const { data: urlData } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('resources').insert({
        title: title.trim(),
        description: description.trim() || null,
        subject,
        grade_level: parseInt(gradeLevel),
        file_url: urlData.publicUrl,
        file_type: ext || 'unknown',
        uploaded_by: profile.id,
      } as any);

      if (insertError) throw insertError;

      setProgress(100);
      toast.success('Resource uploaded successfully!');
      resetForm();
      onClose();
      onUploaded();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { if (!uploading) { onClose(); resetForm(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>Share study materials with your students.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="res-title">Title</Label>
            <Input id="res-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chapter 5 Notes" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="res-desc">Description (optional)</Label>
            <Textarea id="res-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Grade</Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 hover:border-primary/50 hover:bg-muted/30 transition-colors"
            >
              {file ? (
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to select a file</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, PPT, images, etc.</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          {uploading && <Progress value={progress} className="h-2" />}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }} className="flex-1" disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary" disabled={uploading || !file || !title.trim() || !subject || !gradeLevel}>
              {uploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>) : (<><Upload className="mr-2 h-4 w-4" />Upload</>)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
