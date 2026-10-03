import type { ComponentType } from 'react';
import { sections, type SectionId } from '@/data/sections';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SystemBackdrop } from '@/components/three/SystemBackdrop';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Expertise } from '@/components/sections/Expertise';
import { Experience } from '@/components/sections/Experience';
import { Capabilities } from '@/components/sections/Capabilities';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';

// Typed as a full record so adding a section to the registry without a component fails to compile.
const sectionComponents: Record<SectionId, ComponentType> = {
  about: About,
  expertise: Expertise,
  experience: Experience,
  capabilities: Capabilities,
  education: Education,
  contact: Contact,
};

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <SystemBackdrop />
      <main id="main" tabIndex={-1} className="page">
        <Hero />
        {sections.map(({ id }) => {
          const Section = sectionComponents[id];
          return <Section key={id} />;
        })}
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
