const CELL_SIZE = 64;
const GRID_SIZE_X = 10;
const GRID_SIZE_Y = 7;
const QUEUE_WIDTH = 1;
const QUEUE_MARGIN = 16;

const GREEN_FACTORY = {
  type: "factory",
  spritePath: "assets/factory-green.png",
  connections: ["green"],
}

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

const HOUSE_1 = {
  type: "house",
  spritePath: "assets/house-1.png",
  connections: ["green"],
}

const G_T_L_PIECE = {
  color: "green",
  spritePath: "assets/g-t-l.png",
  connections: ["t", "l"],
}

const G_T_R_PIECE = {
  color: "green",
  spritePath: "assets/g-t-r.png",
  connections: ["t", "r"],
}

const G_L_R_PIECE = {
  color: "green",
  spritePath: "assets/g-l-r.png",
  connections: ["l", "r"],
}

const LEVEL_1 = {
  types: ["types"],
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
