const rc = require('rc');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { resolve } = require('path');

const config = rc('orga', {
  source: process.cwd(),
  moveDb: 'move-wiki.json',
});

const dbFile = resolve(config.source, config.moveDb);
const targetDir = resolve(__dirname, './dist/app');

module.exports = (_env, argv) => {
  return {
    entry: './src/app/index.tsx',
    devtool: argv.mode === 'development' ? 'inline-source-map' : 'none',
    output: {
      path: targetDir,
      filename: 'app.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    devServer: {
      contentBase: targetDir,
      historyApiFallback: true,
      compress: true,
      port: 9000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: { configFile: 'tsconfig.app.json' },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          { from: dbFile, to: 'data/items.json' },
          { from: resolve(__dirname, 'src/app/icons') },
          { from: resolve(__dirname, 'src/app/site.webmanifest') },
        ],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: resolve(__dirname, 'src/app/index.html'),
      }),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/',
      }),
    ],
  };
};
