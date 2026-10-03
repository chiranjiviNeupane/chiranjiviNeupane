import { SectionHeading } from '@/components/ui/SectionHeading';
import { TechExplorer } from '@/components/expertise/TechExplorer';

export function Expertise() {
  return (
    <section id="expertise" className="section" aria-labelledby="expertise-title">
      <div className="container">
        <SectionHeading
          section="expertise"
          title="The stack, and how it connects."
          lead="Technology I use to design, build and operate backend systems. Select any technology to see what it's used for and what it works alongside."
        />
        <div className="reveal">
          <TechExplorer />
        </div>
      </div>
    </section>
  );
}
