import $ from 'jquery';
import * as shared_types from './shared_types';



function updateComponentCanvasDimensions(jscp_component: HTMLElement, component_canvas_context: CanvasRenderingContext2D): shared_types.Dimensions {
  const COMPONENT_RECT: DOMRect = jscp_component.getBoundingClientRect();
  const ADJUSTED_WIDTH: number = Math.ceil(COMPONENT_RECT.width);
  const ADJUSTED_HEIGHT: number = Math.ceil(COMPONENT_RECT.height);

  const COMPONENT_CANVAS: HTMLCanvasElement = component_canvas_context.canvas;
  COMPONENT_CANVAS.width = ADJUSTED_WIDTH;
  COMPONENT_CANVAS.height = ADJUSTED_HEIGHT;

  // redraws canvas
  const COMPONENT: JQuery<HTMLElement> = $(jscp_component);

  if (COMPONENT.hasClass('hue')) {
    const HUE_GRADIENT = component_canvas_context.createLinearGradient(0, 0, 0, COMPONENT_CANVAS.offsetHeight);
    HUE_GRADIENT.addColorStop(0/6, "red");
    HUE_GRADIENT.addColorStop(1/6, "orange");
    HUE_GRADIENT.addColorStop(2/6, "yellow");
    HUE_GRADIENT.addColorStop(3/6, "greenyellow");
    HUE_GRADIENT.addColorStop(4/6, "cyan");
    HUE_GRADIENT.addColorStop(5/6, "blue");
    HUE_GRADIENT.addColorStop(6/6, "magenta");

    component_canvas_context.fillStyle = HUE_GRADIENT;
    component_canvas_context.fillRect(0, 0, ADJUSTED_WIDTH, ADJUSTED_HEIGHT);
  }

  return {
    w: ADJUSTED_WIDTH,
    h: ADJUSTED_HEIGHT
  };
};

function getMousePositionRelativeToElement(element: HTMLElement, mouse_x: number, mouse_y: number): shared_types.Coordinates {
  return {
    x: mouse_x - element.offsetLeft,
    y: mouse_y - element.offsetTop
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
  getMousePositionRelativeToElement,
  moveVerticalSlider,
  updateSNTCursorSize,
  moveSNTCursor
};

export default helpers;