import { spawnear } from "./Obstacle/obstacle";
import { Game } from "./game/game";
import "./main.css"
import { Player } from "./player/player"
import "./realTime/realTime";

const game = new Game()
game.render(["playerRigth.png","square.jpg","playerLeft.png","playerUp.png","playerDown.png","bullet.png"])