let type = "WebGL";

if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

//Aliases
const Application = PIXI.Application,
    Assets = PIXI.Assets,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.resizeTo = window;

app.renderer.backgroundColor = 0xffffff;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const cells = [];

;(async () => {
  const texture = await Assets.load("assets/cell.png");
  const scale = getScale();
  const gridMargin = [
    (app.renderer.width - (GRID_SIZE * CELL_SIZE * scale)) / 2,
    (app.renderer.height - (GRID_SIZE * CELL_SIZE * scale)) / 2,
  ]

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let ii = 0; ii < GRID_SIZE; ii++) {
      const cell = Sprite.from(texture);
      app.stage.addChild(cell);

      cell.x = gridMargin[0] + (i * CELL_SIZE * scale);
      cell.y = gridMargin[1] + (ii * CELL_SIZE * scale);

      console.log(scale)
      cell.scale.set(scale);

      cells.push(cell);
    }
  }
})()
