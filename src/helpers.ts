import $ from 'jquery';
import JSColorPicker from './index';
import * as shared_types from './shared_types';



// UPDATES COLOR PICKERS

function updateComponentCanvasDimensions(jscp_component: HTMLElement, component_canvas_context: CanvasRenderingContext2D): shared_types.Dimensions {
  const COMPONENT_RECT: DOMRect = jscp_component.getBoundingClientRect();
  const ADJUSTED_WIDTH: number = Math.ceil(COMPONENT_RECT.width);
  const ADJUSTED_HEIGHT: number = Math.ceil(COMPONENT_RECT.height);

  const COMPONENT_CANVAS: HTMLCanvasElement = component_canvas_context.canvas;
  COMPONENT_CANVAS.width = ADJUSTED_WIDTH;
  COMPONENT_CANVAS.height = ADJUSTED_HEIGHT;

  return {
    w: ADJUSTED_WIDTH,
    h: ADJUSTED_HEIGHT
  };
};

function updateAlphaChannelDisplay(color_picker: JSColorPicker) {
  if (color_picker.alpha_channel === undefined) {
    throw ReferenceError();
  }

  const SELECTED_COLOR: shared_types.RGBA = color_picker.selected_color;

  color_picker.alpha_channel.css({'background': `linear-gradient(rgb(${SELECTED_COLOR.r}, ${SELECTED_COLOR.g}, ${SELECTED_COLOR.b}), transparent)`});
};

function updateShadeAndTintDisplay(color_picker: JSColorPicker) {
  if (color_picker.shades_and_tints === undefined) {
    throw ReferenceError();
  }

  const SELECTED_COLOR: shared_types.RGBA = color_picker.selected_color;

  color_picker.shades_and_tints.css({'background': `linear-gradient(0deg, black, transparent), linear-gradient(270deg, rgb(${SELECTED_COLOR.r}, ${SELECTED_COLOR.g}, ${SELECTED_COLOR.b}), white)`});
};

function updateSNTCursorBackground(color_picker: JSColorPicker) {
  if (color_picker.snt_cursor === undefined) {
    throw ReferenceError();
  }

  const SELECTED_COLOR: shared_types.RGBA = color_picker.selected_color;

  color_picker.snt_cursor.css('background-color', `rgb(${SELECTED_COLOR.r}, ${SELECTED_COLOR.g}, ${SELECTED_COLOR.b})`);
};

function updateColorDisplay(color_picker: JSColorPicker) {
  if (color_picker.color_display === undefined) {
    throw ReferenceError();
  }

  const SELECTED_COLOR: shared_types.RGBA = color_picker.selected_color;

  color_picker.color_display.css('background-color', `rgba(${SELECTED_COLOR.r}, ${SELECTED_COLOR.g}, ${SELECTED_COLOR.b}, ${SELECTED_COLOR.a})`);
};

function updateSearchbarColor(color_picker: JSColorPicker) {
  const COLOR_FORMAT: string = color_picker.color_format;

  if (COLOR_FORMAT === undefined) {
    throw ReferenceError();
  }

  if (color_picker.searchbar === undefined) {
    throw ReferenceError();
  }

  if (COLOR_FORMAT !== 'rgb') {
    throw Error('Only the following formats are allowed: rgb');
  }

  const SELECTED_COLOR: shared_types.RGBA = color_picker.selected_color;

  switch (COLOR_FORMAT) {
    case 'rgb':
      color_picker.searchbar.val(`rgba(${SELECTED_COLOR.r}, ${SELECTED_COLOR.g}, ${SELECTED_COLOR.b}, ${SELECTED_COLOR.a})`);
      break;
    default:
  }
};

function updateShadeAndTintCanvas(color_picker: JSColorPicker) {
  if (color_picker.snt_canvas_context === null) {
    throw ReferenceError();
  }

  redrawShadeAndTintCanvasGradient(
    color_picker.snt_canvas_context,
    color_picker.selected_color
  );

  const SNT_CANVAS: HTMLCanvasElement = color_picker.snt_canvas_context.canvas;

  color_picker.sntc_image_data = color_picker.snt_canvas_context.getImageData(0, 0, SNT_CANVAS.width, SNT_CANVAS.height);
};

function updateSNTCursorSize(color_picker: JSColorPicker) {
  if (color_picker.color_picker === undefined) {
    throw ReferenceError();
  }

  if (color_picker.snt_cursor === undefined) {
    throw ReferenceError();
  }

  const CURSOR_SIZE: number = color_picker.color_picker[0].offsetWidth * 0.02;

  color_picker.snt_cursor.css({
    width: CURSOR_SIZE,
    height: CURSOR_SIZE
  });
};



// GETTERS

