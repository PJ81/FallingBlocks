import Entity from "./entity.js";
import * as Const from "./const.js";

class Block extends Entity {
  moving: boolean;
  moved: number;

  constructor() {
    super();
    this.moved = 0;
    this.moving = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.imgFrames[this.animFrame], this.pos.x, this.pos.y);
  }

  update(dt: number) {
    if (this.moving) {
      const speed = 100 * dt;
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

  constructor(img: HTMLImageElement[]) {
    this.topLine = [];
    this.blocks = [];
    for (let x = 0; x < 100; x++) {
      this.blocks.push(null);
    }
    this.imgs = img;
    this.nextBlock = .5;
    this.state = Const.FILL;
  }

  createOne() {
    const nb = new Block();
    nb.type = Const.RND(0, 4);
    nb.setImage(this.imgs[nb.type], 0);
    const x = this.topLine.length * 40;
    nb.pos.set(x, 0);
    this.topLine.push(nb);
  }

  checkBlocks() {
    const mv = this.topLine.filter(el => el.moving);
    mv.forEach((el, id) => {
      if (el.moved >= 40) {
        const col = ~~(el.pos.x / 40),
          row = ~~(el.pos.y / 40);
        if (row < 10 && this.blocks[(row + 1) * 10 + col] !== null || row === 10) {
          el.pos.y = row * 40;
          el.moving = false;
          this.blocks[(row) * 10 + col] = el;
          this.topLine[id] = null;

        }
      }
    });
  }

  update(dt: number) {
    switch (this.state) {
      case Const.START:
        break;
      case Const.FILL:
        if ((this.nextBlock -= dt) < 0) {
          this.createOne();
          this.nextBlock = .5;
          if (this.topLine.length === 10) {
            this.state = Const.FALL;
            this.topLine.forEach(el => el.moving = true);
          }
        }
        break
      case Const.FALL:
        let check = false;
        this.topLine.forEach(el => {
          if (el.moving) {
            el.update(dt);
            check = true;
          }
        });
        if (check) this.checkBlocks();
        else {
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