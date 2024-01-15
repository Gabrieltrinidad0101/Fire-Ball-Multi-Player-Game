import { Game } from "../game/game";
import { GameObject, IGameObject } from "../object/object";

class Obstacle extends GameObject {
    angle: number = 0
    speed: number = 0
    private imageType: string
    constructor(){
        super({
          x: 0,
          y: 0,
          h: 15,
          w: 15,
          type: "obstacle"
        })
        this.angle = Math.random() * 10 
        this.speed = Math.random() + 1
        this.x = this.w * 2 + (Math.random() * (Game.canvas.width - this.w * 2))
        if(this.x < Game.canvas.width / 2) this.angle = -this.angle

        this.imageType = this.angle < 0 ? "fireBallRigth.gif" : "fireBallLeft.gif"
        this.showGif({
            w: this.w * 2,
            image: this.imageType,
            timeLife: 0,
            h: this.h,
            flip: 1
        })
    }

    collision(gameObject: IGameObject): void {
        if(gameObject.type === "object") {
            Game.deleteObject(this.id);this.imageGif?.remove()
        }
        if(gameObject.type === "player") Game.deleteObject(gameObject.id ?? "")
        if(gameObject.type !== "obstacle"){
            this.showGif({w: this.w, h: this.h, image: "explosion.gif",timeLife: 500})
        }
    }

    async deforeRender(): Promise<void> {
        this.y += this.speed
        this.x -= this.angle
        this.showGif({
            w: 80,
            image: this.imageType,
            timeLife: 0,
            h: 80,
            flip: 1
        })
        if(this.isOutSideOfGame()){
            Game.deleteObject(this.id)
            this.imageGif?.remove()
        }
    }
}
    
export function spawnear(){
    setInterval(()=>{
        new Obstacle()
    },2000)
}