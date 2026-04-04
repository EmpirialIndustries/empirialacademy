import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function AnimatedHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-subtle opacity-60" />
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6 py-20 md:py-32 lg:py-40">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={item}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            South Africa's #1 Online Tutoring Platform
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
          >
            Learn Smarter.{' '}
            <span className="text-gradient block sm:inline">Score Higher.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Connect with expert tutors for Grades 10–12. Live video classes, group study,
            past papers & revision notes — everything you need to ace your matric.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
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
          </motion.div>

          <motion.p
            variants={item}
            className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Free to join • No credit card required
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
