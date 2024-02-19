const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const fs = require('fs')

const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    anybody: [path.resolve(__dirname, 'src', 'anybody.js')],
  },
  externals: {
    'fs': 'fs',
    'window': 'window'
  },
  output: {
    publicPath: '',
    clean: true,
    libraryTarget: 'umd',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    // static: path.resolve(__dirname, "dist"),
    open: true
  },
  node: {
    __dirname: false,   // this configuration ensures you get the actual directory path
    __filename: false,  // this configuration ensures you get the actual file path
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Anybody Problem',
      metaDesc: 'Anybody Problem',
      template: path.resolve(__dirname, 'src/index.ejs'),
      filename: 'index.html',
      inject: false,
      minify: true,
      templateParameters: (compilation, assets, options) => {
        const fs = require('fs')
        const p5Content = fs.readFileSync('./public/p5.min.js', 'utf-8')
        return {
          compilation,
          webpackConfig: options.webpackConfig,
          assets,
          options,
          fs,
          p5Content,
        }
      },
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Anybody Problem',
      metaDesc: 'Anybody Problem',
      template: path.resolve(__dirname, 'src/dev.ejs'),
      filename: 'dev.html',
      inject: false,
      minify: false,
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Anybody Problem',
      metaDesc: 'Anybody Problem',
      template: path.resolve(__dirname, 'src/grid.ejs'),
      filename: 'grid.html',
      inject: false,
      minify: false,
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'public' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|ttf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: true,
            },
          },
        ],
      },
    ]
  }
}