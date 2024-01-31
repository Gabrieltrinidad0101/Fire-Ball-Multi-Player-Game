import StartGameCss from "./startGame.module.css"
import Logo from "../../../public/OIG-removebg.png"
export default function StartGame({totalPlayers,canStartGame,onClick,fire}: {fire: boolean,onClick:()=>void, totalPlayers: number,canStartGame: boolean}) {
  return (
    <div className={`${StartGameCss.container} ${fire ? "" :StartGameCss.background}`}>
        <div className={StartGameCss.players}>
            <h1>PLAYERS: {totalPlayers}</h1>
        </div>
        {
        !fire && <div>
            {
              canStartGame ?
              <button className={StartGameCss.btn} onClick={onClick}>
                <img width="100px" src={Logo} alt="" />
                <span className={StartGameCss.now}>now!</span>
                <span className={StartGameCss.play}>play</span>
            </button> : <h1> Wait for the game start</h1>
            }
        </div>
        }
    </div>
  )
}
