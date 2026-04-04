import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, ArrowRight, 
  CheckCircle, TrendingUp, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { AnimatedStats } from '@/components/landing/AnimatedStats';
import { AnimatedFeatures } from '@/components/landing/AnimatedFeatures';
import { Testimonials } from '@/components/landing/Testimonials';
import { motion } from 'framer-motion';

const subjects = [
  'Mathematics', 'Physical Science', 'Life Sciences', 'English',
  'Afrikaans', 'Accounting', 'Business Studies', 'History', 'Geography',
];

const steps = [
  { step: '01', title: 'Create an Account', description: 'Sign up as a student or tutor in seconds.' },
  { step: '02', title: 'Find Your Tutor', description: 'Browse tutors by subject, grade, and rating.' },
  { step: '03', title: 'Join Live Classes', description: 'Enroll and attend interactive video sessions weekly.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/70 sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">EduConnect</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#subjects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Subjects</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hidden sm:flex">
              Sign In
            </Button>
            <Button className="gradient-primary shadow-glow" onClick={() => navigate('/auth')}>
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Animated Hero */}
      <AnimatedHero />

      {/* Animated Stats */}
      <AnimatedStats />

      {/* Animated Features */}
      <AnimatedFeatures />

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Get Started in 3 Simple Steps
            </h2>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                className="relative text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <span className="text-6xl md:text-7xl font-black text-primary/10">{s.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              Subjects
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              All Your Matric Subjects Covered
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Expert tutors across every major subject for Grades 10–12.
            </p>
          </motion.div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {subjects.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-default"
              >
                {s}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <Testimonials />

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            className="relative rounded-3xl gradient-hero p-12 md:p-20 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/3 -translate-x-1/3" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
                Ready to ace your exams?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-primary-foreground/80 text-lg">
                Join hundreds of South African students already learning with EduConnect.
                Your future starts here.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-10 py-6 text-base font-semibold shadow-lg"
                  onClick={() => navigate('/auth')}
                >
                  Get Started — It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-primary-foreground/70 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />Free forever plan</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />No credit card</span>
                <span className="flex items-center gap-1.5 hidden sm:flex"><CheckCircle className="h-4 w-4" />Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">EduConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EduConnect. Built for South African learners 🇿🇦
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
