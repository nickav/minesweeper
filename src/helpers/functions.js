export const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export const GameState = {
  NONE: 'none',
  PLAY: 'play',
  WIN: 'win',
  GAME_OVER: 'game_over',
};

export const Cell = {
  EMPTY: 0,
  /* 1 - 8: indicates number of neighboring bombs */
  BOMB: 9,
};

export const makeEmptyGrid = (width, height = 0, fn = () => 0) =>
  Array.from({ length: height || width }).map((e) =>
    Array.from({ length: width }).map(fn)
  );

export const getRandomPosition = (width, height) => ({
  x: randomBetween(0, width),
  y: randomBetween(0, height),
});

const getNeighboringPositions = (size, pos) => {
  const results = [];

  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      if (j === 0 && i === 0) continue;

      const x = pos.x + i;
      const y = pos.y + j;
      if (x < 0 || y < 0 || x >= size.width || y >= size.height) {
        continue;
      }

      results.push({ x, y });
    }
  }

  return results;
};

export const makeNewGame = (size, bombCount) => ({
  size,
  grid: makeEmptyGrid(size.width, size.height, () => ({
    value: Cell.EMPTY,
    visible: false,
    flagged: false,
  })),
  bombCount,
  totalCells: size.width * size.height,
  state: GameState.NONE,
  lastPos: { x: -1, y: -1 },
  moves: 0,
});

const buildGridFromFirstMove = (game, excludePosition) => {
  const { grid, bombCount, size } = game;

  // Generate bombs
  for (let i = 0; i < bombCount; i++) {
    const pos = getRandomPosition(size.width, size.height);

    if (
      Math.abs(pos.x - excludePosition.x) <= 1 &&
      Math.abs(pos.y - excludePosition.y) <= 1
    ) {
      i--;
      continue;
    }

    grid[pos.y][pos.x].value = Cell.BOMB;
  }

  // Count up neighboring bombs
  for (let y = 0; y < size.height; y++) {
    for (let x = 0; x < size.width; x++) {
      const cell = grid[y][x];

      if (cell.value === Cell.BOMB) {
        continue;
      }

      let count = 0;
      getNeighboringPositions(size, { x, y }).forEach((pos) => {
        const cell = grid[pos.y][pos.x];
        if (cell.value === Cell.BOMB) count++;
      });

      grid[y][x].value = count;
    }
  }
};

const floodFillAtPosition = (grid, size, pos) => {
  const cell = grid[pos.y][pos.x];

  if (cell.visible) return;

  cell.visible = true;

  if (cell.value > 0) return;

  getNeighboringPositions(size, pos).forEach((pos) => {
    const cell = grid[pos.y][pos.x];
    if (!cell.visible) floodFillAtPosition(grid, size, pos);
  });
};

const countVisibleCells = (grid, size) => {
  let count = 0;

  for (let y = 0; y < size.height; y++) {
    for (let x = 0; x < size.width; x++) {
      const cell = grid[y][x];
      if (cell.visible) count++;
    }
  }

  return count;
};

const revealGrid = (grid, size) => {
  for (let y = 0; y < size.height; y++) {
    for (let x = 0; x < size.width; x++) {
      grid[y][x].visible = true;
    }
  }
};

export const updateGame = (game, pos) => {
  const { grid, size } = game;

  switch (game.state) {
    case GameState.NONE:
      {
        buildGridFromFirstMove(game, pos);
        floodFillAtPosition(grid, size, pos);
        game.state = GameState.PLAY;
      }
      break;

    case GameState.PLAY:
      {
        const cell = grid[pos.y][pos.x];

        // NO-OP
        if (cell.visible) {
          return game;
        }

        // game over
        const didLose = cell.value === Cell.BOMB;

        floodFillAtPosition(grid, size, pos);

        const numVisibleCells = countVisibleCells(grid, size);
        const didWin = numVisibleCells === game.totalCells - game.bombCount;

        if (didLose || didWin) {
          revealGrid(grid, size);
          game.state = didLose ? GameState.GAME_OVER : GameState.WIN;
          break;
        }
      }
      break;

    case GameState.GAME_OVER:
    case GameState.WIN:
      {
        return makeNewGame(size, game.bombCount);
      }
      break;
  }

  game.lastPos = pos;
  game.moves++;
  console.log('updateGame', game, pos);

  return game;
};

export const toggleGameFlag = (game, pos) => {
  const { grid } = game;

  const cell = grid[pos.y][pos.x];

  if (!cell.visible) {
    cell.flagged = !cell.flagged;
  }

  return game;
};
