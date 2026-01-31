import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useStore } from '../store/useStore';

export function Player() {
  const rb = useRef<any>(null);
  const [animation, setAnimation] = useState('Idle');

  const targetPos = useStore((state) => state.targetPos);
  const setPlayerPos = useStore((state) => state.setPlayerPos);
  const isAttacking = useStore((state) => state.isAttacking);

  useFrame((_state, delta) => {
    if (!rb.current) return;

    const currentPos = rb.current.translation();
    setPlayerPos([currentPos.x, currentPos.y, currentPos.z]);

    if (!targetPos) {
      setAnimation('Idle');
      return;
    }

    const currentVec = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);
    const targetVec = new THREE.Vector3(...targetPos);
    
    const direction = targetVec.clone().sub(currentVec);
    direction.y = 0; 

    const distance = direction.length();

    if (distance > 0.1) {
      setAnimation('Run');
      direction.normalize().multiplyScalar(5 * delta);
      rb.current.setTranslation({
        x: currentPos.x + direction.x,
        y: currentPos.y,
        z: currentPos.z + direction.z
      }, true);

      const angle = Math.atan2(direction.x, direction.z);
      rb.current.setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle), true);
    } else {
      setAnimation('Idle');
    }
  });

  return (
    <RigidBody ref={rb} colliders={false} enabledRotations={[false, false, false]} position={[0, 1, 0]}>
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow position={[0, -0.5, 0]}>
        <capsuleGeometry args={[0.4, 1, 4, 8]} />
        <meshStandardMaterial color={isAttacking ? "white" : "royalblue"} />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={2} color="#fff" distance={10} />
    </RigidBody>
  );
}
