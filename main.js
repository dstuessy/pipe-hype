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
const textures = {};

async function renderBackground() {
  for (let i = 0; i < GRID_SIZE_X; i++) {
    const randomGround = EMPTY_GROUND[Math.floor(Math.random() * EMPTY_GROUND.length)]
    const groundTexture = textures[randomGround.spritePath];
    renderToGrid(groundTexture, [i, 0])
  }
  for (let i = 0; i < GRID_SIZE_X; i++) {
    for (let ii = 1; ii < GRID_SIZE_Y; ii++) {
      const randomUnderground = EMPTY_UNDERGROUND[Math.floor(Math.random() * EMPTY_UNDERGROUND.length)]
      const undergroundTexture = textures[randomUnderground.spritePath];
      renderToGrid(undergroundTexture, [i, ii])
    }
  }
}

async function renderQueue(level) {
  const scale = getScale();
  const margin = getGridMargins();
  const queueW = (QUEUE_WIDTH * CELL_SIZE);
  const queueH = (GRID_SIZE_Y * CELL_SIZE);
  const pos = [margin[0]-(queueW * scale)-QUEUE_MARGIN, margin[1]];

  const container = new PIXI.Container();
  container.interactive = true;

  for (const part of level.partsQueue) {
    const partTexture = textures[part.spritePath];
    part.sprite = Sprite.from(partTexture);
    queue.push(part);
  }

  const queueCover = new PIXI.Graphics();
  queueCover.beginFill(0x000000, 0.5)
  queueCover.drawRect(pos[0], pos[1], queueW * scale, (queueH - CELL_SIZE) * scale);
  container.addChild(queueCover);

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

  const returnSelected = () => {
    if (selected) {
      selected.sprite.x = selected.oldPos[0];
      selected.sprite.y = selected.oldPos[1];
      selected.sprite.anchor.set(0);
      queue.push(selected);
      selected = null;
    }
  }

  border.on("pointerup", returnSelected)

  container.on("globalpointermove", (event) => {
    if (selected) {
      selected.sprite.x = event.global.x;
      selected.sprite.y = event.global.y;
    }
  });

  const selectableBorder = new PIXI.Graphics();
  selectableBorder.hitArea = new PIXI.Rectangle(pos[0], pos[1] + (queueH - CELL_SIZE) * scale, queueW * scale, CELL_SIZE * scale);
  selectableBorder.interactive = true;
  selectableBorder.lineStyle(4, 0x222034);
  selectableBorder.drawRect(pos[0], pos[1] + (queueH - CELL_SIZE) * scale, queueW * scale, CELL_SIZE * scale);
  container.addChild(selectableBorder);

  selectableBorder.on("pointerup", returnSelected);
  selectableBorder.on("pointerdown", (event) => {
    if (hoverCell) {
      app.stage.removeChild(hoverCell);
    }

    if (!selected) {
      selected = queue.pop();
      if (selected) {
        selected.oldPos = [selected.sprite.x, selected.sprite.y];
        selected.sprite.x = event.global.x;
        selected.sprite.y = event.global.y;
        selected.sprite.anchor.set(0.5);
      }
    } else {
      selected.sprite.x = selected.oldPos[0];
      selected.sprite.y = selected.oldPos[1];
      selected.sprite.anchor.set(0);
      queue.push(selected);
      selected = null;
    }
  });

  app.stage.addChild(container);
}

async function renderLevel(level) {
  for (const houseData of level.houses) {
    const houseTexture = textures[houseData.data.spritePath];
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
    const factoryTexture = textures[factoryData.data.spritePath];
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

async function renderLoseModal() {
  alert("Oh nooooo, you lost!");
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
      selected.sprite.anchor.set(0);
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

      for (const part of queue) {
        part.sprite.y = part.sprite.y + CELL_SIZE * scale;
      }

      const factories = entities.filter(e => e.type === "factory");
      for (const f of factories) {
        f.refs = findRefs(entities, f);
      }
      const completedFactories = factories.filter(f => isComplete(f));
      if (completedFactories.length === factories.length) {
        setTimeout(async () => {
          await renderWinModal();
          await reset();
        }, 200);
      } else if (queue.length === 0) {
        setTimeout(async () => {
          await renderLoseModal();
          await reset();
        }, 200);
      }
    }
  });
}

async function reset() {
  window.location.reload();
}

