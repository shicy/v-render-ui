const Path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = env => {
  return {
    mode: env.NODE_ENV || "production",
    entry: "./build/build.js",

    output: {
      path: Path.resolve(__dirname, "dist"),
      filename: "vrender-ui.[chunkhash:8].js",
      libraryTarget: "var"
    },

    devtool: "cheap-source-map",

    module: {
      rules: [{
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ContextReplacementPlugin(/.+/, () => {}),
      new MiniCssExtractPlugin({
        filename: "vrender-ui.[chunkhash:8].css"
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
