import { Game } from "./game/game";
import {RealTimeGame}  from "./realTime/realTime";

export const StartGame = (gameId: string): RealTimeGame => {
    const game = new Game()
    game.context()
    const realTime = new RealTimeGame(gameId)
    game.background = "backgroundBig.png"   
    game.render([
        "backgroundBig.png",
        "player/player1.gif",
        "player/player2.gif",
        "player/player3.gif",
        "player/player4.gif",
        "playerRun/player1.gif",
        "playerRun/player2.gif",
        "playerRun/player3.gif",
        "playerRun/player4.gif",
        "playerRun/player5.gif",
        "playerUp/player1.gif",
        "playerUp/player2.gif",
        "playerUp/player3.gif",
        "playerUp/player4.gif",
        "playerDead/player1.gif",
        "playerDead/player2.gif",
        "playerDead/player3.gif",
        "playerDead/player4.gif",
        "playerDead/player5.gif",
        "playerDead/player6.gif",
        "playerDead/player7.gif",
        "fireball/fireball1.gif",
        "fireball/fireball2.gif",
        "fireball/fireball3.gif",
        "fireball/fireball4.gif",
        "fireball/fireball5.gif",
        "object.png",
        "bullet.png"])
    return realTime
}
