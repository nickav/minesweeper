exports.default = {
  extension: '.scss',
  basePath: 'style',
  generate: (args) =>
    `
// File: ${args.name}

.${args.name} {
}
`.trim(),
};
