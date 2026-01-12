export type UserRole = 'student' | 'tutor';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  grade: number | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  tutor_id: string;
  student_id: string;
  title: string;
  subject: string;
  start_time: string;
  end_time: string | null;
  meeting_link: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  tutor?: Profile;
  student?: Profile;
}

export interface Message {
  id: string;
  session_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  grade_level: number;
  file_url: string;
  file_type: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface TutorClass {
  id: string;
  tutor_id: string;
  title: string;
  subject: string;
  grade: number;
  monthly_price: number;
  schedule_days: string[];
  start_time: string;
  meeting_link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tutor?: Profile;
  enrollment_count?: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_id: string;
  subscribed_at: string;
  is_active: boolean;
  class?: TutorClass;
  student?: Profile;
}
