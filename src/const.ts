
export const
  WIDTH = 400,
  HEIGHT = 400,
  SCALE = 1,

  BLUE = 0,
  RED = 1,
  GREEN = 2,
  YELLOW = 3,

  START = 1,
  FILL = 2,
  FALL = 4,

  RND = (mn: number, mx: number) => {
    return Math.floor(Math.random() * (mx - mn) + mn);
  },

  RNDArr = (arr: any[]): any => {
    if (arr.length < 1) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };