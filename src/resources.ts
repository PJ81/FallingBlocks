import * as Const from "./const.js";

export default class Resource {
  images: HTMLImageElement[];
  constructor() {
    this.images;
  }

  loadImages(path: string[], callback: Function) {
    let idx = 0;
    const promises = [];
    this.images = new Array(path.length);
    path.forEach(f => promises.push(this.loadImage(`../img/${f}`)));
    Promise.all(promises).then((res) => {
      res.forEach(img => this.images[idx++] = img);
    }).then(() => callback());
  }

  loadImage(url: string) {
    return new Promise((res) => {
      const img: HTMLImageElement = new Image();
      img.src = url;
      img.onload = () => res(img);
    });
  }
}