const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function currentYearMonth(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function resolveEnd(end: string, now = new Date()): string {
  return end === 'present' ? currentYearMonth(now) : end;
}

export function parseYearMonth(ym: string): { year: number; month: number } {
  const [year, month] = ym.split('-').map(Number);
  return { year, month };
}

/** Fractional year, e.g. 2022-03 -> 2022.1667 (start of month). */
export function toDecimalYear(ym: string): number {
  const { year, month } = parseYearMonth(ym);
  return year + (month - 1) / 12;
}

/** Inclusive month count, matching how CVs usually count tenure. */
export function monthsBetween(startYM: string, endYM: string): number {
  const s = parseYearMonth(startYM);
  const e = parseYearMonth(endYM);
  return (e.year - s.year) * 12 + (e.month - s.month) + 1;
}

export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months > 0 || years === 0) parts.push(`${months} mo${months !== 1 ? 's' : ''}`);
  return parts.join(' ');
}

export function formatYearMonth(ym: string): string {
  if (ym === 'present') return 'Present';
  const { year, month } = parseYearMonth(ym);
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatRange(start: string, end: string): string {
  return `${formatYearMonth(start)} – ${formatYearMonth(end)}`;
}
