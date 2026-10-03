'use client';

import { formatDuration, monthsBetween, resolveEnd } from '@/lib/dates';
import { useCurrentMonth } from '@/lib/useCurrentMonth';

/** Tenure such as "4 yrs 8 mos"; open-ended roles count up to the visitor's month. */
export function RoleDuration({ start, end, builtAt }: { start: string; end: string; builtAt: string }) {
  const now = useCurrentMonth(builtAt);
  return <>{formatDuration(monthsBetween(start, resolveEnd(end, new Date(`${now}-15`))))}</>;
}
