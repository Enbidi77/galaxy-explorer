export const ringVertexShader = /* glsl */ `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const ringFragmentShader = /* glsl */ `
uniform sampler2D uRingTexture;
uniform vec3 uSunPosition;
uniform vec3 uPlanetPosition;
uniform float uPlanetRadius;
uniform float uInnerRadius;
uniform float uOuterRadius;

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  // Compute radial distance from planet center in planet local plane
  vec3 offset = vWorldPosition - uPlanetPosition;
  float dist = length(offset);

  // Map radial distance to [0, 1] texture coordinates
  float ringU = (dist - uInnerRadius) / (uOuterRadius - uInnerRadius);
  if (ringU < 0.0 || ringU > 1.0) {
    discard;
  }

  vec4 ringColor = texture2D(uRingTexture, vec2(ringU, 0.5));
  if (ringColor.a < 0.03) {
    discard;
  }

  // Calculate planetary shadow cast onto the ring:
  // Ray from ring point toward the sun
  vec3 L = normalize(uSunPosition - vWorldPosition);
  
  // Vector from ring point to planet center
  vec3 toPlanet = uPlanetPosition - vWorldPosition;
  float t = dot(toPlanet, L);

  float shadow = 1.0;
  // If the planet lies in the direction of the sun from this ring point
  if (t > 0.0) {
    vec3 closestPoint = vWorldPosition + L * t;
    float distToPlanetCenter = length(uPlanetPosition - closestPoint);
    
    // If ray passes inside planet radius, it is shadowed
    if (distToPlanetCenter < uPlanetRadius) {
      float penumbra = smoothstep(uPlanetRadius * 0.95, uPlanetRadius, distToPlanetCenter);
      shadow = mix(0.08, 1.0, penumbra);
    }
  }

  // Lighting on rings: light can transmit through thin ice particles (dual sided phase effect)
  vec3 finalRgb = ringColor.rgb * (shadow * 0.95 + 0.05);

  gl_FragColor = vec4(finalRgb, ringColor.a);
}
`;
