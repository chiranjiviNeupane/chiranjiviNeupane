'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { profile } from '@/data/profile';
import { sectionNumber, sections } from '@/data/sections';
import { onScrollStateChange, scrollState } from '@/lib/scrollState';
import { pill } from '@/components/ui/pill';
import { StatusDot } from '@/components/ui/StatusDot';
import styles from './SiteHeader.module.css';

// Desktop shows Contact as a call-to-action button rather than a plain link.
const desktopLinks = sections.filter((s) => s.id !== 'contact');

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Header background + reading progress, driven by the shared scroll tracker.
  useEffect(
    () =>
      onScrollStateChange(() => {
        setScrolled(scrollState.scrollY > 12);
        progressRef.current?.style.setProperty('transform', `scaleX(${scrollState.page})`);
      }),
    [],
  );

  // Active section tracking: whichever section crosses the viewport midline.
  useEffect(() => {
    const ids = ['home', ...sections.map((item) => item.id)];
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === 'home' ? null : entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback((returnFocus = false) => {
    setMenuOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Mobile menu: focus first link, trap Tab, close on Escape, lock page scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const links = () => Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
    links()[0]?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu(true);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [toggleRef.current, ...links()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 900) closeMenu();
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className={`${styles.header} ${scrolled || menuOpen ? styles.scrolled : ''}`} data-print="hide">
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.logo} aria-label={`${profile.name}, back to top`}>
          <span className={styles.logoMark} aria-hidden="true">
            {profile.initials}
            <span className={styles.logoDot} />
          </span>
          <span className={styles.logoName}>{profile.name}</span>
        </a>

        <nav aria-label="Primary" className={styles.nav}>
          <ul className={styles.navList}>
            {desktopLinks.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={styles.navLink}
                  aria-current={active === item.id ? 'location' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className={`${pill({ size: 'sm', tone: 'accent' })} ${styles.cta}`}
                aria-current={active === 'contact' ? 'location' : undefined}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.toggleBar} />
          <span className={styles.toggleBar} />
        </button>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <div ref={progressRef} className={styles.progressBar} />
      </div>

      <div id="mobile-menu" ref={menuRef} className={styles.mobileMenu} hidden={!menuOpen}>
        <nav aria-label="Mobile">
          <ol className={styles.mobileList}>
            {sections.map((item, i) => (
              <li key={item.id} style={{ '--i': i } as React.CSSProperties}>
                <a href={`#${item.id}`} className={styles.mobileLink} onClick={() => closeMenu()}>
                  <span>{sectionNumber(item.id)}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className={styles.mobileMeta}>
          <StatusDot />
          {profile.availability} · {profile.location.display}
        </p>
      </div>
    </header>
  );
}
