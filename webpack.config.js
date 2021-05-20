const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack')
const dotenv = require('dotenv').config({
  path: __dirname + '/.env'
});

module.exports = {
  mode: 'production',
  entry: {
    login: './src/scripts/login.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    },
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    }],
  },
  resolve: {
    fallback: {
      "fs": false
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
    }),
  ],
  target: 'web',
  externals: /k6(\/.*)?/,
  devtool: 'source-map',
};