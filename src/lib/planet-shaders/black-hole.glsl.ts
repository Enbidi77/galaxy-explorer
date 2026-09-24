export const blackHoleDiskVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const blackHoleDiskFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uInnerRadius;
uniform float uOuterRadius;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  // Convert UV to centered coordinates [-1, 1]
  vec2 centerUv = vUv * 2.0 - 1.0;
  float r = length(centerUv);

  // Normalize radial distance between inner and outer edge
  float t = (r - 0.28) / (1.0 - 0.28);
  if (t < 0.0 || t > 1.0) {
    discard;
  }

  float angle = atan(centerUv.y, centerUv.x);

  // Relativistic Doppler beaming: approaching side (e.g. left side) is boosted
  float doppler = 1.0 + 0.65 * sin(angle);

  // Swirling logarithmic spiral bands of superheated plasma
  float spiral = sin(r * 45.0 - angle * 4.0 - uTime * 4.0) * 0.5 + 0.5;
  float microDetail = sin(r * 120.0 + angle * 8.0 - uTime * 6.0) * 0.25;

  // Temperature gradient: inner ISCO edge is searing blue-white, outer edge is deep fiery orange
  vec3 hotColor = vec3(0.85, 0.95, 1.0);
  vec3 midColor = vec3(1.0, 0.65, 0.15);
  vec3 coolColor = vec3(0.9, 0.18, 0.02);

  vec3 plasmaColor = mix(hotColor, midColor, smoothstep(0.0, 0.45, t));
  plasmaColor = mix(plasmaColor, coolColor, smoothstep(0.45, 1.0, t));

  // Intensity profile: peaks near ISCO, tapers to outer edge
  float intensity = pow(1.0 - t, 1.5) * (0.8 + 0.4 * (spiral + microDetail)) * doppler;

  // Photon ring glow spike at event horizon boundary
  float photonRing = smoothstep(0.06, 0.0, abs(t - 0.02)) * 3.5;
  plasmaColor += vec3(1.0, 0.95, 0.8) * photonRing;

  float alpha = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.8, t) * min(intensity * 1.5, 1.0);

  gl_FragColor = vec4(plasmaColor * 2.2, alpha);
}
`;
