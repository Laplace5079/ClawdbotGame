import { RigidBody } from '@react-three/rapier';

export function Ground({ onMove }: { onMove: (pos: [number, number, number]) => void }) {
  return (
    <RigidBody type="fixed">
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow 
        onClick={(e) => {
          e.stopPropagation();
          onMove([e.point.x, e.point.y, e.point.z]);
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </RigidBody>
  );
}
