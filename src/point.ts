export default class Point {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x;
    this.y;
    this.set(x, y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(pt: Point): boolean {
    return pt.x === this.x && pt.y === this.y;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length();
    this.x /= len;
    this.y /= len;
  }

  rotate(a: number) {
    const cos = Math.cos(a),
      sin = Math.sin(a);
    this.set(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  clamp(min: number, max: number) {
    this.x = Math.min(Math.max(this.x, min), max);
    this.y = Math.min(Math.max(this.y, min), max);
  }

  dist(pt: Point): number {
    let a = pt.x - this.x,
      b = pt.y - this.y;
    return Math.sqrt(a * a + b * b);
  }

  copy(): Point {
    return new Point(this.x, this.y);
  }

  heading(pt: Point): Point {
    const h = new Point(pt.x - this.x, pt.y - this.y);
    h.normalize();
    return h;
  }

  angleBetween(pt: Point): number {
    return Math.atan2(-(pt.y - this.y), -(pt.x - this.x));
    //return Math.atan((pt.y - this.y) / (pt.x - this.x));
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  limit(max: number) {
    if (this.magSq() > max * max) {
      this.normalize();
      this.x *= max;
      this.y *= max;
    }
  }
}