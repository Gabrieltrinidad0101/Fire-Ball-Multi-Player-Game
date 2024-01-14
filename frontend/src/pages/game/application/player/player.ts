import { Server } from "socket.io";
import { Bullet, TDirrection } from "../bullet/bullet";
import { Game } from "../game/game";
import { GameObject,IBaseGameObject, IGameObject } from "../object/object";

export class Player extends GameObject {   
    gravity = 10
    speed: number = 15
    velocity = 10
    dirrection: TDirrection = "up"
    sendBullet = true
    socket: Server | null = null
    
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
            this.velocity = 10
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

    deforeRender(): void {
        this.y += this.gravity
        this.moves.canJump = false
        if(this.y + this.h > Game.canvas.height){
            this.y = Game.canvas.height - this.h
            this.moves.canJump = true
        }

        Game.objects.forEach(object =>{
            if(object.type != "object") return
            if(object.x <= this.x &&  this.x <= object.x + object.w &&
               object.y <= this.y + this.h && object.y + object.h >= this.y + this.h
            ){
                this.y = object.y - this.w
                this.moves.canJump = true
            }
        })

        if(Game.objects)
        
        if(this.moves.left){
            this.socket?.emit("move user",{
                key: "a",
                id: this.id 
            });
        }
        if(this.moves.right){
            this.socket?.emit("move user",{
                key: "d",
                id: this.id 
            });
        }

        if(this.moves.up && this.moves.canJump){
            this.socket?.emit("move user",{
                key: "w",
                id: this.id 
            });
        }

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
        if(!this.moves.up) return
        this.y -= this.w * 3
        if(this.y < 0) this.y = 0
    }
}