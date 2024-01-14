import { spawnear } from "./Obstacle/obstacle";
import { Game } from "./game/game";
import {StartRealTimeGame}  from "./realTime/realTime";

//Only run one time
export const StartGame = async ()=>{
    if(document.getElementById("game") == undefined) return
    if(Game.canvas != null) return
    const game = new Game()
    game.context()
    //spawnear()
    StartRealTimeGame()
    await game.render(["playerRigth.png","square.jpg","playerLeft.png","playerUp.png","playerDown.png","bullet.png"])
}
