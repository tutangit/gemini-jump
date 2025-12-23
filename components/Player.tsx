
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

interface PlayerProps {
  onGameOver: () => void;
  onUpdateScore: (y: number) => void;
}

const Player: React.FC<PlayerProps> = ({ onGameOver, onUpdateScore }) => {
  const { camera } = useThree();
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard();
  
  // Ref para rastrear se o jogador está no chão baseado na velocidade vertical
  const isGrounded = useRef(false);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [0.5],
    fixedRotation: true,
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      velocity.current = v;
      // Consideramos "no chão" se a velocidade vertical for quase zero
      // Isso impede pulos duplos no ar
      isGrounded.current = Math.abs(v[1]) < 0.01;
    });
    return unsubscribe;
  }, [api.velocity]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => (pos.current = p));
    return unsubscribe;
  }, [api.position]);

  useFrame(() => {
    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, Number(moveBackward) - Number(moveForward));
    const sideVector = new Vector3(Number(moveLeft) - Number(moveRight), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(10) // Velocidade aumentada de 5 para 10
      .applyEuler(camera.rotation);

    // Mantemos a velocidade Y atual para não interferir na gravidade/pulo
    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // Pulo: só permite se estiver no chão (isGrounded)
    if (jump && isGrounded.current) {
      api.velocity.set(velocity.current[0], 7, velocity.current[2]);
      isGrounded.current = false; // Evita disparo contínuo no mesmo frame
    }

    // Suavização da câmera para seguir o jogador
    const targetCameraPos = new Vector3(pos.current[0], pos.current[1] + 3, pos.current[2] + 7);
    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(new Vector3(pos.current[0], pos.current[1], pos.current[2]));

    // Verificação de queda
    if (pos.current[1] < -5) {
      onGameOver();
    }

    onUpdateScore(pos.current[1]);
  });

  return (
    <mesh ref={ref as any} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        emissive="#60a5fa" 
        emissiveIntensity={0.8} 
        roughness={0.2}
      />
    </mesh>
  );
};

export default Player;
