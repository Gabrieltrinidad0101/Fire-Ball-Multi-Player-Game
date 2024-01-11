import { Bullet, TDirrection } from "../bullet/bullet";
import { Game } from "../game/game";
import { GameObject,IBaseGameObject, IGameObject } from "../object/object";

export class Player extends GameObject {   
    speed: number = 10
    dirrection: TDirrection = "left"
    sendBullet = true
    constructor(baseGameObject: IBaseGameObject,canMove: boolean){
        const gameObject = baseGameObject as IGameObject
        gameObject.type = "player"
        super(gameObject) 
        if(!canMove) return;
        document.addEventListener("keypress",(e)=>{
            if(e.key === "d") this.ArrowRight();
            if(e.key === "a") this.ArrowLeft();
            if(e.key === "w") this.ArrowUp();
            if(e.key === "s") this.ArrowDown();
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
        const bullet = new Bullet(this.id,{
            x: this.x + this.w / 2,
            y: this.y + this.h / 2 - 5,
            w: 10, 
            h: 10,
            image: "bullet.png"
        })
        bullet.dirrection = this.dirrection
    }

    collision(object: IGameObject): void {
        if(object.type === "player") return;
        if(object.type === "bullet"){
            const bullet =  object as Bullet
            if (bullet.userId === this.id) return
            Game.deleteObject(this.id)
            return
        }
        if(this.dirrection === "left") this.x += this.speed
        if(this.dirrection === "rigth") this.x -= this.speed
        if(this.dirrection === "up") this.y += this.speed
        if(this.dirrection === "down") this.y -= this.speed
    }

    private ArrowRight = ()=>{
        this.x += this.speed 
        if(this.x + this.w > Game.canvas.width) this.x = Game.canvas.width - this.w
        this.dirrection = "rigth"
        this.image = "playerRigth.png"
    }
    
    private ArrowLeft = ()=>{
        this.x -= this.speed
        if(this.x < 0) this.x = 0
        this.dirrection = "left"
        this.image = "playerLeft.png"
    }

    private ArrowUp = ()=>{
        this.y -= this.speed
        if(this.y < 0) this.y = 0
        this.dirrection = "up"
        this.image = "playerUp.png"
    }

    private ArrowDown = ()=>{
        this.y += this.speed
        if(this.y + this.h > Game.canvas.height) this.y = Game.canvas.height - this.h
        this.dirrection = "down"
        this.image = "playerDown.png"
    }
}