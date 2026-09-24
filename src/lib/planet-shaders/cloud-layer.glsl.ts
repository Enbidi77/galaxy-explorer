export const cloudVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const cloudFragmentShader = /* glsl */ `
uniform sampler2D uCloudMap;
uniform vec3 uSunPosition;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec4 cloudSample = texture2D(uCloudMap, vUv);
  
  // Three.js cloud maps are either greyscale or alpha-encoded
  float cloudDensity = cloudSample.a > 0.0 ? cloudSample.a : cloudSample.r;
  
  if (cloudDensity < 0.05) discard;

  vec3 L = normalize(uSunPosition - vWorldPosition);
  vec3 N = normalize(vNormal);

  // Sunlight illumination across clouds
  float NdotL = max(dot(N, L), 0.0);
  float cloudIllumination = smoothstep(-0.1, 0.4, NdotL) * 0.95 + 0.05;

  vec3 cloudColor = vec3(0.98, 0.98, 1.0) * cloudIllumination;
  float alpha = cloudDensity * uOpacity;

  gl_FragColor = vec4(cloudColor, alpha);
}
`;
