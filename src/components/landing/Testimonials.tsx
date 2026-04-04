import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "EduConnect helped me go from a 45% to an 82% in Physical Science. The live classes and study materials made all the difference.",
    name: 'Thabo M.',
    detail: 'Grade 12, Gauteng',
    rating: 5,
  },
  {
    quote: "As a tutor, this platform makes it so easy to manage my classes. The video quality is amazing and my students love the group chat feature.",
    name: 'Mrs. Nkosi',
    detail: 'Mathematics Tutor, KZN',
    rating: 5,
  },
  {
    quote: "I was struggling with Accounting but my tutor on EduConnect broke everything down so clearly. Got a distinction in my finals!",
    name: 'Zanele K.',
    detail: 'Grade 12, Western Cape',
    rating: 5,
  },
  {
    quote: "The past papers and revision notes are a game changer. Everything I need in one place. Highly recommend to all matric students.",
    name: 'Sipho D.',
    detail: 'Grade 11, Limpopo',
    rating: 4,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((p) => (p + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="py-20 md:py-28 bg-muted/30 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="relative text-center">
          <Quote className="mx-auto mb-6 h-10 w-10 text-primary/20" />

          <div className="min-h-[160px] flex items-center justify-center">
            <div key={current} className="animate-fade-in">
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < t.rating ? 'fill-accent text-accent' : 'text-muted-foreground/20'
                    )}
                  />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
                "{t.quote}"
              </blockquote>

              <p className="mt-6 text-muted-foreground font-medium">
                — {t.name}, {t.detail}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === current ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40'
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => go(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
