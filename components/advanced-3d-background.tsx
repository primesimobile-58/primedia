'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere, Ring } from '@react-three/drei'
import * as THREE from 'three'
import { usePersonalization } from '@/hooks/use-personalization'

interface ParticleFieldProps {
  count?: number
  userId?: string
}

function ParticleField({ count = 2000, userId }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { trackClick } = usePersonalization(userId)
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Create spherical distribution
      const radius = Math.random() * 20 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      temp[i3] = radius * Math.sin(phi) * Math.cos(theta)
      temp[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      temp[i3 + 2] = radius * Math.cos(phi)
      
      // Color gradient from blue to purple to pink
      const colorProgress = i / count
      colors[i3] = 0.2 + colorProgress * 0.8     // R
      colors[i3 + 1] = 0.1 + colorProgress * 0.5 // G
      colors[i3 + 2] = 0.8 + colorProgress * 0.2 // B
      
      // Variable sizes
      sizes[i] = Math.random() * 3 + 1
    }
    
    return { positions: temp, colors, sizes }
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Gentle floating motion
        positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.01
        
        // Subtle rotation
        const x = positions[i3]
        const z = positions[i3 + 2]
        const rotationSpeed = 0.1 + (i % 3) * 0.05
        positions[i3] = x * Math.cos(rotationSpeed * 0.01) - z * Math.sin(rotationSpeed * 0.01)
        positions[i3 + 2] = x * Math.sin(rotationSpeed * 0.01) + z * Math.cos(rotationSpeed * 0.01)
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
          args={[particles.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

interface FloatingOrbProps {
  position: [number, number, number]
  color: string
  size: number
  speed: number
  userId?: string
}

function FloatingOrb({ position, color, size, speed, userId }: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { trackClick } = usePersonalization(userId)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Floating motion
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5
      meshRef.current.position.x = position[0] + Math.cos(time * speed * 0.7) * 0.3
      
      // Gentle rotation
      meshRef.current.rotation.x = time * 0.2
      meshRef.current.rotation.y = time * 0.3
      
      // Pulsing scale
      const scale = size * (1 + Math.sin(time * speed * 2) * 0.1)
      meshRef.current.scale.setScalar(scale)
    }
  })

  const handleClick = () => {
    trackClick('3D Orb', 'Floating Orb Clicked', undefined, { x: 0, y: 0 })
  }

  return (
    <Sphere
      ref={meshRef}
      args={[size, 32, 32]}
      position={position}
      onClick={handleClick}
    >
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.5}
        thickness={0.5}
      />
    </Sphere>
  )
}

interface EnergyWaveProps {
  radius: number
  color: string
  speed: number
  userId?: string
}

function EnergyWave({ radius, color, speed, userId }: EnergyWaveProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const { trackClick } = usePersonalization(userId)
  
  useFrame((state) => {
    if (ringRef.current) {
      const time = state.clock.getElapsedTime()
      
      // Rotating wave
      ringRef.current.rotation.z = time * speed
      
      // Pulsing opacity
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(time * speed * 3) * 0.2
    }
  })

  const handleClick = () => {
    trackClick('3D Energy Wave', 'Energy Wave Clicked', undefined, { x: 0, y: 0 })
  }

  return (
    <Ring
      ref={ringRef}
      args={[radius, radius + 0.1, 64]}
      onClick={handleClick}
    >
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </Ring>
  )
}

interface Advanced3DBackgroundProps {
  userId?: string
}

export default function Advanced3DBackground({ userId }: Advanced3DBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ pointerEvents: 'none' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.2} />
        
        {/* Gradient lighting */}
        <pointLight position={[-10, -10, -10]} color="#4f46e5" intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#ec4899" intensity={0.5} />
        <pointLight position={[0, 0, 5]} color="#06b6d4" intensity={0.3} />
        
        {/* Main particle field */}
        <ParticleField count={2000} userId={userId} />
        
        {/* Floating orbs */}
        <FloatingOrb 
          position={[-8, 3, -5]} 
          color="#4f46e5" 
          size={0.8} 
          speed={0.5} 
          userId={userId}
        />
        <FloatingOrb 
          position={[6, -2, -3]} 
          color="#ec4899" 
          size={0.6} 
          speed={0.7} 
          userId={userId}
        />
        <FloatingOrb 
          position={[2, 5, -8]} 
          color="#06b6d4" 
          size={1.0} 
          speed={0.4} 
          userId={userId}
        />
        <FloatingOrb 
          position={[-4, -4, -6]} 
          color="#8b5cf6" 
          size={0.7} 
          speed={0.6} 
          userId={userId}
        />
        
        {/* Energy waves */}
        <EnergyWave radius={12} color="#4f46e5" speed={0.3} userId={userId} />
        <EnergyWave radius={15} color="#ec4899" speed={0.2} userId={userId} />
        <EnergyWave radius={18} color="#06b6d4" speed={0.25} userId={userId} />
        
        {/* Background sphere for depth */}
        <Sphere args={[25, 32, 32]} position={[0, 0, -15]}>
          <meshBasicMaterial
            color="#1e1b4b"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      </Canvas>
    </div>
  )
}