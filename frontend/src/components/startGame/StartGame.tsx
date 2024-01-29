import StartGameCss from "./startGame.module.css"
import Logo from "../../../public/OIG-removebg.png"
export default function StartGame() {
  return (
    <div className={StartGameCss.container}>
        <div>
            <h1>TEST</h1>
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
