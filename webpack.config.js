const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require("webpack");

module.exports = (e, argv) => {
  let env = "";

  if (argv.mode == "production") {
    env = "./.production.env";
  } else {
    env = "./.development.env";
  }

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "management.[chunkhash].js",
      publicPath: "/",
    },
    resolve: {
      fallback: {
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        util: require.resolve("util/"),
        fs: false,
      },
      extensions: [".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.html$/,
          use: {
            loader: "html-loader",
          },
        },
        {
          test: /\.(s*)css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        store: "store",
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
      }),
      new MiniCssExtractPlugin({
        filename: "assets/management.css",
      }),
      new Dotenv({
        path: env,
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),
      //new BundleAnalyzerPlugin()
    ],
    devServer: {
      static: path.join(__dirname, "dist"),
      compress: true,
      port: 8000,
      historyApiFallback: true,
      open: true,
    },
  };
};
