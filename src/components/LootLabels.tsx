import React from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { ItemRarity } from '../systems/loot.types';

const rarityColors: Record<string, string> = {
  [ItemRarity.COMMON]: '#ffffff',
  [ItemRarity.MAGIC]: '#3366ff',
  [ItemRarity.RARE]: '#ffff00',
  [ItemRarity.UNIQUE]: '#ff8000',
};

export const LootLabels: React.FC = () => {
  const { droppedItems, pickupItem } = useStore();

  return (
    <>
      {droppedItems.map(({ item, position }) => (
        <group key={item.id} position={position}>
          {/* Visual representation of the loot on ground (e.g., a simple glow or item mesh) */}
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial 
              color={rarityColors[item.rarity]} 
              emissive={rarityColors[item.rarity]} 
              emissiveIntensity={2}
            />
          </mesh>
          
          <Html
            center
            distanceFactor={10}
            position={[0, 0.5, 0]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                pickupItem(item.id);
              }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: rarityColors[item.rarity],
                border: `1px solid ${rarityColors[item.rarity]}`,
                padding: '4px 12px',
                borderRadius: '2px',
                fontSize: '14px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                pointerEvents: 'auto',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                transform: 'translateY(-50%)',
              }}
            >
              {item.name}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
};
