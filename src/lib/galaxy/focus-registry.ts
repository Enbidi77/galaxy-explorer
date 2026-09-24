import * as THREE from 'three';

/**
 * MovingObjectRegistry
 * Maintains real-time Object3D references for moving astronomical bodies
 * (planets revolving in Keplerian orbits, moons, satellites).
 * Enables the CameraController to track moving bodies frame-by-frame
 * without stutter or lag.
 */
class MovingObjectRegistry {
  private objects = new Map<string, THREE.Object3D>();

  register(id: string, object: THREE.Object3D) {
    this.objects.set(id, object);
  }

  unregister(id: string) {
    this.objects.delete(id);
  }

  get(id: string): THREE.Object3D | undefined {
    return this.objects.get(id);
  }

  getWorldPosition(id: string, target = new THREE.Vector3()): THREE.Vector3 | null {
    const obj = this.objects.get(id);
    if (!obj) return null;
    return obj.getWorldPosition(target);
  }

  has(id: string): boolean {
    return this.objects.has(id);
  }
}

export const movingObjectRegistry = new MovingObjectRegistry();
