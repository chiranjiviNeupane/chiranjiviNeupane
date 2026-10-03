import { sectionLabel, sectionNumber, type SectionId } from '@/data/sections';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  section: SectionId;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** `display` is the oversized closing headline; `compact` suits short sections. */
  size?: 'default' | 'display' | 'compact';
}

/** Numbered section header; number and label come from the section registry. */
export function SectionHeading({ section, title, lead, size = 'default' }: SectionHeadingProps) {
  return (
    <header className={`${styles.heading} ${styles[size]} reveal`}>
      <p className={styles.label}>
        <span className={styles.index}>{sectionNumber(section)}</span>
        <span>{sectionLabel(section)}</span>
      </p>
      <h2 className={styles.title} id={`${section}-title`}>
        {title}
      </h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </header>
  );
}
