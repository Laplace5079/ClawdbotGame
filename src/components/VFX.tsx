import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ImpactVFX({ position, onComplete }: { position: [number, number, number], onComplete: () => void }) {
  const count = 20;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        Math.random() * 5,
        (Math.random() - 0.5) * 5
      );
      temp.push({ velocity, pos: new THREE.Vector3(0, 0, 0) });
    }
    return temp;
  }, []);

  const startTime = useRef(Date.now());

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    
    const elapsed = (Date.now() - startTime.current) / 1000;
    if (elapsed > 1) {
      onComplete();
      return;
    }

    const matrix = new THREE.Matrix4();
    particles.forEach((p, i) => {
      p.velocity.y -= 9.8 * delta; // Gravity
      p.pos.add(p.velocity.clone().multiplyScalar(delta));
      
      matrix.setPosition(p.pos);
      const scale = 1 - elapsed; // Shrink over time
      matrix.scale(new THREE.Vector3(scale, scale, scale));
      
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="#ff4400" emissive="#ff0000" emissiveIntensity={2} />
    </instancedMesh>
  );
}
