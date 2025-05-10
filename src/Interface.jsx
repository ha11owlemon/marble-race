import { useKeyboardControls } from "@react-three/drei"
import useGame from "./stores/useGame"
import { addEffect } from "@react-three/fiber"
import { useEffect, useRef } from "react"

const Interface = () => {
    const restart = useGame(state => state.restart)
    const phase = useGame(state => state.phase)
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const jump = useKeyboardControls((state) => state.jump)
    const timeRef = useRef()

    useEffect(()=>{
        const destory = addEffect(()=>{
            const state = useGame.getState()

            let elapsedTime = 0

            if (state.phase === 'playing'){
                elapsedTime = Date.now() - state.startTime
            }else if(state.phase === 'ended'){
                elapsedTime = state.endTime - state.startTime
            }

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            timeRef.current.textContent = elapsedTime
        })

        return () => destory()
    }, [])

    return (
        <div className="interface">
            <div ref={timeRef} className="time">0.00</div>
            { phase === 'ended' ? <div className="restart" onClick={restart}>RESTART</div> : null }
            

            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward ? 'active' : ''}`}></div>
                    <div className={`key ${backward ? 'active' : ''}`}></div>
                    <div className={`key ${rightward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key large ${jump ? 'active' : ''}`}></div>
                </div>
            </div>
        </div>
    )
}

export default Interface