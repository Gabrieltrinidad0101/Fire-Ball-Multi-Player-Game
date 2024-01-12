import { Game } from "./game/game";
import {StartRealTimeGame}  from "./realTime/realTime";

//Only run one time
export const StartGame = async ()=>{
    if(document.getElementById("game") === undefined || Game.canvas != undefined) return
    const game = new Game()
    game.context()
    StartRealTimeGame()
    await game.render(["playerRigth.png","square.jpg","playerLeft.png","playerUp.png","playerDown.png","bullet.png"])
}
