'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  
  const [sphere, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3)
    const colors = new Float32Array(5000 * 3)
    
    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3
      const radius = Math.random() * 50 + 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // Gradient colors from blue to purple to pink
      const color = new THREE.Color()
      color.setHSL(0.6 + Math.random() * 0.3, 0.8, 0.5 + Math.random() * 0.3)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [])
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20
      ref.current.rotation.y -= delta / 30
      ref.current.rotation.z -= delta / 40
    }
  })
  
  return (
    <group>
      <Points ref={ref} positions={sphere} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function FloatingOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null!)
  const orb2Ref = useRef<THREE.Mesh>(null!)
  const orb3Ref = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(time * 0.5) * 8
      orb1Ref.current.position.y = Math.cos(time * 0.3) * 6
      orb1Ref.current.position.z = Math.sin(time * 0.7) * 4
      orb1Ref.current.rotation.x = time * 0.2
      orb1Ref.current.rotation.y = time * 0.3
    }
    
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(time * 0.4) * 10
      orb2Ref.current.position.y = Math.sin(time * 0.6) * 8
      orb2Ref.current.position.z = Math.cos(time * 0.8) * 6
      orb2Ref.current.rotation.x = time * 0.15
      orb2Ref.current.rotation.z = time * 0.25
    }
    
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(time * 0.3) * 12
      orb3Ref.current.position.y = Math.cos(time * 0.5) * 10
      orb3Ref.current.position.z = Math.sin(time * 0.9) * 8
      orb3Ref.current.rotation.y = time * 0.2
      orb3Ref.current.rotation.z = time * 0.4
    }
  })
  
  return (
    <group>
      <mesh ref={orb1Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      <mesh ref={orb2Ref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      <mesh ref={orb3Ref}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#ec4899"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.7}
        />
      </mesh>
    </group>
  )
}

function EnergyWaves() {
  const wave1Ref = useRef<THREE.Mesh>(null!)
  const wave2Ref = useRef<THREE.Mesh>(null!)
  const wave3Ref = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (wave1Ref.current) {
      wave1Ref.current.rotation.z = time * 0.5
      wave1Ref.current.position.z = Math.sin(time * 0.8) * 2
    }
    
    if (wave2Ref.current) {
      wave2Ref.current.rotation.z = time * 0.3 + Math.PI / 3
      wave2Ref.current.position.z = Math.cos(time * 0.6) * 3
    }
    
    if (wave3Ref.current) {
      wave3Ref.current.rotation.z = time * 0.7 + (2 * Math.PI) / 3
      wave3Ref.current.position.z = Math.sin(time * 0.4) * 4
    }
  })
  
  return (
    <group>
      <mesh ref={wave1Ref} position={[0, 0, -10]}>
        <ringGeometry args={[15, 16, 64]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh ref={wave2Ref} position={[0, 0, -15]}>
        <ringGeometry args={[20, 21, 64]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh ref={wave3Ref} position={[0, 0, -20]}>
        <ringGeometry args={[25, 26, 64]} />
        <meshStandardMaterial
          color="#ec4899"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
        <pointLight position={[0, 10, -10]} intensity={0.4} color="#ec4899" />
        
        <ParticleField />
        <FloatingOrbs />
        <EnergyWaves />
      </Canvas>
    </div>
  )
}