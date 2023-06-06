interface RGBA {
  r: number,
  g: number,
  b: number,
  a: number
};

interface RGB {
  r: number,
  g: number,
  b: number
};

type Color = RGB | RGBA;

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
  RGB,
  Color,
  Coordinates,
  Dimensions,
  PixelBits
};