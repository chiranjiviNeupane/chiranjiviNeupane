import { profile } from '@/data/profile';
import { Icon } from '@/components/ui/Icon';
import { pill } from '@/components/ui/pill';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatusDot } from '@/components/ui/StatusDot';
import { ContactLinks } from './ContactLinks';
import styles from './Contact.module.css';

const profileLinks = [
  { label: 'LinkedIn', href: profile.contact.linkedin, icon: 'linkedin' },
  { label: 'GitHub', href: profile.contact.github, icon: 'github' },
] as const;

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          section="contact"
          size="display"
          title={
            <>
              Let&rsquo;s build something <span className={styles.accent}>reliable.</span>
            </>
          }
          lead="Open to backend engineering opportunities and conversations about enterprise systems, Java, and cloud architecture."
        />

        <div className="reveal">
          <ContactLinks>
            {profileLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={pill({ size: 'lg' })}>
                  <Icon name={link.icon} />
                  <span>{link.label}</span>
                  <span className="visually-hidden">(opens in a new tab)</span>
                  <Icon name="arrow-up-right" className={styles.linkArrow} />
                </a>
              </li>
            ))}
          </ContactLinks>
        </div>

        <p className={styles.status}>
          <StatusDot />
          {profile.availability}
          <span aria-hidden="true">·</span>
          <span className={styles.location}>
            <Icon name="pin" className={styles.pin} />
            {profile.location.display}
          </span>
        </p>
      </div>
    </section>
  );
}
