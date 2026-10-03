/**
 * The only viewport widths the layout changes at. CSS media queries can't read
 * variables, so stylesheets use these literal values (`max-width: <bp - 1>px`
 * or `min-width: <bp>px`); tests/breakpoints.test.ts enforces that.
 */
export const breakpoints = {
  /** Phones. */
  sm: 640,
  /** Tablets: navigation collapses, timeline goes vertical. */
  md: 900,
  /** Full desktop experience (side-by-side hero, 3D constellation). */
  lg: 1100,
} as const;

/**
 * True when the hero puts the system visual beside the copy rather than above it.
 * Mirrors the hero CSS, which stacks at
 * `(max-width: 639px), (max-width: 1099px) and (orientation: portrait)`,
 * so landscape phones also get the side-by-side layout.
 */
export function isSideHeroLayout(width: number, height: number): boolean {
  const portrait = height >= width;
  return !(width < breakpoints.sm || (width < breakpoints.lg && portrait));
}
