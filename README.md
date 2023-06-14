# JS Color Picker
A simple and lightweight color picker for JavaScript projects. Feel free to use it for commercial and non-commercial purposes.

<a href="https://andre2xu.github.io/color_picker/">View demo</a><br><br>

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
    </div>;
  );
};

export default App;
```
<br>

The following code block shows how to use the API:

```JavaScript
const COLOR_PICKER = new JSColorPicker('my-element');

const RGBA = COLOR_PICKER.getColor() // returns an object containing RGBA data

const CP_ELEMENT = COLOR_PICKER.getColorPicker() // returns the color picker's element (use this if you want to add your own CSS or overwrite the existing ones)
```

<br>

## IMPORTANT
- The color picker can work on its own, it does not need React

- Make sure that the container element for the color picker has rendered on the DOM, otherwise you would get an error saying that there's no element with the id you specified in the constructor

- Be sure to import/include the stylesheet because not only is it required to render the color picker but it's also used to compute the dimensions of the canvases
<br>

## License
Distributed under the MIT License. See LICENSE for more information.
