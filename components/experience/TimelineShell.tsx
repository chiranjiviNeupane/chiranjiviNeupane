'use client';

import { useMemo, useRef, useState } from 'react';
import type { Experience } from '@/data/experience';
import type { Education } from '@/data/education';
import { formatRange, toDecimalYear } from '@/lib/dates';
import { useCurrentMonth } from '@/lib/useCurrentMonth';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { formatDecimalYear, railScale, roleSpans } from './timelineSpans';
import { useScrollPlayhead } from './useScrollPlayhead';
import styles from './ExperienceTimeline.module.css';

/** Bars narrower than this (% of the rail) hide their inline label below the lg breakpoint. */
const NARROW_BAR_PERCENT = 10;

interface TimelineShellProps {
  entries: Experience[];
  studies: Education[];
  builtAt: string;
  /** The server-rendered role entries. */
  children: React.ReactNode;
}

/**
 * Client wrapper around the (server-rendered) role list: adds the sticky
 * proportional rail on wide screens and the progress line on narrow ones.
 */
export function TimelineShell({ entries, studies, builtAt, children }: TimelineShellProps) {
  const now = useCurrentMonth(builtAt);
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const playheadLabelRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const mobileFillRef = useRef<HTMLDivElement>(null);

  const spans = useMemo(() => roleSpans(entries, now), [entries, now]);
  const { toPercent, years } = useMemo(() => railScale(now), [now]);

  useScrollPlayhead(containerRef, spans, reducedMotion, {
    onDate: (value) => {
      const left = `${toPercent(value)}%`;
      playheadRef.current?.style.setProperty('left', left);
      fillRef.current?.style.setProperty('left', left);
      if (playheadLabelRef.current) playheadLabelRef.current.textContent = formatDecimalYear(value);
    },
    onActive: (index) => {
      setActiveIndex(index);
      // Entries are server components, so mark the active one directly.
      containerRef.current?.querySelectorAll('[data-timeline-entry]').forEach((el, i) => {
        if (i === index) el.setAttribute('data-active', '');
        else el.removeAttribute('data-active');
      });
    },
    onProgress: (value) => mobileFillRef.current?.style.setProperty('transform', `scaleY(${value})`),
  });

  const scrollToEntry = (index: number) => {
    containerRef.current
      ?.querySelectorAll('[data-timeline-entry]')
      [index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const initialLeft = `${toPercent(spans[0]?.end ?? 0)}%`;

  return (
    <div ref={containerRef} className={styles.timeline}>
      <div className={styles.railWrap}>
        <div className={styles.rail}>
          <div className={styles.axis} aria-hidden="true">
            {years.map((year) => (
              <span key={year} className={`${styles.tick} mono`} style={{ left: `${toPercent(year)}%` }}>
                {year}
              </span>
            ))}
          </div>

          <div className={styles.track}>
            <div className={styles.trackLine} aria-hidden="true" />
            <div ref={fillRef} className={styles.trackFill} style={{ left: initialLeft }} aria-hidden="true" />
            <ol className={styles.bars} aria-label="Jump to a role">
              {entries.map((entry, i) => {
                const width = toPercent(spans[i].end) - toPercent(spans[i].start);
                const range = formatRange(entry.start, entry.end);
                return (
                  <li
                    key={entry.id}
                    className={styles.barItem}
                    style={{ left: `${toPercent(spans[i].start)}%`, width: `${width}%` }}
                  >
                    <button
                      type="button"
                      className={styles.bar}
                      data-active={i === activeIndex || undefined}
                      // Short roles drop their inline label on tablets, where labels would collide.
                      data-narrow={width < NARROW_BAR_PERCENT || undefined}
                      onClick={() => scrollToEntry(i)}
                      aria-label={`${entry.role}, ${entry.shortName}, ${range}`}
                    >
                      <span className={styles.barLabel}>{entry.shortName}</span>
                      <span className={styles.barTooltip} aria-hidden="true">
                        <strong>{entry.shortName}</strong> {entry.role}
                        <br />
                        {range}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {studies.map((study) =>
              study.start && study.end ? (
                <div
                  key={study.id}
                  className={styles.study}
                  style={{
                    left: `${toPercent(toDecimalYear(study.start))}%`,
                    width: `${toPercent(toDecimalYear(study.end) + 1 / 12) - toPercent(toDecimalYear(study.start))}%`,
                  }}
                  aria-hidden="true"
                >
                  <span>{study.railLabel}</span>
                </div>
              ) : null,
            )}
            <div ref={playheadRef} className={styles.playhead} style={{ left: initialLeft }} aria-hidden="true">
              <span ref={playheadLabelRef} className={`${styles.playheadLabel} mono`} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mobileLine} aria-hidden="true">
        <div ref={mobileFillRef} className={styles.mobileFill} />
      </div>

      {children}
    </div>
  );
}
