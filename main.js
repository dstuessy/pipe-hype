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
let hoverCell = null;
const completed = [];
const queue = [];
const entities = [];

async function renderBackground() {
  for (let i = 0; i < GRID_SIZE_X; i++) {
    const randomGround = EMPTY_GROUND[Math.floor(Math.random() * EMPTY_GROUND.length)]
    const groundTexture = await Assets.load(randomGround.spritePath);
    renderToGrid(groundTexture, [i, 0])
  }
  for (let i = 0; i < GRID_SIZE_X; i++) {
    for (let ii = 1; ii < GRID_SIZE_Y; ii++) {
      const randomUnderground = EMPTY_UNDERGROUND[Math.floor(Math.random() * EMPTY_UNDERGROUND.length)]
      const undergroundTexture = await Assets.load(randomUnderground.spritePath);
      renderToGrid(undergroundTexture, [i, ii])
    }
  }
}

async function renderQueue(level) {
  const scale = getScale();
  const margin = getGridMargins();
  const queueW = (QUEUE_WIDTH * CELL_SIZE);
  const queueH = (GRID_SIZE_Y * CELL_SIZE);
  const pos = [margin[0]-queueW-QUEUE_MARGIN * scale, margin[1]];

  const container = new PIXI.Container();
  container.interactive = true;

  for (const part of level.partsQueue) {
    const partTexture = await Assets.load(part.spritePath);
    part.sprite = Sprite.from(partTexture);
    queue.push(part);
  }

  const border = new PIXI.Graphics();
  border.hitArea = new PIXI.Rectangle(pos[0], pos[1], queueW * scale, queueH * scale);
  border.interactive = true;
  border.lineStyle(4, 0x222034);
  border.drawRect(pos[0], pos[1], queueW * scale, queueH * scale);
  container.addChild(border);

  queue.forEach(async (part, i) => {
    part.sprite.x = pos[0];
    part.sprite.y = (pos[1] + (queueH - CELL_SIZE * queue.length) * scale) + (i * CELL_SIZE * scale);
    part.sprite.scale.set(scale);
    app.stage.addChild(part.sprite);
  });

  border.on("pointerdown", (event) => {
    if (hoverCell) {
      app.stage.removeChild(hoverCell);
    }

    if (!selected) {
      selected = queue.pop();
      if (selected) {
        selected.oldPos = [selected.sprite.x, selected.sprite.y];
        selected.sprite.x = event.global.x;
        selected.sprite.y = event.global.y;
      }
    } else {
      selected.sprite.x = selected.oldPos[0];
      selected.sprite.y = selected.oldPos[1];
      queue.push(selected);
      selected = null;
    }
  });

  container.on("globalpointermove", (event) => {
    if (selected) {
      selected.sprite.x = event.global.x;
      selected.sprite.y = event.global.y;
    }
  });

  const selectableBorder = new PIXI.Graphics();
  selectableBorder.lineStyle(4, 0x222034);
  selectableBorder.drawRect(pos[0], pos[1] + (queueH - CELL_SIZE) * scale, queueW * scale, CELL_SIZE * scale);
  container.addChild(selectableBorder);

  app.stage.addChild(container);
}

async function renderLevel(level) {
  for (const houseData of level.houses) {
    const houseTexture = await Assets.load(houseData.data.spritePath);
    const sprite = renderToGrid(houseTexture, houseData.pos)
    entities.push({
      type: "house",
      pos: houseData.pos,
      color: houseData.data.color,
      connections: houseData.data.connections,
      sprite,
    });
  }
  for (const factoryData of level.factories) {
    const factoryTexture = await Assets.load(factoryData.data.spritePath);
    const sprite = renderToGrid(factoryTexture, factoryData.pos)
    entities.push({
      type: "factory",
      pos: factoryData.pos,
      color: factoryData.data.color,
      connections: factoryData.data.connections,
      refs: [],
      sprite,
    });
  }
}

async function renderWinModal() {
  alert("Congratulations, everything is connected!");
}

async function renderGridOverlay() {
  const scale = getScale();
  const margin = getGridMargins();

  const border = new PIXI.Graphics();
  border.hitArea = new PIXI.Rectangle(margin[0], margin[1], GRID_SIZE_X * CELL_SIZE * scale, GRID_SIZE_Y * CELL_SIZE * scale);
  border.interactive = true;
  border.lineStyle(4, 0x222034);
  border.drawRect(margin[0], margin[1], GRID_SIZE_X * CELL_SIZE * scale, GRID_SIZE_Y * CELL_SIZE * scale);
  app.stage.addChild(border);

  border.on("pointermove", (event) => {
    const pos = getGridPos(event.global.x - margin[0], event.global.y - margin[1]);
    if (hoverCell) {
      app.stage.removeChild(hoverCell);
    }
    if (selected && pos[1] > 0) {
      hoverCell = new PIXI.Graphics();
      hoverCell.lineStyle(4, 0x222034);
      hoverCell.drawRect(
        pos[0] * CELL_SIZE * scale + margin[0],
        pos[1] * CELL_SIZE * scale + margin[1],
        CELL_SIZE * scale,
        CELL_SIZE * scale
      );
      app.stage.addChild(hoverCell);
    }
  });

  border.on("pointerup", (event) => {
    const pos = getGridPos(event.global.x - margin[0], event.global.y - margin[1]);
    if (selected && pos[1] > 0) {
      selected.sprite.x = pos[0] * CELL_SIZE * scale + margin[0];
      selected.sprite.y = pos[1] * CELL_SIZE * scale + margin[1];
      const pipe = {
        type: "pipe",
        pos,
        refs: [],
        connections: selected.connections,
        color: selected.color,
        sprite: selected.sprite,
      }
      pipe.refs = findRefs(entities, pipe);
      entities.push(pipe);
      selected = null;
      app.stage.removeChild(hoverCell);
      const factories = entities.filter(e => e.type === "factory");
      for (const f of factories) {
        f.refs = findRefs(entities, f);
      }
      const completedFactories = factories.filter(f => isComplete(f));
      if (completedFactories.length === factories.length) {
        setTimeout(async () => {
          await renderWinModal();
        }, 500);
      }
    }
  });
}

;(async () => {
  await renderBackground();
  await renderLevel(LEVEL_1);
  await renderGridOverlay();
  await renderQueue(LEVEL_1);
})()
