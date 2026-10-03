'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mulberry32, type SystemGraph } from './systemGraph';
import { COLORS, KIND_COLOR, MOTION, QUALITY, type SceneMode } from './systemConfig';
import { dotFragment, makePointGeometry, makePointMaterial, nodeFragment } from './pointShaders';

const NODE_SIZE_SCALE = 2.4;
const PACKET_SIZE = 9;
const SUBSTRATE = { spacing: 0.62, y: -3.9, zOffset: -0.5, dotSize: 3.2 };

/**
 * GPU buffers for the hero system: nodes, edges, travelling packets and the
 * background lattice. Typed arrays are mutated in place by the frame loop.
 */
export function useSystemBuffers(graph: SystemGraph, mode: SceneMode, pixelRatio: number) {
  const { packets: packetCount, substrate: substrateSize } = QUALITY[mode];

  const nodes = useMemo(() => {
    const count = graph.nodes.length;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const emphasis = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    graph.nodes.forEach((node, i) => {
      positions.set(node.hero, i * 3);
      sizes[i] = node.size * NODE_SIZE_SCALE;
      emphasis[i] = node.emphasis;
      KIND_COLOR[node.kind].toArray(colors, i * 3);
    });
    return {
      positions,
      geometry: makePointGeometry(positions, sizes, colors, emphasis),
      material: makePointMaterial(nodeFragment, pixelRatio),
    };
  }, [graph, pixelRatio]);

  const edges = useMemo(() => {
    const positions = new Float32Array(graph.edges.length * 6);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    const material = new THREE.LineBasicMaterial({
      color: COLORS.accent,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { positions, geometry, material };
  }, [graph]);

  const packets = useMemo(() => {
    // Seeded so the scene starts identically on every load.
    const random = mulberry32(42);
    const positions = new Float32Array(packetCount * 3);
    const colors = new Float32Array(packetCount * 3);
    const route = new Uint16Array(packetCount);
    const segment = new Uint8Array(packetCount);
    const progress = new Float32Array(packetCount);
    const speed = new Float32Array(packetCount);
    const [minSpeed, maxSpeed] = MOTION.packetSpeed;
    for (let i = 0; i < packetCount; i++) {
      route[i] = i % graph.routes.length;
      segment[i] = Math.floor(random() * (graph.routes[route[i]].length - 1));
      progress[i] = random();
      speed[i] = minSpeed + random() * (maxSpeed - minSpeed);
      (i % 5 === 0 ? COLORS.accent : COLORS.signal).toArray(colors, i * 3);
    }
    return {
      count: packetCount,
      positions,
      route,
      segment,
      progress,
      speed,
      random,
      geometry: makePointGeometry(positions, new Float32Array(packetCount).fill(PACKET_SIZE), colors),
      material: makePointMaterial(nodeFragment, pixelRatio),
    };
  }, [graph, packetCount, pixelRatio]);

  const substrate = useMemo(() => {
    const [cols, rows] = substrateSize;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let k = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[k * 3] = (x - (cols - 1) / 2) * SUBSTRATE.spacing;
        positions[k * 3 + 1] = SUBSTRATE.y;
        positions[k * 3 + 2] = (z - (rows - 1) / 2) * SUBSTRATE.spacing + SUBSTRATE.zOffset;
        COLORS.muted.toArray(colors, k * 3);
        k++;
      }
    }
    return {
      geometry: makePointGeometry(positions, new Float32Array(count).fill(SUBSTRATE.dotSize), colors, undefined, false),
      material: makePointMaterial(dotFragment, pixelRatio),
    };
  }, [substrateSize, pixelRatio]);

  useEffect(
    () => () => {
      for (const { geometry, material } of [nodes, edges, packets, substrate]) {
        geometry.dispose();
        material.dispose();
      }
    },
    [nodes, edges, packets, substrate],
  );

  return { nodes, edges, packets, substrate };
}
