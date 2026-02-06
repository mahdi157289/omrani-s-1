import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import LanternModel from './LanternModel';

const LanternCanvas = () => {
  return (
    <div className="h-full w-full absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <LanternModel position={[0, 0.5, 0]} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default LanternCanvas;
