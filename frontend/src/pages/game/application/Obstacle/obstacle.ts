import { Game } from "../game/game";
import { GameObject } from "../object/object";

class Obstacle extends GameObject {
    angle: number = 0
    speed: number = 0
    constructor(){
        super({
          x: 0,
          y: 0,
          h: 15,
          w: 15,
          imageH: 75,
          imageW: 75,
          type: "obstacle"
        })
        this.angle = Math.random() * 10 
        this.speed = Math.random() + 1
        this.x = this.w * 2 + (Math.random() * (Game.canvas.width - this.w * 2))
        if(this.x < 1000 / 2) this.angle = -this.angle

        this.imageAnimation = ["fireball/fireball1.gif","fireball/fireball2.gif","fireball/fireball3.gif","fireball/fireball4.gif"]
        this.flipX = this.angle > 0
        this.delayFrame = 300
        this.animation()
    }

    async deforeRender(): Promise<void> {
        this.y += this.speed
        this.x -= this.angle
        if(this.isOutSideOfGame()){
            Game.deleteObject(this.id)
        }
    }
}
    
export function spawnear(){
    setInterval(()=>{
        new Obstacle()
    },5000)
}