async function renderLoadingPart(n) {
  const imgWidth = 1600;
  const imgHeight = 1090;
  const scale = Math.min(app.renderer.width / imgWidth, app.renderer.height / imgHeight);
  const margin = [
    (app.renderer.width - 1600 * scale) / 2,
    (app.renderer.height - 1090 * scale) / 2,
  ]
  const texture = await Assets.load(`assets/loading-${n}.png`);
  const sprite = new PIXI.Sprite(texture);
  const minX = margin[0];
  const minY = margin[1] + 241 * scale;
  switch(n) {
    case 8:
      sprite.x = sprite.x + 320 * scale;
    case 7:
      sprite.x = sprite.x + 288 * scale;
    case 6:
      sprite.x = sprite.x + minX;
      sprite.y = minY + 272 * scale;
      break;
    case 5:
      sprite.x = sprite.x + 320 * scale;
    case 4:
      sprite.x = sprite.x + 320 * scale;
    case 3:
      sprite.x = sprite.x + 320 * scale;
    case 2:
      sprite.x = sprite.x + 288 * scale;
    case 1:
      sprite.x = sprite.x + minX;
      sprite.y = sprite.y + minY;
  }
  sprite.scale.set(scale);
  app.stage.addChild(sprite);
}

async function loadTextures() {
  for (const ground of EMPTY_GROUND) {
    textures[ground.spritePath] = await Assets.load(ground.spritePath);
  }
  await renderLoadingPart(1);
  for (const underground of EMPTY_UNDERGROUND) {
    textures[underground.spritePath] = await Assets.load(underground.spritePath);
  }
  await renderLoadingPart(2);
  textures[GREEN_FACTORY.spritePath] = await Assets.load(GREEN_FACTORY.spritePath);
  await renderLoadingPart(3);
  textures[HOUSE_1.spritePath] = await Assets.load(HOUSE_1.spritePath);
  await renderLoadingPart(4);
  textures["assets/title-screen.png"] = await Assets.load("assets/title-screen.png");
  await renderLoadingPart(5);
  textures[G_T_L_PIECE.spritePath] = await Assets.load(G_T_L_PIECE.spritePath);
  await renderLoadingPart(6);
  textures[G_T_R_PIECE.spritePath] = await Assets.load(G_T_R_PIECE.spritePath);
  await renderLoadingPart(7);
  textures[G_L_R_PIECE.spritePath] = await Assets.load(G_L_R_PIECE.spritePath);
  await renderLoadingPart(8);
}

async function renderLoadingScreen() {
  const imgWidth = 1600;
  const imgHeight = 1090;
  const scale = Math.min(app.renderer.width / imgWidth, app.renderer.height / imgHeight);
  const margin = [
    (app.renderer.width - 1600 * scale) / 2,
    (app.renderer.height - 1090 * scale) / 2,
  ]
  const bg = await Assets.load(LOADING_BG);
  const bgSprite = new PIXI.Sprite(bg);
  bgSprite.x = margin[0];
  bgSprite.y = margin[1];
  bgSprite.scale.set(scale);
  app.stage.addChild(bgSprite);
}

async function renderTitleScreen() {
  app.stage.removeChildren();
  app.renderer.clear();

  const imgWidth = 1600;
  const imgHeight = 1090;
  const scale = Math.min(app.renderer.width / imgWidth, app.renderer.height / imgHeight);
  const margin = [
    (app.renderer.width - 1600 * scale) / 2,
    (app.renderer.height - 1090 * scale) / 2,
  ]
  const titleTexture = textures["assets/title-screen.png"];
  const titleScreen = new PIXI.Sprite(titleTexture);
  console.log("ttleScreen", titleScreen)
  titleScreen.interactive = true;
  titleScreen.x = margin[0];
  titleScreen.y = margin[1];
  titleScreen.scale.set(scale);
  app.stage.addChild(titleScreen);

  const startText = new PIXI.Text("Click to Start!", { fontFamily: "Arial", fontSize: 64, fill: 0x000000, align: "left" });
  startText.x = margin[0] + CELL_SIZE * 14.5 * scale;
  startText.y = margin[1] + CELL_SIZE * 11 * scale;
  app.stage.addChild(startText);

  titleScreen.on('pointerdown', async () => {
    app.stage.removeChildren();
    app.renderer.clear();
    await renderBackground();
    await renderLevel(LEVEL_1);
    await renderGridOverlay();
    await renderQueue(LEVEL_1);
  });
}

;(async () => {
  await renderLoadingScreen();
  await loadTextures();
  await renderTitleScreen();
})()
