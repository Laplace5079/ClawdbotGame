import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Player } from './components/Player';
import { Ground } from './components/Ground';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const setTargetPos = useStore((state) => state.setTargetPos);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} castShadow />
        
        <Physics debug>
          <Player />
          <Ground onMove={setTargetPos} />
        </Physics>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
