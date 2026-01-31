import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const ExitPortal: React.FC = () => {
  const playerPos = useStore((state) => state.playerPos);
  const setGameState = useStore((state) => state.setGameState);
  
  // Hardcoded portal position for now or can be passed as prop
  const portalPos: [number, number, number] = [0, 0, 0];
  
  useEffect(() => {
    // Simple distance check
    const dx = playerPos[0] - portalPos[0];
    const dz = playerPos[2] - portalPos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    
    if (dist < 2) {
      setGameState('cleared');
    }
  }, [playerPos, setGameState]);

  return (
    <group position={portalPos}>
      {/* Visual representation of the portal */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#800" emissive="#f00" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#daa520" emissive="#daa520" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[0, 2, 0]} color="#f00" intensity={2} distance={10} />
      
      {/* Swirling particles or core */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#100" 
          transparent 
          opacity={0.6} 
          wireframe
        />
      </mesh>
    </group>
  );
};
