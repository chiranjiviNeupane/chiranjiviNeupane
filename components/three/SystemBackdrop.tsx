'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getRenderTier, whenIdle, type RenderTier } from '@/lib/renderTier';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { SystemFallback } from './SystemFallback';
import styles from './SystemBackdrop.module.css';

// three.js + R3F are only fetched once the browser is idle and the device qualifies.
const SystemScene = dynamic(() => import('./SystemScene'), { ssr: false });

/**
 * Decorative background visualisation for the hero (and, on desktop, the
 * closing Contact section). Purely presentational: aria-hidden, no content.
 */
export function SystemBackdrop() {
  const reducedMotion = usePrefersReducedMotion();
  const [tier, setTier] = useState<RenderTier | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => whenIdle(() => setTier(getRenderTier())), []);

  const mode = tier === 'full' || tier === 'compact' ? tier : null;

  return (
    <div
      className={`${styles.backdrop} ${mode === 'full' ? styles.full : styles.compact}`}
      data-ready={ready || undefined}
      aria-hidden="true"
      data-print="hide"
    >
      <div className={styles.fallback}>
        <SystemFallback className={styles.fallbackSvg} />
      </div>
      {mode ? (
        <div className={styles.canvas}>
          <SystemScene mode={mode} reducedMotion={reducedMotion} onReady={() => setReady(true)} />
        </div>
      ) : null}
      <div className={styles.vignette} />
    </div>
  );
}
