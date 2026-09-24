export const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const atmosphereFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSunPosition;
uniform float uDensity;
uniform float uPower;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 V = normalize(cameraPosition - vWorldPosition);
  vec3 N = normalize(vNormal);
  vec3 L = normalize(uSunPosition - vWorldPosition);

  // Fresnel rim intensity
  float VdotN = max(dot(V, N), 0.0);
  float fresnel = pow(1.0 - VdotN, uPower);

  // Sunlight angle alignment (Rayleigh-like forward/day scattering)
  float LdotV = dot(L, V);
  float sunScattering = max(dot(N, L), 0.0);
  float dayAtmosphere = sunScattering * 0.7 + 0.3;

  // Sunset / twilight warm shift along the terminator
  float terminatorProximity = 1.0 - abs(dot(N, L));
  vec3 twilightColor = mix(uColor, vec3(1.0, 0.55, 0.25), pow(terminatorProximity, 4.0) * 0.4);

  // Night-side subtle rim
  float nightRim = 0.08;
  float intensity = fresnel * (dayAtmosphere + nightRim) * uDensity;

  gl_FragColor = vec4(twilightColor, intensity);
}
`;
