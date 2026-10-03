'use client';

/* eslint-disable react-hooks/immutability -- three.js objects are mutated in the frame loop by design (R3F idiom). */

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type * as THREE from 'three';
import { isSideHeroLayout } from '@/lib/breakpoints';
import { clamp, damp, lerp } from '@/lib/motion';
import { onScrollStateChange, scrollState } from '@/lib/scrollState';
import { createSystemGraph } from './systemGraph';
import {
  fitFrame,
  FRAMING,
  MOTION,
  QUALITY,
  resolveAmount,
  restingPoints,
  sceneVisibility,
  type SceneMode,
} from './systemConfig';
import { useSystemBuffers } from './useSystemBuffers';

interface SystemSceneProps {
  mode: SceneMode;
  reducedMotion: boolean;
  onReady?: () => void;
}

function SystemField({ mode, reducedMotion }: { mode: SceneMode; reducedMotion: boolean }) {
  const { camera, gl, size } = useThree();
  const graph = useMemo(() => createSystemGraph(), []);
  const resting = useMemo(() => restingPoints(graph.nodes.map((n) => n.hero)), [graph]);
  // Recomputed only when the canvas resizes.
  const frame = useMemo(
    () =>
      fitFrame(
        resting,
        size.width / Math.max(size.height, 1),
        isSideHeroLayout(size.width, size.height) ? FRAMING.side : FRAMING.stacked,
      ),
    [resting, size.width, size.height],
  );
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, edges, packets, substrate } = useSystemBuffers(graph, mode, gl.getPixelRatio());
  const motionState = useRef({ time: 0, pointerX: 0, pointerY: 0 });

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(rawDelta, 1 / 20);
    const motion = reducedMotion ? 0 : 1;
    const state = motionState.current;
    state.time += dt * motion;
    const t = state.time;

    const heroProgress = scrollState.hero;
    const resolve = resolveAmount(mode);
    const opacity = sceneVisibility(mode);

    for (const material of [nodes.material, packets.material, substrate.material]) {
      material.uniforms.uScale.value = frame.scale;
    }
    nodes.material.uniforms.uOpacity.value = opacity;
    packets.material.uniforms.uOpacity.value = opacity * (reducedMotion ? 0.6 : 1);
    substrate.material.uniforms.uOpacity.value = opacity * 0.55 * (1 - resolve * 0.7);
    edges.material.opacity = 0.17 * opacity;

    // Nodes: blend hero → resolved formation; idle drift only in the hero formation.
    const pos = nodes.positions;
    const busSpin = t * MOTION.busSpin;
    const [busX, busY, busZ] = graph.busCenter;
    graph.nodes.forEach((node, i) => {
      let [hx, hy, hz] = node.hero;
      let [rx, ry] = node.resolved;
      if (node.angle !== undefined) {
        const angle = node.angle + busSpin;
        hx = busX;
        hy = busY + Math.cos(angle) * graph.busRadius;
        hz = busZ + Math.sin(angle) * graph.busRadius;
        rx = Math.sin(angle) * 1.8;
        ry = Math.cos(angle) * 1.8;
      } else {
        hy += Math.sin(t * 0.55 + node.phase) * MOTION.driftY;
        hz += Math.cos(t * 0.4 + node.phase) * MOTION.driftZ;
      }
      pos[i * 3] = lerp(hx, rx, resolve);
      pos[i * 3 + 1] = lerp(hy, ry, resolve);
      pos[i * 3 + 2] = lerp(hz, node.resolved[2], resolve);
    });
    nodes.geometry.attributes.position.needsUpdate = true;

    // Edges follow their nodes.
    const ep = edges.positions;
    graph.edges.forEach(([a, b], i) => {
      for (let k = 0; k < 3; k++) {
        ep[i * 6 + k] = pos[a * 3 + k];
        ep[i * 6 + 3 + k] = pos[b * 3 + k];
      }
    });
    edges.geometry.attributes.position.needsUpdate = true;

    // Packets advance along their routes at a constant world-space speed.
    for (let i = 0; i < packets.count; i++) {
      const route = graph.routes[packets.route[i]];
      const a = route[packets.segment[i]];
      const b = route[packets.segment[i] + 1];
      const dx = pos[b * 3] - pos[a * 3];
      const dy = pos[b * 3 + 1] - pos[a * 3 + 1];
      const dz = pos[b * 3 + 2] - pos[a * 3 + 2];
      packets.progress[i] += (packets.speed[i] * dt * motion) / Math.max(Math.hypot(dx, dy, dz), 0.05);
      if (packets.progress[i] >= 1) {
        packets.progress[i] = 0;
        packets.segment[i] += 1;
        if (packets.segment[i] >= route.length - 1) {
          packets.segment[i] = 0;
          packets.route[i] = Math.floor(packets.random() * graph.routes.length);
        }
        continue;
      }
      const p = packets.progress[i];
      packets.positions[i * 3] = pos[a * 3] + dx * p;
      packets.positions[i * 3 + 1] = pos[a * 3 + 1] + dy * p;
      packets.positions[i * 3 + 2] = pos[a * 3 + 2] + dz * p;
    }
    packets.geometry.attributes.position.needsUpdate = true;

    // Eased pointer parallax and scroll-driven framing.
    const follow = damp(MOTION.pointerFollow, dt);
    state.pointerX = lerp(state.pointerX, reducedMotion ? 0 : scrollState.pointerX, follow);
    state.pointerY = lerp(state.pointerY, reducedMotion ? 0 : scrollState.pointerY, follow);

    const { yaw, pitch, camera: cam, resolved } = FRAMING;
    group.rotation.y = lerp(yaw.base + heroProgress * yaw.scrollTravel + state.pointerX * yaw.pointer, 0, resolve);
    group.rotation.x = lerp(pitch.base + state.pointerY * pitch.pointer, 0, resolve);
    group.position.x = lerp(frame.x, resolved.x, resolve);
    group.position.y = lerp(frame.y, resolved.y, resolve);
    group.scale.setScalar(lerp(frame.scale, resolved.scale, resolve));

    camera.position.z = lerp(cam.heroZ + clamp(heroProgress) * cam.heroZTravel, cam.resolvedZ, resolve);
    camera.position.y = lerp(cam.heroY - heroProgress * cam.heroYTravel, cam.resolvedY, resolve);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <points geometry={substrate.geometry} material={substrate.material} frustumCulled={false} />
      <lineSegments geometry={edges.geometry} material={edges.material} frustumCulled={false} />
      <points geometry={nodes.geometry} material={nodes.material} frustumCulled={false} />
      <points geometry={packets.geometry} material={packets.material} frustumCulled={false} />
    </group>
  );
}

