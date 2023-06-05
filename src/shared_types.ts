interface RGB {
  r: number,
  g: number,
  b: number,
};

interface Coordinates {
  x: number,
  y: number
};

interface Dimensions {
  w: number,
  h: number
};

type PixelBits = Array<number | []>



export {
  RGB,
  Coordinates,
  Dimensions,
  PixelBits
};