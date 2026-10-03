'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/data/profile';
import { Icon } from '@/components/ui/Icon';
import { pill } from '@/components/ui/pill';
import styles from './Contact.module.css';

type CopyStatus = 'idle' | 'copied' | 'failed';

/**
 * Contact links. The email address stays out of the rendered page until asked
 * for; one click both reveals it and copies it, so it's never two steps away.
 */
export function ContactLinks({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState<CopyStatus>('idle');
  const { email } = profile.contact;

  useEffect(() => {
    if (status === 'idle') return;
    const id = window.setTimeout(() => setStatus('idle'), 2400);
    return () => window.clearTimeout(id);
  }, [status]);

  const revealAndCopy = async () => {
    setRevealed(true);
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  const label = status === 'copied' ? 'Copied' : revealed ? 'Copy email' : 'Email';

  return (
    <div>
      <ul className={styles.links} aria-label="Contact and profiles">
        <li>
          <button
            type="button"
            className={pill({ size: 'lg' })}
            aria-expanded={revealed}
            aria-controls="contact-email"
            onClick={revealAndCopy}
          >
            <Icon name={status === 'copied' ? 'check' : revealed ? 'copy' : 'mail'} />
            <span>{label}</span>
          </button>
        </li>
        {children}
      </ul>

      <div id="contact-email" className={styles.emailPanel} hidden={!revealed}>
        {revealed ? (
          <a href={`mailto:${email}`} className={styles.email}>
            <span className={styles.emailText}>{email}</span>
            <Icon name="arrow-up-right" className={styles.emailIcon} />
          </a>
        ) : null}
      </div>

      <p role="status" aria-live="polite" className="visually-hidden">
        {status === 'copied' ? `${email} copied to clipboard` : status === 'failed' ? `Email address: ${email}` : ''}
      </p>
    </div>
  );
}
