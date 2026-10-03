/**
 * Page sections in display order. Navigation, section numbering and the page
 * itself are all generated from this list, so reordering happens here only.
 */
export const sections = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** Two-digit position label, e.g. "03". */
export function sectionNumber(id: SectionId): string {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0');
}

export function sectionLabel(id: SectionId): string {
  return sections.find((s) => s.id === id)!.label;
}
