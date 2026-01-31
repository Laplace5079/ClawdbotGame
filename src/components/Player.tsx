import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useStore } from '../store/useStore';

const MODEL_URL = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/knight/model.gltf';

export function Player() {
  const rb = useRef<any>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, scene);
  const [animation, setAnimation] = useState('Idle');

  const targetPos = useStore((state) => state.targetPos);
  const setPlayerPos = useStore((state) => state.setPlayerPos);
  const isAttacking = useStore((state) => state.isAttacking);

  useEffect(() => {
    let anim = animation;
    if (isAttacking) anim = 'Attack';
    
    actions[anim]?.reset().fadeIn(0.2).play();
    return () => {
      actions[anim]?.fadeOut(0.2);
    };
  }, [animation, isAttacking, actions]);

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
    direction.y = 0; // Keep on ground

    const distance = direction.length();

    if (distance > 0.1) {
      setAnimation('Run');
      direction.normalize().multiplyScalar(5 * delta);
      rb.current.setTranslation({
        x: currentPos.x + direction.x,
        y: currentPos.y,
        z: currentPos.z + direction.z
      }, true);

      // Rotate character to face direction
      const angle = Math.atan2(direction.x, direction.z);
      rb.current.setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle), true);
    } else {
      setAnimation('Idle');
    }
  });

  return (
    <RigidBody ref={rb} colliders={false} enabledRotations={[false, false, false]} position={[0, 1, 0]}>
      <CapsuleCollider args={[0.5, 0.5]} />
      <primitive object={scene} scale={1} position={[0, -1, 0]} castShadow />
    </RigidBody>
  );
}

useGLTF.preload(MODEL_URL);
