-- Create classes table for monthly subscription model
CREATE TABLE public.classes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade INTEGER NOT NULL,
    monthly_price DECIMAL(10, 2) NOT NULL,
    schedule_days TEXT[] NOT NULL DEFAULT '{}',
    start_time TIME NOT NULL,
    meeting_link TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table for student subscriptions
CREATE TABLE public.enrollments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(student_id, class_id)
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Classes policies
CREATE POLICY "Anyone can view active classes"
ON public.classes
FOR SELECT
USING (is_active = true);

CREATE POLICY "Tutors can create their own classes"
ON public.classes
FOR INSERT
WITH CHECK (tutor_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'tutor'
));

CREATE POLICY "Tutors can update their own classes"
ON public.classes
FOR UPDATE
USING (tutor_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Tutors can delete their own classes"
ON public.classes
FOR DELETE
USING (tutor_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Enrollments policies
CREATE POLICY "Students can view their enrollments"
ON public.enrollments
FOR SELECT
USING (student_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
) OR class_id IN (
    SELECT id FROM classes WHERE tutor_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
));

CREATE POLICY "Students can enroll in classes"
ON public.enrollments
FOR INSERT
WITH CHECK (student_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'student'
));

CREATE POLICY "Students can update their enrollments"
ON public.enrollments
FOR UPDATE
USING (student_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Trigger for updated_at on classes
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();