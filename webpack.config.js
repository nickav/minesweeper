const webpack = require('webpack');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageJson = require('./package.json');

// Environment
const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const sourceMap =
  typeof process.env.SOURCE_MAP !== 'undefined'
    ? process.env.SOURCE_MAP
    : !isProd;
const appEnv =
  typeof process.env.APP_ENV !== 'undefined' ? process.env.APP_ENV : 'dev';

const HTML_VARS = {
  title: 'Minesweeper',
  description: 'A simple minesweeper game built in React',
  themeColor: '#000000',
};

const ENV_VARS = {
  NODE_ENV: env,
  APP_ENV: appEnv,
  COMMIT_HASH: process.env.COMMIT_HASH || '',
  VERSION: packageJson.version,
  DATE: new Date(),
  TITLE: HTML_VARS.title,
  API_URL: '/api',
  GOOGLE_MAPS_API_KEY: 'AIzaSyDzir-UR9bIut0_v4tT1VvZDZ_kBSHmlkM',
};

// Babel
const babelrc = {
  options: {
    cacheDirectory: true,
    presets: [
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          targets: {
            chrome: '69',
            firefox: '62',
            safari: '11',
            edge: '17',
            ie: '11',
          },
          useBuiltIns: 'usage',
          corejs: '2',
        },
      ],
    ],
    plugins: [
      'react-hot-loader/babel',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
    ],
  },
};

// Config
module.exports = {
  devtool: sourceMap ? 'eval-source-map' : '',

  entry: ['babel-polyfill', './src/index.jsx'],

  output: {
    path: path.join(__dirname, '/bin'),
    filename: isProd ? '[name].[chunkhash:8].js' : 'main.js',
    chunkFilename: isProd ? '[name].[chunkhash:8].bundle.js' : '[id].js',
    publicPath: '/',
  },

  bail: isProd,

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname),
      '@c': path.resolve(__dirname, 'src', 'components'),
      '@s': path.resolve(__dirname, 'src', 'store'),
      '@h': path.resolve(__dirname, 'src', 'helpers'),
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        ...babelrc,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProd,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: true,
              sourceMap,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, 'src', 'style', 'globals'),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'img/',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            ...babelrc,
          },
          {
            loader: 'react-svg-loader',
            options: {
              es5: true,
              svgo: {
                plugins: [{ mergePaths: false }, { removeTitle: true }],
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    ...(isProd
      ? [new webpack.HashedModuleIdsPlugin(), new CleanWebpackPlugin()]
      : []),

    new webpack.EnvironmentPlugin(ENV_VARS),

    new CopyWebpackPlugin([{ from: 'public', ignore: ['img/*'] }]),

    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[hash:8].css' : '[name].css',
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
      vars: HTML_VARS,
    }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },

  node: {
    fs: 'empty',
  },

  devServer: {
    host: 'localhost',
    port: 8080,
    disableHostCheck: true,
    historyApiFallback: true,
    inline: true,
    contentBase: 'bin/',
    proxy: {
      '/api': { target: 'http://localhost:8000', secure: false },
    },
    overlay: {
      warnings: !isProd,
      errors: !isProd,
    },
  },
};
