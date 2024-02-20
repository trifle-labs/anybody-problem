const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const fs = require('fs')

const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  externals: {
    'fs': 'fs',
    'window': 'window'
  },
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'anybody-problem.js',
    // library: {
    //   name: 'anybody-problem',
    //   type: 'umd',
    // },
    // library: {
    // name: 'anybody-problem',
    // type: 'module',
    // },
    libraryTarget: 'module', // For Webpack 5
    libraryExport: 'default', // This option is often used to select which part of your module to export if it's not the entire module.
    // library: 'anybody-problem',
    // libraryTarget: 'umd',
    globalObject: 'this',
    publicPath: '',
    clean: true,
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
    // new HtmlWebpackPlugin({
    //   hash: true,
    //   title: 'Anybody Problem',
    //   metaDesc: 'Anybody Problem',
    //   template: path.resolve(__dirname, 'src/dev.ejs'),
    //   filename: 'dev.html',
    //   inject: false,
    //   minify: false,
    // }),
    // new HtmlWebpackPlugin({
    //   hash: true,
    //   title: 'Anybody Problem',
    //   metaDesc: 'Anybody Problem',
    //   template: path.resolve(__dirname, 'src/grid.ejs'),
    //   filename: 'grid.html',
    //   inject: false,
    //   minify: false,
    // }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'public' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.json'], // Automatically resolve certain extensions
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile .js files with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.json$/, // Allows importing JSON files directly
        type: 'json',
      },
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