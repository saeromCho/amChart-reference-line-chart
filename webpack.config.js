const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index',
  resolve: {
    extensions: [".js", ".jsx"]
  },
  cache: true,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  // entry: [
  //   './src/index.js'
  // ],
  // output: {
  //   path: path.resolve(__dirname, "public"),
  //   publicPath: '/',
  //   filename: 'bundle.js'
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    port: 8080,
    open: true,
    contentBase: path.join(__dirname, 'public'),
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};