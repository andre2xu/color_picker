import $ from 'jquery';



type ComponentReference = JQuery<HTMLElement> | undefined;

class JSColorPicker {
  container: ComponentReference;

  constructor (container_id: string) {
    const CONTAINER: HTMLElement | null = document.getElementById(container_id);

    if (CONTAINER === null) {
      throw ReferenceError('No element with that id exists');
    }


    // INITIALIZATION
    this.container = $(CONTAINER);

    // builds color picker
    this.container.addClass('jscp_container');

    this.container.html(
      `
      <div class="jscp">
        <div class="shade_AND_tint_AND_searchbar">
          <div class="shade_AND_tint"></div>

          <input type="text" class="searchbar">
        </div>

        <div class="hue_AND_transparency">
          <div class="hue">
            <div class="vertical_slider"></div>
          </div>

          <div class="transparency">
            <div class="alpha_channel"></div>

            <div class="vertical_slider"></div>
          </div>
        </div>
      </div>
      `
    );
  };


  // GETTERS


  // SETTERS
};

new JSColorPicker('test');



export default JSColorPicker;