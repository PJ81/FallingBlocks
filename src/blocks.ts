import * as Const from "./const.js";
import Resource from "./resources.js";
import Point from "./point.js";
import Block from "./block.js";
import Game from "./game.js";

class FallingBlocks extends Game {
  res: Resource;
  blocks: Block[];
  moving: Block[];
  timer: number;
  state: number;
  count: number;

  constructor() {
    super();
    this.res = new Resource();
    this.res.loadImages(["bs.png", "rs.png", "gs.png", "ys.png"], () => {
      this.canvas.addEventListener("click", (e: MouseEvent) => this.click(e, null));
      this.canvas.addEventListener("touchstart", (e: TouchEvent) => this.click(null, e));
      this.loop();
    });

    this.blocks = [];
    this.moving = [];
    for (let x = 0; x < 100; x++) {
      this.blocks.push(null);
    }

    this.timer = .1;
    this.count = 0;
    this.state = Const.FILL;
  }

  draw() {
    this.moving.forEach(el => { if (el && el.state !== Const.OUT) el.draw(this.ctx) });
    this.blocks.forEach(el => { if (el && el.state !== Const.OUT) el.draw(this.ctx) });
  }

  update(dt: number) {
    let f = false;
    this.moving.forEach((el, dx) => {
      if (el && el.state === Const.MOVE_DOWN) {
        f = true;
        el.update(dt);
        if (el.moved >= 40) {
          const col = ~~(el.pos.x / 40),
            row = ~~(el.pos.y / 40);
          if (row < 10 && this.blocks[(row + 1) * 10 + col] !== null || row === 10) {
            el.pos.y = row * 40;
            this.blocks[(row) * 10 + col] = el.clone();
            this.moving[dx] = null;
            if (row === 0) {
              this.state = Const.SHAKE;
              this.blocks.forEach(el => { if (el) el.state = Const.SHAKE; });
              this.timer = 1;
            }
          }
        }
      }
      if (!f) {
        let adj = false;
        for (let x = 0; x < 9; x++) {
          if (!this.blocks[x + 90]) {
            for (let y = 9; y > 0; y--) {
              for (let xx = x; xx < 9; xx++) {
                const b = this.blocks[xx + 1 + 10 * y];
                if (b) {
                  this.blocks[xx + 10 * y] = b;
                  b.pos.set(xx * 40, y * 40);
                  this.blocks[xx + 1 + 10 * y] = null;
                  adj = true;
                }
              }
            }
            if (adj) {
              adj = false;
              x--;
            }
          }
        }
      }
    });

    switch (this.state) {
      case Const.SHAKE: this.updateShake(dt); break;
      case Const.FLY: this.updateFly(dt); break;
      case Const.FILL: this.updateFill(dt); break
      case Const.WAIT:
        if ((this.timer -= dt) < 0) {
          this.count = 0;
          this.state = Const.FILL;
          this.updateFill(dt); break
        }
        break;
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
      const sm = this.removeBlocks(pt, bl.type);
      if (sm > 1) {
        this.blocks.forEach(el => {
          if (el) {
            el.visited = false;
            if (el.remove.x > -1)
              this.blocks[el.remove.x + 10 * el.remove.y] = null;
          }
        });
        this.blocks[pt.x + 10 * pt.y] = null;
        this.moveBlocksDown();
      } else {
        this.blocks.forEach(el => {
          if (el) {
            el.visited = false;
            el.remove.set(-1, -1);
          }
        });
      }
    }
  }

  removeBlocks(pt: Point, tp: number): number {
    if (pt.x < 0 || pt.y < 0 || pt.x > 9 || pt.y > 9) return 0;
    const el = this.blocks[pt.x + 10 * pt.y];
    if (!el || el.visited) return 0;
    el.visited = true;
    if (el.type !== tp) return 0;
    el.remove.set(pt.x, pt.y);
    let r = 1;
    r += this.removeBlocks(new Point(pt.x + 1, pt.y), tp);
    r += this.removeBlocks(new Point(pt.x - 1, pt.y), tp);
    r += this.removeBlocks(new Point(pt.x, pt.y + 1), tp);
    r += this.removeBlocks(new Point(pt.x, pt.y - 1), tp);
    return r;
  }

  moveBlocksDown() {
    for (let y = 9; y > 0; y--) {
      for (let x = 0; x < 10; x++) {
        if (!this.blocks[x + 10 * y]) {
          let yy = y - 1;
          while (yy > 0 && this.blocks[x + 10 * yy]) {
            const e = this.blocks[x + 10 * yy].clone();
            this.blocks[x + 10 * yy] = null;
            e.state = Const.MOVE_DOWN;
            this.moving.push(e);
            yy--;
          }
        }
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
    if ((this.timer -= dt) < 0) {
      const nb = new Block();
      nb.type = Const.RND(0, 4);
      nb.setImage(this.res.images[nb.type], 0);
      nb.pos.set(this.count * 40, 0);
      this.moving.push(nb);
      this.timer = .21;
      if (++this.count === 10) {
        this.state = Const.WAIT;
        this.timer = 1;
        this.moving.forEach(el => {
          if (el) el.state = Const.MOVE_DOWN;
        });
      }
    }
  }
}

new FallingBlocks();