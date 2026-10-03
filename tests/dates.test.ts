import { describe, expect, it } from 'vitest';
import { formatDuration, formatRange, monthsBetween, resolveEnd, toDecimalYear } from '@/lib/dates';

describe('date helpers', () => {
  it('counts months inclusively', () => {
    expect(monthsBetween('2021-08', '2022-02')).toBe(7);
    expect(monthsBetween('2018-03', '2018-12')).toBe(10);
    expect(monthsBetween('2022-03', '2022-03')).toBe(1);
  });

  it('formats durations like a CV', () => {
    expect(formatDuration(7)).toBe('7 mos');
    expect(formatDuration(1)).toBe('1 mo');
    expect(formatDuration(12)).toBe('1 yr');
    expect(formatDuration(56)).toBe('4 yrs 8 mos');
  });

  it('formats ranges and the open-ended present', () => {
    expect(formatRange('2022-03', 'present')).toBe('Mar 2022 – Present');
    expect(resolveEnd('present', new Date(2026, 9, 3))).toBe('2026-10');
    expect(resolveEnd('2020-01')).toBe('2020-01');
  });

  it('converts to decimal years at the start of the month', () => {
    expect(toDecimalYear('2020-01')).toBe(2020);
    expect(toDecimalYear('2020-07')).toBeCloseTo(2020.5);
  });
});
