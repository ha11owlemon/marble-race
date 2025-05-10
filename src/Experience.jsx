import Lights from './Lights.jsx'
import Level from './Level.jsx'
import Player from './Player.jsx'
import Effects from './Effects.jsx'
import { Physics } from '@react-three/rapier'
import useGame from './stores/useGame'
export default function Experience()
{
    const blocksCount = useGame(state => state.blocksCount)
    const blocksSeed = useGame(state => state.blocksSeed)
    return <>
        <color args={['#252731']} attach='background' />
        <Physics>
            {/* <Debug /> */}
            <Lights /> 
            <Level count={blocksCount} seed={blocksSeed} />
            <Player />
        </Physics>

        <Effects />
    </>
}