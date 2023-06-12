import $ from 'jquery';
import JSColorPicker from './index';
import helpers from './helpers';
import * as shared_types from './shared_types';



function mouseDownHandler(this: JSColorPicker, event: JQuery.TriggeredEvent) {
  const CLICKED_ELEMENT: HTMLElement = event.target;

  if (event.button === 0 && event.clientX !== undefined && event.clientY !== undefined) {
    const MOUSE_POSITION: shared_types.Coordinates = helpers.getMousePositionRelativeToElement(
      event.target,
      event.clientX,
      event.clientY
    );

    if (this.hues !== undefined && this.hues[0] === CLICKED_ELEMENT && this.hue_slider !== undefined) {
      this.hue_slider_position = helpers.moveVerticalSlider(
        this.hue_slider[0],
        MOUSE_POSITION.y
      );

      if (this.hcc_image_data !== undefined && this.snt_cursor !== undefined && this.sntc_image_data !== undefined) {
        const HUE_PIXEL: shared_types.PixelBits = helpers.getPixel(this.hcc_image_data, 0, Math.round(this.hue_slider_position.top));

        // selects the hue
        this.selected_color = {
          r: HUE_PIXEL[0],
          g: HUE_PIXEL[1],
          b: HUE_PIXEL[2],
          a: this.selected_color.a
        };

        helpers.updateShadeAndTintCanvas(this);

        helpers.updateShadeAndTintDisplay(this);

        // selects the shade or tint (depends on the S&T cursor's current position)
        const SNTC_COORDINATES: shared_types.Coordinates = helpers.getSNTCursorAbsoluteCoordinates(
          this.snt_cursor[0],
          this.sntc_position
        );

        const SNT_PIXEL: shared_types.PixelBits = helpers.getPixel(
          this.sntc_image_data,
          SNTC_COORDINATES.x,
          SNTC_COORDINATES.y
        );

        this.selected_color = {
          r: SNT_PIXEL[0],
          g: SNT_PIXEL[1],
          b: SNT_PIXEL[2],
          a: this.selected_color.a
        };

        helpers.updateAlphaChannelDisplay(this);

        helpers.updateSNTCursorBackground(this);

        helpers.updateColorDisplay(this);

        helpers.updateSearchbarColor(this);
      }
    }
    else if (this.alpha_channel !== undefined && this.alpha_channel[0] === CLICKED_ELEMENT && this.ac_slider !== undefined) {
      const AC_CONTAINER: HTMLElement = event.target.parentElement as HTMLElement;

      this.ac_slider_position = helpers.moveVerticalSlider(
        this.ac_slider[0],
        event.clientY - AC_CONTAINER.offsetTop
      );

      this.selected_color.a = this.selected_color.a = helpers.getAlpha(
        this.alpha_channel[0],
        this.ac_slider_position
      );

      helpers.updateColorDisplay(this);

      helpers.updateSearchbarColor(this);

      helpers.adjustSearchbarColorContrast(this);
    }
    else if (this.shades_and_tints !== undefined && this.shades_and_tints[0] === CLICKED_ELEMENT && this.snt_cursor !== undefined) {
      const SNTC: HTMLElement = this.snt_cursor[0];

      this.sntc_position = helpers.moveSNTCursor(
        SNTC,
        MOUSE_POSITION.x,
        MOUSE_POSITION.y
      );

      const SNTC_COORDINATES: shared_types.Coordinates = helpers.getSNTCursorAbsoluteCoordinates(
        SNTC,
        this.sntc_position
      );

      if (this.sntc_image_data !== undefined && this.color_display !== undefined && this.alpha_channel !== undefined && this.searchbar !== undefined) {
        const COLOR: shared_types.PixelBits = helpers.getPixel(
          this.sntc_image_data,
          SNTC_COORDINATES.x,
          SNTC_COORDINATES.y
        );

        // selects the shade or tint
        this.selected_color = {
          r: COLOR[0],
          g: COLOR[1],
          b: COLOR[2],
          a: helpers.getAlpha(
            this.alpha_channel[0],
            this.ac_slider_position
          )
        };

        helpers.updateSNTCursorBackground(this);

        helpers.updateColorDisplay(this);

        helpers.updateAlphaChannelDisplay(this);

        helpers.updateSearchbarColor(this);

        helpers.adjustSearchbarColorContrast(this);
      }
    }
    else if (this.hue_slider !== undefined && this.hue_slider[0] === CLICKED_ELEMENT) {
      this.component_held = this.hue_slider;
    }
    else if (this.ac_slider !== undefined && this.ac_slider[0] === CLICKED_ELEMENT) {
      this.component_held = this.ac_slider;
    }
    else if (this.snt_cursor !== undefined && this.snt_cursor[0] === CLICKED_ELEMENT) {
      this.component_held = this.snt_cursor;
    }
  }
};

