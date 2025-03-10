# JS Color Picker &nbsp;![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-2d8dfa?style=flat&logo=typescript&logoColor=white)
![GitHub](https://img.shields.io/github/license/andre2xu/color_picker?color=%##33a633) &nbsp;![npm (scoped)](https://img.shields.io/npm/v/@andre2xu/js-color-picker?color=%23de0404&label=latest&logo=npm)<br><br>
A simple and lightweight color picker for JavaScript projects. Feel free to use it for commercial and non-commercial purposes.

<a href="https://andre2xu.github.io/color_picker/">View demo</a><br><br>

STARTED: 1 June 2023<br>
FINISHED: 13 June 2023<br>

## Installation
```
npm install @andre2xu/js-color-picker
```

## Usage
The following code block shows how to use it with React:

```JavaScript
import React from 'react';
import JSColorPicker from "@andre2xu/js-color-picker";
import "../node_modules/@andre2xu/js-color-picker/index.css";

// CLASS COMPONENT
class App extends React.Component {
  componentDidMount() {
    // creates color picker after the component has rendered
    new JSColorPicker('my-element');
  }

  render() {
    return (
      <div className="App">
        <div id="my-element"></div>
      </div>
    );
  }
}

// FUNCTIONAL COMPONENT
function App() {
  React.useEffect(() => {
    // creates color picker after the component has rendered
    new JSColorPicker('my-element');
  }, []);

  return (
    <div className="App">
      <div id="my-element"></div>
    </div>
  );
};

export default App;
```
<br>

The following code block shows how to use the API:

```JavaScript
const COLOR_PICKER = new JSColorPicker('my-element');

COLOR_PICKER.setSize(300, 250); // width: 300px, height: 250px

COLOR_PICKER.setScale(2); // width: (300*2)px, height: (250*2)px

// control visibility
COLOR_PICKER.hide();

COLOR_PICKER.show();

// detect & respond to changes in the color
COLOR_PICKER.addOnChangeListener(function (event) {
  console.log(event.color); // example: {r: 255, g: 0, b: 0, a: 0.5}
});

const RGBA = COLOR_PICKER.getColor(); // returns an object containing RGBA data

const CP_ELEMENT = COLOR_PICKER.getColorPicker(); // returns the color picker's element (use this if you want to add your own CSS or overwrite the existing ones)
```

<br>

## IMPORTANT
- The color picker can work on its own, it does not need React

- Make sure that the container element for the color picker has rendered on the DOM, otherwise you would get an error saying that there's no element with the id you specified in the constructor

- Be sure to import/include the stylesheet because not only is it required to render the color picker but it's also used to compute the dimensions of the canvases
<br>

## CHANGELOG
[1.1.1] - 2025-03-07
### Fixed
- Fixed the movement of the cursor and the sliders.<br><br>

[1.1.0] - 2024-03-27
### Added
- Added an API method for binding a listener to the color picker that detects & reacts to changes in the color
- The API code block in this README now includes all API methods<br><br>

[1.0.5] - 2024-01-06
### Fixed
- Fixed the condition that was supposed to prevent NaN values for the HSLA and HSVA angles; it now properly checks for NaN<br><br>

[1.0.1] - 2024-01-04 (deleted)
### Fixed
- Added a condition that prevents NaN values for the HSLA and HSVA angles<br><br>

## License
Distributed under the MIT License. See LICENSE for more information.
