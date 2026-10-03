'use client';

import { useRef } from 'react';
import { techCategories, technologies, type TechCategoryId } from '@/data/technologies';
import { pill } from '@/components/ui/pill';
import styles from './TechExplorer.module.css';

export type ChipState = 'active' | 'related' | 'idle';

interface ChipHandlers {
  stateOf: (id: string) => ChipState;
  selected: string;
  onSelect: (id: string) => void;
  /** Hover preview; omitted on layouts without the 3D stage. */
  onHover?: (id: string) => void;
}

// Current stack first, then unmarked, then earlier roles; stable within each group.
const USAGE_ORDER = { current: 0, unset: 1, earlier: 2 } as const;
const membersOf = (categoryId: TechCategoryId) =>
  technologies
    .filter((t) => t.category === categoryId)
    .sort((a, b) => USAGE_ORDER[a.usage ?? 'unset'] - USAGE_ORDER[b.usage ?? 'unset']);

function ChipRow({ categoryId, stateOf, selected, onSelect, onHover }: ChipHandlers & { categoryId: TechCategoryId }) {
  return (
    <ul className={styles.chips}>
      {membersOf(categoryId).map((tech) => (
        <li key={tech.id}>
          <button
            type="button"
            className={`${pill()} ${styles.chip}`}
            data-state={stateOf(tech.id)}
            data-usage={tech.usage}
            aria-pressed={tech.id === selected}
            onClick={() => onSelect(tech.id)}
            onFocus={() => onSelect(tech.id)}
            onPointerEnter={onHover ? () => onHover(tech.id) : undefined}
          >
            {tech.usage === 'current' ? <span className={styles.currentDot} aria-hidden="true" /> : null}
            {tech.name}
            {tech.usage === 'current' ? <span className="visually-hidden"> (current stack)</span> : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Explains the chip marker. */
export function UsageLegend() {
  return (
    <p className={styles.legend}>
      <span className={styles.currentDot} aria-hidden="true" />
      Current stack
    </p>
  );
}

/** Every category expanded, with an optional slot under the active category (narrow layouts). */
export function CategoryList({
  activeCategory,
  slot,
  ...handlers
}: ChipHandlers & { activeCategory: TechCategoryId; slot?: React.ReactNode }) {
  return (
    <div className={styles.index} role="group" aria-label="Technologies by category">
      {techCategories.map((category) => (
        <div key={category.id} className={styles.group}>
          <h3 className={styles.groupTitle}>
            {category.label}
            <span className={styles.groupCount} aria-hidden="true">
              {technologies.filter((t) => t.category === category.id).length}
            </span>
          </h3>
          <ChipRow categoryId={category.id} {...handlers} />
          {category.id === activeCategory ? slot : null}
        </div>
      ))}
    </div>
  );
}

/** One category at a time (beside the 3D stage, where vertical space is limited). */
export function CategoryTabs({
  tab,
  onTabChange,
  onLeave,
  ...handlers
}: ChipHandlers & { tab: TechCategoryId; onTabChange: (id: TechCategoryId) => void; onLeave: () => void }) {
  const tabRefs = useRef(new Map<TechCategoryId, HTMLButtonElement>());

  // Arrow/Home/End keyboard support per the WAI-ARIA tabs pattern.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = techCategories.findIndex((c) => c.id === tab);
    const last = techCategories.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    const id = techCategories[next].id;
    onTabChange(id);
    tabRefs.current.get(id)?.focus();
  };

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label="Technology categories" className={styles.tabList} onKeyDown={onKeyDown}>
        {techCategories.map((category) => (
          <button
            key={category.id}
            ref={(el) => {
              if (el) tabRefs.current.set(category.id, el);
            }}
            type="button"
            role="tab"
            id={`tab-${category.id}`}
            aria-selected={category.id === tab}
            aria-controls={`tabpanel-${category.id}`}
            tabIndex={category.id === tab ? 0 : -1}
            className={styles.tab}
            onClick={() => onTabChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      {techCategories.map((category) => (
        <div
          key={category.id}
          role="tabpanel"
          id={`tabpanel-${category.id}`}
          aria-labelledby={`tab-${category.id}`}
          hidden={category.id !== tab}
          className={styles.tabPanel}
          // Hover clears only when leaving the whole panel, so gaps between chips don't flash.
          onPointerLeave={onLeave}
        >
          <p className={styles.tabSummary}>{category.summary}</p>
          <ChipRow categoryId={category.id} {...handlers} />
        </div>
      ))}
    </div>
  );
}
