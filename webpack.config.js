const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index',
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devtool: 'source-map',
  cache: true,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
        },
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }, 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        },
        // use: {
        //   loader: 'babel-loader',
        // }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          // {
          //   loader: 'css-loader',
          //   options: {
          //     modules: true,
          //     importLoaders: 1,
          //     sourceMap: true,
          //   }
          // },
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]',
              },
              importLoaders: 1,
              // camelCase: true,
              localsConvention: 'camelCase',
              sourceMap: true,//shouldUseSourceMap,
            }
          }
        ],
        exclude: /node_modules/
      },
    ]
  },
  devServer: {
    port: 8080,
    open: true,
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'public'),
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // new MiniCssExtractPlugin({ filename: 'css/styles.css' }),
  ]
};