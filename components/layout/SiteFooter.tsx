import { profile } from '@/data/profile';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          {profile.location.display} · <a href="#home">Back to top ↑</a>
        </p>
      </div>
    </footer>
  );
}
