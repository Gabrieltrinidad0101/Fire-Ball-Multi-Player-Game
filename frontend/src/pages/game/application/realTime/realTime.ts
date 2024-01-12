import { Bullet } from "../bullet/bullet";
import { Game } from "../game/game";
import { Player } from "../player/player"
import {socketIO} from "./parseSocketIO"

export const StartRealTimeGame = ()=>{
    const id = crypto.randomUUID()
    
    socketIO.emit("new user",{x:200,y:100,w: 30,h: 30,image: "playerRigth.png",id})
    new Player(socketIO,{x:200,y:100,w: 30,h: 30,image: "playerRigth.png",id},true);
    
    
    socketIO.on("move user", (data: {key: string,id: string})=>{
        Game.objects.forEach(game=>{
            if(game.id !== data.id) return
            const player = game as Player
            if(data.key === "d")  player.right();
            if(data.key === "a") player.left();
            if(data.key === "w") player.up();
            if(data.key === "s") player.down();
        })          
    })
    
    
    socketIO.on("user collision", (data: {dirrection: string,id: string})=>{
        Game.objects.forEach(game=>{
            if(game.id !== data.id) return
            const player = game as Player
            if(data.dirrection === "left") player.x += player.speed
            if(data.dirrection === "rigth") player.x -= player.speed
            if(data.dirrection === "up") player.y += player.speed
            if(data.dirrection === "down") player.y -= player.speed
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
} 