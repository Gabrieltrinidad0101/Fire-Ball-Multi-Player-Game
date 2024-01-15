import { Server } from "socket.io";
import { Bullet, TDirrection } from "../bullet/bullet";
import { Game } from "../game/game";
import { GameObject,IBaseGameObject, IGameObject } from "../object/object";

export class Player extends GameObject {   
    gravity = 5
    speed: number = 15
    dirrection: TDirrection = "up"
    sendBullet = true
    socket: Server | null = null
    gifAnimation: HTMLImageElement | null= null
    moves = {
        left: false,
        right: false,
        up: false,
        canJump: false
    }


    constructor(socket: Server, baseGameObject: IBaseGameObject,canMove: boolean){
        const gameObject = baseGameObject as IGameObject
        gameObject.type = "player"
        super(gameObject) 
        if(!canMove) return;
        this.socket = socket
        document.addEventListener("keydown",(e)=>{
            if(e.key == "a") {
                this.moves.right = false 
                this.moves.left = true 
            }
            if(e.key == "d") {
                this.moves.right = true 
                this.moves.left = false
            }
            if(e.key === "w") this.moves.up = true
        })

        document.addEventListener("keyup",(e)=>{
            if(e.key === "Enter") this.bullet();
            if(e.key === "a") this.moves.left = false 
            if(e.key === "d") this.moves.right = false
            if(e.key === "w") this.moves.up = false
            this.socket?.emit("stop player",{
                id: this.id
            })
        })
        this.showAnimation("player.gif")
    }

    private bullet = ()=>{
        if(!this.sendBullet) return
        setTimeout(()=>{
            this.sendBullet = true
        },250)
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

    async deforeRender(): Promise<void> {
        this.y += this.gravity


        if(this.y + this.h > Game.canvas.height){
            this.y = Game.canvas.height - this.h
            if(!this.moves.canJump) this.showAnimation("player.gif")
            this.moves.canJump = true
        }else{
            Game.objects.forEach(object =>{
                if(object.type != "object") return
                if(object.x <= this.x + this.w &&  this.x <= object.x + object.w &&
                   object.y <= this.y + this.h && object.y + object.h >= this.y + this.h
                ){
                    if(!this.moves.canJump) this.showAnimation("player.gif")
                    this.y = object.y - this.w
                    this.moves.canJump = true
                    return
                }
                this.moves.canJump = false
            })
        }

        if(this.moves.left){
            this.socket?.emit("move user",{
                x: this.x - this.speed,
                key: "a",
                id: this.id 
            });
        }
        
        if(this.moves.right){
            this.moveUser({
                x: this.x + this.speed,
                key: "d",
                y: this.y
            })
        }

        if(this.moves.up && this.moves.canJump){
            this.moveUser({
                x: this.x,
                key: "w",
                y: this.y - this.w * 3,
            })
            return
        }

        if(!this.moves.left && !this.moves.right && !this.moves.canJump){
            this.showAnimation("playerUp.gif",0)
            return
        }
    }

    private moveUser({x,y,key}:{x: number,y: number,key: string}){
        this.socket?.emit("move user",{
            x,
            y,
            key,
            id: this.id 
        });
    }

    collision(object: IGameObject): void {
        if(object.type !== "bullet") return
        const bullet =  object as Bullet
        if (bullet.userId === this.id) return
        this.showAnimation("playerDead.gif",800)
        this.socket?.emit("delete object",this.id)
    }

    right = (x: number)=>{
        this.x = x 
        if(this.x + this.w > Game.canvas.width) this.x = Game.canvas.width - this.w
        this.dirrection = "rigth"
        this.showAnimation("playerRun.gif")
    }
    
    left = (x: number)=>{
        this.x = x
        if(this.x < 0) this.x = 0
        this.dirrection = "left"
        this.showAnimation("playerRun.gif")
    }

    up = (y: number)=>{
        if(!this.moves.canJump) return
        this.y = y
        if(this.y < 0) this.y = 0
    }
    
    showAnimation(image: string,timeLife = 0){
        this.showGif({
            image,
            w: this.w,
            h: this.h,
            timeLife,
            flip: this.dirrection === "left" ? -1 : 1
        })
    }
}