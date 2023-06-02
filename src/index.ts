import $ from 'jquery';



type ComponentReference = JQuery<HTMLElement> | undefined;

interface RGB {
  r: number,
  g: number,
  b: number,
};

class JSColorPicker {
  container: ComponentReference;
  shades_and_tints: ComponentReference;
  searchbar: ComponentReference;
  hues: ComponentReference;
  alpha_channel: ComponentReference;
  selected_color: RGB;

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

    // gets the color picker's components
    this.shades_and_tints = $(`.shade_AND_tint`).first();
    this.searchbar = $(`.searchbar`).first();
    this.hues = $(`.hue`).first();
    this.alpha_channel = $(`.alpha_channel`).first();

    // initializes defaults
    this.selected_color = {
      r: 255,
      g: 0,
      b: 0
    };

    if (this.searchbar !== undefined) {
      const STARTING_COLOR = this.selected_color;

      this.searchbar.val(`rgb(${STARTING_COLOR.r}, ${STARTING_COLOR.g}, ${STARTING_COLOR.b})`);
    }
  };


  // GETTERS


  // SETTERS
};

new JSColorPicker('test');



export default JSColorPicker;