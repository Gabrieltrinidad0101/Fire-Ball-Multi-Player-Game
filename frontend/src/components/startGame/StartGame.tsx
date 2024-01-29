import StartGameCss from "./startGame.module.css"
import Logo from "../../../public/OIG-removebg.png"
export default function StartGame({totalPlayers}: {totalPlayers: number}) {
  return (
    <div className={StartGameCss.container}>
        <div className={StartGameCss.players}>
            <h1>PLAYERS: {totalPlayers}</h1>
        </div>
        <div>
            <button className={StartGameCss.btn}>
                <img width="100px" src={Logo} alt="" />
                <span className={StartGameCss.now}>now!</span>
                <span className={StartGameCss.play}>play</span>
            </button>
        </div>
    </div>
  )
}
