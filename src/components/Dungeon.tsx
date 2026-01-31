import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { PointLight } from 'three';
import { generateDungeon, DungeonProp } from '../systems/dungeonGenerator';

function Torch({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 15 + Math.sin(state.clock.elapsedTime * 10) * 2;
    }
  });

  return (
    <group position={position}>
      <pointLight 
        ref={lightRef} 
        color="#ff7700" 
        intensity={20} 
        distance={12} 
        castShadow 
        shadow-mapSize={[512, 512]}
      />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ff7700" emissive="#ff7700" emissiveIntensity={5} />
      </mesh>
    </group>
  );
}

function Prop({ prop, position }: { prop: DungeonProp, position: [number, number, number] }) {
    const combinedPos: [number, number, number] = [
        position[0] + prop.offset[0],
        position[1] + prop.offset[1],
        position[2] + prop.offset[2]
    ];

    if (prop.type === 'torch') {
        return <Torch position={combinedPos} />;
    }

    let color = '#543';
    let args: [number, number, number] = [0.6, 0.6, 0.6];
    
    if (prop.type === 'barrel') {
        color = '#432';
        args = [0.5, 0.8, 0.5];
    } else if (prop.type === 'debris') {
        color = '#333';
        args = [0.8, 0.2, 0.8];
    }

    return (
        <RigidBody colliders="cuboid" position={combinedPos} rotation={[0, prop.rotation, 0]}>
            <mesh castShadow receiveShadow scale={prop.scale}>
                {prop.type === 'barrel' ? <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} /> : <boxGeometry args={args} />}
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
        </RigidBody>
    );
}

export function Dungeon() {
  const layout = useMemo(() => generateDungeon(20, 20), []);
  
  return (
    <group>
      {layout.map((cell, i) => {
        const basePos: [number, number, number] = [cell.x * 2, -0.5, cell.z * 2];
        return (
            <group key={i}>
                <RigidBody type="fixed" position={basePos}>
                    <mesh receiveShadow>
                        <boxGeometry args={[2, 1, 2]} />
                        <meshStandardMaterial 
                            color={cell.type === 'room' ? '#151515' : '#111'} 
                            roughness={1}
                            metalness={0}
                        />
                    </mesh>
                    {/* Simple Walls logic: If neighbor is empty, add a wall */}
                    <mesh position={[0, 1.5, 1]} receiveShadow>
                        <boxGeometry args={[2, 3, 0.1]} />
                        <meshStandardMaterial color="#080808" />
                    </mesh>
                    <mesh position={[0, 1.5, -1]} receiveShadow>
                        <boxGeometry args={[2, 3, 0.1]} />
                        <meshStandardMaterial color="#080808" />
                    </mesh>
                    <mesh position={[1, 1.5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
                        <boxGeometry args={[2, 3, 0.1]} />
                        <meshStandardMaterial color="#080808" />
                    </mesh>
                    <mesh position={[-1, 1.5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
                        <boxGeometry args={[2, 3, 0.1]} />
                        <meshStandardMaterial color="#080808" />
                    </mesh>
                </RigidBody>
                
                {cell.props.map((p, j) => (
                    <Prop key={j} prop={p} position={[cell.x * 2, 0, cell.z * 2]} />
                ))}
            </group>
        );
      })}
    </group>
  );
}

