import $ from 'jquery';
import helpers from './helpers';
import event_handlers from './event_handlers';
import * as shared_types from './shared_types';



type ComponentReference = JQuery<HTMLElement> | undefined;

class JSColorPicker {
  container: ComponentReference;
  color_picker: ComponentReference;
  shades_and_tints: ComponentReference;
  snt_cursor: ComponentReference;
  sntc_position: JQuery.Coordinates = {top: 0, left: 0};
  snt_canvas_context: CanvasRenderingContext2D | null = null;
  searchbar: ComponentReference;
  hues: ComponentReference;
  hue_slider: ComponentReference;
  hue_slider_position: JQuery.Coordinates = {top: 0, left: 0};
  hue_canvas_context: CanvasRenderingContext2D | null = null;
  hcc_image_data: ImageData | undefined;
  alpha_channel: ComponentReference;
  ac_slider: ComponentReference;
  ac_slider_position: JQuery.Coordinates = {top: 0, left: 0};
  ac_canvas_context: CanvasRenderingContext2D | null = null;
  accc_image_data: ImageData | undefined;
  selected_color: shared_types.RGBA;
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
          <canvas class="snt_canvas hide" hidden></canvas>

          <div class="shade_AND_tint">
            <div class="cursor"></div>
          </div>

          <input type="text" class="searchbar">
        </div>

        <div class="hue_AND_transparency">
          <canvas class="hue_canvas hide" hidden></canvas>

          <div class="hue">
            <div class="vertical_slider"></div>
          </div>

          <canvas class="alpha_channel_canvas hide" hidden></canvas>

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
    this.snt_cursor = this.shades_and_tints.children('.cursor').first();
    const snt_canvas: ComponentReference = $('.snt_canvas').first(); 
    this.searchbar = $('.searchbar').first();
    this.hues = $('.hue').first();
    this.hue_slider = this.hues.children('.vertical_slider').first();
    const hue_canvas: ComponentReference = $('.hue_canvas').first();
    this.alpha_channel = $('.alpha_channel').first();
    const alpha_channel_canvas: ComponentReference = $('.alpha_channel_canvas').first();
    this.ac_slider = this.alpha_channel.parent().children('.vertical_slider').first();

    if (hue_canvas !== undefined && hue_canvas[0] instanceof HTMLCanvasElement) {
      this.hue_canvas_context = hue_canvas[0].getContext('2d');
    }

    if (alpha_channel_canvas !== undefined && alpha_channel_canvas[0] instanceof HTMLCanvasElement) {
      this.ac_canvas_context = alpha_channel_canvas[0].getContext('2d');
    }

    if (snt_canvas !== undefined && snt_canvas[0] instanceof HTMLCanvasElement) {
      this.snt_canvas_context = snt_canvas[0].getContext('2d');
    }

    // initializes defaults
    this.selected_color = {
      r: 255,
      g: 0,
      b: 0,
      a: 255
    };

    const STARTING_COLOR: string = `${this.selected_color.r}, ${this.selected_color.g}, ${this.selected_color.b}`;

    if (this.alpha_channel !== undefined) {
      helpers.updateAlphaChannelDisplay(
        this.alpha_channel[0],
        this.selected_color
      );
    }

    if (this.searchbar !== undefined) {
      this.searchbar.val(`rgb(${STARTING_COLOR})`);
    }

    this.setSize(300, 200);

    if (this.snt_cursor !== undefined) {
      this.snt_cursor.css('background-color', `rgb(${STARTING_COLOR})`);

      const SNTC: HTMLElement = this.snt_cursor[0];

      if (this.color_picker !== undefined) {
        helpers.updateSNTCursorSize(
          this.color_picker[0],
          SNTC
        );
      }

      if (this.shades_and_tints !== undefined) {
        this.sntc_position = helpers.moveSNTCursor(
          SNTC,
          this.shades_and_tints[0].offsetWidth,
          0
        );
      }
    }

    // binds event listeners
    this.color_picker.on('mousedown', event_handlers.mouseDownHandler.bind(this));

    this.color_picker.on('mouseup', event_handlers.mouseUpHandler.bind(this));

    this.color_picker.on('mousemove', event_handlers.mouseMoveHandler.bind(this));

    this.color_picker.on('mouseleave', event_handlers.mouseLeaveHandler.bind(this));
  };


  // GETTERS


  // SETTERS
  setSize(w: number, h: number) {
    if (this.color_picker !== undefined) {
      this.color_picker.css({
        width: w,
        height: h,
        padding: w * 0.03
      });

      // ensures the searchbar's text is responsive to changes in the color picker's size
      if (this.searchbar !== undefined) {
        this.searchbar.css({
          fontSize: this.searchbar[0].offsetHeight * 0.55
        });
      }

      // updates the dimensions of the hidden canvases so that they match their component's new size
      if (this.hues !== undefined && this.hue_canvas_context !== null) {
        const CANVAS_DIMENSIONS: shared_types.Dimensions = helpers.updateComponentCanvasDimensions(
          this.hues[0],
          this.hue_canvas_context
        );

        helpers.redrawHueCanvasGradient(this.hue_canvas_context);

        this.hcc_image_data = this.hue_canvas_context.getImageData(0, 0, CANVAS_DIMENSIONS.w, CANVAS_DIMENSIONS.h);
      }

      if (this.alpha_channel !== undefined && this.ac_canvas_context !== null) {
        const CANVAS_DIMENSIONS: shared_types.Dimensions = helpers.updateComponentCanvasDimensions(
          this.alpha_channel[0],
          this.ac_canvas_context
        );

        helpers.redrawAlphaChannelCanvasGradient(
          this.ac_canvas_context,
          this.selected_color
        );

        this.accc_image_data = this.ac_canvas_context.getImageData(0, 0, CANVAS_DIMENSIONS.w, CANVAS_DIMENSIONS.h);
      }

      // ensures the shade & tint component cursor is responsive to changes in the color picker's size
      if (this.snt_cursor !== undefined) {
        const SNTC: HTMLElement = this.snt_cursor[0];

        helpers.updateSNTCursorSize(
          this.color_picker[0],
          SNTC
        );

        // ensures the cursor is still in the same spot
        if (this.shades_and_tints !== undefined) {
          const SNT_COMPONENT: HTMLElement = this.shades_and_tints[0];
          const CORRECTED_X: number = this.sntc_position.left * SNT_COMPONENT.offsetWidth;
          const CORRECTED_Y: number = this.sntc_position.top * SNT_COMPONENT.offsetHeight;

          helpers.moveSNTCursor(
            SNTC,
            CORRECTED_X,
            CORRECTED_Y
          );
        }
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