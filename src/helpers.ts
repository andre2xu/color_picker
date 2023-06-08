import $ from 'jquery';
import JSColorPicker from './index';
import * as shared_types from './shared_types';



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

function redrawAlphaChannelCanvasGradient(ac_canvas_context: CanvasRenderingContext2D, selected_color: shared_types.Color) {
  const AC_CANVAS = ac_canvas_context.canvas;

  if ($(AC_CANVAS).hasClass('alpha_channel_canvas')) {
    const RGB: string = `${selected_color.r}, ${selected_color.g}, ${selected_color.b}`;

    const ALPHA_CHANNEL_GRADIENT: CanvasGradient = ac_canvas_context.createLinearGradient(0, 0, 0, AC_CANVAS.height);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.01, `rgba(${RGB}, 1)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.1, `rgba(${RGB}, 0.9)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.2, `rgba(${RGB}, 0.8)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.3, `rgba(${RGB}, 0.7)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.4, `rgba(${RGB}, 0.6)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.5, `rgba(${RGB}, 0.5)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.6, `rgba(${RGB}, 0.4)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.7, `rgba(${RGB}, 0.3)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.8, `rgba(${RGB}, 0.2)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(0.9, `rgba(${RGB}, 0.1)`);
    ALPHA_CHANNEL_GRADIENT.addColorStop(1.0, `rgba(${RGB}, 0)`);

    ac_canvas_context.fillStyle = ALPHA_CHANNEL_GRADIENT;
    ac_canvas_context.fillRect(0, 0, AC_CANVAS.width, AC_CANVAS.height);
  }
  else {
    throw ReferenceError('Not the 2D canvas rendering context of a color picker\'s alpha channel component');
  }
};

function redrawShadeAndTintCanvasGradient(snt_canvas_context: CanvasRenderingContext2D, selected_color: shared_types.Color) {
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

function updateAlphaChannelDisplay(alpha_channel_component: HTMLElement, color: shared_types.Color) {
  const ACC: JQuery<HTMLElement> = $(alpha_channel_component);

  if (ACC.hasClass('alpha_channel') === false) {
    throw ReferenceError('Not a color picker\'s alpha channel component');
  }

  ACC.css({'background': `linear-gradient(rgb(${color.r}, ${color.g}, ${color.b}), transparent)`});
};

function updateShadeAndTintDisplay(snt_component: HTMLElement, color: shared_types.Color) {
  const SNT_COMPONENT: JQuery<HTMLElement> = $(snt_component);

  if (SNT_COMPONENT.hasClass('shade_AND_tint') === false) {
    throw ReferenceError('Not a color picker\'s shade & tint component');
  }

  SNT_COMPONENT.css({'background': `linear-gradient(0deg, black, transparent), linear-gradient(270deg, rgb(${color.r}, ${color.g}, ${color.b}), white)`});
};

function updateSNTCursorBackground(snt_cursor: HTMLElement, color: shared_types.RGBA) {
  const SNTC: JQuery<HTMLElement> = $(snt_cursor);

  if (SNTC.hasClass('cursor') === false || SNTC.parent().hasClass('shade_AND_tint') === false) {
    throw ReferenceError('Not a shade & tint component cursor');
  }

  SNTC.css('background-color', `rgb(${color.r}, ${color.g}, ${color.b})`);
};

function updateSearchbarBackground(searchbar: HTMLElement, color: shared_types.RGBA) {
  const SEARCHBAR: JQuery<HTMLElement> = $(searchbar);

  if (SEARCHBAR.hasClass('searchbar') === false || SEARCHBAR.parent().parent().hasClass('jscp') === false) {
    throw ReferenceError('Not a color picker\'s searchbar');
  }

  SEARCHBAR.css('background-color', `rgb(${color.r}, ${color.g}, ${color.b})`);
};

function updateAllDisplaysAndCanvases(jscp: JSColorPicker) {
  if (jscp.alpha_channel !== undefined && jscp.ac_canvas_context !== null) {
    updateAlphaChannelDisplay(
      jscp.alpha_channel[0],
      jscp.selected_color
    );

    // updates the alpha channel's canvas
    redrawAlphaChannelCanvasGradient(
      jscp.ac_canvas_context,
      jscp.selected_color
    );

    const AC_CANVAS: HTMLCanvasElement = jscp.ac_canvas_context.canvas;

    jscp.accc_image_data = jscp.ac_canvas_context.getImageData(0, 0, AC_CANVAS.width, AC_CANVAS.height);
  }

  if (jscp.shades_and_tints !== undefined && jscp.snt_canvas_context !== null) {
    updateShadeAndTintDisplay(
      jscp.shades_and_tints[0],
      jscp.selected_color
    );

    // updates the shade & tint component's canvas
    redrawShadeAndTintCanvasGradient(
      jscp.snt_canvas_context,
      jscp.selected_color
    );

    const SNT_CANVAS: HTMLCanvasElement = jscp.snt_canvas_context.canvas;

    jscp.sntc_image_data = jscp.snt_canvas_context.getImageData(0, 0, SNT_CANVAS.width, SNT_CANVAS.height);
  }

  if (jscp.snt_cursor !== undefined) {
    updateSNTCursorBackground(
      jscp.snt_cursor[0],
      jscp.selected_color
    );
  }

  if (jscp.searchbar !== undefined) {
    updateSearchbarBackground(
      jscp.searchbar[0],
      jscp.selected_color
    );
  }
};

function getPixel(canvas_image_data: ImageData, x: number, y: number): shared_types.PixelBits {
  const PIXELS: Uint8ClampedArray = canvas_image_data.data;

  const INDEX: number = (y * canvas_image_data.width * 4) + (x * 4);

  const R: number = PIXELS[INDEX];
  const G: number = PIXELS[INDEX + 1];
  const B: number = PIXELS[INDEX + 2];
  const A: number = PIXELS[INDEX + 3];

  return [R, G, B, A];
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

function moveVerticalSlider(vertical_slider: HTMLElement, y: number) {
  const VS: JQuery<HTMLElement> = $(vertical_slider);
  const VS_PARENT = VS.parent()[0];

  if (VS.hasClass('vertical_slider') === false) {
    throw ReferenceError('Not a vertical slider');
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
    top: slider_y,
    left: 0
  };
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



const helpers = {
  updateComponentCanvasDimensions,
  redrawHueCanvasGradient,
  redrawAlphaChannelCanvasGradient,
  redrawShadeAndTintCanvasGradient,
  updateAlphaChannelDisplay,
  updateShadeAndTintDisplay,
  updateSNTCursorBackground,
  updateSearchbarBackground,
  updateAllDisplaysAndCanvases,
  getPixel,
  getMousePositionRelativeToElement,
  getSNTCursorAbsoluteCoordinates,
  moveVerticalSlider,
  updateSNTCursorSize,
  moveSNTCursor
};

export default helpers;