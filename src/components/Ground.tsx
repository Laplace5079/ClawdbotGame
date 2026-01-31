import { RigidBody } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Ground({ onMove }: { onMove: (pos: [number, number, number]) => void }) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]}
        receiveShadow 
        onClick={(e) => {
          e.stopPropagation();
          onMove([e.point.x, e.point.y, e.point.z]);
        }}
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
            color="#111" 
            roughness={0.8} 
            metalness={0.2}
        />
      </mesh>
      {/* Decorative grid lines for a more "designed" floor look */}
      <gridHelper args={[200, 100, '#111', '#050505']} position={[0, 0.01, 0]} />
    </RigidBody>
  );
}
