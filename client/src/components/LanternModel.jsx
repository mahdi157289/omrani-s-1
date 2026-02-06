import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Octahedron } from '@react-three/drei';

const LanternModel = (props) => {
  const group = useRef();
  
  // Rotate the lantern slowly
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) * 0.2;
    group.current.rotation.x = Math.sin(t / 2) * 0.05;
    group.current.position.y = Math.sin(t) * 0.1;
  });

  return (
    <group ref={group} {...props}>
      {/* Lantern Body (Glass/Paper) */}
      <Cylinder args={[0.8, 0.6, 1.5, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" transparent opacity={0.8} emissive="#f59e0b" emissiveIntensity={0.5} />
      </Cylinder>
      
      {/* Top Cap */}
      <Cylinder args={[0.2, 0.9, 0.3, 8]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </Cylinder>
      
      {/* Bottom Cap */}
      <Cylinder args={[0.7, 0.5, 0.2, 8]} position={[0, -0.85, 0]}>
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </Cylinder>
      
      {/* Flame/Light Source */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#fbbf24" distance={5} decay={2} />
      <Octahedron args={[0.2]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Octahedron>
    </group>
  );
};

export default LanternModel;
