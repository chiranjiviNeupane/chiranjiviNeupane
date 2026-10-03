import {
  employersUsing,
  neighboursOf,
  techCategories,
  technologyById,
  type Technology,
  type TechUsage,
} from '@/data/technologies';
import { pill } from '@/components/ui/pill';
import styles from './TechExplorer.module.css';

const USAGE_LABEL: Record<TechUsage, string> = { current: 'Current stack', earlier: 'Earlier roles' };

/** Card describing one technology: what it's for, what it connects to, where it was used. */
export function TechDetail({ tech, onSelect }: { tech: Technology; onSelect: (id: string) => void }) {
  const category = techCategories.find((c) => c.id === tech.category)!;
  const related = [...neighboursOf(tech.id)];
  const usedAt = employersUsing(tech);

  return (
    <div className={styles.detail}>
      <p className={styles.detailMeta}>
        <span>{category.label}</span>
        {tech.usage ? (
          <>
            <span aria-hidden="true">·</span>
            <span className={styles.usage} data-usage={tech.usage}>
              {USAGE_LABEL[tech.usage]}
            </span>
          </>
        ) : null}
      </p>
      <h3 className={styles.detailTitle}>{tech.name}</h3>
      <p className={styles.detailText}>{tech.description}</p>
      {related.length > 0 ? (
        <div className={styles.detailRow}>
          <p className={styles.detailLabel}>Connects to</p>
          <ul className={styles.relatedList}>
            {related.map((id) => (
              <li key={id}>
                <button type="button" className={pill({ size: 'sm', tone: 'accent' })} onClick={() => onSelect(id)}>
                  {technologyById.get(id)!.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {usedAt.length > 0 ? (
        <div className={styles.detailRow}>
          <p className={styles.detailLabel}>Used at</p>
          <p className={styles.usedAt}>{usedAt.join(' · ')}</p>
        </div>
      ) : null}
    </div>
  );
}
