import Game from "./game.js";
import Resource from "./resources.js";
import Blocks from "./blocks.js";

class FB extends Game {
  res: Resource;
  blocks: Blocks;

  constructor() {
    super();
    this.res = new Resource();
    this.res.loadImages(["bs.png", "rs.png", "gs.png", "ys.png"], () => {
      this.blocks = new Blocks([this.res.images[0], this.res.images[1], this.res.images[2], this.res.images[3]]);
      this.canvas.addEventListener("click", (e: MouseEvent) => this.blocks.click(e, null));
      this.canvas.addEventListener("touchstart", (e: TouchEvent) => this.blocks.click(null, e));
      this.loop();
    });
  }

  update(dt: number) {
    this.blocks.update(dt);
  }

  draw() {
    this.blocks.draw(this.ctx);
  }
}

new FB();