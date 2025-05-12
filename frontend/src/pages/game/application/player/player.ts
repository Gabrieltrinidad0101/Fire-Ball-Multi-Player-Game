import { Server } from "socket.io";
import { Bullet, TDirrection } from "../bullet/bullet";
import { Game } from "../game/game";
import { GameObject,IBaseGameObject, IGameObject } from "../object/object";

export class Player extends GameObject {   
    gravity = 5
    speed: number = 15
    dirrection: TDirrection = "up"
    sendBullet = false
    socket: Server | null = null
    gifAnimation: HTMLImageElement | null= null
    moves = {
        left: false,
        right: false,
        up: false,
        canJump: false
    }
    isDead = false
    
    constructor(socket: Server, baseGameObject: IBaseGameObject,canMove: boolean){
        const gameObject = baseGameObject as IGameObject
        gameObject.type = "player"
        super(gameObject) 
        this.showPlayerAnimation("player",4)
        this.delayFrame = 250
        this.animation()
        if(!canMove) return;
        this.socket = socket
        document.querySelector(".left")?.addEventListener("keydown",_=>this.keyDown({key: "a"}))
        document.querySelector(".right")?.addEventListener("keydown",_=>this.keyDown({key: "d"}))
        document.querySelector(".up")?.addEventListener("keydown",_=>this.keyDown({key: "w"}))
        document.querySelector(".left")?.addEventListener("keyup",_=>this.keyUp({key: "a"}))
        document.querySelector(".right")?.addEventListener("keyup",_=>this.keyUp({key: "d"}))
        document.querySelector(".up")?.addEventListener("keyup",_=>this.keyUp({key: "w"}))
        document.querySelector(".enter")?.addEventListener("keyup",_=>this.keyUp({key: "Enter"}))
        document.addEventListener("keydown",(e)=> this.keyDown(e))
        document.addEventListener("keyup",(e)=> this.keyUp(e))
    }

    keyDown = (e: {key: string})=>{
        if(this.isDead) return 
        if(e.key == "a") {
            this.moves.right = false 
            this.moves.left = true 
        }
        if(e.key == "d") {
            this.moves.right = true 
            this.moves.left = false
        }
        if(e.key === "w") this.moves.up = true
    }

    keyUp = (e: {key: string})=>{
        if(this.isDead) return 
        if(e.key === "Enter"){
            this.bullet();
            return
        } 
        if(e.key === "a") this.moves.left = false 
        if(e.key === "d") this.moves.right = false
        if(e.key === "w") this.moves.up = false
        this.socket?.emit("stop player",{
            id: this.id
        })
    }

    private bullet = ()=>{
        if(!this.sendBullet) return
        setTimeout(()=>{
            this.sendBullet = true
        },400)
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

        let canJump = false

        if(this.y + this.h > Game.canvas.height){
            this.y = Game.canvas.height - this.h
            if(!this.moves.canJump) {
                this.showPlayerAnimation("player",4)
            }
            canJump = true
        }else{
            Game.objects.forEach(object =>{
                if(object.type != "object") return
                if(object.x <= this.x + this.w &&  this.x <= object.x + object.w &&
                   object.y <= this.y + this.h && object.y + object.h >= this.y + this.h
                ){
                    if(!this.moves.canJump) this.showPlayerAnimation("player",4)
                    this.y = object.y - this.h
                    canJump = true
                    return
                }
            })
        }
        this.moves.canJump = canJump

        if(this.moves.left){
            this.moveUser({
                x: this.x - this.speed,
                key: "a",
                y: this.y
            })
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
                y: this.y - this.h * 3,
            })
            return
        }

        if(!this.moves.left && !this.moves.right && !this.moves.canJump){
            this.showPlayerAnimation("playerUp",4)
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
        if(object.type === "obstacle"){
            this.showPlayerAnimation("playerDead",7)
            this.isDead = true
            setTimeout(()=>{
                this.socket?.emit("delete object",this.id) 
                this.imageAnimation = []
            },800)
            return
        }
        if(object.type !== "bullet") return
        const bullet =  object as Bullet
        if (bullet.userId === this.id) return
        this.isDead = true
        this.showPlayerAnimation("playerDead",7)
        setTimeout(()=>{
            this.socket?.emit("delete object",this.id)
            this.imageAnimation = []
        },800)
    }

    right = (x: number,y: number,playerId: string)=>{
        this.x = x
        this.y = y 
        if(this.x + this.w > Game.canvas.width) this.x = Game.canvas.width - this.w
        this.dirrection = "rigth"
        this.showPlayerAnimation("playerRun",5)
        this.camera(playerId)
    }
    
    left = (x: number,y: number,playerId: string)=>{
        this.x = x
        this.y = y
        if(this.x < 0) this.x = 0
        this.dirrection = "left"
        this.showPlayerAnimation("playerRun",5)
        this.camera(playerId)
    }

    up = (x: number,y: number)=>{
        if(!this.moves.canJump) return
        this.y = y
        this.x = x
        if(this.y < 0) this.y = 0
    }
   
    showPlayerAnimation(animation: string,frames: number): void {
        const animationImages = []
        for(let i = 1; i <= frames; i++){
            animationImages.push(`${animation}/player${i}.gif`) 
        }
        this.flipX = this.dirrection === "left"
        this.imageAnimation = animationImages
    }

    camera(playerId: string){
        if(playerId !== this.id || Game.canvasContainer === null)  return
        if(this.x <= 1000) Game.canvasContainer.scrollLeft = 0
        else if(this.x <= 2000) Game.canvasContainer.scrollLeft = 1000
        else if(this.x <= 3000) Game.canvasContainer.scrollLeft = Game.canvasContainer.scrollWidth
    }
}