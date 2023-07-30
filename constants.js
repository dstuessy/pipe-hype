const CELL_SIZE = 64;
const GRID_SIZE_X = 10;
const GRID_SIZE_Y = 7;
const QUEUE_WIDTH = 1;
const QUEUE_MARGIN = 16;
const OUTER_WIDTH_PIXELS = (GRID_SIZE_X * CELL_SIZE) + (QUEUE_WIDTH * CELL_SIZE) + QUEUE_MARGIN;
const MODAL_WIDTH = 8;
const MODAL_HEIGHT = 4;

const EMPTY_GROUND = [
  {
    spritePath: "assets/empty-ground-1.png",
  },
  {
    spritePath: "assets/empty-ground-2.png",
  },
  {
    spritePath: "assets/empty-ground-3.png",
  },
  {
    spritePath: "assets/empty-ground-4.png",
  },
]

const EMPTY_UNDERGROUND = [
  {
    spritePath: "assets/ground-1.png",
  },
  {
    spritePath: "assets/ground-2.png",
  },
  {
    spritePath: "assets/ground-3.png",
  },
  {
    spritePath: "assets/ground-4.png",
  },
  {
    spritePath: "assets/ground-5.png",
  },
  {
    spritePath: "assets/ground-6.png",
  },
  {
    spritePath: "assets/ground-7.png",
  },
  {
    spritePath: "assets/ground-8.png",
  },
]

const GREEN_FACTORY = {
  spritePath: "assets/factory-green.png",
  color: ["green"],
  connections: ["bottom"],
}

const BLUE_FACTORY = {
  spritePath: "assets/factory-blue.png",
  color: ["blue"],
  connections: ["bottom"],
}

const HOUSE_1 = {
  spritePath: "assets/house-1.png",
  color: ["green"],
  connections: ["bottom"],
}

const G_T_L_PIECE = {
  color: ["green"],
  spritePath: "assets/g-t-l.png",
  connections: ["top", "left"],
}

const G_T_R_PIECE = {
  color: ["green"],
  spritePath: "assets/g-t-r.png",
  connections: ["top", "right"],
}

const G_L_R_PIECE = {
  color: ["green"],
  spritePath: "assets/g-l-r.png",
  connections: ["left", "right"],
}

const LEVEL_1 = {
  partsQueue: [
    G_T_L_PIECE,
    G_L_R_PIECE,
    G_T_R_PIECE,
  ],
  houses: [
    {
      pos: [4, 0],
      data: HOUSE_1,
    },
    {
      pos: [3, 0],
      data: HOUSE_1,
    },
  ],
  factories: [
    {
      pos: [6, 0],
      data: GREEN_FACTORY,
    }
  ],
}
