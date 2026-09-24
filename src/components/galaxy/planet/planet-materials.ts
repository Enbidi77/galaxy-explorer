import * as THREE from 'three';

// Texture Cache to avoid repeated downloads and decodes
const textureCache = new Map<string, THREE.Texture>();
const textureLoader = new THREE.TextureLoader();

/**
 * Loads a texture with proper color space, mipmaps, and anisotropic filtering
 */
export function loadPlanetTexture(
  url: string,
  isColor = true,
  onLoad?: (tex: THREE.Texture) => void,
  onError?: (err: unknown) => void
): THREE.Texture {
  if (textureCache.has(url)) {
    const cached = textureCache.get(url)!;
    if (onLoad) onLoad(cached);
    return cached;
  }

  const texture = textureLoader.load(
    url,
    (loadedTex) => {
      loadedTex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      loadedTex.generateMipmaps = true;
      loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTex.magFilter = THREE.LinearFilter;
      loadedTex.anisotropy = 8;
      loadedTex.wrapS = THREE.RepeatWrapping;
      loadedTex.wrapT = THREE.ClampToEdgeWrapping;
      loadedTex.needsUpdate = true;
      if (onLoad) onLoad(loadedTex);
    },
    undefined,
    (err) => {
      console.warn(`[PlanetMaterial] Failed to load ${url}, falling back to procedural.`, err);
      if (onError) onError(err);
    }
  );

  texture.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  textureCache.set(url, texture);
  return texture;
}

/**
 * Procedural Fallback Generators (Canvas Textures)
 * Guarantees planets never fail to render even if network or files are offline
 */
export function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean background
  ctx.fillStyle = '#0c274c';
  ctx.fillRect(0, 0, 1024, 512);

  // Stylized continents
  ctx.fillStyle = '#265935';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 352;
    const rad = 40 + Math.random() * 90;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar Ice Caps
  ctx.fillStyle = '#eef5fc';
  ctx.fillRect(0, 0, 1024, 45);
  ctx.fillRect(0, 467, 1024, 45);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

export function createProceduralGasGiantTexture(baseColor = '#c49a6c', stripeColor = '#80593f'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Horizontal cloud bands
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, baseColor);
  grad.addColorStop(0.2, stripeColor);
  grad.addColorStop(0.35, baseColor);
  grad.addColorStop(0.5, '#ad754f');
  grad.addColorStop(0.65, baseColor);
  grad.addColorStop(0.8, stripeColor);
  grad.addColorStop(1.0, baseColor);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Great storm spot
  ctx.fillStyle = '#b83b23';
  ctx.beginPath();
  ctx.ellipse(650, 320, 60, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

export function createProceduralMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8f9298';
  ctx.fillRect(0, 0, 512, 256);

  // Lunar Maria
  ctx.fillStyle = '#4a4d53';
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.arc(x, y, 20 + Math.random() * 45, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

export function createProceduralSaturnRings(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 8;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0.0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.1, 'rgba(160,145,125,0.4)');
  grad.addColorStop(0.3, 'rgba(215,195,165,0.85)');
  grad.addColorStop(0.58, 'rgba(225,205,175,0.9)');
  // Cassini Gap
  grad.addColorStop(0.60, 'rgba(10,10,10,0.05)');
  grad.addColorStop(0.65, 'rgba(15,15,15,0.05)');
  // A Ring
  grad.addColorStop(0.67, 'rgba(195,180,150,0.7)');
  grad.addColorStop(0.92, 'rgba(180,165,140,0.6)');
  grad.addColorStop(1.0, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
