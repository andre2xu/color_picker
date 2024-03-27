import JSColorPicker from ".";

window.addEventListener('load', function () {
    const CP = new JSColorPicker('demo');

    CP.addOnChangeListener((event) => {
        console.log(event);
    });
});