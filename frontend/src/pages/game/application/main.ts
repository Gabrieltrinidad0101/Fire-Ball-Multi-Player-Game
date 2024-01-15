import { spawnear } from "./Obstacle/obstacle";
import { Game } from "./game/game";
import {StartRealTimeGame}  from "./realTime/realTime";

//Only run one time
export const StartGame = async ()=>{
    if(document.getElementById("game") == undefined) return
    if(Game.canvas != null) return
    const game = new Game()
    game.context()
    StartRealTimeGame()
    game.background = "backgroundBig.png"   
    spawnear()
    await game.render(["backgroundBig.png","square.jpg","object.png","bullet.png"])
}
