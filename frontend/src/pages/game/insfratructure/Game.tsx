import { useEffect, useRef } from "react"
import { StartGame } from "../application/main"
import "./main.css"
import Background from "../../../components/Background"


export default function Game(): JSX.Element {
  useEffect(()=>{
    StartGame().catch((error: string) => console.error(error))
  },[])

  return (
    <Background>
      <div className="canvasContiner">
        <canvas width="2000px" height="500px" id="game"></canvas>
      </div>
    </Background>
  )
}
