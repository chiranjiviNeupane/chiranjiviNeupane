import * as THREE from 'three';
import { smoothstep } from '@/lib/motion';
import { scrollState } from '@/lib/scrollState';
import type { RenderTier } from '@/lib/renderTier';
import type { NodeKind } from './systemGraph';

export type SceneMode = Exclude<RenderTier, 'none'>;

export const COLORS = {
  accent: new THREE.Color('#4da3ff'),
  signal: new THREE.Color('#f2b04b'),
  muted: new THREE.Color('#8d929a'),
};

export const KIND_COLOR: Record<NodeKind, THREE.Color> = {
  gateway: new THREE.Color('#eceef1'),
  service: COLORS.accent,
  bus: new THREE.Color('#7cbcff'),
  worker: COLORS.accent,
  store: COLORS.signal,
};

/** Per-tier quality budget. */
export const QUALITY: Record<SceneMode, { packets: number; substrate: [number, number]; dpr: [number, number] }> = {
  full: { packets: 90, substrate: [32, 18], dpr: [1, 1.75] },
  compact: { packets: 34, substrate: [18, 10], dpr: [1, 1.25] },
};

export interface Frame {
  x: number;
  y: number;
  scale: number;
}

/**
 * Where the graph should sit in the hero canvas, as fractions of the canvas:
 * centre position (from the left / top) and the share of width/height it may fill.
 */
export interface FrameRegion {
  centerX: number;
  centerY: number;
  fillWidth: number;
  fillHeight: number;
  maxScale: number;
}

/**
 * Framing for each composition. The hero layouts are regions the graph is
 * fitted into (see `fitFrame`), so they hold at any aspect ratio.
 * `side`: right of the hero copy. `stacked`: above it, clear of the header.
 * `resolved`: the ordered lattice behind Contact (desktop only).
 */
export const FRAMING = {
  side: { centerX: 0.73, centerY: 0.5, fillWidth: 0.48, fillHeight: 0.66, maxScale: 0.72 },
  stacked: { centerX: 0.5, centerY: 0.4, fillWidth: 0.86, fillHeight: 0.42, maxScale: 0.75 },
  resolved: { x: 4.9, y: -0.6, scale: 0.68 },
  camera: { fov: 40, heroZ: 15.5, heroZTravel: 3.5, resolvedZ: 17, heroY: 1.1, heroYTravel: 0.6, resolvedY: 0.2 },
  yaw: { base: -0.42, scrollTravel: 0.55, pointer: 0.14 },
  pitch: { base: 0.1, pointer: 0.07 },
} as const satisfies Record<'side' | 'stacked', FrameRegion> & Record<string, unknown>;

/** The hero formation rotated to its resting angle (camera-facing coordinates). */
export function restingPoints(points: [number, number, number][]): [number, number, number][] {
  const cy = Math.cos(FRAMING.yaw.base);
  const sy = Math.sin(FRAMING.yaw.base);
  const cx = Math.cos(FRAMING.pitch.base);
  const sx = Math.sin(FRAMING.pitch.base);
  return points.map(([x, y, z]) => {
    const rx = x * cy + z * sy;
    const rz = -x * sy + z * cy;
    return [rx, y * cx - rz * sx, y * sx + rz * cx];
  });
}

/** Size of the camera's view on the z = 0 plane, in world units. */
export function visibleArea(aspect: number) {
  const { fov, heroZ } = FRAMING.camera;
  const height = 2 * heroZ * Math.tan(((fov / 2) * Math.PI) / 180);
  return { width: height * aspect, height };
}

/**
 * Scales and positions the graph so it fits `region` of a canvas with the
 * given aspect ratio: never clipped at the edges, whatever the device or
 * orientation.
 *
 * Uses perspective projection (nearer nodes render larger), refined over a few
 * iterations because scale and offset affect each other. Runs only on resize.
 */
export function fitFrame(points: [number, number, number][], aspect: number, region: FrameRegion): Frame {
  const depth = FRAMING.camera.heroZ;
  const visible = visibleArea(aspect);
  const targetX = (region.centerX - 0.5) * visible.width;
  const targetY = (0.5 - region.centerY) * visible.height;

  let scale = region.maxScale;
  let x = targetX;
  let y = targetY;
  for (let i = 0; i < 6; i++) {
    let minU = Infinity;
    let maxU = -Infinity;
    let minV = Infinity;
    let maxV = -Infinity;
    for (const [px, py, pz] of points) {
      const perspective = depth / (depth - pz * scale);
      const u = (px * scale + x) * perspective;
      const v = (py * scale + y) * perspective;
      minU = Math.min(minU, u);
      maxU = Math.max(maxU, u);
      minV = Math.min(minV, v);
      maxV = Math.max(maxV, v);
    }
    const fit = Math.min(
      (visible.width * region.fillWidth) / (maxU - minU),
      (visible.height * region.fillHeight) / (maxV - minV),
    );
    scale = Math.min(region.maxScale, scale * fit);
    x += targetX - (minU + maxU) / 2;
    y += targetY - (minV + maxV) / 2;
  }
  return { x, y, scale };
}

export const MOTION = {
  busSpin: 0.09,
  driftY: 0.09,
  driftZ: 0.06,
  pointerFollow: 2.5,
  packetSpeed: [1.6, 3.0] as const,
};

/** How visible the system should be for the current scroll position (0..1). */
export function sceneVisibility(mode: SceneMode): number {
  const hero = 1 - smoothstep(0.3, 0.95, scrollState.hero);
  if (mode === 'compact') return hero;
  return Math.max(hero, smoothstep(0.05, 0.85, scrollState.contact) * 0.65);
}

/** 0 in the hero formation, 1 once Contact fills the viewport (desktop only). */
export function resolveAmount(mode: SceneMode): number {
  return mode === 'full' ? smoothstep(0.15, 0.95, scrollState.contact) : 0;
}
