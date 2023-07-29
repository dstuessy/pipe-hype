const CELL_SIZE = 64;
const GRID_SIZE_X = 10;
const GRID_SIZE_Y = 7;
const QUEUE_WIDTH = 3;

const GREEN_FACTORY = {
  spritePath: "assets/factory-green.png",
  connections: ["green"],
}

const EMPTY_GROUND = [
  {
    spritePath: "assets/empty-ground-1.png",
  },
  {
    spritePath: "assets/empty-ground-2.png",
  }
]

const EMPTY_CONCRETE = [
  {
    spritePath: "assets/ground.png",
  }
]

const HOUSE_1 = {
  spritePath: "assets/house-1.png",
  connections: ["green"],
}

const G_T_L_PIECE = {
  spritePath: "assets/g-t-l.png",
  connections: ["t", "l"],
}

const G_T_R_PIECE = {
  spritePath: "assets/g-t-r.png",
  connections: ["t", "r"],
}

const G_L_R_PIECE = {
  spritePath: "assets/g-l-r.png",
  connections: ["l", "r"],
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
      type: HOUSE_1,
    },
  ],
  factories: [
    {
      pos: [6, 0],
      type: GREEN_FACTORY,
    }
  ],
}
