import { Server } from "socket.io";
import { Bullet, TDirrection } from "../bullet/bullet";
import { Game } from "../game/game";
import { GameObject,IBaseGameObject, IGameObject } from "../object/object";

export class Player extends GameObject {   
    speed: number = 10
    dirrection: TDirrection = "left"
    sendBullet = true
    socket: Server | null = null
    constructor(socket: Server, baseGameObject: IBaseGameObject,canMove: boolean){
        const gameObject = baseGameObject as IGameObject
        gameObject.type = "player"
        super(gameObject) 
        if(!canMove) return;
        this.socket = socket
        document.addEventListener("keypress",(e)=>{
            if(!["a","s","w","d"].includes(e.key)) return
            socket.emit("move user",{
                key: e.key,
                id: this.id 
            });
        })

        document.addEventListener("keyup",(e)=>{
            if(e.key === "Enter") this.bullet();
        })
    }

    private bullet = ()=>{
        if(!this.sendBullet) return
        setTimeout(()=>{
            this.sendBullet = true
        },500)
        this.sendBullet = false
        this.socket?.emit("send bullet",{
            x: this.x + this.w / 2,
            y: this.y + this.h / 2 - 5,
            w: 10, 
            h: 10,
            image: "bullet.png",
            userId: this.id,
            dirrection: this.dirrection
        })
    }

    collision(object: IGameObject): void {
        if(object.type === "player") return;
        if(object.type === "bullet"){
            const bullet =  object as Bullet
            if (bullet.userId === this.id) return
            this.socket?.emit("delete object",this.id)
            return
        }
    }

    right = ()=>{
        this.x += this.speed 
        if(this.x + this.w > Game.canvas.width) this.x = Game.canvas.width - this.w
        this.dirrection = "rigth"
        this.image = "playerRigth.png"
    }
    
    left = ()=>{
        this.x -= this.speed
        if(this.x < 0) this.x = 0
        this.dirrection = "left"
        this.image = "playerLeft.png"
    }

    up = ()=>{
        this.y -= this.speed
        if(this.y < 0) this.y = 0
        this.dirrection = "up"
        this.image = "playerUp.png"
    }

    down = ()=>{
        this.y += this.speed
        if(this.y + this.h > Game.canvas.height) this.y = Game.canvas.height - this.h
        this.dirrection = "down"
        this.image = "playerDown.png"
    }
}