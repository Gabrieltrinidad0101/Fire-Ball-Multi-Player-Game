import { Game } from "../game/game"

export type TObject = "player" | "bullet" | "object" | "obstacle"

export interface IBaseGameObject {
    x: number,
    y: number,
    w: number,
    h: number,
    imageW?: number,
    imageH?: number,
    image?: string
    id?: string,
}

export interface IGameObject extends IBaseGameObject {
    type: TObject,
}

export class GameObject{
    x = 0
    y = 0
    w = 0
    h = 0 
    imageW: number | undefined = 0
    imageH: number | undefined = 0
    type: TObject = "object"
    id: string = ""
    image?: string
    imageGif: HTMLImageElement | null = null

    constructor(gameObject: IGameObject){
        this.x = gameObject.x
        this.y = gameObject.y
        this.w = gameObject.w
        this.h = gameObject.h
        this.type = gameObject.type
        this.image = gameObject.image
        this.imageH = gameObject.imageH
        this.imageW = gameObject.imageW
        this.id = gameObject.id ?? crypto.randomUUID()
        Game.objects.set(this.id,this)
    }

    showGif(data: {w:number,h:number,image: string,timeLife: number,flip?: number}) {
        if(data.timeLife > 0){
            setTimeout(()=>{
                this.imageGif?.remove()
            },data.timeLife)
        }
        if(this.imageGif != null){
            this.changeGif(data)
            return
        }
        this.imageGif = document.createElement("img")
        this.imageGif.className = "gif"
        this.changeGif(data)
        document.body.append(this.imageGif)
    }

    centerPosition(width: number,height : number):{centerW: number,centerH: number}{
        const centerW =  width > this.w ? ((width - this.w) / 2) : 0
        const centerH =  height > this.h ? ((height - this.h) / 2) : 0
        return {centerW,centerH}
    }

    changeGif(data: {w:number,h:number,image: string,timeLife: number,flip?: number}){
        const {centerW,centerH} = this.centerPosition(data.w,data.h)
        const canvasPosition = Game.canvas.getBoundingClientRect()
        if(this.imageGif === null) return
        if(this.imageGif.src.split("/").at(-1) !== data.image){
            this.imageGif.src = data.image
        } 
        this.imageGif.setAttribute("style",`transform: scaleX(${data.flip});width: ${data.w}px; left: ${canvasPosition.left + (this.x - centerW)}px;top: ${canvasPosition.top + (this.y - centerH)}px`)
    }




    isOutSideOfGame(){
        if(this.x + this.w > Game.canvas.width) return true
        if(this.x < 0) return true
        if(this.y < 0) return true
        if(this.y + this.h > Game.canvas.height) return true
        return false
    }

    async deforeRender(): Promise<void>{

    }

    collision(_:IGameObject){
    
    }
}