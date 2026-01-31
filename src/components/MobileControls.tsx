import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export function MobileControls() {
  const setTargetPos = useStore((state) => state.setTargetPos);
  const playerPos = useStore((state) => state.playerPos);
  const enemies = useStore((state) => state.enemies);
  const damageEnemy = useStore((state) => state.damageEnemy);
  const addVFX = useStore((state) => state.addVFX);
  const hp = useStore((state) => state.hp);
  const maxHp = useStore((state) => state.maxHp);
  const mp = useStore((state) => 100); // Placeholder for MP

  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsJoystickActive(true);
    setJoystickPos({ x: clientX, y: clientY });
    setKnobPos({ x: 0, y: 0 });
  };

  const handleJoystickMove = (e: TouchEvent | MouseEvent) => {
    if (!isJoystickActive) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - joystickPos.x;
    const dy = clientY - joystickPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 50;

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxDist);
    
    const nx = Math.cos(angle) * clampedDist;
    const ny = Math.sin(angle) * clampedDist;

    setKnobPos({ x: nx, y: ny });

    const moveDir = new THREE.Vector3(nx / maxDist, 0, ny / maxDist);
    const worldTarget = [
      playerPos[0] + moveDir.x * 5,
      playerPos[1],
      playerPos[2] + moveDir.z * 5
    ] as [number, number, number];
    
    setTargetPos(worldTarget);
  };

  const handleJoystickEnd = () => {
    setIsJoystickActive(false);
    setKnobPos({ x: 0, y: 0 });
    setTargetPos(null);
  };

  useEffect(() => {
    const opts = { passive: false };
    if (isJoystickActive) {
      window.addEventListener('touchmove', handleJoystickMove, opts);
      window.addEventListener('touchend', handleJoystickEnd);
      window.addEventListener('mousemove', handleJoystickMove);
      window.addEventListener('mouseup', handleJoystickEnd);
    }
    return () => {
      window.removeEventListener('touchmove', handleJoystickMove);
      window.removeEventListener('touchend', handleJoystickEnd);
      window.removeEventListener('mousemove', handleJoystickMove);
      window.removeEventListener('mouseup', handleJoystickEnd);
    };
  }, [isJoystickActive, joystickPos]);

  const setAttacking = useStore((state) => state.setAttacking);

  const handleAttack = () => {
    setAttacking(true);
    setTimeout(() => setAttacking(false), 300);

    const range = 4;
    enemies.forEach(enemy => {
      const dist = Math.sqrt(
        Math.pow(enemy.position[0] - playerPos[0], 2) +
        Math.pow(enemy.position[2] - playerPos[2], 2)
      );
      if (dist < range) {
        damageEnemy(enemy.id, 25);
        addVFX('impact', enemy.position);
      }
    });
  };

  return (
    <div className="mobile-ui-container">
      {/* HUD: Health & Mana Globes (AAA Style) */}
      <div className="globe hp-globe">
        <div className="globe-fill" style={{ height: `${(hp / maxHp) * 100}%` }} />
        <div className="globe-overlay" />
        <span className="globe-value">{Math.round(hp)}</span>
      </div>

      <div className="globe mp-globe">
        <div className="globe-fill" style={{ height: '80%' }} />
        <div className="globe-overlay" />
        <span className="globe-value">100</span>
      </div>

      {/* Joystick */}
      <div 
        className="joystick-base"
        onMouseDown={handleJoystickStart}
        onTouchStart={handleJoystickStart}
      >
        <div 
          className="joystick-knob"
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="action-group">
        <button className="action-btn attack-btn" onClick={handleAttack}>
          <div className="btn-inner">ATK</div>
        </button>
        <button className="action-btn skill-btn">
          <div className="btn-inner">SKILL</div>
        </button>
      </div>

      <style>{`
        .mobile-ui-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1000;
          font-family: 'Cinzel', serif;
        }

        .globe {
          position: absolute;
          bottom: 20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #111;
          border: 2px solid #daa520;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hp-globe { left: 20px; border-color: #800; }
        .mp-globe { left: 110px; border-color: #008; }

        .globe-fill {
          position: absolute;
          bottom: 0;
          width: 100%;
          transition: height 0.3s ease-out;
        }

        .hp-globe .globe-fill {
          background: linear-gradient(0deg, #400 0%, #a00 100%);
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
        }

        .mp-globe .globe-fill {
          background: linear-gradient(0deg, #004 0%, #00a 100%);
          box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
        }

        .globe-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%);
          pointer-events: none;
        }

        .globe-value {
          position: relative;
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
          text-shadow: 0 0 5px black;
        }

        .joystick-base {
          position: absolute;
          bottom: 40px;
          right: 140px;
          width: 120px;
          height: 120px;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
        }

        .joystick-knob {
          width: 50px;
          height: 50px;
          background: radial-gradient(circle at center, #666 0%, #222 100%);
          border: 2px solid #444;
          border-radius: 50%;
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }

        .action-group {
          position: absolute;
          bottom: 40px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          pointer-events: auto;
        }

        .action-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #111;
          border: 2px solid #daa520;
          padding: 0;
          cursor: pointer;
          transition: transform 0.1s;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }

        .action-btn:active {
          transform: scale(0.9);
        }

        .attack-btn {
          border-color: #800;
          background: linear-gradient(135deg, #300 0%, #111 100%);
        }

        .btn-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .attack-btn .btn-inner { color: #fff; }

        @media (min-width: 1024px) {
          .mobile-ui-container { display: none; }
        }
      `}</style>
    </div>
  );
}
