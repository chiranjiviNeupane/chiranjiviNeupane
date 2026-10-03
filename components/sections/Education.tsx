import { education } from '@/data/education';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Education.module.css';

export function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className={`container ${styles.layout}`}>
        <SectionHeading section="education" title="Education" size="compact" />
        <ol className={styles.list}>
          {education.map((item, i) => (
            <li
              key={item.id}
              className={`${styles.item} reveal`}
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
            >
              <p className={`${styles.dates} mono`}>{item.dates}</p>
              <div>
                <h3 className={styles.qualification}>{item.qualification}</h3>
                <p className={styles.institution}>{item.institution}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
