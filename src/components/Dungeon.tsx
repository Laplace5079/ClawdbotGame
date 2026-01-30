import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { PointLight } from 'three';
import { generateDungeon } from '../systems/dungeonGenerator';

function Torch({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Simple flickering effect
      lightRef.current.intensity = 15 + Math.sin(state.clock.elapsedTime * 10) * 2;
    }
  });

  return (
    <group position={position}>
      <pointLight 
        ref={lightRef} 
        color="#ffaa44" 
        intensity={15} 
        distance={10} 
        castShadow 
        shadow-mapSize={[512, 512]}
      />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffaa44" emissive="#ffaa44" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export function Dungeon() {
  const layout = useMemo(() => generateDungeon(10, 10), []);
  
  // Pick some cells for torches (e.g., center of rooms)
  const torchPositions = useMemo(() => {
    return layout
      .filter((cell, i) => cell.type === 'room' && i % 15 === 0)
      .map(cell => [cell.x * 2, 1.5, cell.z * 2] as [number, number, number]);
  }, [layout]);

  return (
    <group>
      {layout.map((cell, i) => (
        <RigidBody key={i} type="fixed" position={[cell.x * 2, -0.5, cell.z * 2]}>
          <mesh receiveShadow>
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial 
              color={cell.type === 'room' ? '#222' : '#1a1a1a'} 
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        </RigidBody>
      ))}
      
      {torchPositions.map((pos, i) => (
        <Torch key={i} position={pos} />
      ))}
    </group>
  );
}

