import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Noise } from 'noisejs'; // Import Perlin Noise library

const PointCloud = () => {
  const noise = new Noise(Math.random()); // Create a new Noise instance

  const generatePerlinNoise = (x, y) => {
    return noise.perlin2(x * 0.07, y * 0.06) * 10; // Use Perlin noise for z values
  };

  const points = useMemo(() => {
    const numPoints = 640 * 640;
    const positions = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints; i++) {
      const x = (i % 640) - 320;
      const y = Math.floor(i / 640) - 320;
      const z = generatePerlinNoise(x, y); // Apply Perlin noise to z values
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(points, 3));
    return geom;
  }, [points]);

  const material = useMemo(() => new THREE.PointsMaterial({ size: 0.01, color: 0x888888 }), []);

  return <points geometry={geometry} material={material} />;
};

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 500], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <PointCloud />
      <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} />
    </Canvas>
  );
};

export default App;
