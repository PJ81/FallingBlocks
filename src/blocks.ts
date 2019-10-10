import * as Const from "./const.js";
import Point from "./point.js";
import Block from "./block.js";

export default class Blocks {
  imgs: HTMLImageElement[];
  blocks: Block[];
  timer: number;
  state: number;
  count: number;

  constructor(img: HTMLImageElement[]) {
    this.blocks = [];
    for (let x = 0; x < 100; x++) {
      this.blocks.push(null);
    }
    this.imgs = img;
    this.timer = .1;
    this.count = 0;
    this.state = Const.FILL;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.blocks.forEach(el => { if (el && el.state !== Const.OUT) el.draw(ctx) });
  }

  update(dt: number) {
    switch (this.state) {
      case Const.SHAKE: this.updateShake(dt); break;
      case Const.FLY: this.updateFly(dt); break;
      case Const.FILL: this.updateFill(dt); break
      case Const.FALL: this.updateFall(dt); break
      case Const.START: break;
      case Const.OVER: break;
    }
  }

  click(m: MouseEvent, t: TouchEvent) {
    const pt = new Point();
    if (m) {
      pt.x = ~~((m.clientX - (m.srcElement as HTMLCanvasElement).offsetLeft) / 40);
      pt.y = ~~((m.clientY - (m.srcElement as HTMLCanvasElement).offsetTop) / 40);
    } else {
      pt.x = ~~((t.touches[0].clientX - (t.srcElement as HTMLCanvasElement).offsetLeft) / 40);
      pt.y = ~~((t.touches[0].clientY - (t.srcElement as HTMLCanvasElement).offsetTop) / 40);
    }

    const bl = this.blocks[pt.x + 10 * pt.y];
    if (bl && bl.state === Const.NONE) {
      this.blocks[pt.x + 10 * pt.y] = null;
      this.moveBlocks();
    }
  }

  checkBlocks() {
    const mv = this.blocks.filter(el => el && el.state === Const.MOVING);
    let ret = true;
    mv.forEach((el) => {
      if (el.moved >= 40) {
        const col = ~~(el.pos.x / 40),
          row = ~~(el.pos.y / 40);
        if (row < 10 && this.blocks[(row + 1) * 10 + col] !== null || row === 10) {
          el.pos.y = row * 40;
          this.count--;
          this.blocks[(row) * 10 + col] = el.clone();
          if (row === 0) {
            this.state = Const.SHAKE;
            ret = false;
            this.blocks.forEach(el => { if (el) el.state = Const.SHAKE; });
            this.timer = 1;
          }
        }
      }
    });
    return ret;
  }

  moveBlocks() {
    for (let y = 9; y > 0; y--) {
      for (let x = 0; x < 10; x++) {
        if (!this.blocks[x + 10 * y] && this.blocks[x + 10 * (y - 1)])
          this.blocks[x + 10 * (y - 1)].state = Const.MOVING;
      }
    }
  }

  updateShake(dt: number) {
    this.blocks.forEach(el => { if (el) el.update(dt) });
    if ((this.timer -= dt) < 0) {
      this.timer = 0;
      this.state = Const.FLY;
      this.blocks.forEach(el => {
        if (el) {
          el.state = Const.FLY;
          const a = Math.random() * Const.TWO_PI;
          el.velocity.set(300 * Math.cos(a), 300 * Math.sin(a));
        }
      });
    }
  }

  updateFly(dt: number) {
    this.count = 0;
    this.blocks.forEach(el => {
      if (el) {
        el.update(dt);
        if (el.state === Const.OUT) {
          if ((++this.count) === 100) {
            this.state = Const.OVER;
          }
        }
      }
    });
  }

  updateFill(dt: number) {
    this.blocks.forEach(el => { if (el) el.update(dt) });
    if ((this.timer -= dt) < 0) {
      const nb = new Block();
      nb.type = Const.RND(0, 4);
      nb.setImage(this.imgs[nb.type], 0);
      nb.pos.set(this.count * 40, 0);
      this.blocks[this.count] = nb;
      this.timer = .1;
      if (++this.count === 10) {
        this.state = Const.FALL;
        for (let b = 0; b < 10; b++)
          this.blocks[b].state = Const.MOVING;
      }
    }
  }

  updateFall(dt: number) {
    let check = false;
    this.blocks.forEach(el => {
      if (el && el.state === Const.MOVING) {
        el.update(dt);
        check = true;
      }
    });
    if (check) this.checkBlocks();
    else this.state = Const.FILL;
  }
}