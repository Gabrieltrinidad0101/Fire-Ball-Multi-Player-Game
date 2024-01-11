import { Game } from "../game/game"

export type TObject = "player" | "bullet" | "object" | "obstacle"

export interface IBaseGameObject {
    x: number,
    y: number,
    w: number,
    h: number,
    image?: string
}

export interface IGameObject extends IBaseGameObject {
    type: TObject,
    id: string,
}

export class GameObject{
    x: number = 0
    y: number = 0
    w: number = 0
    h: number = 0 
    type: TObject = "object"
    id: string = crypto.randomUUID()
    image?: string
    
    constructor(gameObject: IGameObject){
        this.x = gameObject.x
        this.y = gameObject.y
        this.w = gameObject.w
        this.h = gameObject.h
        this.type = gameObject.type
        this.image = gameObject.image
        Game.objects.set(this.id,this)
    }

    showGif(data: {w:number,image: string,timeLife: number}): HTMLImageElement {
        const image = document.createElement("img")
        image.src = data.image
        image.className = "gif"
        this.changeGif(image,data)
        document.body.append(image)
        if(data.timeLife > 0){
            setTimeout(()=>{
                image.remove()
            },data.timeLife)
        }
        return image
    }

    changeGif(image: HTMLImageElement,data: {w:number,image: string,timeLife: number}){
        const center =  data.w > this.w ? ((data.w - this.w) / 2) : 0
        image.setAttribute("style",`width: ${data.w}px; left: ${this.x - center}px;top: ${this.y - center}px`)
    }

    isOutSideOfGame(){
        if(this.x + this.w > Game.canvas.width) return true
        if(this.x < 0) return true
        if(this.y < 0) return true
        if(this.y + this.h > Game.canvas.height) return true
        return false
    }

    deforeRender(){

    }

    collision(_:IGameObject){
    
    }
}