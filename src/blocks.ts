import Entity from "./entity.js";
import * as Const from "./const.js";

class Block extends Entity {
  moving: boolean;
  moved: number;
  shake: boolean;

  constructor() {
    super();
    this.moved = 40;
    this.moving = false;
    this.shake = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    let x = this.pos.x, y = this.pos.y;
    if (this.shake) {
      x += Math.random() < .5 ? 1 : -1;
      y += Math.random() < .5 ? 1 : -1;
    }
    ctx.drawImage(this.imgFrames[this.animFrame], x, y);
  }

  update(dt: number) {
    if (this.moving) {
      const speed = 200 * dt;
      this.pos.y += speed;
      this.moved += speed;
    }
  }
}

export default class Blocks {
  imgs: HTMLImageElement[];
  blocks: Block[];
  topLine: Block[];
  nextBlock: number;
  state: number;
  count: number;

  constructor(img: HTMLImageElement[]) {
    this.topLine = [];
    for (let x = 0; x < 10; x++) {
      this.topLine.push(null);
    }
    this.blocks = [];
    for (let x = 0; x < 100; x++) {
      this.blocks.push(null);
    }
    this.imgs = img;
    this.nextBlock = .1;
    this.count = 0;
    this.state = Const.FILL;
  }

  createOne() {
    const nb = new Block();
    nb.type = Const.RND(0, 4);
    nb.setImage(this.imgs[nb.type], 0);
    nb.pos.set(this.count * 40, 0);
    this.topLine[this.count] = nb;
  }

  checkBlocks() {
    const mv = this.topLine.filter(el => el.moving);
    let ret = true;
    mv.forEach((el, id) => {
      if (el.moved >= 40) {
        const col = ~~(el.pos.x / 40),
          row = ~~(el.pos.y / 40);
        if (row < 10 && this.blocks[(row + 1) * 10 + col] !== null || row === 10) {
          el.pos.y = row * 40;
          el.moving = false;
          this.count--;
          this.blocks[(row) * 10 + col] = el;
          this.topLine[id] = null;
          if (row === 0) {
            this.state = Const.OVER;
            ret = false;
            this.blocks.forEach(el => { if (el) el.shake = true });
          }
        }
      }
    });
    return ret;
  }

  update(dt: number) {
    switch (this.state) {
      case Const.START:
        break;
      case Const.OVER:
        break;
      case Const.FILL:
        if ((this.nextBlock -= dt) < 0) {
          this.createOne();
          this.nextBlock = .1;
          if (++this.count === 10) {
            this.state = Const.FALL;
            this.topLine.forEach(el => el.moving = true);
          }
        }
        break
      case Const.FALL:
        let check = false;
        this.topLine.forEach(el => {
          if (el && el.moving) {
            el.update(dt);
            check = true;
          }
        });
        if (check) {
          this.checkBlocks();
        } else {
          this.state = Const.FILL;
        }
        break
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.topLine.forEach(el => { if (el) el.draw(ctx) });
    this.blocks.forEach(el => { if (el) el.draw(ctx) });
  }
}