interface RGBA {
  r: number,
  g: number,
  b: number,
  a: number
};

interface HSL {
  h: number,
  s: number,
  l: number
};

interface HSV {
  h: number,
  s: number,
  v: number
};

interface Coordinates {
  x: number,
  y: number
};

interface Dimensions {
  w: number,
  h: number
};

type PixelBits = Array<number>



export {
  RGBA,
  HSL,
  HSV,
  Coordinates,
  Dimensions,
  PixelBits
};