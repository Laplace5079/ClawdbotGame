import { useRef, useMemo, useEffect } from 'react';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { useStore } from '../store/useStore';
import { DerivedStatType } from '../systems/stats.types';
import { calculateStats } from '../systems/statCalculator';
import { generateItem } from '../systems/itemGenerator';

export function Enemy({ id, initialPosition }: { id: string, initialPosition: [number, number, number] }) {
  const rb = useRef<RapierRigidBody>(null);
  const { damageEnemy, removeEnemy, dropItem, baseStats, equipped, enemies, addExperience } = useStore();
  const enemyData = enemies.find(e => e.id === id);
  
  const playerDamage = useMemo(() => {
    const allStats = Object.values(equipped).flatMap(item => item?.stats || []);
    const computed = calculateStats(baseStats, allStats as any);
    return computed[DerivedStatType.PHYSICAL_DAMAGE];
  }, [baseStats, equipped]);

  useEffect(() => {
    if (enemyData && enemyData.hp <= 0) {
      addExperience(enemyData.isBoss ? 500 : 50);
      const pos = rb.current?.translation() || { x: 0, y: 0, z: 0 };
      dropItem(generateItem(1), [pos.x, 0.5, pos.z]);
      removeEnemy(id);
    }
  }, [enemyData?.hp, id, addExperience, dropItem, removeEnemy]);

  if (!enemyData) return null;

  return (
    <RigidBody ref={rb} position={initialPosition} colliders="cuboid" enabledRotations={[false, false, false]}>
      <mesh castShadow onPointerDown={() => damageEnemy(id, playerDamage)}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color={enemyData.hp < enemyData.maxHp ? "red" : "darkred"} />
      </mesh>
    </RigidBody>
  );
}
