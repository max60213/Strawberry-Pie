import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

function CameraControl() {
  const { camera, gl } = useThree()
  camera.position.y = 1
  camera.position.z = 0

  const lastTouchY = useRef(null)
  const velocity = useRef(0) // Track the vertical movement speed
  const damping = 0.95       // How quickly the movement slows down after release

  useEffect(() => {
    const handleWheel = (event) => {
      // Mouse wheel zoom
      camera.position.z += event.deltaY * 0.01
    }

    const handleTouchStart = (event) => {
      if (event.touches.length === 1) {
        lastTouchY.current = event.touches[0].clientY
        velocity.current = 0 // Reset velocity on new touch
      }
    }

    const handleTouchMove = (event) => {
      if (event.touches.length === 1 && lastTouchY.current != null) {
        event.preventDefault() // Prevent default scrolling
        const currentY = event.touches[0].clientY
        const deltaY = currentY - lastTouchY.current
        // Adjust direction and sensitivity as desired
        velocity.current = deltaY * -0.05
        camera.position.z += velocity.current
        lastTouchY.current = currentY
      }
    }

    const handleTouchEnd = () => {
      lastTouchY.current = null
      // Now the camera will continue to move based on velocity in useFrame
    }

    const canvas = gl.domElement
    canvas.addEventListener('wheel', handleWheel, { passive: true })
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [camera, gl.domElement])

  useFrame(() => {
    // If no touch is active, let inertia carry on
    if (lastTouchY.current == null && Math.abs(velocity.current) > 0.0001) {
      camera.position.z += velocity.current
      // Apply damping to slow down the movement over time
      velocity.current *= damping
    }
  })

  return null
}

export default CameraControl