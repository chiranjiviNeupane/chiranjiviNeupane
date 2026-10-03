import type { Experience } from '@/data/experience';
import { technologyById } from '@/data/technologies';
import { formatRange } from '@/lib/dates';
import { pill } from '@/components/ui/pill';
import { RoleDuration } from './RoleDuration';
import styles from './ExperienceTimeline.module.css';

interface ExperienceEntryProps {
  entry: Experience;
  /** Chronological position, e.g. "04" for the most recent of four. */
  number: string;
  builtAt: string;
}

/** One role. Server-rendered; TimelineShell marks the active entry. */
export function ExperienceEntry({ entry, number, builtAt }: ExperienceEntryProps) {
  const titleId = `role-${entry.id}-title`;

  const highlights = (
    <ul className={styles.highlights}>
      {entry.highlights.map((highlight) => (
        <li key={highlight.text} className={styles.highlight}>
          <span className={styles.focus}>{highlight.focus}</span>
          <p>{highlight.text}</p>
        </li>
      ))}
    </ul>
  );

  const techList = (
    <ul className={styles.tech} aria-label={`Technologies used at ${entry.shortName}`}>
      {entry.technologies.map((id) => (
        <li key={id} className={pill({ tag: true })}>
          {technologyById.get(id)?.name ?? id}
        </li>
      ))}
    </ul>
  );

  return (
    <li id={`role-${entry.id}`} className={styles.entry} data-timeline-entry>
      <article className={styles.article} aria-labelledby={titleId}>
        <aside className={styles.meta}>
          <span className={styles.dot} aria-hidden="true" />
          <p className={styles.metaIndex} aria-hidden="true">
            {number}
          </p>
          <p className={`${styles.dates} mono`}>{formatRange(entry.start, entry.end)}</p>
          <p className={`${styles.duration} mono`}>
            <RoleDuration start={entry.start} end={entry.end} builtAt={builtAt} />
          </p>
          <p className={styles.location}>{entry.location}</p>
        </aside>

        <div className={styles.content}>
          <header className={styles.header}>
            <h3 id={titleId} className={styles.role}>
              {entry.role}
              <span className={styles.at}> at </span>
              <span className={styles.company}>{entry.company}</span>
            </h3>
            {entry.via ? <p className={styles.sub}>via {entry.via}</p> : null}
            {entry.project ? (
              <p className={styles.sub}>
                <span className={styles.subLabel}>Project</span> {entry.project}
              </p>
            ) : null}
          </header>

          {entry.collapsed ? (
            <>
              {techList}
              {/* Native disclosure: works without JS and the text stays in the page for search engines. */}
              <details className={styles.more}>
                <summary className={styles.moreToggle}>
                  <span className={styles.moreShow}>Show {entry.highlights.length} highlights</span>
                  <span className={styles.moreHide}>Hide highlights</span>
                </summary>
                {highlights}
              </details>
            </>
          ) : (
            <>
              {highlights}
              {techList}
            </>
          )}
        </div>
      </article>
    </li>
  );
}
