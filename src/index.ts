import $ from 'jquery';



type ComponentReference = JQuery<HTMLElement> | undefined;

interface RGB {
  r: number,
  g: number,
  b: number,
};

class JSColorPicker {
  container: ComponentReference;
  color_picker: ComponentReference;
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
    this.color_picker = $('.jscp').first();
    this.shades_and_tints = $('.shade_AND_tint').first();
    this.searchbar = $('.searchbar').first();
    this.hues = $('.hue').first();
    this.alpha_channel = $('.alpha_channel').first();

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

    this.setSize(300, 200);
  };


  // GETTERS


  // SETTERS
  setSize(w: number, h: number) {
    if (this.color_picker !== undefined) {
      this.color_picker.css({
        width: w,
        height: h,
        padding: w * 0.025
      });

      // ensures the searchbar's text is responsive to changes in the color picker's size
      if (this.searchbar !== undefined) {
        this.searchbar.css({
          fontSize: this.searchbar[0].clientHeight * 0.55
        });
      }
    }
  };
};

new JSColorPicker('test');



export default JSColorPicker;