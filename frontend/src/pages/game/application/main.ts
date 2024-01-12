import { Game } from "./game/game";
import "./main.css"
import "./realTime/realTime";

export const StartGame = async ()=>{
    const game = new Game()
    await game.render(["playerRigth.png","square.jpg","playerLeft.png","playerUp.png","playerDown.png","bullet.png"])
}
