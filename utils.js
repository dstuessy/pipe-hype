
function getScale() {
  const gridPixelSize = GRID_SIZE * CELL_SIZE;
  return Math.min(app.renderer.height / gridPixelSize);
}