/** Stops the render loop whenever the scene is scrolled out of view. */
function FrameGate({ mode, reducedMotion }: { mode: SceneMode; reducedMotion: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  const canvas = useThree((s) => s.gl.domElement);

  useEffect(() => {
    let running: boolean | null = null;
    return onScrollStateChange(() => {
      const visible = sceneVisibility(mode) > 0.004;
      canvas.style.visibility = visible ? 'visible' : 'hidden';
      if (reducedMotion) {
        if (visible) invalidate();
        return;
      }
      if (visible !== running) {
        running = visible;
        setFrameloop(visible ? 'always' : 'never');
      }
    });
  }, [mode, reducedMotion, setFrameloop, invalidate, canvas]);

  return null;
}

export default function SystemScene({ mode, reducedMotion, onReady }: SystemSceneProps) {
  return (
    <Canvas
      dpr={QUALITY[mode].dpr}
      camera={{
        position: [0, FRAMING.camera.heroY, FRAMING.camera.heroZ],
        fov: FRAMING.camera.fov,
        near: 0.1,
        far: 60,
      }}
      gl={{ antialias: mode === 'full', alpha: true, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: 'none' }}
    >
      <SystemField mode={mode} reducedMotion={reducedMotion} />
      <FrameGate mode={mode} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
