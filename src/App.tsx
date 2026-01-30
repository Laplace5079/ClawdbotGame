import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Player } from './components/Player';
import { Ground } from './components/Ground';
import { InventoryUI } from './components/InventoryUI';
import { LootLabels } from './components/LootLabels';
import { useStore } from './store/useStore';
import './App.css';

import { Dungeon } from './components/Dungeon';
import { Enemy } from './components/Enemy';

function App() {
  const setTargetPos = useStore((state) => state.setTargetPos);
  const spawnEnemy = useStore((state) => state.spawnEnemy);
  const enemies = useStore((state) => state.enemies);

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
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} castShadow />
        
        <Physics debug>
          <Player />
          <Dungeon />
          {enemies.map(enemy => (
            <Enemy key={enemy.id} id={enemy.id} initialPosition={enemy.position} />
          ))}
          {/* Keep ground for movement raycasting */}
          <Ground onMove={setTargetPos} />
        </Physics>

        <LootLabels />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
