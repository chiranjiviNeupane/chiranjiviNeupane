import { capabilities, philosophy, type CapabilityIcon } from '@/data/capabilities';
import { experience } from '@/data/experience';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Capabilities.module.css';

const glyphs: Record<CapabilityIcon, React.ReactNode> = {
  system: (
    <>
      <path d="M4 7l8-4 8 4-8 4-8-4z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 17l8 4 8-4" />
    </>
  ),
  api: (
    <>
      <path d="M8 4c-2 0-3 1-3 3v2.5c0 1-.7 1.8-2 2.5 1.3.7 2 1.5 2 2.5V17c0 2 1 3 3 3" />
      <path d="M16 4c2 0 3 1 3 3v2.5c0 1 .7 1.8 2 2.5-1.3.7-2 1.5-2 2.5V17c0 2-1 3-3 3" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  services: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="15" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="15" width="6" height="6" rx="1.5" />
      <rect x="15" y="15" width="6" height="6" rx="1.5" />
      <path d="M9 6h6M6 9v6M18 9v6M9 18h6" />
    </>
  ),
  integration: (
    <>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
      <path d="M9 12h6" />
      <path d="M13 9.5L15.5 12 13 14.5" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  security: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
      <circle cx="12" cy="11" r="1.8" />
      <path d="M12 12.8V15" />
    </>
  ),
  pipeline: (
    <>
      <circle cx="4.5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6.5 12h3.5M14 12h4" />
      <path d="M17 9l3 3-3 3" />
    </>
  ),
  incident: <path d="M2 12h4l2.5-6 4 12 3-9 1.5 3H22" />,
  legacy: (
    <>
      <rect x="3" y="14" width="8" height="7" rx="1" />
      <rect x="3" y="6" width="8" height="6" rx="1" strokeDasharray="2 2" />
      <path d="M14 17h7M17.5 13.5L21 17l-3.5 3.5" />
      <path d="M15 4l5 0M17.5 4v6" />
    </>
  ),
};

const companyById = new Map(experience.map((e) => [e.id, e.shortName]));

export function Capabilities() {
  return (
    <section id="capabilities" className="section" aria-labelledby="capabilities-title">
      <div className="container">
        <SectionHeading section="capabilities" title="What I can help you build." />

        <blockquote className={`${styles.philosophy} reveal`}>
          <p>{philosophy}</p>
        </blockquote>

        <ol className={styles.grid}>
          {capabilities.map((capability, i) => (
            <li
              key={capability.id}
              className={`${styles.cell} reveal`}
              style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as React.CSSProperties}
            >
              <div className={styles.cellTop}>
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {glyphs[capability.icon]}
                </svg>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className={styles.title}>{capability.title}</h3>
              <p className={styles.description}>{capability.description}</p>
              <p className={styles.applied}>
                <span className={styles.appliedLabel}>Applied at</span>{' '}
                {capability.appliedAt.map((id) => companyById.get(id)).join(' · ')}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
