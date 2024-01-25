import { useEffect } from "react"
import { StartGame } from "../application/main"
import "./main.css"
import Background from "../../../components/Background"
import { useNavigate, useParams} from "react-router-dom"

export default function Game(): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()


  useEffect(()=>{
    const gameId = params.gameId
    if(gameId === undefined) {
      navigate("/Home")
      return
    }
    StartGame(gameId).catch((error: string) => console.error(error))
  },[])

  return (
    <Background>
      <div className="canvasContiner">
        <canvas width="2000px" height="500px" id="game"></canvas>
      </div>
    </Background>
  )
}