function mouseUpHandler(this: JSColorPicker, event: JQuery.TriggeredEvent) {
  this.component_held = undefined;

  const ELEMENT_CLICKED: JQuery<HTMLElement> = $(event.target);

  if (ELEMENT_CLICKED.hasClass('arrow_button')) {
    const COLOR_FORMATS: Array<string> = [
      'rgb',
      'hex',
      'hsv',
      'hsl'
    ];

    // starts with the index of the currently selected format
    let index: number = COLOR_FORMATS.indexOf(this.color_format);

    if (ELEMENT_CLICKED.hasClass('left')) {
      index -= 1;

      if (index < 0) {
        index = COLOR_FORMATS.length - 1;
      }
    }
    else if (ELEMENT_CLICKED.hasClass('right')) {
      index += 1;

      if (index >= COLOR_FORMATS.length) {
        index = 0;
      }
    }

    this.color_format = COLOR_FORMATS[index];

    helpers.updateSearchbarColor(this);
  }
};

function mouseMoveHandler(this: JSColorPicker, event: JQuery.TriggeredEvent) {
  if (event.button === 0 && this.component_held !== undefined && event.clientX !== undefined && event.clientY !== undefined) {
    if (this.hue_slider !== undefined && this.component_held[0] === this.hue_slider[0] && this.hues !== undefined) {
      const MOUSE_Y: number = event.clientY - this.hues[0].offsetTop;

      this.hue_slider_position = helpers.moveVerticalSlider(
        this.hue_slider[0],
        MOUSE_Y
      );

      if (this.hcc_image_data !== undefined && this.snt_cursor !== undefined && this.sntc_image_data !== undefined) {
        const HUE_PIXEL: shared_types.PixelBits = helpers.getPixel(
          this.hcc_image_data,
          0,
          Math.round(this.hue_slider_position.top)
        );

        // selects the hue
        this.selected_color = {
          r: HUE_PIXEL[0],
          g: HUE_PIXEL[1],
          b: HUE_PIXEL[2],
          a: this.selected_color.a
        };

        helpers.updateShadeAndTintCanvas(this);

        helpers.updateShadeAndTintDisplay(this);

        // selects the shade or tint (depends on the S&T cursor's current position)
        const SNTC_COORDINATES: shared_types.Coordinates = helpers.getSNTCursorAbsoluteCoordinates(
          this.snt_cursor[0],
          this.sntc_position
        );

        const SNT_PIXEL: shared_types.PixelBits = helpers.getPixel(
          this.sntc_image_data,
          SNTC_COORDINATES.x,
          SNTC_COORDINATES.y
        );

        this.selected_color = {
          r: SNT_PIXEL[0],
          g: SNT_PIXEL[1],
          b: SNT_PIXEL[2],
          a: this.selected_color.a
        };

        helpers.updateAlphaChannelDisplay(this);

        helpers.updateSNTCursorBackground(this);

        helpers.updateColorDisplay(this);

        helpers.updateSearchbarColor(this);
      }
    }
    else if (this.ac_slider !== undefined && this.component_held[0] === this.ac_slider[0] && this.alpha_channel !== undefined) {
      const AC_CONTAINER: HTMLElement = this.alpha_channel.parent()[0];
      const MOUSE_Y: number = event.clientY - AC_CONTAINER.offsetTop;

      if (MOUSE_Y <= AC_CONTAINER.offsetHeight) {
        this.ac_slider_position = helpers.moveVerticalSlider(
          this.ac_slider[0],
          MOUSE_Y
        );

        this.selected_color.a = helpers.getAlpha(
          this.alpha_channel[0],
          this.ac_slider_position
        );

        helpers.updateColorDisplay(this);

        helpers.updateSearchbarColor(this);

        helpers.adjustSearchbarColorContrast(this);
      }
    }
    else if (this.snt_cursor !== undefined && this.component_held[0] === this.snt_cursor[0] && this.shades_and_tints !== undefined) {
      const MOUSE_POSITION = helpers.getMousePositionRelativeToElement(
        this.shades_and_tints[0],
        event.clientX,
        event.clientY
      );

      const SNTC: HTMLElement = this.snt_cursor[0]; 

      this.sntc_position = helpers.moveSNTCursor(
        SNTC,
        MOUSE_POSITION.x,
        MOUSE_POSITION.y
      );

      const SNTC_COORDINATES: shared_types.Coordinates = helpers.getSNTCursorAbsoluteCoordinates(
        SNTC,
        this.sntc_position
      );

      if (this.sntc_image_data !== undefined && this.alpha_channel !== undefined) {
        const COLOR: shared_types.PixelBits = helpers.getPixel(
          this.sntc_image_data,
          SNTC_COORDINATES.x,
          SNTC_COORDINATES.y
        );

        // selects the shade or tint
        this.selected_color = {
          r: COLOR[0],
          g: COLOR[1],
          b: COLOR[2],
          a: helpers.getAlpha(
            this.alpha_channel[0],
            this.ac_slider_position
          )
        };

        helpers.updateSNTCursorBackground(this);

        helpers.updateColorDisplay(this);

        helpers.updateAlphaChannelDisplay(this);

        helpers.updateSearchbarColor(this);

        helpers.adjustSearchbarColorContrast(this);
      }
    }
  }
};

