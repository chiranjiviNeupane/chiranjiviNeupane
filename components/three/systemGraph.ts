import type { Vec3 } from '@/lib/vec';

/**
 * Deterministic model of the abstract distributed system shown in the hero:
 * gateway → services → event bus (ring) → workers → data stores.
 *
 * Each node has two formations: `hero` (organic, spatial) and `resolved`
 * (ordered lattice used as the page reaches Contact).
 */

export type NodeKind = 'gateway' | 'service' | 'bus' | 'worker' | 'store';

export interface SystemNode {
  kind: NodeKind;
  hero: Vec3;
  resolved: Vec3;
  /** Base point size in px at DPR 1. */
  size: number;
  /** 1 = render with an outer ring (major components). */
  emphasis: 0 | 1;
  /** Phase used for subtle idle motion. */
  phase: number;
  /** For bus nodes: angle on the ring. */
  angle?: number;
}

export interface SystemGraph {
  nodes: SystemNode[];
  edges: [number, number][];
  /** Candidate request paths (node index lists) packets travel along. */
  routes: number[][];
  busCenter: Vec3;
  busRadius: number;
}

// Small seeded PRNG so server/client and fallback/WebGL agree.
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dist2 = (a: Vec3, b: Vec3) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

function nearest(from: Vec3, candidates: number[], nodes: SystemNode[], count: number): number[] {
  return [...candidates].sort((a, b) => dist2(from, nodes[a].hero) - dist2(from, nodes[b].hero)).slice(0, count);
}

/** Evenly distributed column in the resolved lattice. */
function column(x: number, index: number, total: number, spacing: number): Vec3 {
  return [x, (index - (total - 1) / 2) * spacing, 0];
}

export function createSystemGraph(): SystemGraph {
  const rand = mulberry32(20180301);
  const nodes: SystemNode[] = [];
  const range = (min: number, max: number) => min + rand() * (max - min);

  const busCenter: Vec3 = [0.6, 0, 0];
  const busRadius = 2.1;
  const SERVICE_COUNT = 7;
  const BUS_COUNT = 20;
  const WORKER_COUNT = 5;
  const STORE_COUNT = 3;

  // Gateway
  nodes.push({ kind: 'gateway', hero: [-6.2, 0.3, 0.6], resolved: [-6.4, 0, 0], size: 15, emphasis: 1, phase: 0 });
  const gateway = 0;

  // Services
  const services: number[] = [];
  for (let i = 0; i < SERVICE_COUNT; i++) {
    const y = ((i / (SERVICE_COUNT - 1)) * 2 - 1) * 2.5 + range(-0.3, 0.3);
    services.push(nodes.length);
    nodes.push({
      kind: 'service',
      hero: [range(-3.8, -2.0), y, range(-2.2, 2.2)],
      resolved: column(-3.4, i, SERVICE_COUNT, 0.85),
      size: 10,
      emphasis: 1,
      phase: rand() * Math.PI * 2,
    });
  }

  // Event bus ring (YZ plane in hero; faces the camera once resolved)
  const bus: number[] = [];
  for (let i = 0; i < BUS_COUNT; i++) {
    const angle = (i / BUS_COUNT) * Math.PI * 2;
    bus.push(nodes.length);
    nodes.push({
      kind: 'bus',
      hero: [busCenter[0], busCenter[1] + Math.cos(angle) * busRadius, busCenter[2] + Math.sin(angle) * busRadius],
      resolved: [Math.sin(angle) * 1.8, Math.cos(angle) * 1.8, 0],
      size: 4.5,
      emphasis: 0,
      phase: angle,
      angle,
    });
  }

  // Workers
  const workers: number[] = [];
  for (let i = 0; i < WORKER_COUNT; i++) {
    const y = ((i / (WORKER_COUNT - 1)) * 2 - 1) * 2.0 + range(-0.25, 0.25);
    workers.push(nodes.length);
    nodes.push({
      kind: 'worker',
      hero: [range(3.0, 4.0), y, range(-1.8, 1.8)],
      resolved: column(3.4, i, WORKER_COUNT, 0.85),
      size: 8.5,
      emphasis: 0,
      phase: rand() * Math.PI * 2,
    });
  }

  // Data stores
  const stores: number[] = [];
  const storeY = [-1.6, 0.1, 1.7];
  for (let i = 0; i < STORE_COUNT; i++) {
    stores.push(nodes.length);
    nodes.push({
      kind: 'store',
      hero: [range(5.5, 6.1), storeY[i], range(-1.2, 1.0)],
      resolved: column(6.4, i, STORE_COUNT, 1.1),
      size: 13,
      emphasis: 1,
      phase: rand() * Math.PI * 2,
    });
  }

  const edges: [number, number][] = [];
  const edgeKeys = new Set<string>();
  const link = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a === b || edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push([a, b]);
  };

  services.forEach((s) => link(gateway, s));
  for (let i = 0; i < services.length - 2; i += 2) link(services[i], services[i + 2]);
  const serviceToBus = new Map<number, number>();
  services.forEach((s) => {
    const [b1, b2] = nearest(nodes[s].hero, bus, nodes, 2);
    serviceToBus.set(s, b1);
    link(s, b1);
    link(s, b2);
  });
  bus.forEach((b, i) => link(b, bus[(i + 1) % bus.length]));
  const busToWorker = new Map<number, number>();
  bus.forEach((b, i) => {
    if (i % 2) return;
    const [w] = nearest(nodes[b].hero, workers, nodes, 1);
    busToWorker.set(b, w);
    link(b, w);
  });
  const workerToStore = new Map<number, number[]>();
  workers.forEach((w) => {
    const targets = nearest(nodes[w].hero, stores, nodes, 2);
    workerToStore.set(w, targets);
    targets.forEach((st) => link(w, st));
  });

  // Routes: gateway → service → bus hops → worker → store.
  const routes: number[][] = [];
  services.forEach((s) => {
    const entry = serviceToBus.get(s)!;
    const entryIdx = bus.indexOf(entry);
    for (const dir of [1, -1]) {
      const path = [gateway, s, entry];
      let idx = entryIdx;
      // Walk the ring until a bus node with a worker link is reached.
      for (let hop = 0; hop < bus.length; hop++) {
        idx = (idx + dir + bus.length) % bus.length;
        path.push(bus[idx]);
        if (busToWorker.has(bus[idx]) && hop > 0) break;
      }
      const worker = busToWorker.get(path[path.length - 1]);
      if (worker === undefined) continue;
      path.push(worker);
      const storesForWorker = workerToStore.get(worker)!;
      path.push(storesForWorker[routes.length % storesForWorker.length]);
      routes.push(path);
    }
  });

  return { nodes, edges, routes, busCenter, busRadius };
}
