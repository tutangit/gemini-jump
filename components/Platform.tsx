
import React from 'react';
import { useBox } from '@react-three/cannon';
import { ThreeElements } from '@react-three/fiber';

// Fix: Use ThreeElements['mesh'] instead of MeshProps which might not be exported in this version
interface PlatformProps extends Partial<ThreeElements['mesh']> {
  size: [number, number, number];
  color: string;
}

const Platform: React.FC<PlatformProps> = ({ position, size, color }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: position as [number, number, number],
    args: size,
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
    </mesh>
  );
};

export default Platform;