function mouseLeaveHandler(this: JSColorPicker) {
  this.component_held = undefined;
};

function searchbarInputHandler(this: JSColorPicker, event: JQuery.TriggeredEvent) {
  const SEARCHBAR: JQuery<HTMLInputElement> = $(event.target);
  const INPUT = SEARCHBAR.val();

  if (INPUT !== undefined && typeof INPUT === 'string') {
    let is_valid_color: boolean = false;

    if (/^rgba\(((0|[0-9]{1,3}),[ ]?){2}(0|[0-9]{1,3}),[ ]?(0|1(\.0)?|0\.[0-9]+)\)$/g.test(INPUT)) {
      const RGBA_values: Array<string> = INPUT.substring(
        INPUT.indexOf('(') + 1,
        INPUT.indexOf(')')
      ).replace(/ /g, '').split(',');

      const R: number = parseInt(RGBA_values[0]);
      const G: number = parseInt(RGBA_values[1]);
      const B: number = parseInt(RGBA_values[2]);

      const R_IS_VALID: boolean = R >= 0 && R <= 255;
      const G_IS_VALID: boolean = G >= 0 && G <= 255;
      const B_IS_VALID: boolean = B >= 0 && B <= 255;

      if (R_IS_VALID && G_IS_VALID && B_IS_VALID) {
        this.selected_color = {
          r: R,
          g: G,
          b: B,
          a: parseFloat(RGBA_values[3]),
        };

        is_valid_color = true;
      }
    }
    else if (/^#([0-9a-f]){8}$/g.test(INPUT.toLowerCase())) {
      const R: string = `${INPUT[1]}${INPUT[2]}`;
      const G: string = `${INPUT[3]}${INPUT[4]}`;
      const B: string = `${INPUT[5]}${INPUT[6]}`;
      const A: string = `${INPUT[7]}${INPUT[8]}`;

      this.selected_color = {
        r: parseInt(R, 16),
        g: parseInt(G, 16),
        b: parseInt(B, 16),
        a: parseFloat((parseInt(A, 16) / 255).toFixed(2))
      };

      is_valid_color = true;
    }
    else if (/^hsva\((0|[0-9]{1,3})\u00B0?,[ ]?((0|[0-9]{1,3})\u0025?,[ ]?){2}(0|1(\.0)?|0\.[0-9]+)\)$/g.test(INPUT)) {
      const HSVA_values: Array<string> = INPUT.substring(
        INPUT.indexOf('(') + 1,
        INPUT.indexOf(')')
      ).replace(/ /g, '').split(',');

      const H: number = parseInt(HSVA_values[0]);
      const S: number = parseInt(HSVA_values[1]) / 100;
      const V: number = parseInt(HSVA_values[2]) / 100;
      const A: number = parseFloat(HSVA_values[3]);

      const H_IS_VALID: boolean = H >= 0 && H < 360;
      const S_IS_VALID: boolean = S >= 0 && S <= 100;
      const V_IS_VALID: boolean = V >= 0 && V <= 100;

      if (H_IS_VALID && S_IS_VALID && V_IS_VALID) {
        const CHROMA: number = V * S;

        const POINT_ON_RGB_CUBE: Array<number> = helpers.getPointWithSameHueAndChroma(H, CHROMA);

        if (POINT_ON_RGB_CUBE.length > 0) {
          const MATCH: number = V - CHROMA;

          this.selected_color = {
            r: Math.round((POINT_ON_RGB_CUBE[0] + MATCH) * 255),
            g: Math.round((POINT_ON_RGB_CUBE[1] + MATCH) * 255),
            b: Math.round((POINT_ON_RGB_CUBE[2] + MATCH) * 255),
            a: A
          };

          is_valid_color = true;
        }
      }
    }
    else if (/^hsla\((0|[0-9]{1,3})\u00B0?,[ ]?((0|[0-9]{1,3})\u0025?,[ ]?){2}(0|1(\.0)?|0\.[0-9]+)\)$/g.test(INPUT)) {
      const HSLA_values: Array<string> = INPUT.substring(
        INPUT.indexOf('(') + 1,
        INPUT.indexOf(')')
      ).replace(/ /g, '').split(',');

      const H: number = parseInt(HSLA_values[0]);
      const S: number = parseInt(HSLA_values[1]) / 100;
      const L: number = parseInt(HSLA_values[2]) / 100;
      const A: number = parseFloat(HSLA_values[3]);

      const H_IS_VALID: boolean = H >= 0 && H < 360;
      const S_IS_VALID: boolean = S >= 0 && S <= 100;
      const L_IS_VALID: boolean = L >= 0 && L <= 100;

      if (H_IS_VALID && S_IS_VALID && L_IS_VALID) {
        const CHROMA: number = (1 - Math.abs(2 * L - 1)) * S;

        const POINT_ON_RGB_CUBE: Array<number> = helpers.getPointWithSameHueAndChroma(H, CHROMA);

        if (POINT_ON_RGB_CUBE.length > 0) {
          const MATCH: number = L - (CHROMA / 2);

          this.selected_color = {
            r: Math.round((POINT_ON_RGB_CUBE[0] + MATCH) * 255),
            g: Math.round((POINT_ON_RGB_CUBE[1] + MATCH) * 255),
            b: Math.round((POINT_ON_RGB_CUBE[2] + MATCH) * 255),
            a: A
          };

          is_valid_color = true;
        }
      }
    }

    if (is_valid_color && this.hues !== undefined && this.hue_slider !== undefined && this.hcc_image_data !== undefined && this.alpha_channel !== undefined && this.ac_slider !== undefined && this.shades_and_tints !== undefined && this.snt_cursor !== undefined) {
      const HSV: shared_types.HSV = helpers.RGBtoHSV(this.selected_color);

      // moves the vertical slider for hue
      const Y_COORDINATE_OF_HUE: number = Math.round((HSV.h / 360) * this.hues[0].offsetHeight);

      helpers.moveVerticalSlider(
        this.hue_slider[0],
        Y_COORDINATE_OF_HUE
      );

      // updates the gradient of the shade & tint component with the hue of the color input
      const COPY_OF_COLOR_INPUT: shared_types.RGBA = this.selected_color;

      const COLOR_INPUT_HUE: shared_types.PixelBits = helpers.getPixel(this.hcc_image_data, 0, Y_COORDINATE_OF_HUE);

      this.selected_color = {
        r: COLOR_INPUT_HUE[0],
        g: COLOR_INPUT_HUE[1],
        b: COLOR_INPUT_HUE[2],
        a: this.selected_color.a
      };

      helpers.updateShadeAndTintCanvas(this);
      helpers.updateShadeAndTintDisplay(this);

      // moves the vertical slider for transparency
      const Y_COORDINATE_OF_ALPHA: number = Math.round((1 - this.selected_color.a) * this.alpha_channel[0].offsetHeight);

      helpers.moveVerticalSlider(
        this.ac_slider[0],
        Y_COORDINATE_OF_ALPHA
      );

      // moves the S&T cursor
      helpers.moveSNTCursor(
        this.snt_cursor[0],
        Math.round(this.shades_and_tints[0].offsetWidth * (HSV.s / 100)),
        Math.round(this.shades_and_tints[0].offsetHeight * (1 - (HSV.v / 100)))
      );
    }
  }
};



const event_handlers = {
  mouseDownHandler,
  mouseUpHandler,
  mouseMoveHandler,
  mouseLeaveHandler,
  searchbarInputHandler
};

export default event_handlers;