import * as Const from "./const.js"
import Point from "./point.js";

export default class Entity {
  pos: Point;
  velocity: Point;
  alive: boolean;
  hasAnimation: boolean;
  angle: number;
  energy: number;
  turnDir: number;
  width: number;
  height: number;
  type: number;
  score: number;
  hitScore: number;
  animTimer: number;
  animFrame: number;
  imgFrames: HTMLImageElement[];

  constructor(x: number = -200, y: number = -200) {
    this.alive = true;
    this.hasAnimation = false;
    this.pos = new Point(x, y);
    this.velocity = new Point();
    this.turnDir = 0;
    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this.energy = 0;
    this.type = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.score = 0;
    this.hitScore = 0;
    this.imgFrames = [];
  }

  isVisible(): boolean {
    return (this.left > 0 && this.right < Const.WIDTH && this.top > 0 && this.bottom < Const.HEIGHT);
  }

  inBounds(): boolean {
    return !(this.left > Const.WIDTH || this.top > Const.HEIGHT || this.right < 0 || this.bottom < 0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.imgFrames[this.animFrame], this.left, this.top);
  }

  update(dt: number) {
    if (this.hasAnimation) {
      if ((this.animTimer -= dt) < 0) {
        this.animTimer = .5;
        this.animFrame = (this.animFrame + 1) % this.imgFrames.length;
      }
    }
  }

  setImage(img: HTMLImageElement, idx = -1) {
    if (img) {
      if (idx < 0) {
        this.imgFrames.push(img);
      } else {
        this.imgFrames[idx] = img;
      }
      this.width = img.width;
      this.height = img.height;
    }
  }

  get top(): number {
    return this.pos.y - (this.height >> 1);
  }

  get bottom(): number {
    return this.pos.y + (this.height >> 1);
  }

  get left(): number {
    return this.pos.x - (this.width >> 1);
  }

  get right(): number {
    return this.pos.x + (this.width >> 1);
  }

  get box(): object {
    return {
      l: this.left,
      t: this.top,
      r: this.right,
      b: this.bottom
    }
  }

  drawBox(ctx: CanvasRenderingContext2D) {
    const w = this.right - this.left,
      h = this.bottom - this.top;
    ctx.strokeStyle = "#f00";
    ctx.beginPath()
    ctx.rect(this.left, this.top, w, h);
    ctx.stroke();
  }
}