import { useEffect } from "react"
import { StartGame } from "../application/main"
import "./main.css"
import Background from "../../../components/Background"


export default function Game(): JSX.Element {

  useEffect(()=>{
    StartGame().catch((error: string) => console.error(error))
  },[])

  return (
    <Background>
      <canvas width="1000px" height="500px" id="game"></canvas>
    </Background>
  )
}
