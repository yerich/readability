var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './src/index.jsx',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
};
