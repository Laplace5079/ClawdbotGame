import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

const BackgroundScene = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.5} opacity={0.5} color="#800" />
      
      {/* Background Pillars or shapes to give depth */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 40, -10, (Math.random() - 0.5) * 40]}>
          <boxGeometry args={[2, 20, 2]} />
          <meshStandardMaterial color="#050505" roughness={1} />
        </mesh>
      ))}

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={50} color="#800" />
      <fog attach="fog" args={['#000', 10, 30]} />
    </group>
  );
};

export const SplashScreen: React.FC = () => {
  const setGameState = useStore((state) => state.setGameState);
  const loadGame = useStore((state) => state.loadGame);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleLoad = () => {
    loadGame();
    setGameState('playing');
  };

  return (
    <div className="splash-container">
      <div className="canvas-bg">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={40} />
          <BackgroundScene />
        </Canvas>
      </div>

      <div className="splash-overlay">
        <div className="content">
          <h1 className="main-title">ABYSS</h1>
          <div className="divider" />
          <p className="subtitle">ETERNAL DESCENT</p>
          
          <div className="button-list">
            <button className="aaa-button primary" onClick={handleStart}>
              <span className="btn-text">Begin Journey</span>
              <div className="btn-glow" />
            </button>
            <button className="aaa-button secondary" onClick={handleLoad}>
              <span className="btn-text">Load Memory</span>
            </button>
          </div>
        </div>

        <div className="footer" style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          color: '#daa520', 
          fontSize: '1.2rem',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(218, 165, 32, 0.5)',
          letterSpacing: '2px'
        }}>
          PHASE 7.3 | AAA OVERHAUL
        </div>
      </div>

      <style>{`
        .splash-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: black;
          z-index: 2000;
          font-family: 'Cinzel', serif;
          overflow: hidden;
        }

        .canvas-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.6;
        }

        .splash-overlay {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%);
        }

        .content {
          text-align: center;
          animation: fadeIn 2s ease-out;
        }

        .main-title {
          font-size: clamp(4rem, 15vw, 8rem);
          margin: 0;
          color: #fff;
          letter-spacing: 1.5rem;
          text-shadow: 0 0 30px rgba(255, 0, 0, 0.4);
          font-weight: 700;
        }

        .divider {
          width: 100px;
          height: 2px;
          background: #800;
          margin: 1rem auto;
          box-shadow: 0 0 10px #800;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #aaa;
          letter-spacing: 0.8rem;
          margin-bottom: 4rem;
          text-transform: uppercase;
        }

        .button-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .aaa-button {
          position: relative;
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(128, 0, 0, 0.5);
          color: #ccc;
          padding: 1.2rem 4rem;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.2rem;
          width: 300px;
          overflow: hidden;
        }

        .aaa-button:hover {
          color: #fff;
          border-color: #f00;
          background: rgba(40, 0, 0, 0.4);
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
        }

        .aaa-button.primary {
          border-color: #800;
          background: linear-gradient(90deg, rgba(60,0,0,0.8) 0%, rgba(20,0,0,0.8) 100%);
        }

        .btn-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: 0.5s;
        }

        .aaa-button:hover .btn-glow {
          left: 100%;
        }

        .footer {
          position: absolute;
          bottom: 2rem;
          color: #444;
          font-size: 0.8rem;
          letter-spacing: 0.1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .main-title { letter-spacing: 0.5rem; }
          .aaa-button { width: 80vw; }
        }
      `}</style>
      
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet" />
    </div>
  );
};
