const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const __dirname = path.resolve()

  const config = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      assetModuleFilename: 'assets/[hash][ext][query]'
    },
    devServer: {
      open: true,
      host: 'localhost',
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      },
      static: {
        directory: path.join(__dirname, 'public')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        minify: isProduction
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css'
      })
    ],
    module: {
      rules: [
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  quietDeps: true
                }
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }

  if (isProduction) {
    config.mode = 'production'
    config.optimization = {
      minimize: true,
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      },
      runtimeChunk: 'single'
    }
    config.performance = {
      hints: 'warning',
      maxAssetSize: 244 * 1024,
      maxEntrypointSize: 244 * 1024
    }
  }
  else {
    config.mode = 'development'
    config.devtool = 'eval-source-map'
  }

  return config
}
