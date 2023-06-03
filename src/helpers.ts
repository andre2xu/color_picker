import $ from 'jquery';



function updateComponentCanvasDimensions(jscp_component: HTMLElement, component_canvas: HTMLCanvasElement) {
  component_canvas.width = jscp_component.clientWidth;
  component_canvas.height = jscp_component.clientHeight;
};

function getMousePositionRelativeToElement(element: HTMLElement, mouse_x: number, mouse_y: number) {
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