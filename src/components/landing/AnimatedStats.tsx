import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const stats = [
  { value: 500, suffix: '+', label: 'Active Students' },
  { value: 50, suffix: '+', label: 'Expert Tutors' },
  { value: 9, suffix: '', label: 'Subjects Covered' },
  { value: 4.9, suffix: '★', label: 'Average Rating', isDecimal: true },
];

function Counter({ target, isDecimal, suffix }: { target: number; isDecimal?: boolean; suffix: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isDecimal ? parseFloat((eased * target).toFixed(1)) : Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, isDecimal]);

  return (
    <div ref={ref} className="text-center">
      <p className={cn(
        'text-3xl md:text-4xl font-extrabold text-primary transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}>
        {isDecimal ? count.toFixed(1) : count}{suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{stats.find(s => s.value === target)?.label}</p>
    </div>
  );
}

export function AnimatedStats() {
  return (
    <section className="border-y border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <Counter
              key={stat.label}
              target={stat.value}
              isDecimal={stat.isDecimal}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
