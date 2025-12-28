import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect } from 'react'

function FloatingParticles() {
  const points = useRef<THREE.Points>(null!)
  const particleCount = 2000
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      
      // Color (blue to purple gradient)
      colors[i * 3] = 0.3 + Math.random() * 0.7     // R
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3 // G  
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.02
      points.current.rotation.y = state.clock.elapsedTime * 0.01
      points.current.rotation.z = state.clock.elapsedTime * 0.005
      
      // Animate particle positions
      const positions = points.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
        positions[i * 3] += Math.cos(state.clock.elapsedTime + i) * 0.0005
      }
      points.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={points} positions={particlesPosition.positions} colors={particlesPosition.colors}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlesPosition.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particlesPosition.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function AIConnections() {
  const linesRef = useRef<THREE.Group>(null!)
  
  const connections = useMemo(() => {
    const lines = []
    const connectionCount = 50
    
    for (let i = 0; i < connectionCount; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      )
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      )
      lines.push({ start, end })
    }
    
    return lines
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.x = state.clock.elapsedTime * 0.01
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.005
    }
  })

  return (
    <group ref={linesRef}>
      {connections.map((connection, index) => {
        const points = [connection.start, connection.end]
        return (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  connection.start.x, connection.start.y, connection.start.z,
                  connection.end.x, connection.end.y, connection.end.z
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#60a5fa"
              transparent
              opacity={0.3}
            />
          </line>
        )
      })}
    </group>
  )
}

function FloatingAISpheres() {
  const spheresRef = useRef<THREE.Group>(null!)
  const sphereCount = 20
  
  const spheres = useMemo(() => {
    const sphereData = []
    for (let i = 0; i < sphereCount; i++) {
      sphereData.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        ] as [number, number, number],
        color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
        size: 0.2 + Math.random() * 0.5
      })
    }
    return sphereData
  }, [])

  useFrame((state) => {
    if (spheresRef.current) {
      spheresRef.current.rotation.x = state.clock.elapsedTime * 0.005
      spheresRef.current.rotation.y = state.clock.elapsedTime * 0.003
      
      // Animate individual spheres
      spheresRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01
          child.rotation.x = state.clock.elapsedTime * 0.5 + index
          child.rotation.y = state.clock.elapsedTime * 0.3 + index
        }
      })
    }
  })

  return (
    <group ref={spheresRef}>
      {spheres.map((sphere, index) => (
        <mesh key={index} position={sphere.position}>
          <sphereGeometry args={[sphere.size, 16, 16]} />
          <meshStandardMaterial
            color={sphere.color}
            emissive={sphere.color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

export function ParticleSystem({ powerSaving = false }: { powerSaving?: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
        
        {/* Reduce scene complexity in power saving mode */}
        <FloatingParticles />
        {!powerSaving && <AIConnections />}
        {!powerSaving && <FloatingAISpheres />}
        
        {/* Mouse-following light */}
        <pointLight
          position={[mousePosition.x * 10, mousePosition.y * 10, 5]}
          intensity={0.8}
          color="#ffffff"
          distance={20}
        />
      </Canvas>
    </div>
  )
}
