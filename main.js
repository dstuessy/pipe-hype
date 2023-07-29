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

app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.resizeTo = document.getElementById('canvas-wrapper');

app.renderer.backgroundColor = 0xffffff;

//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById('canvas-wrapper').appendChild(app.view);

const cells = [];

function drawPipeGrid(texture, margin = [0, 0], scale = 1) {
  for (let i = 0; i < GRID_SIZE_X; i++) {
    for (let ii = 0; ii < GRID_SIZE_Y; ii++) {
      const cell = Sprite.from(texture);
      app.stage.addChild(cell);

      cell.x = margin[0] + (i * CELL_SIZE * scale);
      cell.y = margin[1] + (ii * CELL_SIZE * scale);

      cell.scale.set(scale);

      cells.push(cell);
    }
  }

  const border = new PIXI.Graphics();
  border.lineStyle(4, 0xcbdbfc);
  border.drawRect(margin[0], margin[1], GRID_SIZE_X * CELL_SIZE * scale, GRID_SIZE_Y * CELL_SIZE * scale);
  app.stage.addChild(border);
}

;(async () => {
  const cellTexture = await Assets.load("assets/cell.png");
  const scale = getScale();
  const gridMargin = [
    (app.renderer.width - (GRID_SIZE_X * CELL_SIZE * scale)) / 2,
    (app.renderer.height - (GRID_SIZE_Y * CELL_SIZE * scale)) / 2,
  ]

  drawPipeGrid(cellTexture, gridMargin, scale);
})()
