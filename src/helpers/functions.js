import Game from '../components/main/Game';

// Non-destructive update of array
export const arrUpdate = (arr, val, i) => {
  return [...arr.slice(0, i), val, ...arr.slice(i + 1)];
};

// Non-destructive delete of array
export const arrDelete = (arr, i) => {
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
};

// Non-destructive insert of array
export const arrInsert = (arr, val, i) => {
  return [...arr.slice(0, i), val, ...arr.slice(i)];
};

// Non-destructive append of array
export const arrAppend = (arr, val) => {
  return [...arr, val];
};

// Alternate method of array creation based on initial size and value
export const arrNew = (size = 0, value) => {
  if (typeof value === 'function') {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
      arr[i] = value(i);
    }
    return arr;
  }

  return new Array(size).fill(value);
};

export const arrUniq = (arr) => [...new Set(arr)];

export const arrChunk = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const objFilter = (obj, fn) =>
  Object.keys(obj)
    .filter((key) => fn(key, obj[key], obj))
    .reduce((memo, key) => {
      memo[key] = obj[key];
      return memo;
    }, {});

// Transforms every key and value of object
export const objMap = (obj, keyFn, valFn) =>
  Object.keys(obj).reduce((memo, key) => {
    const val = obj[key];
    memo[keyFn(key, val, obj)] = valFn(val, key, obj);
    return memo;
  }, {});

// Transforms every key of object
export const objMapKeys = (obj, keyFn) =>
  Object.keys(obj).reduce(
    (memo, key) => ((memo[keyFn(key, obj[key], obj)] = obj[key]), memo),
    {}
  );

// Transforms every value of object
export const objMapValues = (obj, valFn) =>
  Object.keys(obj).reduce(
    (memo, key) => ((memo[key] = valFn(obj[key], key, obj)), memo),
    {}
  );

// Clamps val between [min, max] inclusive.
export const clamp = (
  val,
  lower = -Number.MAX_VALUE,
  upper = Number.MAX_VALUE
) => {
  return Math.max(lower, Math.min(upper, val));
};

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
  /* 1 - 4: indicate number of neighboring bombs */
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
