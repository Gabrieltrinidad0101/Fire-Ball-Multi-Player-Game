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
    //spawnear()
    await game.render([
        "backgroundBig.png",
        "square.jpg",
        "./player/player1.gif",
        "./player/player2.gif",
        "./player/player3.gif",
        "./player/player4.gif",
        "./playerRun/player1.gif",
        "./playerRun/player2.gif",
        "./playerRun/player3.gif",
        "./playerRun/player4.gif",
        "./playerRun/player5.gif",
        "./playerUp/player1.gif",
        "./playerUp/player2.gif",
        "./playerUp/player3.gif",
        "./playerUp/player4.gif",
        "./playerDead/player1.gif",
        "./playerDead/player2.gif",
        "./playerDead/player3.gif",
        "./playerDead/player4.gif",
        "./playerDead/player5.gif",
        "./playerDead/player6.gif",
        "./playerDead/player7.gif",
        "object.png",
        "bullet.png"])
}
