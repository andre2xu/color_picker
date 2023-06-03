import $ from 'jquery';



function updateComponentCanvasDimensions(jscp_component: HTMLElement, component_canvas: HTMLCanvasElement) {
  component_canvas.width = jscp_component.clientWidth;
  component_canvas.height = jscp_component.clientHeight;
};



const helpers = {
  updateComponentCanvasDimensions
};

export default helpers;