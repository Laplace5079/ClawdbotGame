import { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { generateDungeon } from '../systems/dungeonGenerator';

export function Dungeon() {
  const layout = useMemo(() => generateDungeon(10, 10), []);

  return (
    <group>
      {layout.map((cell, i) => (
        <RigidBody key={i} type="fixed" position={[cell.x * 2, -0.5, cell.z * 2]}>
          <mesh receiveShadow>
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial 
              color={cell.type === 'room' ? '#444' : '#333'} 
              roughness={0.8}
            />
          </mesh>
        </RigidBody>
      ))}
      
      {/* Invisible plane for click-to-move detection if needed, or we can use the tiles */}
    </group>
  );
}
