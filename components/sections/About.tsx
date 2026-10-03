import { about } from '@/data/profile';
import { RichText } from '@/components/ui/RichText';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './About.module.css';

export function About() {
  const [lead, ...body] = about.paragraphs;

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading section="about" title="Owning services from architecture to production." />

        <div className={styles.grid}>
          <p className={styles.lead}>
            <RichText text={lead} />
          </p>
          <div className={styles.body}>
            {body.map((paragraph, i) => (
              <p key={i}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </div>

        <div className={`${styles.snapshot} reveal`}>
          <h3 className={styles.snapshotTitle}>Engineering snapshot</h3>
          <dl className={styles.facts}>
            {about.snapshot.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>
                  <span className={styles.factValue}>{fact.value}</span>
                  <span className={styles.factDetail}>{fact.detail}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
