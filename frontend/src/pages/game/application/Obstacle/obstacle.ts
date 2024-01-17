import { Game } from "../game/game";
import { GameObject } from "../object/object";

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
        if(this.x < 1000 / 2) this.angle = -this.angle

        this.imageType = this.angle < 0 ? "fireBallRigth.gif" : "fireBallLeft.gif"
        this.showGif({
            w: this.w * 2,
            image: this.imageType,
            timeLife: 0,
            h: this.h,
            flip: 1
        })
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
        //hidden fireball when is outside of the game
        if(Game.canvasContainer === null || !this.imageGif) return
        if(this.x < Game.canvasContainer.scrollLeft ||
           this.x + this.w > Game.canvasContainer.scrollLeft + Game.canvasContainer.clientWidth){
            this.imageGif.classList.add("d-none")
            return
           }
        this.imageGif.classList.remove("d-none")
    }
}
    
export function spawnear(){
    setInterval(()=>{
        new Obstacle()
    },5000)
}