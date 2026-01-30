import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Player } from './components/Player';
import { Ground } from './components/Ground';
import { InventoryUI } from './components/InventoryUI';
import { LootLabels } from './components/LootLabels';
import { useStore } from './store/useStore';
import { generateItem } from './systems/itemGenerator';
import './App.css';

function App() {
  const setTargetPos = useStore((state) => state.setTargetPos);
  const dropItem = useStore((state) => state.dropItem);

  const mockEnemyDeath = () => {
    const newItem = generateItem(1);
    const randomPos: [number, number, number] = [
      (Math.random() - 0.5) * 10,
      0.5,
      (Math.random() - 0.5) * 10
    ];
    dropItem(newItem, randomPos);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <InventoryUI />
      
      <button 
        onClick={mockEnemyDeath}
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
        Mock Enemy Kill (Drop Loot)
      </button>

      <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} castShadow />
        
        <Physics debug>
          <Player />
          <Ground onMove={setTargetPos} />
        </Physics>

        <LootLabels />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
