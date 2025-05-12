import { GameObject } from "../object/object";

export class Game {
  static canvas: HTMLCanvasElement = document.getElementById(
    "game"
  ) as HTMLCanvasElement;
  static canvasContainer: HTMLDivElement | null = null;
  private static context: CanvasRenderingContext2D | undefined | null =
    Game.canvas?.getContext("2d");
  static objects: Map<string, GameObject> = new Map<string, GameObject>();
  static cameraWidth = 500;
  background: string = "";
  context(): CanvasRenderingContext2D {
    if (!Game.context) {
      Game.canvasContainer = document.querySelector(".canvasContiner");
      Game.canvas = document.getElementById("game") as HTMLCanvasElement;
      Game.context = Game.canvas?.getContext("2d");
      if (!Game.context) throw new Error("Canvas not exit");
    }
    return Game.context;
  }

  private loadImage = async (image: string): Promise<HTMLImageElement> =>
    new Promise((res) => {
      var img = new Image();
      img.onload = () => {
        res(img);
      };
      img.src = `./${image}`;
    });

  private drawImage(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    object: GameObject
  ) {
    const { centerW, centerH } = object.centerPosition(
      object.imageW ?? object.w,
      object.imageH ?? object.h
    );
    ctx.save();
    ctx.setTransform(
      object.flipX ? -1 : 1,
      0,
      0,
      1,
      object.x + (object.flipX ? object.imageW ?? object.w : 0) - centerW,
      object.y - centerH
    );
    ctx.drawImage(
      image,
      0,
      0,
      object.imageW ?? object.w,
      object.imageH ?? object.h
    );
    ctx.restore(); // restore the state as it was when this function was called
  }

  wait = (time: number) => new Promise((res) => setInterval(res, time));

  #render = (imagesElement: Map<string, HTMLImageElement>) => {
    if (!window.location.href.includes("#/Game/")) return;
    if (!Game.context) return;
    Game.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    if (this.background != "") {
      const imageElement = imagesElement.get(this.background);
      if (imageElement)
        Game.context?.drawImage(
          imageElement,
          0,
          0,
          Game.canvas.width * 2,
          Game.canvas.height
        );
    }
    for (const keyValueObject of Game.objects) {
        const object = keyValueObject[1];
      if (object == null) return;
      object.deforeRender();
      this.collisionDetector();
      if (object.image === undefined) return;
      const imageElement = imagesElement.get(object.image);
      if (imageElement === undefined) return;
      console.log(imageElement);
      this.drawImage(Game.context, imageElement, object);
    }
    window.requestAnimationFrame(() => this.#render(imagesElement));
  };

  async render(imagesPath: Array<string>) {
    try {
      const imagesElement: Map<string, HTMLImageElement> = new Map();
      for (const imagePath of imagesPath) {
        imagesElement.set(imagePath, await this.loadImage(imagePath));
      }
      window.requestAnimationFrame(() => {
        this.#render(imagesElement);
      });
    } catch (error) {
      console.error(error);
    }
  }

  collisionDetector() {
    Game.objects.forEach((object1) => {
      Game.objects.forEach((object2) => {
        if (object1.id === object2.id) return;
        if (
          object1.x < object2.x + object2.w &&
          object1.x + object1.w > object2.x &&
          object1.y < object2.y + object2.h &&
          object1.y + object1.h > object2.y
        ) {
          object1.collision(object2);
          object2.collision(object1);
        }
      });
    });
  }

  static deleteObject(id: string) {
    Game.objects.delete(id);
  }
}
