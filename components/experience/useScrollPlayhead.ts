'use client';

import { useEffect, useRef } from 'react';
import { onScrollStateChange } from '@/lib/scrollState';
import { clamp, damp, lerp } from '@/lib/motion';
import type { RoleSpan } from './timelineSpans';

interface PlayheadCallbacks {
  /** Called every animation frame with the eased date (decimal year). */
  onDate: (value: number) => void;
  /** Called when the role under the reading line changes. */
  onActive: (index: number) => void;
  /** 0..1 progress through the whole timeline (drives the mobile line). */
  onProgress: (value: number) => void;
}

/** Reading line, as a fraction of viewport height. */
const ANCHOR = 0.42;
const SETTLED = 0.0005;

/**
 * Maps the reader's position within each role entry to a date between that
 * role's end and start. Recomputes on scroll (via the shared tracker) and eases
 * toward the target with a short rAF loop that stops once it settles.
 */
export function useScrollPlayhead(
  containerRef: React.RefObject<HTMLElement | null>,
  spans: RoleSpan[],
  reducedMotion: boolean,
  callbacks: PlayheadCallbacks,
) {
  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || spans.length === 0) return;
    const entries = Array.from(container.querySelectorAll<HTMLElement>('[data-timeline-entry]'));

    let current = spans[0].end;
    let target = current;
    let activeIndex = -1;
    let frame = 0;
    let last = 0;

    const tick = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 1 / 60;
      last = time;
      current = reducedMotion ? target : lerp(current, target, damp(7, dt));
      if (Math.abs(current - target) < SETTLED) current = target;
      callbacksRef.current.onDate(current);
      frame = current === target ? 0 : requestAnimationFrame(tick);
      if (!frame) last = 0;
    };

    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const vh = window.innerHeight;
      // Skip work while the timeline is well off-screen.
      if (bounds.bottom < -vh || bounds.top > 2 * vh) return;

      const anchor = vh * ANCHOR;
      let index = 0;
      target = spans[0].end;
      entries.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top > anchor) return;
        index = i;
        target = lerp(spans[i].end, spans[i].start, clamp((anchor - rect.top) / Math.max(rect.height, 1)));
      });

      if (index !== activeIndex) {
        activeIndex = index;
        callbacksRef.current.onActive(index);
      }
      callbacksRef.current.onProgress(clamp((anchor - bounds.top) / Math.max(bounds.height, 1)));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const unsubscribe = onScrollStateChange(measure);
    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
    };
  }, [containerRef, spans, reducedMotion]);
}
