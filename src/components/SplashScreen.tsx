import React from 'react';
import { useStore } from '../store/useStore';

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
    <div className="splash-screen">
      <div className="splash-content">
        <h1 className="title">PROJECT ABYSS</h1>
        <p className="subtitle">Descending into the dark...</p>
        
        <div className="button-group">
          <button className="menu-button start" onClick={handleStart}>
            Start Journey
          </button>
          <button className="menu-button" onClick={handleLoad}>
            Continue
          </button>
        </div>
      </div>

      <style>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle, #1a0a0a 0%, #050505 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          color: white;
          font-family: 'Cinzel', serif;
        }

        .splash-content {
          text-align: center;
          padding: 2rem;
          border: 1px solid rgba(218, 165, 32, 0.2);
          background: rgba(0, 0, 0, 0.8);
          box-shadow: 0 0 50px rgba(0, 0, 0, 1);
        }

        .title {
          font-size: clamp(3rem, 10vw, 5rem);
          margin-bottom: 0.5rem;
          letter-spacing: 0.5rem;
          color: #800;
          text-shadow: 0 0 20px rgba(128, 0, 0, 0.5), 2px 2px 2px black;
        }

        .subtitle {
          font-style: italic;
          color: #888;
          margin-bottom: 3rem;
          letter-spacing: 0.2rem;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .menu-button {
          background: #111;
          color: #aaa;
          border: 1px solid #444;
          padding: 1rem 3rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 250px;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
        }

        .menu-button:hover {
          color: #daa520;
          border-color: #daa520;
          background: #1a1a1a;
          box-shadow: 0 0 15px rgba(218, 165, 32, 0.3);
          transform: translateY(-2px);
        }

        .menu-button.start {
          background: #300;
          border-color: #800;
          color: #fff;
        }

        .menu-button.start:hover {
          background: #500;
          border-color: #a00;
        }

        @media (max-width: 600px) {
          .menu-button {
            width: 80vw;
          }
        }
      `}</style>
      
      {/* Import Gothic font if not available */}
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet" />
    </div>
  );
};
