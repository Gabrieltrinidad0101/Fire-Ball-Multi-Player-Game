import { useEffect, useState } from "react"
import { StartGame } from "../application/main"
import StartGameComponet from "../../../components/startGame/StartGame"
import "./main.css"
import Background from "../../../components/Background"
import { useNavigate, useParams} from "react-router-dom"



export default function Game(): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()
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

    const realTimeGame = StartGame(gameId)

    realTimeGame?.onTotal((total: number)=>{
      setTotalPlayers(total)
    })
    
  },[])



  return (
    <Background>
      <StartGameComponet totalPlayers={totalPlayers}/>
      <div className="canvasContiner">
        <canvas width="2000px" height="500px" id="game"></canvas>
      </div>
    </Background>
  )
}
