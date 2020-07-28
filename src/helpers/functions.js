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
