export interface LabelBox {
  key: string;
  /** Lower number = more important; kept when labels overlap. */
  priority: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

const GAP = 2;

const overlaps = (a: LabelBox, b: LabelBox) =>
  a.left < b.left + b.width + GAP &&
  b.left < a.left + a.width + GAP &&
  a.top < b.top + b.height + GAP &&
  b.top < a.top + a.height + GAP;

/**
 * Greedy label placement: visit labels by priority and mark any label that
 * overlaps one already placed as occluded. Returns the keys to de-emphasise.
 * O(n²) — fine for the few dozen labels in the constellation.
 */
export function findOccludedLabels(boxes: LabelBox[]): Set<string> {
  const placed: LabelBox[] = [];
  const occluded = new Set<string>();
  for (const box of [...boxes].sort((a, b) => a.priority - b.priority)) {
    if (placed.some((other) => overlaps(box, other))) occluded.add(box.key);
    else placed.push(box);
  }
  return occluded;
}
