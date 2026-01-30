import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export function Player() {
  const rb = useRef<any>(null);
  const targetPos = useStore((state) => state.targetPos);
  const setPlayerPos = useStore((state) => state.setPlayerPos);

  useFrame((_state, delta) => {
    if (!rb.current) return;

    const currentPos = rb.current.translation();
    setPlayerPos([currentPos.x, currentPos.y, currentPos.z]);

    if (!targetPos) return;
    const currentVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
    const targetVec = new THREE.Vector3(...targetPos);
    
    const direction = targetVec.clone().sub(currentVec);
    direction.y = 0; // Keep on ground

    if (direction.length() > 0.1) {
      direction.normalize().multiplyScalar(5 * delta);
      rb.current.setTranslation({
        x: currentPos.x + direction.x,
        y: currentPos.y,
        z: currentPos.z + direction.z
      }, true);
    }
  });

  return (
    <RigidBody ref={rb} colliders={false} enabledRotations={[false, false, false]} position={[0, 1, 0]}>
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>
    </RigidBody>
  );
}
