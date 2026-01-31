import React from 'react';
import { useStore } from '../store/useStore';

export const LevelClearUI: React.FC = () => {
  const dungeonLevel = useStore((state) => state.dungeonLevel);
  const incrementDungeonLevel = useStore((state) => state.incrementDungeonLevel);
  const resetDungeon = useStore((state) => state.resetDungeon);
  const setGameState = useStore((state) => state.setGameState);
  const enemiesDefeated = useStore((state) => state.enemiesDefeated);

  const handleNextLevel = () => {
    incrementDungeonLevel();
    resetDungeon();
    setGameState('playing');
  };

  return (
    <div className="clear-screen">
      <div className="clear-content">
        <h2 className="title">DUNGEON CLEARED</h2>
        <div className="stats">
          <p>Dungeon Level: {dungeonLevel}</p>
          <p>Enemies Slain: {enemiesDefeated}</p>
        </div>
        
        <button className="next-button" onClick={handleNextLevel}>
          Descend Deeper
        </button>
      </div>

      <style>{`
        .clear-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 900;
          color: white;
          font-family: 'Cinzel', serif;
          backdrop-filter: blur(5px);
        }

        .clear-content {
          text-align: center;
          padding: 3rem;
          border: 2px solid #daa520;
          background: #0a0a0a;
          box-shadow: 0 0 30px rgba(218, 165, 32, 0.4);
        }

        .title {
          font-size: 2.5rem;
          color: #daa520;
          margin-bottom: 2rem;
          text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
        }

        .stats {
          margin-bottom: 2.5rem;
          font-size: 1.2rem;
          color: #ccc;
          line-height: 2;
        }

        .next-button {
          background: #800;
          color: white;
          border: 1px solid #daa520;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .next-button:hover {
          background: #a00;
          box-shadow: 0 0 20px rgba(128, 0, 0, 0.6);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};
