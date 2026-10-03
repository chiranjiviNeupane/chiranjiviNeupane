import type { Experience } from '@/data/experience';
import type { Education } from '@/data/education';
import { ExperienceEntry } from './ExperienceEntry';
import { TimelineShell } from './TimelineShell';
import styles from './ExperienceTimeline.module.css';

interface ExperienceTimelineProps {
  /** Most recent first. */
  entries: Experience[];
  /** Study periods to show on the rail (entries with start/end dates). */
  studies: Education[];
  /** YYYY-MM at build time; open-ended roles update to the visitor's month. */
  builtAt: string;
}

export function ExperienceTimeline({ entries, studies, builtAt }: ExperienceTimelineProps) {
  return (
    <TimelineShell entries={entries} studies={studies} builtAt={builtAt}>
      <ol className={styles.entries}>
        {entries.map((entry, i) => (
          <ExperienceEntry
            key={entry.id}
            entry={entry}
            number={String(entries.length - i).padStart(2, '0')}
            builtAt={builtAt}
          />
        ))}
      </ol>
    </TimelineShell>
  );
}
