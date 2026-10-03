import * as THREE from 'three';

/** Soft round points sized in screen space with depth attenuation. */
const pointVertex = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uScale;
  attribute float aSize;
  attribute float aEmphasis;
  attribute vec3 aColor;
  varying float vEmphasis;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * uScale * (14.0 / -mv.z);
    vEmphasis = aEmphasis;
    vColor = aColor;
    vDepth = smoothstep(24.0, 9.0, -mv.z);
  }
`;

/** Core + glow, with an outer ring when `aEmphasis` is 1. */
export const nodeFragment = /* glsl */ `
  uniform float uOpacity;
  varying float vEmphasis;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.16, 0.1, d);
    float glow = exp(-d * d * 30.0) * 0.5;
    float ring = vEmphasis * smoothstep(0.03, 0.0, abs(d - 0.43)) * 0.75;
    float alpha = (core + glow + ring) * uOpacity * (0.35 + 0.65 * vDepth);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/** Plain soft dot that fades with distance, for the background lattice. */
export const dotFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.15, d) * uOpacity * vDepth;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export type PointMaterial = THREE.ShaderMaterial & {
  uniforms: { uPixelRatio: { value: number }; uScale: { value: number }; uOpacity: { value: number } };
};

export function makePointMaterial(fragmentShader: string, pixelRatio: number): PointMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uScale: { value: 1 },
      uOpacity: { value: 1 },
    },
    vertexShader: pointVertex,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }) as PointMaterial;
}

/** Geometry with the attributes the point shader expects. */
export function makePointGeometry(
  positions: Float32Array,
  sizes: Float32Array,
  colors: Float32Array,
  emphasis = new Float32Array(sizes.length),
  dynamic = true,
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const position = new THREE.BufferAttribute(positions, 3);
  if (dynamic) position.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', position);
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aEmphasis', new THREE.BufferAttribute(emphasis, 1));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  return geometry;
}
