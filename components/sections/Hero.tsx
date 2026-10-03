import { heroFacts, profile } from '@/data/profile';
import { Icon } from '@/components/ui/Icon';
import { pill } from '@/components/ui/pill';
import { StatusDot } from '@/components/ui/StatusDot';
import styles from './Hero.module.css';

// Legend for the decorative system visual; colours match the node kinds.
const legend = [
  { label: 'gateway', color: 'var(--text)' },
  { label: 'services & workers', color: 'var(--accent)' },
  { label: 'event bus', color: '#7cbcff' },
  { label: 'data stores', color: 'var(--signal)' },
];

export function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>
          <StatusDot />
          {profile.availability}
        </p>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.name}>{profile.name}</span>
          <span className="visually-hidden">, </span>
          <span className={styles.role}>{profile.title}</span>
        </h1>

        <ul className={`${styles.stack} mono`} aria-label="Core technologies">
          {profile.coreStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <p className={styles.summary}>{profile.headline}</p>

        <div className={styles.actions}>
          <a href="#experience" className={pill({ size: 'lg', tone: 'solid' })}>
            View Experience
            <Icon name="arrow-right" />
          </a>
          <a href="#contact" className={pill({ size: 'lg' })}>
            Contact Me
          </a>
          <ul className={styles.social} aria-label="Profiles">
            <li>
              <a
                href={profile.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub profile (opens in a new tab)"
              >
                <Icon name="github" />
              </a>
            </li>
            <li>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn profile (opens in a new tab)"
              >
                <Icon name="linkedin" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.footer}`}>
        <dl className={styles.facts}>
          {heroFacts.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.caption} aria-hidden="true">
          <p>Request flow through a distributed system</p>
          <ul className={styles.legend}>
            {legend.map((item) => (
              <li key={item.label}>
                <span className={styles.legendDot} style={{ background: item.color }} />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <a href="#about" className={styles.scrollCue}>
          <span>Scroll</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
