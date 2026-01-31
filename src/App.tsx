import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Player } from './components/Player';
import { Ground } from './components/Ground';
import { InventoryUI } from './components/InventoryUI';
import { LootLabels } from './components/LootLabels';
import { Effects } from './components/Effects';
import { ImpactVFX } from './components/VFX';
import { MobileControls } from './components/MobileControls';
import { useStore } from './store/useStore';
import './App.css';

import { Dungeon } from './components/Dungeon';
import { Enemy } from './components/Enemy';

import { SplashScreen } from './components/SplashScreen';
import { LevelClearUI } from './components/LevelClearUI';
import { ExitPortal } from './components/ExitPortal';

function App() {
  const gameState = useStore((state) => state.gameState);
  const setTargetPos = useStore((state) => state.setTargetPos);
  const spawnEnemy = useStore((state) => state.spawnEnemy);
  const enemies = useStore((state) => state.enemies);
  const vfx = useStore((state) => state.vfx);
  const removeVFX = useStore((state) => state.removeVFX);

  const saveGame = useStore((state) => state.saveGame);
  const loadGame = useStore((state) => state.loadGame);
  const level = useStore((state) => state.level);
  const exp = useStore((state) => state.experience);
  const dungeonLevel = useStore((state) => state.dungeonLevel);
  const enemiesDefeated = useStore((state) => state.enemiesDefeated);
  const totalEnemies = useStore((state) => state.totalEnemiesInLevel);
  const setTotalEnemies = useStore((state) => state.setTotalEnemies);

  // Logic to spawn portal when all enemies are defeated
  const allEnemiesDefeated = totalEnemies > 0 && enemiesDefeated >= totalEnemies && enemies.length === 0;

  const mockEnemySpawn = () => {
    const id = Math.random().toString();
    const isBoss = Math.random() > 0.8;
    spawnEnemy({
      id,
      position: [(Math.random() - 0.5) * 20, 1, (Math.random() - 0.5) * 20],
      hp: (isBoss ? 500 : 50) * (1 + (dungeonLevel - 1) * 0.5), // Scale HP with dungeon level
      maxHp: (isBoss ? 500 : 50) * (1 + (dungeonLevel - 1) * 0.5),
      isBoss
    });
    setTotalEnemies(totalEnemies + 1);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      {gameState === 'start' && <SplashScreen />}
      {gameState === 'cleared' && <LevelClearUI />}
      
      <InventoryUI />
      {gameState === 'playing' && <MobileControls />}
      
      {/* HUD Info */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        zIndex: 10,
        fontFamily: 'monospace',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderLeft: '4px solid #800'
      }}>
        LEVEL: {level}<br/>
        EXP: {exp} / {level * 100}<br/>
        DUNGEON: {dungeonLevel}<br/>
        ENEMIES: {enemiesDefeated} / {totalEnemies}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10,
        flexWrap: 'wrap',
        justifyContent: 'center'
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
        <fog attach="fog" args={['#050505', 5, 40]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        
        <Physics debug={false}>
          {gameState === 'playing' && (
            <>
              <Player />
              <Dungeon />
              {enemies.map(enemy => (
                <Enemy key={enemy.id} id={enemy.id} initialPosition={enemy.position} />
              ))}
              {allEnemiesDefeated && <ExitPortal />}
            </>
          )}
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
