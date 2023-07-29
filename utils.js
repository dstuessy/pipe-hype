
function getScale() {
  const gridPixelSizeX = GRID_SIZE_X * CELL_SIZE;
  const gridPixelSizeY = GRID_SIZE_Y * CELL_SIZE;
  return Math.min(app.renderer.height / gridPixelSizeY, app.renderer.width / gridPixelSizeX);
}

function getGridMargins(){
  const scale = getScale();
  return [
    (app.renderer.width - (GRID_SIZE_X * CELL_SIZE * scale)) / 2,
    (app.renderer.height - (GRID_SIZE_Y * CELL_SIZE * scale)) / 2,
  ]
}

function getGridPos(x, y) {
  const scale = getScale();
  return [
    Math.floor(x / (CELL_SIZE * scale)),
    Math.floor(y / (CELL_SIZE * scale)),
  ]
}
