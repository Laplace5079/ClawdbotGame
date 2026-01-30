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

  const saveGame = useStore((state) => state.saveGame);
  const loadGame = useStore((state) => state.loadGame);
  const level = useStore((state) => state.level);
  const exp = useStore((state) => state.experience);

  const mockEnemySpawn = () => {
    const id = Math.random().toString();
    const isBoss = Math.random() > 0.8;
    spawnEnemy({
      id,
      position: [(Math.random() - 0.5) * 20, 1, (Math.random() - 0.5) * 20],
      hp: isBoss ? 500 : 50,
      maxHp: isBoss ? 500 : 50,
      isBoss
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <InventoryUI />
      
      {/* HUD Info */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        zIndex: 10,
        fontFamily: 'monospace',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px'
      }}>
        LEVEL: {level}<br/>
        EXP: {exp} / {level * 100}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        <button 
          onClick={mockEnemySpawn}
          style={{
            padding: '10px 20px',
            backgroundColor: '#800',
            color: 'white',
            border: '2px solid #daa520',
            cursor: 'pointer',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}
        >
          Spawn Enemy
        </button>

        <button 
          onClick={saveGame}
          style={{
            padding: '10px 20px',
            backgroundColor: '#222',
            color: 'white',
            border: '1px solid #666',
            cursor: 'pointer'
          }}
        >
          Save
        </button>

        <button 
          onClick={loadGame}
          style={{
            padding: '10px 20px',
            backgroundColor: '#222',
            color: 'white',
            border: '1px solid #666',
            cursor: 'pointer'
          }}
        >
          Load
        </button>
      </div>

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
