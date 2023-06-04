import $ from 'jquery';
import * as shared_types from './shared_types';



function updateComponentCanvasDimensions(jscp_component: HTMLElement, component_canvas: HTMLCanvasElement): void {
  component_canvas.width = jscp_component.offsetWidth;
  component_canvas.height = jscp_component.offsetHeight;
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

  // ensures the cursor stays within the component
  if (x < 0) {
    x = 0;
  }
  else if (x > sntc_parent.offsetWidth - snt_cursor.offsetWidth) {
    x = sntc_parent.offsetWidth - snt_cursor.offsetWidth;
  }

  if (y < 0) {
    y = 0;
  }
  else if (y > sntc_parent.offsetHeight - snt_cursor.offsetHeight) {
    y = sntc_parent.offsetHeight - snt_cursor.offsetHeight;
  }

  // moves the cursor and returns its new position
  SNTC.css({
    top: y,
    left: x
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