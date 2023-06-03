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



const helpers = {
  updateComponentCanvasDimensions,
  getMousePositionRelativeToElement
};

export default helpers;