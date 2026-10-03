'use client';

import { useSyncExternalStore } from 'react';
import { currentYearMonth } from './dates';

const subscribe = () => () => {};

/**
 * The visitor's current YYYY-MM. Renders `builtAt` during prerender/hydration
 * (so markup matches), then the live month, without a setState-in-effect pass.
 */
export function useCurrentMonth(builtAt: string): string {
  return useSyncExternalStore(subscribe, currentYearMonth, () => builtAt);
}
