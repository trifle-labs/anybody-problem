const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const fs = require('fs')
const templateParameters = (compilation, assets, options) => {
  return {
    compilation,
    webpackConfig: options.webpackConfig,
    assets,
    options,
  }
}
const path = require('path')

module.exports = {
  // mode: 'production',
  entry: './src/nft.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Ensure files are served relative to the base URL
    filename: 'anybody-problem.js',
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true
  },
  node: {
    __dirname: false,   // this configuration ensures you get the actual directory path
    __filename: false,  // this configuration ensures you get the actual file path
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Anybody Problem',
      metaDesc: 'Anybody Problem',
      template: path.resolve(__dirname, 'src/index.ejs'),
      filename: 'index.html',
      inject: false,
      minify: false,
      templateParameters,
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Anybody Problem',
      metaDesc: 'Anybody Problem',
      template: path.resolve(__dirname, 'src/dev.ejs'),
      filename: 'dev.html',
      inject: false,
      minify: false,
      templateParameters,
    }),
    new HTMLInlineCSSWebpackPlugin(),
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
      {
        test: /\.(wav|mp3|webm)/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
}