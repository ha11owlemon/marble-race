import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)


const floor1Material = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0, roughness: 0 })
const floor2Material = new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0, roughness: 0 })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: '#ff0000', metalness: 0, roughness: 1 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#887777',metalness: 0, roughness: 0 })


export const BlockStart = ({ position = [0, 0, 0] }) => {
    return (
        <group position={ position }>
            <Float
                floatIntensity={0.25}
                rotationIntensity={0.25}
            >
                <Text
                    scale={0.5}
                    font='./bebas-neue-v9-latin-regular.woff'
                    maxWidth={0.25}
                    lineHeight={0.75}
                    textAlign='right'
                    position={[0.75, 0.65, 0]}
                    rotation-y={-0.25}
                >
                    Marble Race
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>
            <mesh 
                material={ floor1Material }
                geometry={ boxGeometry } 
                position={[0 ,-0.1 ,0]} 
                scale={[4, 0.2, 4]} 
                receiveShadow
            />
        </group>
    )
}

export const BlockSpinner = ({ position = [0, 0, 0] }) => {
    const obstacle = useRef()
    const [speed] = useState(()=> (Math.random() + 0.2) * (Math.random() > 0.5 ? 1 : -1))

    useFrame(({ clock })=>{
        const time = clock.getElapsedTime()

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return (
        <group position={ position }>
            <mesh 
                material={ floor2Material }
                geometry={ boxGeometry } 
                position={[0 ,-0.1 ,0]} 
                scale={[4, 0.2, 4]} 
                receiveShadow
            />
            <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                <mesh 
                    material={ obstacleMaterial  }
                    geometry={ boxGeometry } 
                    position={[0 ,-0.1 ,0]} 
                    scale={[3.5, 0.3, 0.5]} 
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    )
}

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
    const obstacle = useRef()
    const [timeOffset] = useState(()=> Math.random() * Math.PI * 2)

    useFrame(({ clock })=>{
        const time = clock.getElapsedTime()

        const y = Math.sin(timeOffset + time) + 1.35
        obstacle.current.setNextKinematicTranslation({ x:position[0], y: y + position[1], z:position[2] })
    })

    return (
        <group position={ position }>
            <mesh 
                material={ floor2Material }
                geometry={ boxGeometry } 
                position={[0 ,-0.1 ,0]} 
                scale={[4, 0.2, 4]} 
                receiveShadow
            />
            <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                <mesh 
                    material={ obstacleMaterial  }
                    geometry={ boxGeometry } 
                    position={[0 ,-0.1 ,0]} 
                    scale={[3.5, 0.3, 0.5]} 
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    )
}

export const BlockAxe = ({ position = [0, 0, 0] }) => {
    const obstacle = useRef()
    const [timeOffset] = useState(()=> Math.random() * Math.PI * 2)

    useFrame(({ clock })=>{
        const time = clock.getElapsedTime()

        const x = Math.sin(timeOffset + time) * 1.25
        obstacle.current.setNextKinematicTranslation({ x:position[0] + x, y: position[1] + 0.85, z:position[2] })
    })

    return (
        <group position={ position }>
            <mesh 
                material={ floor2Material }
                geometry={ boxGeometry } 
                position={[0 ,-0.1 ,0]} 
                scale={[4, 0.2, 4]} 
                receiveShadow
            />
            <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
                <mesh 
                    material={ obstacleMaterial  }
                    geometry={ boxGeometry } 
                    position={[0 ,-0.1 ,0]} 
                    scale={[1.5, 1.5, 0.3]} 
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    )
}

export const BlockEnd = ({ position = [0, 0, 0] }) => {
    const hamburger = useGLTF('./hamburger.glb')

    hamburger.scene.children.forEach((child)=> child.castShadow = true)

    return (
        <group position={ position }>
            <Text
                scale={0.5}
                font='./bebas-neue-v9-latin-regular.woff'
                position={[0, 2.25, 2]}
            >
                FINISH
                <meshBasicMaterial toneMapped={false} />
            </Text>
            <mesh 
                material={ floor1Material }
                geometry={ boxGeometry } 
                position={[0 , 0 ,0]} 
                scale={[4, 0.2, 4]} 
                receiveShadow
            />
            <RigidBody type="fixed" colliders='hull' position={[0, 0.25,0]}  restitution={0.2} friction={0}>
                <primitive object={hamburger.scene} scale={0.2} />
            </RigidBody>
            
        </group>
    )
}

export const Bounds = ( {length} ) => {

    return (
        <>
        <RigidBody type='fixed' restitution={0.2}  friction={0}>
            <mesh
                position={[2.15, 0.75, - (length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                receiveShadow
                castShadow
                scale={[0.3, 1.5, length * 4]}
            />

            <mesh
                position={[-2.15, 0.75, - (length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                receiveShadow
                scale={[0.3, 1.5, length * 4]}
            />
            <mesh
                position={[0, 0.75, - (length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                receiveShadow
                scale={[4, 1.5, 0.3]}
            />
            <CuboidCollider restitution={0.2} friction={1} args={[2, 0.1, 2 * length]} position={ [0, - 0.1, -(length * 2) + 2] } />
        </RigidBody>
        </>
    )
}

const Level = ({ count = 5, types= [ BlockSpinner, BlockAxe, BlockLimbo ], seed = 0 }) => {
    
    const blocks = useMemo(()=>{
        const blocks = []
        for(let i = 0; i < count; i++){
            const Block = types[Math.floor(Math.random() * types.length)]
            blocks.push(<Block key={i} position={[0, 0, (i + 1) * -4]} />)
        }
        return blocks
    }, [count, types, seed])
     
    // console.log(blocks)

    return (
        <>  
            <BlockStart position={[0, 0, 0]} />
            {blocks}
            <BlockEnd position={[0, 0, (count + 1) * -4]} />

            <Bounds length={count + 2} />
        </>
    )
}

export default Level