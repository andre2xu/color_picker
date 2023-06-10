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

function updateColorDisplay(color_display: HTMLElement, color: shared_types.RGBA) {
  const CD: JQuery<HTMLElement> = $(color_display);

  if (CD.hasClass('color_display') === false) {
    throw ReferenceError('Not a color picker\'s color display');
  }

  CD.css('background-color', `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
};

function updateSearchbarColor(searchbar: HTMLElement, color: shared_types.RGBA, format: string) {
  const SEARCHBAR: JQuery<HTMLElement> = $(searchbar);

  if (SEARCHBAR.hasClass('searchbar') === false) {
    throw ReferenceError('Not a color picker\'s searchbar');
  }

  format = format.toLowerCase();

  if (format !== 'rgb') {
    throw Error('Only the following formats are allowed: rgb');
  }

  switch (format) {
    case 'rgb':
      SEARCHBAR.val(`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
      break;
    default:
  }
};

function updateAllCanvases(jscp: JSColorPicker) {
  if (jscp.snt_canvas_context !== null) {
    redrawShadeAndTintCanvasGradient(
      jscp.snt_canvas_context,
      jscp.selected_color
    );

    const SNT_CANVAS: HTMLCanvasElement = jscp.snt_canvas_context.canvas;

    jscp.sntc_image_data = jscp.snt_canvas_context.getImageData(0, 0, SNT_CANVAS.width, SNT_CANVAS.height);
  }
};

function updateSNTCursorSize(color_picker: HTMLElement, snt_cursor: HTMLElement) {
  const CP: JQuery<HTMLElement> = $(color_picker);
  const SNTC: JQuery<HTMLElement> = $(snt_cursor);

  if (CP.hasClass('jscp') === false) {
    throw ReferenceError('Not a color picker');
  }

  if (SNTC.hasClass('cursor') === false || SNTC.parent().hasClass('shade_AND_tint') === false) {
    throw ReferenceError('Not a shade and tint component cursor');
  }

  const CURSOR_SIZE: number = color_picker.offsetWidth * 0.02;

  SNTC.css({
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
    throw ReferenceError('Not a color picker\'s alpha channel component');
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
    throw ReferenceError('Not a shade and tint component cursor');
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
    throw ReferenceError('Not the 2D canvas rendering context of a color picker\'s hue component');
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
    throw ReferenceError('Not the 2D canvas rendering context of a color picker\'s shade & tint component');
  }
};



// MOVES COMPONENTS

function moveVerticalSlider(vertical_slider: HTMLElement, y: number) {
  const VS: JQuery<HTMLElement> = $(vertical_slider);
  const VS_PARENT = VS.parent()[0];

  if (VS.hasClass('vertical_slider') === false) {
    throw ReferenceError('Not a vertical slider');
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
    throw ReferenceError('Not a shade and tint component cursor');
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

function adjustSearchbarColorContrast(jscp: JSColorPicker) {
  if (jscp.searchbar !== undefined && jscp.searchbar_buttons !== undefined) {
    if (jscp.selected_color.a > 0.5 && (jscp.sntc_position.top > 0.5 || jscp.sntc_position.left > 0.4)) {
      jscp.searchbar.css('color', 'white');
      jscp.searchbar_buttons.css('border-color', 'white');
    }
    else {
      jscp.searchbar.css('color', 'black');
      jscp.searchbar_buttons.css('border-color', 'black');
    }
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
  updateAllCanvases,
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