import { useEffect, useState } from "react"
import { StartGame,SetGame} from "../application/main"
import StartGameComponet from "../../../components/startGame/StartGame"
import "./main.css"
import Background from "../../../components/Background"
import { useNavigate, useParams} from "react-router-dom"
import { RealTimeGame } from "../application/realTime/realTime"
import wait from "../../../share/application/wait"
import { customFecth } from "../../../share/insfranstructure/dependencies";

let realTimeGame: RealTimeGame | null = null

export default function Game(): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()
  const [count,setCount] = useState<number>()
  const [gameData,setGameData] = useState<{fire: boolean,start: boolean}>({
    fire: false,
    start: false
  })
  const [totalPlayers,setTotalPlayers] = useState<number>(1)

  const fetchData = async ()=>{
    const gameId = params.gameId
    if(gameId === undefined) {
      navigate("/Home")
      return
    }

    const error = await SetGame(customFecth,gameId)
    if(error) return
    realTimeGame = StartGame(gameId)
    
    realTimeGame.onTotal((total: number)=>{
      setTotalPlayers(total)
    })

    realTimeGame.onStartGame =async (player)=>{
      setGameData(prevStart=>({...prevStart,["fire"]: true}))
      for (let i = 10; i > 0; i-- ){
        await wait(1000)
        setCount(i)
      }
      setCount(undefined)
      player.sendBullet = true
    }

    realTimeGame.getGameData = (data)=>{
      setGameData(data)
    }

    realTimeGame.initial()
  }

  useEffect(()=>{

    window.addEventListener('beforeunload',event => {
      event.returnValue = "Are you sure you want to leave? If you leave, you're going to die";
    });

    fetchData().catch(error=>{
      console.log(error)
    })
  },[])

  const onClickStartGame = async ()=>{
    realTimeGame?.startGame()
  }

  return (
    <Background>
      <StartGameComponet fire={gameData.fire} onClick={onClickStartGame} totalPlayers={totalPlayers} canStartGame={gameData.start}/>
      <div className="canvasContiner">
        <canvas width="2000px" height="500px" id="game"></canvas>
      </div>
      <div className="counter">
          <h1>{count}</h1>
        </div>
    </Background>
  )
}
