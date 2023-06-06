interface RGBA {
  r: number,
  g: number,
  b: number,
  a: number
};

interface Hue {
  r: number,
  g: number,
  b: number
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
  Hue,
  Coordinates,
  Dimensions,
  PixelBits
};