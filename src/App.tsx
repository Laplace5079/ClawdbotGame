import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Player } from './components/Player';
import { Ground } from './components/Ground';
import { InventoryUI } from './components/InventoryUI';
import { LootLabels } from './components/LootLabels';
import { Effects } from './components/Effects';
import { ImpactVFX } from './components/VFX';
import { useStore } from './store/useStore';
import './App.css';

import { Dungeon } from './components/Dungeon';
import { Enemy } from './components/Enemy';

function App() {
  const setTargetPos = useStore((state) => state.setTargetPos);
  const spawnEnemy = useStore((state) => state.spawnEnemy);
  const enemies = useStore((state) => state.enemies);
  const vfx = useStore((state) => state.vfx);
  const removeVFX = useStore((state) => state.removeVFX);

  const mockEnemySpawn = () => {
    const id = Math.random().toString();
    spawnEnemy({
      id,
      position: [(Math.random() - 0.5) * 20, 1, (Math.random() - 0.5) * 20],
      hp: 50,
      maxHp: 50,
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <InventoryUI />
      
      <button 
        onClick={mockEnemySpawn}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          backgroundColor: '#800',
          color: 'white',
          border: '2px solid #daa520',
          cursor: 'pointer',
          zIndex: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        Spawn Enemy
      </button>

      <Canvas shadows camera={{ position: [15, 15, 15], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 50]} />
        <ambientLight intensity={0.1} />
        
        <Physics debug={false}>
          <Player />
          <Dungeon />
          {enemies.map(enemy => (
            <Enemy key={enemy.id} id={enemy.id} initialPosition={enemy.position} />
          ))}
          {/* Keep ground for movement raycasting */}
          <Ground onMove={setTargetPos} />
        </Physics>

        {vfx.map(v => (
          <ImpactVFX 
            key={v.id} 
            position={v.position} 
            onComplete={() => removeVFX(v.id)} 
          />
        ))}

        <Effects />
        <LootLabels />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
