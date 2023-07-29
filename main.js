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

function drawPipeGrid(texture) {
  const scale = getScale();
  const margin = getGridMargins();

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

function renderToGrid(texture, pos) {
  const house = Sprite.from(texture);
  const scale = getScale();
  const gridMargin = getGridMargins();
  house.x = gridMargin[0] + pos[0] * CELL_SIZE * scale;
  house.y = gridMargin[1] + pos[1] * CELL_SIZE * scale;

  house.scale.set(scale);
  app.stage.addChild(house);
}

;(async () => {
  const cellTexture = await Assets.load("assets/cell.png");
  const houseTexture = await Assets.load('assets/house-1.png');

  drawPipeGrid(cellTexture);

  renderToGrid(houseTexture, [0, 0]);
})()
