'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { neighboursOf, techCategories, technologies, technologyById, type TechCategoryId } from '@/data/technologies';
import { breakpoints } from '@/lib/breakpoints';
import { getRenderTier } from '@/lib/renderTier';
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/useMediaQuery';
import { CategoryList, CategoryTabs, UsageLegend, type ChipState } from './TechChips';
import { TechDetail } from './TechDetail';
import styles from './TechExplorer.module.css';

const ConstellationScene = dynamic(() => import('./ConstellationScene'), { ssr: false });

const DEFAULT_TECH = 'spring-boot';
const noopSubscribe = () => () => {};

/** Full 3D layout only on large, fine-pointer screens with capable WebGL. */
function useFull3D(): boolean {
  const capable = useSyncExternalStore(
    noopSubscribe,
    () => getRenderTier() === 'full',
    () => false,
  );
  const wide = useMediaQuery(`(min-width: ${breakpoints.lg}px) and (pointer: fine)`);
  return capable && wide;
}

export function TechExplorer() {
  const [selected, setSelectedState] = useState(DEFAULT_TECH);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tab, setTab] = useState<TechCategoryId>(technologyById.get(DEFAULT_TECH)!.category);
  const show3D = useFull3D();

  const activeId = hovered ?? selected;
  const active = technologyById.get(activeId)!;
  const related = useMemo(() => neighboursOf(activeId), [activeId]);
  const stateOf = (id: string): ChipState => (id === activeId ? 'active' : related.has(id) ? 'related' : 'idle');

  // Selecting anything (chip, node, related link) also brings its category's tab forward.
  const select = (id: string) => {
    setSelectedState(id);
    setTab(technologyById.get(id)!.category);
  };

  const chipHandlers = { stateOf, selected, onSelect: select };
  const detail = <TechDetail tech={active} onSelect={select} />;

  if (!show3D) {
    return (
      <div className={styles.explorer}>
        <div>
          <UsageLegend />
          <CategoryList
            {...chipHandlers}
            activeCategory={active.category}
            slot={
              <div className={styles.inlineDetail} aria-live="polite">
                {detail}
              </div>
            }
          />
        </div>
        <div className={styles.sideDetail} aria-live="polite">
          {detail}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.explorer} ${styles.with3D}`}>
      <ConstellationStage activeId={activeId} onHover={setHovered} onSelect={select} />
      <div className={styles.panel}>
        {/*
          Every card shares one grid cell so the area is always as tall as the
          tallest card; the tabs below therefore never shift under the pointer.
        */}
        <div className={styles.detailStack}>
          {technologies.map((tech) => (
            <div key={tech.id} className={styles.detailSlot} data-visible={tech.id === activeId || undefined}>
              <TechDetail tech={tech} onSelect={select} />
            </div>
          ))}
          <p className="visually-hidden" aria-live="polite">
            {active.name}, {techCategories.find((c) => c.id === active.category)!.label}: {active.description}
          </p>
        </div>
        <UsageLegend />
        <CategoryTabs
          {...chipHandlers}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
          tab={tab}
          onTabChange={setTab}
        />
      </div>
    </div>
  );
}

/** Lazily mounts the WebGL constellation just before it scrolls into view and pauses it off-screen. */
function ConstellationStage({
  activeId,
  onHover,
  onSelect,
}: {
  activeId: string;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden="true">
      {mounted ? (
        <ConstellationScene
          activeId={activeId}
          running={inView}
          reducedMotion={reducedMotion}
          onHover={onHover}
          onSelect={onSelect}
        />
      ) : null}
      <p className={styles.stageHint}>Hover a node to trace its connections</p>
    </div>
  );
}
