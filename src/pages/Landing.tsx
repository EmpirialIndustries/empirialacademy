import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Video, Users, BookOpen, ArrowRight, Sparkles, 
  Star, CheckCircle, Calendar, Shield, Zap, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Video,
    title: 'Live Video Classes',
    description: 'Join interactive sessions with HD video, screen sharing, and real-time Q&A with your tutor.',
    color: 'from-primary to-primary/70',
  },
  {
    icon: Users,
    title: 'Group Study & Chat',
    description: 'Collaborate with classmates in dedicated group chats. Ask questions, share notes, and study together.',
    color: 'from-accent to-accent/70',
  },
  {
    icon: BookOpen,
    title: 'PDF Resources & Notes',
    description: 'Access curated study materials, past papers, and revision notes uploaded by expert tutors.',
    color: 'from-primary to-primary/70',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'View your weekly class schedule at a glance. Never miss a session with calendar integration.',
    color: 'from-accent to-accent/70',
  },
];

const stats = [
  { value: '500+', label: 'Active Students' },
  { value: '50+', label: 'Expert Tutors' },
  { value: '9', label: 'Subjects Covered' },
  { value: '4.9★', label: 'Average Rating' },
];

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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-subtle opacity-60" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-6xl px-4 md:px-6 py-20 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              South Africa's #1 Online Tutoring Platform
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
              Learn Smarter.{' '}
              <span className="text-gradient block sm:inline">Score Higher.</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Connect with expert tutors for Grades 10–12. Live video classes, group study, 
              past papers & revision notes — everything you need to ace your matric.
            </p>
            
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="gradient-primary px-10 py-6 text-base font-semibold shadow-glow hover:shadow-xl transition-all" 
                onClick={() => navigate('/auth')}
              >
                Start Learning — It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-6 text-base border-2" 
                onClick={() => navigate('/auth')}
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                I'm a Tutor
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              Free to join • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <Zap className="mr-1 h-3.5 w-3.5" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for South African high school students and tutors.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <Card 
                key={f.title} 
                className="group border-border/60 bg-card shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-md`}>
                    <f.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Get Started in 3 Simple Steps
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center md:text-left">
                <span className="text-6xl md:text-7xl font-black text-primary/10">{s.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
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
          
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {subjects.map((s) => (
              <div
                key={s}
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-default"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-accent text-accent" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
            "EduConnect helped me go from a 45% to an 82% in Physical Science. 
            The live classes and study materials made all the difference."
          </blockquote>
          <p className="mt-6 text-muted-foreground font-medium">
            — Thabo M., Grade 12, Gauteng
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="relative rounded-3xl gradient-hero p-12 md:p-20 overflow-hidden">
            {/* Decorative circles */}
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
          </div>
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