function getPixel(canvas_image_data: ImageData, x: number, y: number): shared_types.PixelBits {
  const PIXELS: Uint8ClampedArray = canvas_image_data.data;

  // prevents the coordinates from going out of bounds
  if (x >= canvas_image_data.width) {
    x = canvas_image_data.width - 1;
  }

  if (y >= canvas_image_data.height) {
    y = canvas_image_data.height - 1;
  }

  // gets the index of the pixel at a given coordinate
  const INDEX: number = (y * canvas_image_data.width * 4) + (x * 4);

  const R: number = PIXELS[INDEX];
  const G: number = PIXELS[INDEX + 1];
  const B: number = PIXELS[INDEX + 2];
  const A: number = PIXELS[INDEX + 3];

  return [R, G, B, A];
};

function getAlpha(alpha_channel_component: HTMLElement, vertical_slider_position: JQuery.Coordinates): number {
  if ($(alpha_channel_component).hasClass('alpha_channel') === false) {
    throw ReferenceError("Not a color picker's alpha channel component");
  }

  const ALPHA_CHANNEL_HEIGHT: number = alpha_channel_component.offsetHeight;

  let alpha: number = (ALPHA_CHANNEL_HEIGHT - vertical_slider_position.top) / ALPHA_CHANNEL_HEIGHT;

  alpha = parseFloat((alpha).toFixed(2));

  return alpha;
};

function getMousePositionRelativeToElement(element: HTMLElement, mouse_x: number, mouse_y: number): shared_types.Coordinates {
  return {
    x: mouse_x - element.offsetLeft,
    y: mouse_y - element.offsetTop
  };
};

function getSNTCursorAbsoluteCoordinates(snt_cursor: HTMLElement, relative_position: JQuery.Coordinates): shared_types.Coordinates {
  const SNTC: JQuery<HTMLElement> = $(snt_cursor);
  const SNTC_PARENT: JQuery<HTMLElement> = SNTC.parent();

  if (SNTC.hasClass('cursor') === false || SNTC_PARENT.hasClass('shade_AND_tint') === false) {
    throw ReferenceError("Not a shade and tint component cursor");
  }

  return {
    x: Math.round(relative_position.left * SNTC_PARENT[0].offsetWidth),
    y: Math.round(relative_position.top * SNTC_PARENT[0].offsetHeight)
  };
};



// REDRAWS CANVASES

function redrawHueCanvasGradient(hue_canvas_context: CanvasRenderingContext2D) {
  const HUE_CANVAS = hue_canvas_context.canvas;

  if ($(HUE_CANVAS).hasClass('hue_canvas')) {
    const HUE_GRADIENT = hue_canvas_context.createLinearGradient(0, 0, 0, HUE_CANVAS.height);
    HUE_GRADIENT.addColorStop(0.1/6, "red");
    HUE_GRADIENT.addColorStop(1/6, "orange");
    HUE_GRADIENT.addColorStop(2/6, "yellow");
    HUE_GRADIENT.addColorStop(3/6, "greenyellow");
    HUE_GRADIENT.addColorStop(4/6, "cyan");
    HUE_GRADIENT.addColorStop(5/6, "blue");
    HUE_GRADIENT.addColorStop(6/6, "magenta");

    hue_canvas_context.fillStyle = HUE_GRADIENT;
    hue_canvas_context.fillRect(0, 0, HUE_CANVAS.width, HUE_CANVAS.height);
  }
  else {
    throw ReferenceError("Not the 2D canvas rendering context of a color picker's hue component");
  }
};

function redrawShadeAndTintCanvasGradient(snt_canvas_context: CanvasRenderingContext2D, selected_color: shared_types.RGBA) {
  const SNT_CANVAS = snt_canvas_context.canvas;

  if ($(SNT_CANVAS).hasClass('snt_canvas')) {
    const RGB: string = `${selected_color.r}, ${selected_color.g}, ${selected_color.b}`;

    const SNT_TINT_GRADIENT: CanvasGradient = snt_canvas_context.createLinearGradient(SNT_CANVAS.width, 0, 0, 0);
    SNT_TINT_GRADIENT.addColorStop(0.01, `rgba(${RGB}, 1)`);
    SNT_TINT_GRADIENT.addColorStop(1, 'white');

    snt_canvas_context.fillStyle = SNT_TINT_GRADIENT;
    snt_canvas_context.fillRect(0, 0, SNT_CANVAS.width, SNT_CANVAS.height);

    const SNT_SHADE_GRADIENT: CanvasGradient = snt_canvas_context.createLinearGradient(0, SNT_CANVAS.height, 0, 0);
    SNT_SHADE_GRADIENT.addColorStop(0.01, "rgba(0, 0, 0, 1)");
    SNT_SHADE_GRADIENT.addColorStop(0.1, "rgba(0, 0, 0, 0.9)");
    SNT_SHADE_GRADIENT.addColorStop(0.2, "rgba(0, 0, 0, 0.8)");
    SNT_SHADE_GRADIENT.addColorStop(0.3, "rgba(0, 0, 0, 0.7)");
    SNT_SHADE_GRADIENT.addColorStop(0.4, "rgba(0, 0, 0, 0.6)");
    SNT_SHADE_GRADIENT.addColorStop(0.5, "rgba(0, 0, 0, 0.5)");
    SNT_SHADE_GRADIENT.addColorStop(0.6, "rgba(0, 0, 0, 0.4)");
    SNT_SHADE_GRADIENT.addColorStop(0.7, "rgba(0, 0, 0, 0.3)");
    SNT_SHADE_GRADIENT.addColorStop(0.8, "rgba(0, 0, 0, 0.2)");
    SNT_SHADE_GRADIENT.addColorStop(0.9, "rgba(0, 0, 0, 0.1)");
    SNT_SHADE_GRADIENT.addColorStop(0.99, "rgba(0, 0, 0, 0)");

    snt_canvas_context.fillStyle = SNT_SHADE_GRADIENT;
    snt_canvas_context.fillRect(0, 0, SNT_CANVAS.width, SNT_CANVAS.height);
  }
  else {
    throw ReferenceError("Not the 2D canvas rendering context of a color picker's shade & tint component");
  }
};



