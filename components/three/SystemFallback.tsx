import type { Vec3 } from '@/lib/vec';
import { createSystemGraph } from './systemGraph';

/**
 * Static SVG rendering of the hero system graph. Shown before WebGL loads and
 * permanently on devices where 3D is disabled (no WebGL, Save-Data, low power).
 */

const graph = createSystemGraph();
const YAW = -0.42;
const PITCH = 0.1;
const CAMERA_Z = 13;
const FOCAL = 520;

function project([x, y, z]: Vec3): { x: number; y: number; depth: number } {
  const cosY = Math.cos(YAW);
  const sinY = Math.sin(YAW);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(PITCH);
  const sinX = Math.sin(PITCH);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  const depth = CAMERA_Z - z2;
  return { x: round((x1 * FOCAL) / depth), y: round((-y1 * FOCAL) / depth), depth };
}

/**
 * Trig results can differ in the last bits between Node (prerender) and the
 * browser, which breaks hydration; two decimals is plenty for an SVG.
 */
const round = (value: number) => Math.round(value * 100) / 100;

const projected = graph.nodes.map((n) => project(n.hero));

const COLORS = { gateway: '#eceef1', service: '#4da3ff', bus: '#7cbcff', worker: '#4da3ff', store: '#f2b04b' };

export function SystemFallback({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-460 -300 920 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g stroke="#4da3ff" strokeOpacity="0.22" strokeWidth="1">
        {graph.edges.map(([a, b], i) => (
          <line key={i} x1={projected[a].x} y1={projected[a].y} x2={projected[b].x} y2={projected[b].y} />
        ))}
      </g>
      {graph.nodes.map((node, i) => {
        const p = projected[i];
        const r = round((node.size / 4) * (CAMERA_Z / p.depth));
        return (
          <g key={i} opacity={round(Math.min(1, 0.45 + 6 / p.depth))}>
            {node.emphasis ? (
              <circle cx={p.x} cy={p.y} r={round(r * 2.4)} fill="none" stroke={COLORS[node.kind]} strokeOpacity="0.5" />
            ) : null}
            <circle cx={p.x} cy={p.y} r={r} fill={COLORS[node.kind]} />
          </g>
        );
      })}
    </svg>
  );
}
