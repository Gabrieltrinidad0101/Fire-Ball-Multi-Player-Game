import { Game } from "../game/game";
import { GameObject, IBaseGameObject, IGameObject } from "../object/object";

export type TDirrection = "left" | "rigth" | "up" | "down"

export class Bullet extends GameObject{
    userId: string = ""
    constructor(userId: string,baseGameObject: IBaseGameObject){
        const gameObject = baseGameObject as IGameObject
        gameObject.type = "bullet"
        super(gameObject)
        this.userId = userId
    }
    dirrection: TDirrection = "left"

    async deforeRender(): Promise<void>{
        if(this.dirrection === "left") this.x -= 30       
        if(this.dirrection === "rigth") this.x += 30
        if(this.isOutSideOfGame())
            Game.deleteObject(this.id)
    }

    collision(object: IGameObject): void {
        if(object.id === this.userId) return
        if(object instanceof Bullet && (object as Bullet).userId === this.userId) return
        if(object.type == "object") return
        Game.deleteObject(this.id)
        this.showGif({h: this.h, w: this.w,image: "explosion.gif",timeLife: 500})
    }
}