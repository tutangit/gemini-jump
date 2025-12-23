
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Sky, Stars, Environment, ContactShadows } from '@react-three/drei';
import Player from './Player';
import Platform from './Platform';
import { PlatformData } from '../types';

interface GameSceneProps {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

const GameScene: React.FC<GameSceneProps> = ({ onGameOver, onScoreUpdate }) => {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [maxScore, setMaxScore] = useState(0);

  // Initial platforms
  useEffect(() => {
    const initialPlatforms: PlatformData[] = [
      { id: 'start', position: [0, 0, 0], size: [5, 0.5, 5], color: '#4ade80' }
    ];

    // Generate path
    let lastPos = { x: 0, y: 0, z: 0 };
    for (let i = 1; i <= 50; i++) {
      const offsetX = (Math.random() - 0.5) * 6;
      const offsetY = 1.5 + Math.random() * 1.5;
      const offsetZ = -(3 + Math.random() * 3);
      
      lastPos = {
        x: lastPos.x + offsetX,
        y: lastPos.y + offsetY,
        z: lastPos.z + offsetZ
      };

      initialPlatforms.push({
        id: `plat-${i}`,
        position: [lastPos.x, lastPos.y, lastPos.z],
        size: [3 - (i * 0.02), 0.4, 3 - (i * 0.02)],
        color: `hsl(${200 + i * 5}, 70%, 50%)`
      });
    }
    setPlatforms(initialPlatforms);
  }, []);

  const handleUpdateScore = (y: number) => {
    const score = Math.max(0, Math.floor(y * 10));
    if (score > maxScore) {
      setMaxScore(score);
      onScoreUpdate(score);
    }
  };

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <Environment preset="city" />

      <Physics gravity={[0, -15, 0]}>
        <Player 
          onGameOver={() => onGameOver(maxScore)} 
          onUpdateScore={handleUpdateScore} 
        />
        {platforms.map((plat) => (
          <Platform 
            key={plat.id} 
            position={plat.position} 
            size={plat.size} 
            color={plat.color} 
          />
        ))}
      </Physics>
      
      <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={100} blur={2.5} far={40} />
    </Canvas>
  );
};

export default GameScene;
