import Entity from "./entity.js";
import * as Const from "./const.js";
import Point from "./point.js";

export default class Block extends Entity {
  state: number;
  moved: number;
  remove: Point;
  visited: Boolean;

  constructor() {
    super();
    this.moved = 40;
    this.remove = new Point(-1, -1);
    this.visited = false;
    this.state = Const.NONE;
    this.velocity.set(0, 600);
  }

  clone(): Block {
    const b = new Block();
    b.type = this.type;
    b.remove.set(this.remove.x, this.remove.y);
    b.pos.set(this.pos.x, this.pos.y);
    b.setImage(this.imgFrames[this.animFrame]);
    return b;
  }

  draw(ctx: CanvasRenderingContext2D) {
    let x = this.pos.x, y = this.pos.y;
    if (this.state === Const.SHAKE) {
      x += Math.random() < .5 ? 1 : -1;
      y += Math.random() < .5 ? 1 : -1;
    }
    ctx.drawImage(this.imgFrames[this.animFrame], x, y);
  }

  update(dt: number) {
    switch (this.state) {
      case Const.MOVING:
        const spd = this.velocity.y * dt;
        this.pos.y += spd;
        this.moved += spd;
        break;
      case Const.FLY:
        this.pos.x += this.velocity.x * dt;
        this.pos.y += this.velocity.y * dt;
        this.state = this.right < -20 || this.bottom < -20 || this.top > Const.HEIGHT || this.left > Const.WIDTH ? Const.OUT : this.state;
        this.velocity.x *= 1.0025;
        this.velocity.y *= 1.0025;
        break;
    }
  }
}