import { Canvas } from '@react-three/fiber'
import './App.css'
import { useRef, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import CameraControl from './CameraControl'

const baseUrl = import.meta.env.BASE_URL

const Cube = ({ position, size, color }) => {
  const ref = useRef()
  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function App() {
  const gltf = useLoader(GLTFLoader, `${baseUrl}/GT_Scene.gltf`)

  useEffect(() => {
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          const material = child.material

          if (material && material.map) {
            material.transparent = true
            material.premultipliedAlpha = true // Ensure premultipliedAlpha is applied
            material.needsUpdate = true
          }
        }
      })

      console.log('GLTF materials updated:', gltf)
    }
  }, [gltf])

  return (
    <Canvas gl={{
        alpha: true,
        premultipliedAlpha: true, // Enable premultipliedAlpha in the WebGL context
        antialias: true,
      }}>
      <directionalLight position={[0, 0, 2]} intensity={2} />
      <ambientLight intensity={0.9} />
      <group position={[0, 0, 0]}>
        <Cube position={[1, -1, 0]} size={[1, 1, 1]} color='green' />
        <Cube position={[-1, -1, 0]} size={[1, 1, 1]} color='hotpink' />
        <Cube position={[1, 1, 0]} size={[1, 1, 1]} color='blue' />
        <Cube position={[-1, 1, 0]} size={[1, 1, 1]} color='yellow' />
      </group>
      <primitive object={gltf.scene} />
      <CameraControl />
    </Canvas>
  )
}

export default App