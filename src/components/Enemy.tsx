import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, vec3 } from '@react-three/rapier';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import { DerivedStatType } from '../systems/stats.types';
import { calculateStats } from '../systems/statCalculator';
import { generateItem } from '../systems/itemGenerator';

interface EnemyProps {
  id: string;
  initialPosition: [number, number, number];
}

export function Enemy({ id, initialPosition }: EnemyProps) {
  const rb = useRef<RapierRigidBody>(null);
  const { damageEnemy, removeEnemy, dropItem, baseStats, equipped, enemies, playerPos } = useStore();
  const enemyData = enemies.find(e => e.id === id);
  
  // Calculate player damage
  const playerDamage = useMemo(() => {
    const allStats = Object.values(equipped).flatMap(item => item?.stats || []);
    const computed = calculateStats(baseStats, allStats);
    return computed[DerivedStatType.PHYSICAL_DAMAGE];
  }, [baseStats, equipped]);

  // Handle Death
  useEffect(() => {
    if (enemyData && enemyData.hp <= 0 && rb.current) {
      const pos = rb.current.translation();
      const newItem = generateItem(1);
      dropItem(newItem, [pos.x, 0.5, pos.z]);
      removeEnemy(id);
    }
  }, [enemyData?.hp, id, removeEnemy, dropItem]);

  // Basic AI: Chase Player
  useFrame(() => {
    if (!rb.current || !enemyData) return;
    
    const currentPos = vec3(rb.current.translation());
    const target = new THREE.Vector3(...playerPos);
    
    const direction = new THREE.Vector3().subVectors(target, currentPos).normalize();
    direction.y = 0;
    
    if (currentPos.distanceTo(target) > 1.5) {
      rb.current.setLinvel({ x: direction.x * 2, y: 0, z: direction.z * 2 }, true);
    } else {
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  if (!enemyData) return null;

  return (
    <RigidBody 
      ref={rb} 
      position={initialPosition} 
      colliders="cuboid" 
      enabledRotations={[false, false, false]}
    >
      <mesh castShadow onPointerDown={() => damageEnemy(id, playerDamage)}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color={enemyData.hp < enemyData.maxHp ? "red" : "darkred"} />
      </mesh>
      
      {/* Health Bar */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[1 * (enemyData.hp / enemyData.maxHp), 0.1]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </RigidBody>
  );
}
