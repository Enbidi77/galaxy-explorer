export const earthSurfaceVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const earthSurfaceFragmentShader = /* glsl */ `
uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
uniform sampler2D uNormalMap;
uniform sampler2D uSpecularMap;
uniform vec3 uSunPosition;
uniform float uNormalScale;
uniform float uShininess;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

// Perturb normal using screen-space derivatives (works on any UV mapped sphere)
vec3 perturbNormal2Arb(vec3 eye_pos, vec3 surf_norm, vec2 uv, sampler2D normalMap, float scale) {
  vec3 q0 = dFdx(eye_pos);
  vec3 q1 = dFdy(eye_pos);
  vec2 st0 = dFdx(uv);
  vec2 st1 = dFdy(uv);

  vec3 N = surf_norm;
  vec3 S = normalize(q0 * st1.t - q1 * st0.t);
  vec3 T = normalize(-q0 * st1.s + q1 * st0.s);
  vec3 B = normalize(cross(N, S));

  vec3 mapN = texture2D(normalMap, uv).xyz * 2.0 - 1.0;
  mapN.xy = scale * mapN.xy;
  mat3 tsn = mat3(S, B, N);
  return normalize(tsn * mapN);
}

void main() {
  vec3 N = vWorldNormal;
  #ifdef USE_NORMALMAP
    N = perturbNormal2Arb(vWorldPosition, vWorldNormal, vUv, uNormalMap, uNormalScale);
  #endif

  vec3 L = normalize(uSunPosition - vWorldPosition);
  vec3 V = normalize(cameraPosition - vWorldPosition);
  vec3 H = normalize(L + V);

  float NdotL = dot(N, L);
  float rawNdotL = dot(vWorldNormal, L);

  // Day albedo
  vec3 dayColor = texture2D(uDayMap, vUv).rgb;

  // Ocean Specular & Roughness
  float oceanMask = texture2D(uSpecularMap, vUv).r;
  float specFactor = pow(max(dot(N, H), 0.0), uShininess) * oceanMask;
  vec3 sunReflection = vec3(1.0, 0.95, 0.85) * specFactor * 1.8 * max(NdotL, 0.0);

  // Diffuse illumination with smooth terminator wrap
  float dayTerminator = smoothstep(-0.08, 0.25, NdotL);
  vec3 diffuse = dayColor * (dayTerminator * 1.1 + 0.03);

  // Night lights on unlit side
  vec3 nightLights = texture2D(uNightMap, vUv).rgb;
  float nightTerminator = smoothstep(0.12, -0.15, rawNdotL);
  vec3 night = nightLights * nightTerminator * 1.4;

  // Composite day + night + specular reflections
  vec3 finalColor = diffuse + sunReflection + night;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
