const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// eslint-disable-next-line
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  target: 'web',
  entry: './src/client/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }, { test: /\.css$/, use: ['style-loader', 'css-loader'] }],
  },
  devServer: {
    port: 2999,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: 'assets/favicon.ico',
      template: 'assets/template.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
  ],
}
