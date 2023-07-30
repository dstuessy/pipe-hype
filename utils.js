
function getScale() {
  const gridPixelSizeX = GRID_SIZE_X * CELL_SIZE;
  const gridPixelSizeY = GRID_SIZE_Y * CELL_SIZE;
  return Math.min(app.renderer.height / gridPixelSizeY, app.renderer.width / gridPixelSizeX);
}

function getGridMargins() {
  const scale = getScale();
  return [
    (app.renderer.width - (GRID_SIZE_X * CELL_SIZE * scale)) / 2,
    (app.renderer.height - (GRID_SIZE_Y * CELL_SIZE * scale)) / 2,
  ]
}

function findRefs(entities, entity) {
  const neighbours = entities.filter((other) => {
    if (other === entity) {
      return false;
    }

    if (entity.color.every((color) => color === other.color.includes(color))) {
      return false;
    }

    if (entity.connections.includes("top") && other.connections.includes("bottom")) {
      return other.pos[0] === entity.pos[0] && other.pos[1] === entity.pos[1] - 1;
    }

    if (entity.connections.includes("down") && other.connections.includes("up")) {
      return other.pos[0] === entity.pos[0] && other.pos[1] === entity.pos[1] + 1;
    }

    if (entity.connections.includes("left") && other.connections.includes("right")) {
      return other.pos[0] === entity.pos[0] - 1 && other.pos[1] === entity.pos[1];
    }

    if (entity.connections.includes("right") && other.connections.includes("left")) {
      return other.pos[0] === entity.pos[0] + 1 && other.pos[1] === entity.pos[1];
    }

    return false;
  });

  return neighbours;
}

function renderToGrid(texture, pos) {
  const sprite = Sprite.from(texture);
  const scale = getScale();
  const gridMargin = getGridMargins();
  sprite.x = gridMargin[0] + pos[0] * CELL_SIZE * scale;
  sprite.y = gridMargin[1] + pos[1] * CELL_SIZE * scale;

  sprite.scale.set(scale);
  app.stage.addChild(sprite);
  return sprite;
}

function getGridPos(x, y) {
  const scale = getScale();
  return [
    Math.floor(x / (CELL_SIZE * scale)),
    Math.floor(y / (CELL_SIZE * scale)),
  ]
}

function isComplete(piece) {
  if (piece && !piece.refs.length) {
    return false;
  }

  // piece.refs.forEach((ref) => {
  // });
}
