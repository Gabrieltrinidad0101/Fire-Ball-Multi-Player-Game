import { Bullet } from "../bullet/bullet";
import { Game } from "../game/game";
import { GameObject } from "../object/object";
import { Player } from "../player/player"
import {socketIO} from "./parseSocketIO"

export class RealTimeGame{
    socket: SocketIO.Server
    onStartGame = (_: Player) =>{}
    getGameData = (_: {fire: boolean,start: boolean}) =>{}
    onWin = ()=>{}
    onDead = ()=>{}
    constructor(gameId: string){
        this.socket = socketIO(gameId)
    }

    initial(){
        const id = Math.random().toString() + Math.random().toString()
        const playerData = {x:50,y:Game.canvas.height - 60,w: 35,h: 75,imageW: 75, image: "playerRigth.png",id}
        this.socket.emit("new player",playerData)
        const player = new Player(this.socket,playerData,true);

        new GameObject({x:2700,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        new GameObject({x:2500,y: 200,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        new GameObject({x:2200,y: 200,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        new GameObject({x:1500,y: 200,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        new GameObject({x:1400,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        new GameObject({x:1000,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        new GameObject({x:500,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        new GameObject({x:100,y: 300,w: 300,h:30,imageW: 300, imageH: 120,image: "object.png",type: "object"})
        
        this.socket.on("move user", (data: {key: string,id: string,x: number,y: number})=>{
            Game.objects.forEach(game=>{
                if(game.id !== data.id) return
                const player = game as Player
                if(player.isDead) return
                if(data.key === "d")  player.right(data.x,data.y,id);
                if(data.key === "a") player.left(data.x,data.y,id);
                if(data.key === "w") player.up(data.x,data.y);
            })
        })
        
        this.socket.on("delete object", (playerId: string)=>{
            Game.deleteObject(playerId)
            this.onDead()
            if (id === playerId){
                window.location.href = "/home" 
            }
        })
        
        this.socket.on("send bullet",(data: any)=>{
            const bullet = new Bullet(data.userId,data)
            bullet.dirrection = data.dirrection
        })
        
        this.socket.on("new player", (data: any)=>{
            if(data.id === id) return
            new Player(this.socket,data,false)
        })
        
        this.socket.on("stop player", (data: any)=>{
            Game.objects.forEach(object =>{
                if(object.id !== data.id) return
                (object as Player).showPlayerAnimation("player",4)
            })
        })
        
        this.socket.on("disconnection", (data: any)=>{
            Game.objects.delete(data.id)
            if (data.id == id) {
                this.onDead()
                window.location.href = "/home"
            } 
        })
        
        this.socket.on("win", ()=>{
            this.onWin()
            this.socket.close()
        })

        this.socket.on("start game", ()=>{
            this.onStartGame(player)
        })

        this.socket.on("connect_error", ()=>{
            this.onDead()
            window.location.href = "/home"
            this.socket.close()
        })

        this.socket.on("game data", (data: {fire: boolean,start: boolean})=>{
            this.getGameData(data)
        })

        this.socket.on("force disconnect", (playerUuid: string)=>{
            if (playerUuid == id || playerUuid == "force") {
                this.onDead()
                window.location.href = "/home"
                this.socket.close()
            }
        })
    }

    startGame(){
        this.socket.emit("start game")
    }


    onTotal = (totalPlayers: (total: number)=>void)=>{
        this.socket.on("total players", (total: number)=>{
            totalPlayers(total)       
        })
    }
}