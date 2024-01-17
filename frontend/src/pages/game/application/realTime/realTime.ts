import { Bullet } from "../bullet/bullet";
import { Game } from "../game/game";
import { GameObject } from "../object/object";
import { Player } from "../player/player"
import {socketIO} from "./parseSocketIO"
export const StartRealTimeGame = ()=>{
    const id = Math.random().toString() + Math.random().toString()
    
    socketIO.emit("new user",{x:300,y:Game.canvas.height - 60,w: 35,h: 75,imageW: 75, image: "playerRigth.png",id})
    new Player(socketIO,{x:300,y:Game.canvas.height - 60,w: 35,h: 75,imageW: 75, image: "playerRigth.png",id},true);
    
    new GameObject({x:1500,y: 200,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
    new GameObject({x:1400,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
    new GameObject({x:1000,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
    new GameObject({x:500,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
    new GameObject({x:100,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
    
    socketIO.on("move user", (data: {key: string,id: string,x: number,y: number})=>{
        Game.objects.forEach(game=>{
            if(game.id !== data.id) return
            const player = game as Player
            if(data.key === "d")  player.right(data.x,data.id);
            if(data.key === "a") player.left(data.x,data.id);
            if(data.key === "w") player.up(data.y);
        })
    })
    
    socketIO.on("delete object", (id: string)=>{
        Game.deleteObject(id)        
    })
    
    socketIO.on("send bullet",(data: any)=>{
        const bullet = new Bullet(data.userId,data)
        bullet.dirrection = data.dirrection
    })
    
    socketIO.on("new user", (data: any)=>{
        if(data.id === id) return
        new Player(socketIO,data,false)
    })

    socketIO.on("stop player", (data: any)=>{
        Game.objects.forEach(object =>{
            if(object.id !== data.id) return
            (object as Player).showPlayerAnimation("player",4)
        })
    })
} 