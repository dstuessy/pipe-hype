let type = "WebGL";

if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

//Create a Pixi Application
const app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
