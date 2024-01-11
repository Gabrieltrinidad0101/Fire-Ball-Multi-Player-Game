import { spawnear } from "./Obstacle/obstacle";
import { Game } from "./game/game";
import "./main.css"
import { GameObject } from "./object/object";
import { Player } from "./player/player"


new Player({x:170,y:10,w: 30,h: 30,image: "playerRigth.png"},true);
new Player({x:35,y:100,w: 30,h: 30,image: "playerLeft.png"},false);

new GameObject({x:800,y:400,w: 30,h: 30,type: "object",image: "square.jpg",id:""})
new GameObject({x:800,y:350,w: 130,h: 30,type: "object",image: "square.jpg",id:""})
new GameObject({x:900,y:400,w: 30,h: 30,type: "object",image: "square.jpg",id:""})

new GameObject({x:50,y:400,w: 30,h: 30,type: "object",image: "square.jpg",id:""})
new GameObject({x:50,y:350,w: 130,h: 30,type: "object",image: "square.jpg",id:""})
new GameObject({x:150,y:400,w: 30,h: 30,type: "object",image: "square.jpg",id:""})


const game = new Game()
spawnear()
game.render(["playerRigth.png","square.jpg","playerLeft.png","playerUp.png","playerDown.png","bullet.png"])