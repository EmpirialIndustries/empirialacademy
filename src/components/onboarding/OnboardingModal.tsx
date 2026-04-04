import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, Calendar, Users, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const subjects = [
  'Mathematics', 'Physical Science', 'Life Sciences', 'English',
  'Afrikaans', 'Accounting', 'Business Studies', 'History', 'Geography',
];

const steps = [
  {
    icon: Sparkles,
    title: 'Welcome to EduConnect!',
    description: "Let's get you set up in just a few steps. This will help us personalise your experience.",
  },
  {
    icon: BookOpen,
    title: 'Choose Your Subjects',
    description: 'Select the subjects you want to focus on. You can always change these later.',
  },
  {
    icon: Calendar,
    title: "You're All Set!",
    description: "You're ready to explore. Here's what you can do next:",
  },
];

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const { profile } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleComplete = () => {
    localStorage.setItem('educonnect-onboarded', 'true');
    onComplete();
  };

  const isTutor = profile?.role === 'tutor';

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden [&>button]:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="p-8"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/40' : 'w-4 bg-muted'
                  )}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                {(() => {
                  const Icon = steps[step].icon;
                  return <Icon className="h-8 w-8 text-primary-foreground" />;
                })()}
              </div>
            </div>

            {/* Title & description */}
            <h2 className="text-2xl font-bold text-foreground text-center">
              {step === 0 ? `Welcome, ${profile?.full_name.split(' ')[0]}!` : steps[step].title}
            </h2>
            <p className="mt-2 text-center text-muted-foreground">{steps[step].description}</p>

            {/* Step content */}
            {step === 1 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSubject(s)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium border transition-all',
                      selectedSubjects.includes(s)
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-foreground border-border hover:border-primary/40'
                    )}
                  >
                    {selectedSubjects.includes(s) && <Check className="inline mr-1 h-3.5 w-3.5" />}
                    {s}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 space-y-3">
                {[
                  { icon: Users, label: isTutor ? 'Create your first class' : 'Browse & enroll in classes' },
                  { icon: BookOpen, label: isTutor ? 'Upload study resources' : 'Explore study materials' },
                  { icon: Calendar, label: 'Check your schedule' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border border-border p-3 bg-card/50">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button
                className="flex-1 gradient-primary"
                onClick={() => {
                  if (step < steps.length - 1) setStep(step + 1);
                  else handleComplete();
                }}
              >
                {step === steps.length - 1 ? "Let's Go!" : 'Continue'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
