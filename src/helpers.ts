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



const helpers = {
  updateComponentCanvasDimensions,
  getMousePositionRelativeToElement,
  moveVerticalSlider
};

export default helpers;