import { breakpoints } from './breakpoints';

/** Decides how much 3D the current device should get. Client-only. */
export type RenderTier = 'none' | 'compact' | 'full';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function detectRenderTier(): RenderTier {
  if (typeof window === 'undefined' || !hasWebGL()) return 'none';

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return 'none';
  if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return 'none';

  const smallScreen = window.matchMedia(`(max-width: ${breakpoints.md - 1}px)`).matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return smallScreen || coarse ? 'compact' : 'full';
}

let cachedTier: RenderTier | undefined;

/** Memoised tier: detection creates a WebGL context, so only do it once per page. */
export function getRenderTier(): RenderTier {
  cachedTier ??= detectRenderTier();
  return cachedTier;
}

/** Run `fn` once the browser is idle so 3D never competes with first paint. */
export function whenIdle(fn: () => void, timeout = 1200): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 300);
  return () => window.clearTimeout(id);
}
