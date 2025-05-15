const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  performance: {
    maxAssetSize: 500000,
    maxEntrypointSize: 500000,
  },
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.scss'],
  },
};
