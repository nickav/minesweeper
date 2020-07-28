const assert = (expr, message) => {
  if (!expr) {
    throw message;
  }
}

exports.default = {
  output: {
    path: './src',
  },

  commands: {
    style: (ctx) => {
      assert(ctx.name, `[pinkprint]: style command requires a name`);
      ctx.print('style', { basePath: 'style', extension: '.scss' });
    },

    component: (ctx) => {
      assert(ctx.name, `[pinkprint]: component command requires a name`);
      ctx.print('component', { basePath: 'components' });
      ctx.print('style', { basePath: 'components' });
    },

    store: async (ctx) => {
      assert(ctx.name, `[pinkprint]: store command requires a name`);
      await ctx.print('store', { basePath: 'store' });
      ctx.print('reducer', { basePath: 'store' });
    },

    helper: (ctx) => {
      assert(ctx.name, `[pinkprint]: helper command requires a name`);
      ctx.print('helper', { basePath: 'helpers' });
    },
  },
};
