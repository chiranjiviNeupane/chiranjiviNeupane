import { describe, expect, it } from 'vitest';
import { createSystemGraph } from '@/components/three/systemGraph';
import { FRAMING, fitFrame, restingPoints, visibleArea, type FrameRegion } from '@/components/three/systemConfig';
import { isSideHeroLayout } from '@/lib/breakpoints';

const points = restingPoints(createSystemGraph().nodes.map((n) => n.hero));
const depth = FRAMING.camera.heroZ;

/** Projected bounds of the fitted graph, as fractions of the canvas (0..1, origin top-left). */
function projectedBounds(aspect: number, region: FrameRegion) {
  const { x, y, scale } = fitFrame(points, aspect, region);
  const visible = visibleArea(aspect);
  const project = ([px, py, pz]: [number, number, number]) => {
    const perspective = depth / (depth - pz * scale);
    return {
      left: ((px * scale + x) * perspective) / visible.width + 0.5,
      top: 0.5 - ((py * scale + y) * perspective) / visible.height,
    };
  };
  const projected = points.map(project);
  return {
    left: Math.min(...projected.map((p) => p.left)),
    right: Math.max(...projected.map((p) => p.left)),
    top: Math.min(...projected.map((p) => p.top)),
    bottom: Math.max(...projected.map((p) => p.top)),
  };
}

function expectInsideRegion(aspect: number, region: FrameRegion) {
  const b = projectedBounds(aspect, region);
  const tolerance = 0.002;
  expect(b.left).toBeGreaterThanOrEqual(region.centerX - region.fillWidth / 2 - tolerance);
  expect(b.right).toBeLessThanOrEqual(region.centerX + region.fillWidth / 2 + tolerance);
  expect(b.top).toBeGreaterThanOrEqual(region.centerY - region.fillHeight / 2 - tolerance);
  expect(b.bottom).toBeLessThanOrEqual(region.centerY + region.fillHeight / 2 + tolerance);
  // Centred within the region on the axis that limits it.
  expect(Math.abs((b.left + b.right) / 2 - region.centerX)).toBeLessThan(0.01);
}

describe('hero framing', () => {
  // Portrait phones/tablets: canvas is the band above the copy (≈0.6–1.1 wide:tall).
  it.each([0.6, 0.69, 0.75, 0.85, 1.1])('stacked: fits above the copy at aspect %s', (aspect) => {
    expectInsideRegion(aspect, FRAMING.stacked);
  });

  // Desktop (16:10, 16:9), ultrawide, and landscape phones (≈2.2).
  it.each([1.33, 1.6, 1.78, 2.17, 2.4])('side: fits right of the copy at aspect %s', (aspect) => {
    expectInsideRegion(aspect, FRAMING.side);
  });
});

describe('hero layout choice', () => {
  it.each([
    [390, 844, false], // portrait phone
    [820, 1180, false], // portrait tablet
    [667, 375, true], // landscape small phone
    [844, 390, true], // landscape phone
    [932, 430, true], // landscape large phone
    [1180, 820, true], // landscape tablet
    [1440, 900, true], // desktop
    [1200, 1600, true], // tall desktop window (≥ lg)
    [600, 400, false], // tiny window (< sm)
  ])('%sx%s → side-by-side: %s', (width, height, side) => {
    expect(isSideHeroLayout(width, height)).toBe(side);
  });
});
