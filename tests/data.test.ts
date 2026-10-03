import { describe, expect, it } from 'vitest';
import { capabilities } from '@/data/capabilities';
import { education } from '@/data/education';
import { experience } from '@/data/experience';
import { sections } from '@/data/sections';
import { techCategories, technologies, technologyById } from '@/data/technologies';

const ym = /^\d{4}-(0[1-9]|1[0-2])$/;
const unique = (values: string[]) => new Set(values).size === values.length;

describe('content data integrity', () => {
  it('uses unique ids everywhere', () => {
    expect(unique(technologies.map((t) => t.id))).toBe(true);
    expect(unique(experience.map((e) => e.id))).toBe(true);
    expect(unique(capabilities.map((c) => c.id))).toBe(true);
    expect(unique(education.map((e) => e.id))).toBe(true);
    expect(unique(sections.map((s) => s.id))).toBe(true);
  });

  it('only references technologies that exist', () => {
    for (const tech of technologies) {
      for (const id of tech.related) expect(technologyById.has(id), `${tech.id} → ${id}`).toBe(true);
    }
    for (const job of experience) {
      for (const id of job.technologies) expect(technologyById.has(id), `${job.id} → ${id}`).toBe(true);
    }
  });

  it('only references experience entries that exist', () => {
    const jobs = new Set(experience.map((e) => e.id));
    for (const capability of capabilities) {
      for (const id of capability.appliedAt) expect(jobs.has(id), `${capability.id} → ${id}`).toBe(true);
    }
  });

  it('assigns every technology to a known category, and no category is empty', () => {
    const categories = new Set(techCategories.map((c) => c.id));
    for (const tech of technologies) expect(categories.has(tech.category), tech.id).toBe(true);
    for (const category of techCategories) {
      expect(
        technologies.some((t) => t.category === category.id),
        category.id,
      ).toBe(true);
    }
  });

  it('has well-formed, ordered experience dates (most recent first)', () => {
    for (const job of experience) {
      expect(job.start, job.id).toMatch(ym);
      if (job.end !== 'present') {
        expect(job.end, job.id).toMatch(ym);
        expect(job.end >= job.start, job.id).toBe(true);
      }
    }
    const starts = experience.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it('marks every technology in the current role as current, and none as earlier', () => {
    const current = experience.find((job) => job.end === 'present')!;
    for (const id of current.technologies) {
      expect(technologyById.get(id)!.usage, id).toBe('current');
    }
  });

  it('only marks technologies as earlier when no current role uses them', () => {
    const currentIds = new Set(experience.filter((j) => j.end === 'present').flatMap((j) => j.technologies));
    for (const tech of technologies.filter((t) => t.usage === 'earlier')) {
      expect(currentIds.has(tech.id), tech.id).toBe(false);
    }
  });

  it('has well-formed dates for education placed on the timeline', () => {
    for (const item of education) {
      if (item.start) expect(item.start).toMatch(ym);
      if (item.end) expect(item.end).toMatch(ym);
    }
  });
});
