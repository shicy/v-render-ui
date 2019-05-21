const Path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = env => {
  let isDevelopment = env.NODE_ENV == "development";

  let fileName = "vrender-ui";
  if (!isDevelopment) {
    // let dt = new Date();
    // let year = dt.getFullYear() - 2000;
    // let month = dt.getMonth();
    // let date = dt.getDate();
    // fileName += "." + (year < 10 ? "0" : "") + year;
    // fileName += (month < 10 ? "0" : "") + month;
    // fileName += (date < 10 ? "0" : "") + date;
    fileName += ".[chunkhash:8]";
  }

  return {
    mode: env.NODE_ENV || "production",
    entry: "./build/build.js",

    output: {
      path: Path.resolve(__dirname, "dist"),
      filename: fileName + ".js",
      libraryTarget: "var"
    },

    devtool: "inline-cheap-source-map",

    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }, {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ContextReplacementPlugin(/.+/, () => {}),
      new MiniCssExtractPlugin({
        filename: fileName + ".css"
      })
    ],

    optimization: {
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  };
};
