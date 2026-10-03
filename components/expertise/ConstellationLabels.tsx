'use client';

import { useEffect, useMemo } from 'react';
import type * as THREE from 'three';
import { neighboursOf, techCategories, technologies, technologyById } from '@/data/technologies';
import type { Vec3 } from '@/lib/vec';
import { clusterRadius, computeConstellationLayout } from './constellationLayout';
import { findOccludedLabels, type LabelBox } from './labelCollision';
import styles from './ConstellationScene.module.css';

export const layout = computeConstellationLayout();

/** Tech labels sit this far right of their node (px), vertically centred. */
const TECH_LABEL_OFFSET = 9;

type Anchor = { key: string; kind: 'category' | 'tech'; position: Vec3 };

/** Where each DOM label is anchored, in constellation (group) space. */
const anchors: Anchor[] = [
  ...techCategories.map((category) => {
    const [x, y, z] = layout.anchors.get(category.id)!;
    return {
      key: `category:${category.id}`,
      kind: 'category' as const,
      position: [x, y + clusterRadius(category.id) * 0.8 + 0.42, z] as Vec3,
    };
  }),
  ...technologies.map((tech) => ({
    key: `tech:${tech.id}`,
    kind: 'tech' as const,
    position: layout.positions.get(tech.id)!,
  })),
];

/** Mutable registry shared by the DOM label layer and the WebGL frame loop. */
export interface LabelRegistry {
  elements: Map<string, HTMLElement>;
  sizes: Map<string, { width: number; height: number }>;
}

export function createLabelRegistry(): LabelRegistry {
  return { elements: new Map(), sizes: new Map() };
}

/**
 * Projects every label anchor to screen space, moves the DOM labels, and fades
 * labels that would overlap a more important one. Called once per frame.
 */
export function positionLabels(
  registry: LabelRegistry,
  group: THREE.Object3D,
  camera: THREE.Camera,
  size: { width: number; height: number },
  scratch: THREE.Vector3,
) {
  group.updateMatrixWorld();
  const boxes: LabelBox[] = [];

  for (const anchor of anchors) {
    const el = registry.elements.get(anchor.key);
    if (!el) continue;
    scratch
      .set(...anchor.position)
      .applyMatrix4(group.matrixWorld)
      .project(camera);
    if (scratch.z >= 1) {
      el.style.visibility = 'hidden';
      continue;
    }
    const x = (scratch.x * 0.5 + 0.5) * size.width;
    const y = (-scratch.y * 0.5 + 0.5) * size.height;
    el.style.visibility = 'visible';
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

    const measured = registry.sizes.get(anchor.key);
    if (!measured) continue;
    const { width, height } = measured;
    boxes.push({
      key: anchor.key,
      priority: Number(el.dataset.priority ?? 9),
      left: anchor.kind === 'tech' ? x + TECH_LABEL_OFFSET : x - width / 2,
      top: y - height / 2,
      width,
      height,
    });
  }

  const occluded = findOccludedLabels(boxes);
  for (const { key } of boxes) {
    registry.elements.get(key)!.toggleAttribute('data-occluded', occluded.has(key));
  }
}

interface LabelLayerProps {
  activeId: string | null;
  registry: LabelRegistry;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onHoverChange: (hovering: boolean) => void;
}

/**
 * Labels are plain DOM in one overlay (not a React root per label), positioned
 * by the scene's frame loop. Decorative: the accessible list lives in TechExplorer.
 */
export function LabelLayer({ activeId, registry, onHover, onSelect, onHoverChange }: LabelLayerProps) {
  const neighbours = useMemo(() => (activeId ? neighboursOf(activeId) : new Set<string>()), [activeId]);
  const activeCategory = activeId ? technologyById.get(activeId)?.category : undefined;

  // Label sizes feed collision detection; measure on mount and on any resize (e.g. font load).
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const anchor = (entry.target as HTMLElement).closest<HTMLElement>('[data-label-key]');
        if (!anchor) continue;
        const { width, height } = entry.contentRect;
        registry.sizes.set(anchor.dataset.labelKey!, { width, height });
      }
    });
    registry.elements.forEach((el) => {
      const label = el.firstElementChild;
      if (label) observer.observe(label);
    });
    return () => observer.disconnect();
  }, [registry]);

  const register = (key: string) => (el: HTMLElement | null) => {
    if (el) registry.elements.set(key, el);
    else registry.elements.delete(key);
  };

  return (
    <div className={styles.labelLayer} aria-hidden="true">
      {techCategories.map((category) => {
        const key = `category:${category.id}`;
        const isActive = category.id === activeCategory;
        return (
          <span
            key={key}
            ref={register(key)}
            data-label-key={key}
            data-priority={isActive ? 2 : 5}
            className={`${styles.anchor} ${styles.anchorCentered}`}
          >
            <span className={styles.category} data-active={isActive || undefined}>
              {category.label}
            </span>
          </span>
        );
      })}
      {technologies.map((tech) => {
        const key = `tech:${tech.id}`;
        const state = tech.id === activeId ? 'active' : neighbours.has(tech.id) ? 'related' : activeId ? 'dim' : 'idle';
        const priority = { active: 0, related: 1, idle: 3, dim: 4 }[state];
        return (
          <span key={key} ref={register(key)} data-label-key={key} data-priority={priority} className={styles.anchor}>
            <span
              className={styles.label}
              data-state={state}
              onPointerEnter={() => {
                onHoverChange(true);
                onHover(tech.id);
              }}
              onPointerLeave={() => {
                onHoverChange(false);
                onHover(null);
              }}
              onClick={() => onSelect(tech.id)}
            >
              {tech.name}
            </span>
          </span>
        );
      })}
    </div>
  );
}
