import styles from './Pill.module.css';

export interface PillOptions {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'outline' | 'solid' | 'accent';
  /** Static, mono "tag" look for non-interactive labels. */
  tag?: boolean;
  mono?: boolean;
}

/**
 * Class names for the shared pill style. A helper rather than a component so it
 * works on any element (a, button, li, span) without polymorphic typing.
 */
export function pill({ size = 'md', tone = 'outline', tag = false, mono = false }: PillOptions = {}): string {
  if (tag) return `${styles.pill} ${styles.tag}`;
  return [styles.pill, styles[size], styles[tone], styles.interactive, mono ? styles.mono : '']
    .filter(Boolean)
    .join(' ');
}
