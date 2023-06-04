import $ from 'jquery';
import helpers from './helpers';
import * as shared_types from './shared_types';



type ComponentReference = JQuery<HTMLElement> | undefined;

class JSColorPicker {
  container: ComponentReference;
  color_picker: ComponentReference;
  shades_and_tints: ComponentReference;
  searchbar: ComponentReference;
  hues: ComponentReference;
  hue_slider: ComponentReference;
  hue_canvas: ComponentReference;
  alpha_channel: ComponentReference;
  ac_slider: ComponentReference;
  selected_color: shared_types.RGB;
  component_held: ComponentReference;

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
    this.hue_slider = this.hues.children('.vertical_slider').first();
    this.hue_canvas = $('.hue_canvas').first();
    this.alpha_channel = $('.alpha_channel').first();
    this.ac_slider = this.alpha_channel.parent().children('.vertical_slider').first();

    // initializes defaults
    this.selected_color = {
      r: 255,
      g: 0,
      b: 0
    };

    if (this.searchbar !== undefined) {
      const STARTING_COLOR: shared_types.RGB = this.selected_color;

      this.searchbar.val(`rgb(${STARTING_COLOR.r}, ${STARTING_COLOR.g}, ${STARTING_COLOR.b})`);
    }

    this.setSize(300, 200);

    // binds event listeners
    this.color_picker.on('mousedown', function (this: JSColorPicker, event: JQuery.TriggeredEvent) {
      const CLICKED_ELEMENT: HTMLElement = event.target;

      if (event.button === 0 && event.clientX !== undefined && event.clientY !== undefined) {
        const MOUSE_POSITION: shared_types.Coordinates = helpers.getMousePositionRelativeToElement(
          event.target,
          event.clientX,
          event.clientY
        );

        if (this.hues !== undefined && this.hues[0] === CLICKED_ELEMENT && this.hue_slider !== undefined) {
          helpers.moveVerticalSlider(
            this.hue_slider[0],
            MOUSE_POSITION.y
          );
        }
        else if (this.alpha_channel !== undefined && this.alpha_channel[0] === CLICKED_ELEMENT && this.ac_slider !== undefined) {
          const AC_CONTAINER: HTMLElement = event.target.parentElement as HTMLElement;

          helpers.moveVerticalSlider(
            this.ac_slider[0],
            event.clientY - AC_CONTAINER.offsetTop
          );
        }
        else if (this.hue_slider !== undefined && this.hue_slider[0] === CLICKED_ELEMENT) {
          this.component_held = this.hue_slider;
        }
      }
    }.bind(this));

    this.color_picker.on('mouseup', function (this: JSColorPicker) {
      this.component_held = undefined;
    }.bind(this));

    this.color_picker.on('mousemove', function (this: JSColorPicker, event: JQuery.TriggeredEvent) {
      if (event.button === 0 && this.component_held !== undefined && event.clientX !== undefined && event.clientY !== undefined) {
        if (this.hue_slider !== undefined && this.component_held[0] === this.hue_slider[0] && this.hues !== undefined) {
          const HUE_COMPONENT: HTMLElement = this.hues[0];

          let mouse_y: number = event.clientY - HUE_COMPONENT.offsetTop;

          if (mouse_y <= HUE_COMPONENT.offsetHeight) {
            helpers.moveVerticalSlider(
              this.hue_slider[0],
              mouse_y
            );
          }
        }
      }
    }.bind(this));

    this.color_picker.on('mouseleave', function (this: JSColorPicker) {
      this.component_held = undefined;
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
          fontSize: this.searchbar[0].offsetHeight * 0.55
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
        COLOR_PICKER.offsetWidth * multiplier,
        COLOR_PICKER.offsetHeight * multiplier
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