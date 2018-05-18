const path = require('path')

module.exports = {
  target: 'web',
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }, { test: /\.css$/, use: ['style-loader', 'css-loader'] }],
  },
}