// MOVES COMPONENTS

function moveVerticalSlider(vertical_slider: HTMLElement, y: number) {
  const VS: JQuery<HTMLElement> = $(vertical_slider);
  const VS_PARENT = VS.parent()[0];

  if (VS.hasClass('vertical_slider') === false) {
    throw ReferenceError("Not a vertical slider");
  }

  // ensures the cursor stays within the top and bottom edges
  if (y < 0) {
    y = 0;
  }
  else if (y > VS_PARENT.offsetHeight) {
    y = VS_PARENT.offsetHeight;
  }

  let slider_y: number = y - (vertical_slider.offsetHeight * 0.5);

  // ensures the vertical slider stays inside of its component
  if (slider_y < 0) {
    slider_y = 0;
  }
  else if (slider_y > VS_PARENT.offsetHeight) {
    slider_y = VS_PARENT.offsetHeight;
  }

  VS.css('top', slider_y);

  return {
    top: y,
    left: 0
  };
};

function moveSNTCursor(snt_cursor: HTMLElement, x: number, y: number) {
  const SNTC: JQuery<HTMLElement> = $(snt_cursor);
  let sntc_parent: JQuery<HTMLElement> | HTMLElement = SNTC.parent();

  if (SNTC.hasClass('cursor') === false || sntc_parent.hasClass('shade_AND_tint') === false) {
    throw ReferenceError("Not a shade and tint component cursor");
  }

  sntc_parent = sntc_parent[0];

  const CURSOR_HALF_WIDTH: number = snt_cursor.offsetWidth * 0.5;
  const CURSOR_HALF_HEIGHT: number = snt_cursor.offsetHeight * 0.5;

  // ensures the cursor stays within the left and right edges
  if (x < 0) {
    x = 0;
  }
  else if (x > sntc_parent.offsetWidth) {
    x = sntc_parent.offsetWidth;
  }

  // ensures the cursor stays within the top and bottom edges
  if (y < 0) {
    y = 0;
  }
  else if (y > sntc_parent.offsetHeight) {
    y = sntc_parent.offsetHeight;
  }

  SNTC.css({
    top: y - CURSOR_HALF_HEIGHT,
    left: x - CURSOR_HALF_WIDTH
  });

  return {
    top: y / sntc_parent.offsetHeight,
    left: x / sntc_parent.offsetWidth
  };
};



// MISCELLANEOUS

function adjustSearchbarColorContrast(color_picker: JSColorPicker) {
  if (color_picker.searchbar === undefined) {
    throw ReferenceError();
  }

  if (color_picker.searchbar_buttons === undefined) {
    throw ReferenceError();
  }

  if (color_picker.selected_color.a > 0.5 && (color_picker.sntc_position.top > 0.5 || color_picker.sntc_position.left > 0.4)) {
    color_picker.searchbar.css('color', 'white');
    color_picker.searchbar_buttons.css('border-color', 'white');
  }
  else {
    color_picker.searchbar.css('color', 'black');
    color_picker.searchbar_buttons.css('border-color', 'black');
  }
};



const helpers = {
  updateComponentCanvasDimensions,
  redrawHueCanvasGradient,
  redrawShadeAndTintCanvasGradient,
  updateAlphaChannelDisplay,
  updateShadeAndTintDisplay,
  updateSNTCursorBackground,
  updateColorDisplay,
  updateSearchbarColor,
  updateShadeAndTintCanvas,
  getPixel,
  getAlpha,
  getMousePositionRelativeToElement,
  getSNTCursorAbsoluteCoordinates,
  moveVerticalSlider,
  updateSNTCursorSize,
  moveSNTCursor,
  adjustSearchbarColorContrast
};

export default helpers;