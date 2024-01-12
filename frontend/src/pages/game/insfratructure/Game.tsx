import { useEffect } from "react"
import { StartGame } from "../application/main"

export default function Game(): JSX.Element {
  
    useEffect(()=>{
        StartGame()
            .catch((error: string) => console.error(error))
    },[])

  // I was trying to install using npm socket.io but I was having problems 😜 
  return (
    <div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>
        <canvas width="1000px" height="500px" id="game"></canvas>
    </div>
  )
}
