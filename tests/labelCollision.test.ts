import { describe, expect, it } from 'vitest';
import { findOccludedLabels, type LabelBox } from '@/components/expertise/labelCollision';

const box = (key: string, priority: number, left: number, top = 0): LabelBox => ({
  key,
  priority,
  left,
  top,
  width: 50,
  height: 16,
});

describe('findOccludedLabels', () => {
  it('keeps non-overlapping labels', () => {
    expect(findOccludedLabels([box('a', 1, 0), box('b', 1, 100)]).size).toBe(0);
  });

  it('hides the lower-priority label of an overlapping pair', () => {
    const occluded = findOccludedLabels([box('idle', 3, 10), box('active', 0, 0)]);
    expect([...occluded]).toEqual(['idle']);
  });

  it('does not let an occluded label hide others', () => {
    // b overlaps a (hidden); c overlaps only b, so c stays visible.
    const occluded = findOccludedLabels([box('a', 0, 0), box('b', 1, 40), box('c', 2, 85)]);
    expect([...occluded]).toEqual(['b']);
  });
});
