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
  sntc_image_data: ImageData | undefined;
  color_display: ComponentReference;
  searchbar: ComponentReference;
  searchbar_buttons: ComponentReference;
  hues: ComponentReference;
  hue_slider: ComponentReference;
  hue_slider_position: JQuery.Coordinates = {top: 0, left: 0};
  hue_canvas_context: CanvasRenderingContext2D | null = null;
  hcc_image_data: ImageData | undefined;
  alpha_channel: ComponentReference;
  ac_slider: ComponentReference;
  ac_slider_position: JQuery.Coordinates = {top: 0, left: 0};
  selected_color: shared_types.RGBA;
  component_held: ComponentReference;
  color_format: string; // rgb, hex, hsv, hsl

  constructor (container_id: string) {
    const CONTAINER: HTMLElement | null = document.getElementById(container_id);

    if (CONTAINER === null) {
      throw ReferenceError('No element with that id exists');
    }


    // INITIALIZATION
    this.container = $(CONTAINER);

    // builds color picker
    this.container.addClass('jscp_container');

    this.container.empty();

    this.container.html(
      `
      <div class="jscp">
        <div class="shade_AND_tint_AND_searchbar">
          <canvas class="snt_canvas hide" hidden></canvas>

          <div class="shade_AND_tint">
            <div class="cursor"></div>
          </div>

          <div class="searchbar_container">
            <div class="color_display"></div>

            <div class="arrow_button left"></div>
            <input type="text" class="searchbar">
            <div class="arrow_button right"></div>
          </div>
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
    this.color_picker = this.container.children('.jscp').first();
    this.shades_and_tints = this.container.find('.shade_AND_tint').first();
    this.snt_cursor = this.shades_and_tints.children('.cursor').first();
    const snt_canvas: ComponentReference = this.container.find('.snt_canvas').first(); 
    const searchbar_container = this.container.find('.searchbar_container').first();
    this.color_display = searchbar_container.children('.color_display').first();
    this.searchbar = searchbar_container.children('.searchbar').first();
    this.searchbar_buttons = searchbar_container.children('.arrow_button');
    this.hues = this.container.find('.hue').first();
    this.hue_slider = this.hues.children('.vertical_slider').first();
    const hue_canvas: ComponentReference = this.container.find('.hue_canvas').first();
    this.alpha_channel = this.container.find('.alpha_channel').first();
    this.ac_slider = this.alpha_channel.parent().children('.vertical_slider').first();

    if (hue_canvas !== undefined && hue_canvas[0] instanceof HTMLCanvasElement) {
      this.hue_canvas_context = hue_canvas[0].getContext('2d', {willReadFrequently: true});
    }

    if (snt_canvas !== undefined && snt_canvas[0] instanceof HTMLCanvasElement) {
      this.snt_canvas_context = snt_canvas[0].getContext('2d', {willReadFrequently: true});
    }

    // initializes defaults
    this.selected_color = {
      r: 255,
      g: 0,
      b: 0,
      a: 1
    };

    this.color_format = 'rgb';

    helpers.updateAlphaChannelDisplay(this);
    helpers.updateShadeAndTintDisplay(this);
    helpers.updateColorDisplay(this);
    helpers.updateSearchbarColor(this);

    this.setSize(300, 200);

    helpers.updateSNTCursorBackground(this);
    helpers.updateSNTCursorSize(this);

    if (this.shades_and_tints !== undefined) {
      this.sntc_position = helpers.moveSNTCursor(
        this.snt_cursor[0],
        this.shades_and_tints[0].offsetWidth,
        0
      );
    }

    helpers.adjustSearchbarColorContrast(this);

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

      // ensures the searchbar buttons are responsive to changes in the color picker's size
      if (this.searchbar_buttons !== undefined) {
        const SEARCHBAR_CONTAINER: HTMLElement = this.searchbar_buttons.parent()[0];

        const BUTTON_SIZE: number = SEARCHBAR_CONTAINER.offsetHeight * 0.3;
        const BUTTON_THICKNESS: number = SEARCHBAR_CONTAINER.offsetHeight * 0.1;

        this.searchbar_buttons.css({
          height: BUTTON_SIZE,
          width: BUTTON_SIZE,
          borderWidth: BUTTON_THICKNESS
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

      if (this.shades_and_tints !== undefined && this.snt_canvas_context !== null) {
        const CANVAS_DIMENSIONS: shared_types.Dimensions = helpers.updateComponentCanvasDimensions(
          this.shades_and_tints[0],
          this.snt_canvas_context
        );

        helpers.redrawShadeAndTintCanvasGradient(
          this.snt_canvas_context,
          this.selected_color
        );

        this.sntc_image_data = this.snt_canvas_context.getImageData(0, 0, CANVAS_DIMENSIONS.w, CANVAS_DIMENSIONS.h);
      }

      // ensures the shade & tint component cursor is responsive to changes in the color picker's size
      helpers.updateSNTCursorSize(this);

      // ensures the cursor is still in the same spot
      if (this.shades_and_tints !== undefined && this.snt_cursor !== undefined) {
        const SNT_COMPONENT: HTMLElement = this.shades_and_tints[0];
        const CORRECTED_X: number = this.sntc_position.left * SNT_COMPONENT.offsetWidth;
        const CORRECTED_Y: number = this.sntc_position.top * SNT_COMPONENT.offsetHeight;

        helpers.moveSNTCursor(
          this.snt_cursor[0],
          CORRECTED_X,
          CORRECTED_Y
        );
      }
    }
    else {
      throw ReferenceError();
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