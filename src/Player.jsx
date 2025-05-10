import { useRapier, RigidBody } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { useRef, useEffect, useState } from "react"
import * as THREE from 'three'
import useGame from "./stores/useGame"

const Player = () => {
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const ballRef = useRef()
    const { rapier, world } = useRapier()
    const rapierWord = world.raw()
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
    const start = useGame(state => state.start)
    const end = useGame(state => state.end)
    const restart = useGame(state => state.restart)
    const blocksCount = useGame(state => state.blocksCount)
    const phase = useGame(state => state.phase)

    const jump = () => {
        // console.log(ballRef.current.translation())
        // const height = ballRef.current.translation().y
        // if(height && height - 0.3 <= 0.1) ballRef.current.applyImpulse({ x:0, y:0.5, z:0 })
        const origin = ballRef.current.translation()
        origin.y -= 0.31
        const direction = { x:0, y:-1, z:0  }
        const ray = new rapier.Ray(origin, direction)
        const hit = rapierWord.castRay(ray, 10, true) 

        if(hit.toi < 0.15) ballRef.current.applyImpulse({ x:0, y:0.5, z:0 })
    }

    const reset = () => {
        ballRef.current.setTranslation({ x:0, y:1, z:0 })
        ballRef.current.setLinvel({x:0, y:0, z:0})
        ballRef.current.setAngvel({x:0, y:0, z:0})
    }

    useEffect(() =>{
        if (phase === 'ready'){
            reset()
        }
    }, [phase])

    useEffect(()=>{
        const unsubscribeJump = subscribeKeys(
            (state)=> state.jump,
            (isPressed)=>{
                if(isPressed) jump()
            }
        )

        const unsubscribeKeys = subscribeKeys(
            () => {
                start()
            }
        )

        return ()=>{
            unsubscribeJump()
            unsubscribeKeys()
        }
    },[])

    useFrame((state, delta)=>{
        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta

        if (forward){
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        if (rightward){
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }
        if (backward){
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
        if (leftward){
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
        
        ballRef.current.applyImpulse(impulse)
        ballRef.current.applyTorqueImpulse(torque)
        // console.log(forward, backward, leftward, rightward)

        /**
         * camera
         */

        const ballPositioon = ballRef.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(ballPositioon)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.25

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(ballPositioon)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        if(ballPositioon.z < -(blocksCount * 4 + 2)) end()

        if(ballPositioon.y < -4) restart()
        
    })

    return (
        <RigidBody ref={ballRef} linearDamping={0.5} angularDamping={0.5} colliders='ball' restitution={0.2} friction={1} position={[0,1,0]}>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color={"mediumpurple"} />
            </mesh>
        </RigidBody>
    )
}

export default Player