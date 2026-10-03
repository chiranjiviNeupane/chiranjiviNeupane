import type { Experience } from '@/data/experience';
import { resolveEnd, toDecimalYear } from '@/lib/dates';

export const RAIL_START_YEAR = 2018;

export interface RoleSpan {
  /** Decimal years; `end` is exclusive (start of the month after). */
  start: number;
  end: number;
}

export function roleSpans(entries: Experience[], now: string): RoleSpan[] {
  const today = new Date(`${now}-15`);
  return entries.map((entry) => ({
    start: toDecimalYear(entry.start),
    end: toDecimalYear(resolveEnd(entry.end, today)) + 1 / 12,
  }));
}

/** Rail runs from RAIL_START_YEAR to a few months past the current month. */
export function railScale(now: string) {
  const end = toDecimalYear(now) + 1 / 12 + 0.35;
  const toPercent = (year: number) => ((year - RAIL_START_YEAR) / (end - RAIL_START_YEAR)) * 100;
  const years: number[] = [];
  for (let y = RAIL_START_YEAR; y <= Math.floor(end); y++) years.push(y);
  return { toPercent, years };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDecimalYear(value: number): string {
  const year = Math.floor(value);
  const month = Math.min(11, Math.floor((value - year) * 12));
  return `${MONTHS[month]} ${year}`;
}
