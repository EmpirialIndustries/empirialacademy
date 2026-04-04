import { motion } from 'framer-motion';
import { Video, Users, BookOpen, Calendar, Zap } from 'lucide-react';
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

export function AnimatedFeatures() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group border-border/60 bg-card shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 overflow-hidden h-full">
                <CardContent className="p-8">
                  <motion.div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-md`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <f.icon className="h-7 w-7 text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
