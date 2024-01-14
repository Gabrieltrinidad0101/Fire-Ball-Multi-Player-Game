import { GameObject } from "../object/object";

export class Game {
    static canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement
    private static context: CanvasRenderingContext2D | undefined | null = Game.canvas?.getContext("2d")
    static objects: Map<string, GameObject> = new Map<string, GameObject>();
    context(): CanvasRenderingContext2D {
        if (!Game.context) {
            Game.canvas = document.getElementById("game") as HTMLCanvasElement
            Game.context = Game.canvas?.getContext("2d")
            if(!Game.context) throw new Error("Canvas not exit")
        }

        console.log(Game.canvas.getBoundingClientRect())

        return Game.context
    }

    private loadImage = async (image: string): Promise<HTMLImageElement> => new Promise((res) => {
        var img = new Image;
        img.onload = () => {
            res(img)
        };
        img.src = image ?? "";
    })

    wait = (time: number) => new Promise(res => setInterval(res, time))

    async render(imagesPath: Array<string>) {
        const imagesElement: Map<string,HTMLImageElement> = new Map()
        for (const imagePath of imagesPath) {
            imagesElement.set(imagePath,await this.loadImage(imagePath))
        }

        while (true) {
            try {
                Game.context?.clearRect(0,0,Game.canvas.width,Game.canvas.height)
                Game.context?.fillRect(0,0,Game.canvas.width,Game.canvas.height)
                for (const keyValueObject of Game.objects) {
                    const object = keyValueObject[1]
                    if (object == null) return
                    const imageElement = imagesElement.get(object.image ?? "")
                    object.deforeRender()
                    this.collisionDetector()
                    if(imageElement) Game.context?.drawImage(imageElement, object.x, object.y, object.w, object.h)
                }
                await this.wait(100)
            } catch (error) {
                console.log(error)
            }
        }
    }

    collisionDetector() {
        Game.objects.forEach(object1 => {
            Game.objects.forEach(object2 => {
                if (object1.id === object2.id) return
                if (
                    object1.x < object2.x + object2.w &&
                    object1.x + object1.w > object2.x &&
                    object1.y < object2.y + object2.h &&
                    object1.y + object1.h > object2.y
                ) {
                    object1.collision(object2)
                    object2.collision(object1)
                }
            })
        })
    }


    static deleteObject(id: string) {
        Game.objects.delete(id)
    }
}