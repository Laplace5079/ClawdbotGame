import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, vec3 } from '@react-three/rapier';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import { DerivedStatType } from '../systems/stats.types';
import { calculateStats } from '../systems/statCalculator';
import { generateItem } from '../systems/itemGenerator';

// Mock Sound Engine
const playSound = (type: string) => {
  console.log(`[Audio] Playing SFX: ${type}`);
  // In a real implementation: new Audio(`/sounds/${type}.mp3`).play();
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

  // Handle Death
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

  // AI & AOE Mechanics
  useFrame((state) => {
    if (!rb.current || !enemyData) return;
    
    const currentPos = vec3(rb.current.translation());
    const target = new THREE.Vector3(...playerPos);
    const distance = currentPos.distanceTo(target);
    
    const direction = new THREE.Vector3().subVectors(target, currentPos).normalize();
    direction.y = 0;
    
    // Boss AOE Logic
    if (enemyData.isBoss && distance < 4 && state.clock.elapsedTime - lastAoeTime > 5) {
      setLastAoeTime(state.clock.elapsedTime);
      addVFX('boss_aoe', [currentPos.x, 0.1, currentPos.z]);
      playSound('boss_roar');
      console.log("BOSS casting AOE Slam!");
      // Logic for damaging player would go here
    }

    if (distance > 1.5) {
      const speed = enemyData.isBoss ? 1.5 : 2;
      rb.current.setLinvel({ x: direction.x * speed, y: 0, z: direction.z * speed }, true);
    } else {
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  if (!enemyData) return null;

  const scale = enemyData.isBoss ? 2 : 1;

  return (
    <RigidBody 
      ref={rb} 
      position={initialPosition} 
      colliders="cuboid" 
      enabledRotations={[false, false, false]}
    >
      <mesh castShadow onPointerDown={handleHit} scale={[scale, scale, scale]}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color={enemyData.isBoss ? "purple" : (enemyData.hp < enemyData.maxHp ? "red" : "darkred")} />
      </mesh>
      
      {/* Health Bar */}
      <mesh position={[0, scale * 1.5, 0]}>
        <planeGeometry args={[scale * (enemyData.hp / enemyData.maxHp), 0.1 * scale]} />
        <meshBasicMaterial color={enemyData.isBoss ? "gold" : "green"} />
      </mesh>
    </RigidBody>
  );
}
