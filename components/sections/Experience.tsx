import { experience } from '@/data/experience';
import { education } from '@/data/education';
import { currentYearMonth } from '@/lib/dates';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading
          section="experience"
          title="From first modules to production platforms."
          lead="Enterprise and platform engineering across Australia and Nepal, most recent first."
        />
        <ExperienceTimeline
          entries={experience}
          studies={education.filter((e) => e.start && e.end)}
          builtAt={currentYearMonth()}
        />
      </div>
    </section>
  );
}
