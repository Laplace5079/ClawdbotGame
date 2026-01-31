import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, vec3 } from '@react-three/rapier';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import { DerivedStatType } from '../systems/stats.types';
import { calculateStats } from '../systems/statCalculator';
import { generateItem } from '../systems/itemGenerator';

const ENEMY_MODEL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Ghost/glTF/Ghost.gltf';

const playSound = (type: string) => {
  console.log(`[Audio] Playing SFX: ${type}`);
};

interface EnemyProps {
  id: string;
  initialPosition: [number, number, number];
}

export function Enemy({ id, initialPosition }: EnemyProps) {
  const rb = useRef<RapierRigidBody>(null);
  const { damageEnemy, removeEnemy, dropItem, baseStats, equipped, enemies, playerPos, addVFX, addExperience } = useStore();
  const enemyData = enemies.find(e => e.id === id);
  const [lastAoeTime, setLastAoeTime] = useState(0);

  // Load Model
  const { scene, animations } = useGLTF(ENEMY_MODEL);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    actions['Walking']?.play();
  }, [actions]);
  
  const playerDamage = useMemo(() => {
    const allStats = Object.values(equipped).flatMap(item => item?.stats || []);
    const computed = calculateStats(baseStats, allStats);
    return computed[DerivedStatType.PHYSICAL_DAMAGE];
  }, [baseStats, equipped]);

  const handleHit = () => {
    if (!rb.current) return;
    const pos = rb.current.translation();
    damageEnemy(id, playerDamage);
    addVFX('impact', [pos.x, pos.y + 0.5, pos.z]);
    playSound('hit');
  };

  useEffect(() => {
    if (enemyData && enemyData.hp <= 0 && rb.current) {
      const pos = rb.current.translation();
      const xpValue = enemyData.isBoss ? 500 : 50;
      addExperience(xpValue);
      
      const lootCount = enemyData.isBoss ? 3 : 1;
      for (let i = 0; i < lootCount; i++) {
        const newItem = generateItem(enemyData.isBoss ? 5 : 1);
        dropItem(newItem, [pos.x + (Math.random() - 0.5), 0.5, pos.z + (Math.random() - 0.5)]);
      }
      
      playSound('loot_drop');
      removeEnemy(id);
    }
  }, [enemyData?.hp, id, removeEnemy, dropItem]);

  useFrame((state) => {
    if (!rb.current || !enemyData) return;
    
    const currentPos = vec3(rb.current.translation());
    const target = new THREE.Vector3(...playerPos);
    const distance = currentPos.distanceTo(target);
    
    const direction = new THREE.Vector3().subVectors(target, currentPos).normalize();
    direction.y = 0;
    
    if (enemyData.isBoss && distance < 4 && state.clock.elapsedTime - lastAoeTime > 5) {
      setLastAoeTime(state.clock.elapsedTime);
      addVFX('boss_aoe', [currentPos.x, 0.1, currentPos.z]);
      playSound('boss_roar');
    }

    if (distance > 1.5) {
      const speed = enemyData.isBoss ? 1.5 : 2.5;
      rb.current.setLinvel({ x: direction.x * speed, y: 0, z: direction.z * speed }, true);
      
      // Rotate to face player
      const angle = Math.atan2(direction.x, direction.z);
      rb.current.setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle), true);
    } else {
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  if (!enemyData) return null;

  const scale = enemyData.isBoss ? 2.5 : 1.2;

  return (
    <RigidBody 
      ref={rb} 
      position={initialPosition} 
      colliders="cuboid" 
      enabledRotations={[false, false, false]}
    >
      <group onPointerDown={handleHit}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <primitive 
                object={scene.clone()} 
                scale={scale} 
                position={[0, -0.5, 0]}
            >
                {/* Visual indicator for damage */}
                <meshStandardMaterial 
                    attach="material" 
                    color={enemyData.hp < enemyData.maxHp ? "#ff0000" : "#ffffff"} 
                    transparent
                    opacity={0.8}
                />
            </primitive>
        </Float>
      </group>
      
      {/* Health Bar (AAA Style) */}
      <mesh position={[0, scale + 0.5, 0]}>
        <boxGeometry args={[scale, 0.05, 0.05]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      <mesh position={[- (scale * (1 - enemyData.hp/enemyData.maxHp))/2, scale + 0.5, 0.01]}>
        <boxGeometry args={[scale * (enemyData.hp / enemyData.maxHp), 0.06, 0.06]} />
        <meshBasicMaterial color={enemyData.isBoss ? "#daa520" : "#800"} />
      </mesh>
    </RigidBody>
  );
}

useGLTF.preload(ENEMY_MODEL);
