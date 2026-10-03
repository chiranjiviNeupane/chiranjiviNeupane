import styles from './StatusDot.module.css';

/** Small static availability indicator. */
export function StatusDot() {
  return <span className={styles.dot} aria-hidden="true" />;
}
