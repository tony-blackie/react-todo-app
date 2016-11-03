const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const packageJson = require('./package.json')
const config = packageJson.config.development

const extractAppCss = new ExtractTextPlugin(config.css.appBundle)
const extractVendorCss = new ExtractTextPlugin(config.css.vendorBundle)

module.exports = {
  devServer: {
    open: true,
    port: config.server.port,
    contentBase: config.distDir,
    hot: true,
    inline: true
  },
  watch: true,
  entry: {
    app: config.entry
  },
  // entry: [config.entry, `webpack-hot-middleware/${config.distDir}`],
  output: {
    path: config.distDir,
    filename: config.js.appBundle,
    publicPath: config.publicPath
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'react-hmre'],
          plugins: [
            'transform-object-rest-spread',
            'transform-es2015-modules-commonjs',
            'transform-class-properties'
          ]
        }
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: extractAppCss.extract('css?-autoprefixer!postcss!less', { publicPath: config.distDir })
      },
      {
        test: /\.css$/,
        loader: extractVendorCss.extract('css')
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg(\?v=\w+))$/,
        exclude: /node_modules/,
        loader: `file?name=${config.statics.fonts}`
      },
      {
        test: /\.(png|svg)$/,
        loader: `file?name=${config.statics.images}`
      }
    ]
  },
  postcss: function () {
    return [autoprefixer]
  },
  svgoConfig: {
    plugins: [
      { removeTitle: true },
      { convertColors: { shorthex: false } },
      { convertPathData: false }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new CleanWebpackPlugin(config.cleanDirs, {
      root: path.join(__dirname, config.distDir),
      verbose: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: config.js.vendorBundle,
      minChunks: module => isVendor(module)
    }),
    extractAppCss,
    extractVendorCss,
    new HtmlWebpackPlugin({
      template: config.htmlEntry,
      minify: { collapseWhitespace: true }
    })
  ]
}

function isVendor (module) {
  let userRequest = module.userRequest

  if (typeof userRequest !== 'string') {
    return false
  }

  return userRequest.includes('/node_modules/')
}
