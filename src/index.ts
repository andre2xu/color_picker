import $ from 'jquery';
import helpers from './helpers';



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
  hue_canvas: ComponentReference;
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
          <canvas class="hue_canvas hide" hidden></canvas>

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
    this.hue_canvas = $('.hue_canvas').first();
    this.alpha_channel = $('.alpha_channel').first();

    // initializes defaults
    this.selected_color = {
      r: 255,
      g: 0,
      b: 0
    };

    if (this.searchbar !== undefined) {
      const STARTING_COLOR: RGB = this.selected_color;

      this.searchbar.val(`rgb(${STARTING_COLOR.r}, ${STARTING_COLOR.g}, ${STARTING_COLOR.b})`);
    }

    this.setSize(300, 200);

    // binds event listeners
    this.color_picker.on('click', function (this: JSColorPicker, event: JQuery.TriggeredEvent) {
      const CLICKED_ELEMENT: HTMLElement = event.target;

      if (this.hues !== undefined && this.hues[0] === CLICKED_ELEMENT) {
        
      }
    }.bind(this));
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

      // updates the dimensions of the hidden canvases so that they match their component's new size
      if (this.hues !== undefined && this.hue_canvas !== undefined) {
        helpers.updateComponentCanvasDimensions(
          this.hues[0],
          this.hue_canvas[0] as HTMLCanvasElement
        );
      }
    }
  };

  setScale(multiplier: number) {
    if (this.color_picker !== undefined) {
      const COLOR_PICKER: HTMLElement = this.color_picker[0];

      this.setSize(
        COLOR_PICKER.clientWidth * multiplier,
        COLOR_PICKER.clientHeight * multiplier
      );
    }
  };

  hide() {
    if (this.color_picker !== undefined) {
      this.color_picker.addClass('hide');
    }
  };

  show() {
    if (this.color_picker !== undefined) {
      this.color_picker.removeClass('hide');
    }
  };
};

new JSColorPicker('test');



export default JSColorPicker;