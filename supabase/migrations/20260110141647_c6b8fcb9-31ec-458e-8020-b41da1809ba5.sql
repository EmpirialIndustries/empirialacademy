-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'tutor');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    grade INTEGER CHECK (grade >= 10 AND grade <= 12),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sessions table for tutoring sessions
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    meeting_link TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for session chat
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table for study materials
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    grade_level INTEGER NOT NULL CHECK (grade_level >= 10 AND grade_level <= 12),
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'PDF',
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sessions policies
CREATE POLICY "Users can view their sessions" ON public.sessions FOR SELECT 
    USING (
        tutor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR 
        student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    );
CREATE POLICY "Tutors can create sessions" ON public.sessions FOR INSERT 
    WITH CHECK (tutor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'tutor'));
CREATE POLICY "Tutors can update their sessions" ON public.sessions FOR UPDATE 
    USING (tutor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Messages policies
CREATE POLICY "Session participants can view messages" ON public.messages FOR SELECT 
    USING (
        session_id IN (
            SELECT id FROM public.sessions 
            WHERE tutor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) 
            OR student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        )
    );
CREATE POLICY "Session participants can send messages" ON public.messages FOR INSERT 
    WITH CHECK (
        sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) AND
        session_id IN (
            SELECT id FROM public.sessions 
            WHERE tutor_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) 
            OR student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        )
    );

-- Resources policies (viewable by all authenticated, uploadable by tutors)
CREATE POLICY "Authenticated users can view resources" ON public.resources FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Tutors can upload resources" ON public.resources FOR INSERT 
    WITH CHECK (uploaded_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND role = 'tutor'));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles timestamp
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();