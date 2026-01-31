import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export function MobileControls() {
  const setTargetPos = useStore((state) => state.setTargetPos);
  const playerPos = useStore((state) => state.playerPos);
  const enemies = useStore((state) => state.enemies);
  const damageEnemy = useStore((state) => state.damageEnemy);
  const addVFX = useStore((state) => state.addVFX);

  const joystickRef = useRef<HTMLDivElement>(null);
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

    // Update target position in world space
    // Since it's top down, we can translate joystick movement to world coordinates
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
    if (isJoystickActive) {
      window.addEventListener('touchmove', handleJoystickMove);
      window.addEventListener('touchend', handleJoystickEnd);
      window.addEventListener('mousemove', handleJoystickMove);
      window.addEventListener('mouseup', handleJoystickEnd);
    } else {
      window.removeEventListener('touchmove', handleJoystickMove);
      window.removeEventListener('touchend', handleJoystickEnd);
      window.removeEventListener('mousemove', handleJoystickMove);
      window.removeEventListener('mouseup', handleJoystickEnd);
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
    setTimeout(() => setAttacking(false), 500); // Reset after animation duration

    // Attack closest enemy in range
    const range = 3;
    let closestEnemy = null;
    let minDist = Infinity;

    enemies.forEach(enemy => {
      const dist = Math.sqrt(
        Math.pow(enemy.position[0] - playerPos[0], 2) +
        Math.pow(enemy.position[2] - playerPos[2], 2)
      );
      if (dist < range && dist < minDist) {
        minDist = dist;
        closestEnemy = enemy;
      }
    });

    if (closestEnemy) {
      damageEnemy(closestEnemy.id, 20); // Base damage
      addVFX('impact', closestEnemy.position);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 100,
      userSelect: 'none'
    }}>
      {/* Joystick Area */}
      <div 
        onMouseDown={handleJoystickStart}
        onTouchStart={handleJoystickStart}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.5)',
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: isJoystickActive ? 'none' : 'transform 0.1s'
        }} />
      </div>

      {/* Attack Button */}
      <button 
        onClick={handleAttack}
        style={{
          position: 'absolute',
          bottom: '12%',
          right: '10%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#800',
          color: 'white',
          border: '4px solid #daa520',
          fontWeight: 'bold',
          fontSize: '14px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ATTACK
      </button>
    </div>
  );
}
