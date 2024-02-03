import { useEffect, useState } from "react"
import { StartGame } from "../application/main"
import StartGameComponet from "../../../components/startGame/StartGame"
import "./main.css"
import Background from "../../../components/Background"
import { useNavigate, useParams } from "react-router-dom"
import { RealTimeGame } from "../application/realTime/realTime"
import wait from "../../../share/application/wait"
import { Toast } from "../../../share/insfranstructure/toast"

let realTimeGame: RealTimeGame | null = null

export default function Game(): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()
  const [count, setCount] = useState<number>()
  const [gameData, setGameData] = useState<{ fire: boolean, start: boolean }>({
    fire: false,
    start: false
  })
  const [totalPlayers, setTotalPlayers] = useState<number>(1)

  const redirect = () => {
    navigate("/Home")
  }

  const fetchData = async () => {
    const gameId = params.gameId
    if (gameId === undefined) {
      redirect()
      return
    }


    realTimeGame = StartGame(gameId)

    realTimeGame.onTotal((total: number) => {
      setTotalPlayers(total)
    })

    const question = (event: any) => {
      event.returnValue = "Are you sure you want to leave? If you leave, you're going to die";
    }

    realTimeGame.onStartGame = async (player) => {
      window.addEventListener('beforeunload',question);
      setGameData(prevStart => ({ ...prevStart, ["fire"]: true }))
      for (let i = 10; i > 0; i--) {
        await wait(1000)
        setCount(i)
      }
      setCount(undefined)
      player.sendBullet = true
    }

    realTimeGame.getGameData = (data) => {
      setGameData(data)
    }

    realTimeGame.initial()

    realTimeGame.onDead = ()=>{
      window.removeEventListener('beforeunload',question);
    }

    realTimeGame.onWin = ()=>{
      Toast.sucess("Winner")
      window.removeEventListener('beforeunload',question);
      navigate("/home")
    }
  }

  useEffect(() => {

    fetchData()
      .catch(error => {
        console.log(error)
      })
  }, [])

  const onClickStartGame = async () => {
    realTimeGame?.startGame()
  }

  return (
    <Background>
      <StartGameComponet fire={gameData.fire} onClick={onClickStartGame} totalPlayers={totalPlayers} canStartGame={gameData.start} />
      <div className="canvasContiner">
        <canvas width="2000px" height="500px" id="game"></canvas>
      </div>
      <div className="counter">
        <h1>{count}</h1>
      </div>
    </Background>
  )
}
