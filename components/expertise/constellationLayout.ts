import type { Vec3 } from '@/lib/vec';
import { techCategories, technologies, type TechCategoryId } from '@/data/technologies';

/** Cluster radius per category, scaled to how many technologies it holds. */
export function clusterRadius(categoryId: TechCategoryId): number {
  const count = technologies.filter((t) => t.category === categoryId).length;
  return 0.5 + count * 0.085;
}

/**
 * Backend sits at the core; the other categories orbit it on a camera-facing
 * ellipse with alternating depth, each technology arranged around its anchor.
 */
export function computeConstellationLayout() {
  const anchors = new Map<TechCategoryId, Vec3>();
  const orbiting = techCategories.filter((c) => c.id !== 'backend');

  anchors.set('backend', [0, 0, 0]);
  orbiting.forEach((category, i) => {
    const angle = (i / orbiting.length) * Math.PI * 2 + Math.PI / 2;
    anchors.set(category.id, [Math.cos(angle) * 3.45, Math.sin(angle) * 3.0, i % 2 ? -1.0 : 0.8]);
  });

  const positions = new Map<string, Vec3>();
  for (const category of techCategories) {
    const members = technologies.filter((t) => t.category === category.id);
    const [ax, ay, az] = anchors.get(category.id)!;
    const radius = clusterRadius(category.id);
    members.forEach((tech, i) => {
      const angle = (i / members.length) * Math.PI * 2 + 0.35;
      positions.set(tech.id, [
        ax + Math.cos(angle) * radius,
        ay + Math.sin(angle) * radius * 0.85,
        az + Math.sin(angle * 3) * 0.35,
      ]);
    });
  }

  return { anchors, positions };
}
