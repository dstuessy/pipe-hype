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

let selected = null;
const queue = [];
const grid = new Array(GRID_SIZE_Y).fill(null).map(() => new Array(GRID_SIZE_X).fill(null)); 
const overlays = [];

function drawQueue() {
  const scale = getScale();
  const margin = getGridMargins();
  const queueW = (QUEUE_WIDTH * CELL_SIZE);
  const queueH = (GRID_SIZE_Y * CELL_SIZE);
  const pos = [margin[0]-queueW-QUEUE_MARGIN * scale, margin[1]];

  const border = new PIXI.Graphics();
  border.lineStyle(4, 0xcbdbfc);
  border.drawRect(pos[0], pos[1], queueW * scale, queueH * scale);
  app.stage.addChild(border);

  queue.forEach(async (part, i) => {
    part.sprite.x = pos[0];
    part.sprite.y = (pos[1] + (queueH - CELL_SIZE * queue.length) * scale) + (i * CELL_SIZE * scale);
    part.sprite.scale.set(scale);
    part.sprite.interactive = true;
    app.stage.addChild(part.sprite);

    part.sprite.on("pointerdown", (event) => {
      if (!selected) {
        selected = queue[queue.length - 1];
        selected.oldPos = [selected.sprite.x, selected.sprite.y];
        selected.sprite.x = event.global.x;
        selected.sprite.y = event.global.y;
      } else {
        selected.sprite.x = selected.oldPos[0];
        selected.sprite.y = selected.oldPos[1];
        selected = null;
      }
    });

    part.sprite.on("globalmousemove", (event) => {
      if (selected) {
        selected.sprite.x = event.global.x;
        selected.sprite.y = event.global.y;
      }
    });
  });

  const selectableBorder = new PIXI.Graphics();
  selectableBorder.lineStyle(4, 0xcbdbfc);
  selectableBorder.drawRect(pos[0], pos[1] + (queueH - CELL_SIZE) * scale, queueW * scale, CELL_SIZE * scale);
  app.stage.addChild(selectableBorder);
}

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

      overlays.push(cell);
    }
  }

  const border = new PIXI.Graphics();
  border.lineStyle(4, 0xcbdbfc);
  border.drawRect(margin[0], margin[1], GRID_SIZE_X * CELL_SIZE * scale, GRID_SIZE_Y * CELL_SIZE * scale);
  app.stage.addChild(border);
}

async function renderLevel(level) {
  for (const part of level.partsQueue) {
    const partTexture = await Assets.load(part.spritePath);
    part.sprite = Sprite.from(partTexture);
    queue.push(part);
  }
  level.houses.forEach(async (houseData) => {
    grid[houseData.pos[0]][houseData.pos[1]] = houseData;
    const houseTexture = await Assets.load(houseData.type.spritePath);
    renderToGrid(houseTexture, houseData.pos)
  });
  level.factories.forEach(async (factoryData) => {
    grid[factoryData.pos[0]][factoryData.pos[1]] = factoryData;
    const factoryTexture = await Assets.load(factoryData.type.spritePath);
    renderToGrid(factoryTexture, factoryData.pos)
  });
  grid[0].forEach((_, i) => {
    const randomGround = EMPTY_GROUND[Math.floor(Math.random() * EMPTY_GROUND.length)]
    renderToGrid(randomGround.spritePath, [i, 0])
  })
  for (let i = 0; i < GRID_SIZE_X; i++) {
    for (let ii = 1; ii < GRID_SIZE_Y; ii++) {
      const randomUnderground = EMPTY_UNDERGROUND[Math.floor(Math.random() * EMPTY_UNDERGROUND.length)]
      renderToGrid(randomUnderground.spritePath, [i, ii])
    }
  }
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
  drawPipeGrid(cellTexture);
  await renderLevel(LEVEL_1);
  drawQueue(LEVEL_1);
})()
