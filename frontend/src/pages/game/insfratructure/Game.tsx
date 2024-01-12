import { useEffect } from "react"
import { StartGame } from "../application/main"
import "./main.css"


export default function Game(): JSX.Element {

  useEffect(()=>{
    StartGame().catch((error: string) => console.error(error))
  },[])

  return (
    <div>
        <canvas width="1000px" height="500px" id="game"></canvas>
    </div>
  )
}
