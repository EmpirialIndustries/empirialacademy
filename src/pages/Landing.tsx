import { useNavigate } from 'react-router-dom';
import { GraduationCap, Video, Users, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Video,
    title: 'Live Video Classes',
    description: 'Join interactive sessions with real-time video, screen sharing, and collaborative learning.',
  },
  {
    icon: Users,
    title: 'Group Chat & Communities',
    description: 'Connect with classmates and tutors through dedicated class group chats.',
  },
  {
    icon: BookOpen,
    title: 'Shared Resources',
    description: 'Access study materials, notes, and past papers uploaded by expert tutors.',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
            <Button className="gradient-primary" onClick={() => navigate('/auth')}>
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              South Africa's Online Tutoring Platform
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Learn Smarter with{' '}
              <span className="text-gradient">Expert Tutors</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Connect with top tutors for Grades 10–12. Live video classes, group study, and curated resources — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gradient-primary px-8 text-base" onClick={() => navigate('/auth')}>
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 text-base" onClick={() => navigate('/auth')}>
                I'm a Tutor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">Everything You Need to Succeed</h2>
            <p className="mt-3 text-muted-foreground">Powerful tools designed for SA high school students and tutors.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-border bg-card p-8 shadow-card transition-smooth hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="rounded-3xl gradient-hero p-12 md:p-16">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Ready to ace your exams?</h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
              Join thousands of students already learning with EduConnect.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 px-8 text-base" onClick={() => navigate('/auth')}>
              Get Started — It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduConnect. Built for South African learners.
        </div>
      </footer>
    </div>
  );
}
