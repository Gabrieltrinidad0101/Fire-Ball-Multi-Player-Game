import { useEffect, useState } from "react"
import { StartGame } from "../application/main"
import StartGameComponet from "../../../components/startGame/StartGame"
import "./main.css"
import Background from "../../../components/Background"
import { useNavigate, useParams} from "react-router-dom"
import { RealTimeGame } from "../application/realTime/realTime"


let realTimeGame: RealTimeGame | null = null

export default function Game(): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()
  const [gameData,setGameData] = useState<{fire: boolean,start: boolean}>({
    fire: false,
    start: false
  })
  const [totalPlayers,setTotalPlayers] = useState<number>(1)

  useEffect(()=>{

    window.addEventListener('beforeunload',event => {
      event.returnValue = "Are you sure you want to leave? If you leave, you're going to die";
    });

    const gameId = params.gameId
    if(gameId === undefined) {
      navigate("/Home")
      return
    }

    realTimeGame = StartGame(gameId)
    
    realTimeGame.onTotal((total: number)=>{
      setTotalPlayers(total)
    })

    realTimeGame.onStartGame =()=>{
      setGameData(prevStart=>({...prevStart,["fire"]: true}))
    }

    realTimeGame.getGameData = (data)=>{
      setGameData(data)
    }

    realTimeGame.initial()
  },[])

  const onClickStartGame = ()=>{
    realTimeGame?.startGame()
  }

  return (
    <Background>
      <StartGameComponet fire={gameData.fire} onClick={onClickStartGame} totalPlayers={totalPlayers} canStartGame={gameData.start}/>
      <div className="canvasContiner">
        <canvas width="2000px" height="500px" id="game"></canvas>
      </div>
    </Background>
  )
}
