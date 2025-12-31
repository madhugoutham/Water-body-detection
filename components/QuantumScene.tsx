/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, Sphere, MeshDistortMaterial, Line, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing JSX types in some environments
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

const WaterSurface = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
        mesh.current.rotation.x = -Math.PI / 2;
        mesh.current.position.y = -2;
        // Simple undulation
        const t = state.clock.getElapsedTime();
        mesh.current.position.z = Math.sin(t * 0.2) * 0.5;
    }
  });

  return (
    <mesh ref={mesh} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <meshStandardMaterial 
        color="#0ea5e9"
        wireframe
        transparent
        opacity={0.3}
        emissive="#0ea5e9"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const SatellitePoints = ({ count = 200 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 3 + Math.random() * 0.5;
            p[i*3] = r * Math.sin(phi) * Math.cos(theta);
            p[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            p[i*3+2] = r * Math.cos(phi);
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if(ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    })

    return (
        <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#38bdf8"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    )
}

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <fog attach="fog" args={['#0f172a', 5, 15]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#38bdf8" />
        
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Sphere args={[2.5, 64, 64]} position={[0, 0, 0]}>
             <MeshDistortMaterial
                color="#0284c7"
                envMapIntensity={1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                metalness={0.8}
                distort={0.3}
                speed={1.5}
                roughness={0.2}
             />
          </Sphere>
        </Float>
        
        <SatellitePoints />
        <WaterSurface />

        <Environment preset="night" />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export const SatelliteScene: React.FC = () => {
    // Placeholder for a scene used in other sections if needed
  return (
    <div className="w-full h-full absolute inset-0">
        {/* Simplified scene or different view */}
    </div>
  );
}