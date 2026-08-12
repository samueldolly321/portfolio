import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Full value string, e.g. "6+", "100%", "360°" — the numeric part is animated. */
  value: string;
  durationMs?: number;
  className?: string;
}

/**
 * Counts up from 0 to the numeric part of `value` the first time it scrolls
 * into view, preserving any prefix/suffix (e.g. "+", "%"). Respects
 * prefers-reduced-motion by rendering the final value immediately.
 */
export const CountUp: React.FC<CountUpProps> = ({ value, durationMs = 1600, className = '' }) => {
  const match = value.match(/\d[\d\s.,]*/);
  const target = match ? parseFloat(match[0].replace(/[\s,]/g, '')) : NaN;
  const prefix = match ? value.slice(0, match.index) : value;
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : '';

  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(isNaN(target) ? value : `${prefix}0${suffix}`);

  useEffect(() => {
    if (isNaN(target)) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let started = false;

    const animate = (startTime: number) => {
      const step = (now: number) => {
        const p = Math.min((now - startTime) / durationMs, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            raf = requestAnimationFrame(animate);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, prefix, suffix, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};
