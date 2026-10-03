'use client';

/* eslint-disable react-hooks/immutability -- three.js objects are mutated in the frame loop by design (R3F idiom). */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { neighboursOf, technologies, technologyEdges } from '@/data/technologies';
import { damp, lerp } from '@/lib/motion';
import { createLabelRegistry, LabelLayer, layout, positionLabels, type LabelRegistry } from './ConstellationLabels';
import styles from './ConstellationScene.module.css';

interface ConstellationSceneProps {
  activeId: string | null;
  running: boolean;
  reducedMotion: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

const PALETTE = {
  accent: new THREE.Color('#4da3ff'),
  signal: new THREE.Color('#f2b04b'),
  idleEdge: new THREE.Color('#8d929a').multiplyScalar(0.28),
  dimEdge: new THREE.Color('#8d929a').multiplyScalar(0.1),
  idleNode: new THREE.Color('#c4c8ce'),
  dimNode: new THREE.Color('#3b3e43'),
};

const PULSES_PER_EDGE = 2;
const MAX_PULSES = 12 * PULSES_PER_EDGE;
const SWAY = { speed: 0.2, amplitude: 0.38, pointerYaw: 0.12, pointerPitch: 0.1, pointerShift: 0.15, basePitch: 0.06 };
/** Delay before clearing hover, so moving between a node and its label doesn't flash. */
const HOVER_CLEAR_DELAY = 90;

interface ConstellationProps extends Omit<ConstellationSceneProps, 'running'> {
  registry: LabelRegistry;
  /** True while the pointer is over a node or label; pauses the idle sway. */
  hovering: React.RefObject<boolean>;
}

function useEdgeBuffers(activeId: string | null) {
  const edges = useMemo(() => {
    const positions = new Float32Array(technologyEdges.length * 6);
    const colors = new Float32Array(technologyEdges.length * 6);
    technologyEdges.forEach(([a, b], i) => {
      positions.set(layout.positions.get(a)!, i * 6);
      positions.set(layout.positions.get(b)!, i * 6 + 3);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material, colors };
  }, []);

  // Recolour edges whenever the active technology changes.
  useEffect(() => {
    technologyEdges.forEach(([a, b], i) => {
      const connected = activeId !== null && (a === activeId || b === activeId);
      const color = connected ? PALETTE.accent : activeId ? PALETTE.dimEdge : PALETTE.idleEdge;
      color.toArray(edges.colors, i * 6);
      color.toArray(edges.colors, i * 6 + 3);
    });
    edges.geometry.attributes.color.needsUpdate = true;
  }, [activeId, edges]);

  useEffect(
    () => () => {
      edges.geometry.dispose();
      edges.material.dispose();
    },
    [edges],
  );

  return edges;
}

/** Points that travel from the active technology to each of its neighbours. */
function usePulseBuffers() {
  const pulses = useMemo(() => {
    const positions = new Float32Array(MAX_PULSES * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setDrawRange(0, 0);
    const material = new THREE.PointsMaterial({
      color: PALETTE.signal,
      size: 0.09,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material, positions };
  }, []);

  useEffect(
    () => () => {
      pulses.geometry.dispose();
      pulses.material.dispose();
    },
    [pulses],
  );

  return pulses;
}

function Constellation({ activeId, reducedMotion, onHover, onSelect, registry, hovering }: ConstellationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const neighbours = useMemo(() => (activeId ? neighboursOf(activeId) : new Set<string>()), [activeId]);
  const edges = useEdgeBuffers(activeId);
  const pulses = usePulseBuffers();
  const motion = useRef({ elapsed: 0, sway: 0, pointerX: 0, pointerY: 0 });
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(rawDelta, 1 / 20);
    const m = motion.current;
    m.elapsed += dt;

    // Gentle sway (not a full spin) keeps labels legible; it pauses while exploring.
    if (!reducedMotion) {
      if (!hovering.current) m.sway += dt;
      const follow = damp(3, dt);
      m.pointerX = lerp(m.pointerX, state.pointer.x, follow);
      m.pointerY = lerp(m.pointerY, state.pointer.y, follow);
      group.rotation.y = Math.sin(m.sway * SWAY.speed) * SWAY.amplitude + m.pointerX * SWAY.pointerYaw;
      group.rotation.x = SWAY.basePitch - m.pointerY * SWAY.pointerPitch;
      group.position.x = m.pointerX * SWAY.pointerShift;
    }

    let count = 0;
    if (activeId && !reducedMotion) {
      const from = layout.positions.get(activeId)!;
      for (const id of neighbours) {
        const to = layout.positions.get(id)!;
        for (let p = 0; p < PULSES_PER_EDGE && count < MAX_PULSES; p++, count++) {
          const t = (m.elapsed * 0.55 + p / PULSES_PER_EDGE) % 1;
          for (let k = 0; k < 3; k++) pulses.positions[count * 3 + k] = lerp(from[k], to[k], t);
        }
      }
      pulses.geometry.attributes.position.needsUpdate = true;
    }
    pulses.geometry.setDrawRange(0, count);

    positionLabels(registry, group, state.camera, state.size, scratch);
  });

  const handleOver = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovering.current = true;
    document.body.style.cursor = 'pointer';
    onHover(id);
  };
  const handleOut = () => {
    hovering.current = false;
    document.body.style.cursor = '';
    onHover(null);
  };

  return (
    <group ref={groupRef} rotation={[SWAY.basePitch, 0, 0]}>
      <lineSegments geometry={edges.geometry} material={edges.material} />
      <points geometry={pulses.geometry} material={pulses.material} frustumCulled={false} />

      {technologies.map((tech) => {
        const isActive = tech.id === activeId;
        const isRelated = neighbours.has(tech.id);
        const color = isActive
          ? PALETTE.signal
          : isRelated
            ? PALETTE.accent
            : activeId
              ? PALETTE.dimNode
              : PALETTE.idleNode;
        return (
          <group key={tech.id} position={layout.positions.get(tech.id)!}>
            <mesh scale={isActive ? 1.7 : isRelated ? 1.25 : 1}>
              <sphereGeometry args={[0.075, 16, 12]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            {isActive ? (
              <mesh>
                <ringGeometry args={[0.2, 0.215, 48]} />
                <meshBasicMaterial
                  color={PALETTE.signal}
                  transparent
                  opacity={0.7}
                  side={THREE.DoubleSide}
                  toneMapped={false}
                />
              </mesh>
            ) : null}
            {/* Generous invisible hit target. */}
            <mesh
              visible={false}
              onPointerOver={handleOver(tech.id)}
              onPointerOut={handleOut}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(tech.id);
              }}
            >
              <sphereGeometry args={[0.32, 8, 6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function ConstellationScene({ running, onHover, ...props }: ConstellationSceneProps) {
  const hovering = useRef(false);
  const registry = useMemo(() => createLabelRegistry(), []);
  const clearTimer = useRef<number | undefined>(undefined);

  const deferredHover = useCallback(
    (id: string | null) => {
      window.clearTimeout(clearTimer.current);
      if (id) onHover(id);
      else clearTimer.current = window.setTimeout(() => onHover(null), HOVER_CLEAR_DELAY);
    },
    [onHover],
  );
  useEffect(() => () => window.clearTimeout(clearTimer.current), []);

  const setHovering = useCallback((value: boolean) => {
    hovering.current = value;
  }, []);

  return (
    <div className={styles.root}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 13.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={running ? (props.reducedMotion ? 'demand' : 'always') : 'never'}
      >
        <Constellation {...props} onHover={deferredHover} registry={registry} hovering={hovering} />
      </Canvas>
      <LabelLayer
        activeId={props.activeId}
        registry={registry}
        onHover={deferredHover}
        onSelect={props.onSelect}
        onHoverChange={setHovering}
      />
    </div>
  );
}
