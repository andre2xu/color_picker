import $ from 'jquery';



class JSColorPicker {
  container: JQuery<HTMLElement> | undefined;

  constructor (container_id: string) {
    const CONTAINER: HTMLElement | null = document.getElementById(container_id);

    if (CONTAINER === null) {
      throw ReferenceError('No element with that id exists');
    }


    // INITIALIZATION
    this.container = $(CONTAINER);
  };


  // GETTERS


  // SETTERS
};

new JSColorPicker('test');



export default JSColorPicker;