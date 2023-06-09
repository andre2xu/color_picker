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

      if (this.hcc_image_data !== undefined && this.shades_and_tints !== undefined && this.snt_cursor !== undefined && this.sntc_image_data !== undefined && this.alpha_channel !== undefined && this.color_display !== undefined) {
        const HUE_PIXEL: shared_types.PixelBits = helpers.getPixel(this.hcc_image_data, 0, Math.round(this.hue_slider_position.top));

        // selects the hue
        this.selected_color = {
          r: HUE_PIXEL[0],
          g: HUE_PIXEL[1],
          b: HUE_PIXEL[2],
          a: this.selected_color.a
        };

        helpers.updateAllCanvases(this);

        helpers.updateShadeAndTintDisplay(
          this.shades_and_tints[0],
          this.selected_color
        );

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

        helpers.updateAlphaChannelDisplay(
          this.alpha_channel[0],
          this.selected_color
        );

        helpers.updateSNTCursorBackground(
          this.snt_cursor[0],
          this.selected_color
        );

        helpers.updateColorDisplay(
          this.color_display[0],
          this.selected_color
        );
      }
    }
    else if (this.alpha_channel !== undefined && this.alpha_channel[0] === CLICKED_ELEMENT && this.ac_slider !== undefined && this.color_display !== undefined) {
      const AC_CONTAINER: HTMLElement = event.target.parentElement as HTMLElement;

      this.ac_slider_position = helpers.moveVerticalSlider(
        this.ac_slider[0],
        event.clientY - AC_CONTAINER.offsetTop
      );

      this.selected_color.a = this.selected_color.a = helpers.getAlpha(
        this.alpha_channel[0],
        this.ac_slider_position
      );

      helpers.updateColorDisplay(
        this.color_display[0],
        this.selected_color
      );
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

      if (this.sntc_image_data !== undefined && this.color_display !== undefined && this.alpha_channel !== undefined) {
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

        helpers.updateSNTCursorBackground(
          this.snt_cursor[0],
          this.selected_color
        );

        helpers.updateColorDisplay(
          this.color_display[0],
          this.selected_color
        );

        helpers.updateAlphaChannelDisplay(
          this.alpha_channel[0],
          this.selected_color
        );
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

function mouseUpHandler(this: JSColorPicker) {
  this.component_held = undefined;
};

function mouseMoveHandler(this: JSColorPicker, event: JQuery.TriggeredEvent) {
  if (event.button === 0 && this.component_held !== undefined && event.clientX !== undefined && event.clientY !== undefined) {
    if (this.hue_slider !== undefined && this.component_held[0] === this.hue_slider[0] && this.hues !== undefined) {
      const HUE_COMPONENT: HTMLElement = this.hues[0];
      const MOUSE_Y: number = event.clientY - HUE_COMPONENT.offsetTop;

      if (MOUSE_Y <= HUE_COMPONENT.offsetHeight) {
        this.hue_slider_position = helpers.moveVerticalSlider(
          this.hue_slider[0],
          MOUSE_Y
        );

        if (this.hcc_image_data !== undefined && this.shades_and_tints !== undefined && this.snt_cursor !== undefined && this.sntc_image_data !== undefined && this.alpha_channel !== undefined && this.color_display !== undefined) {
          const HUE_PIXEL: shared_types.PixelBits = helpers.getPixel(this.hcc_image_data, 0, Math.round(this.hue_slider_position.top));

          // selects the hue
          this.selected_color = {
            r: HUE_PIXEL[0],
            g: HUE_PIXEL[1],
            b: HUE_PIXEL[2],
            a: this.selected_color.a
          };

          helpers.updateAllCanvases(this);

          helpers.updateShadeAndTintDisplay(
            this.shades_and_tints[0],
            this.selected_color
          );

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

          helpers.updateAlphaChannelDisplay(
            this.alpha_channel[0],
            this.selected_color
          );

          helpers.updateSNTCursorBackground(
            this.snt_cursor[0],
            this.selected_color
          );

          helpers.updateColorDisplay(
            this.color_display[0],
            this.selected_color
          );
        }
      }
    }
    else if (this.ac_slider !== undefined && this.component_held[0] === this.ac_slider[0] && this.alpha_channel !== undefined && this.color_display !== undefined) {
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

        helpers.updateColorDisplay(
          this.color_display[0],
          this.selected_color
        );
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

      if (this.sntc_image_data !== undefined && this.color_display !== undefined && this.alpha_channel !== undefined) {
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

        helpers.updateSNTCursorBackground(
          this.snt_cursor[0],
          this.selected_color
        );

        helpers.updateColorDisplay(
          this.color_display[0],
          this.selected_color
        );

        helpers.updateAlphaChannelDisplay(
          this.alpha_channel[0],
          this.selected_color
        );
      }
    }
  }
};

function mouseLeaveHandler(this: JSColorPicker) {
  this.component_held = undefined;
};



const event_handlers = {
  mouseDownHandler,
  mouseUpHandler,
  mouseMoveHandler,
  mouseLeaveHandler
};

export default event_handlers;