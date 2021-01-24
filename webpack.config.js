"use strict";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack");
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
const filename = (ext) =>
  isProd ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const optimization = () => {
  const configObj = {
    splitChunks: {
      chunks: "all",
    },
  };
  if (isProd) {
    configObj.minimizer = [new OptimizeCssAssetsPlugin(), new TerserPlugin()];
  }
  return configObj;
};
const plugins = () => {
  const basePlugins = [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filename("css")}`,
    }),
    // копирование не удалять
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       // from: path.resolve(__dirname, "src/assets"),
    //       // to: path.resolve(__dirname, "dist/assets"),
    //     },
    //   ],
    // }),
  ];
  if (isProd) {
    basePlugins.push(
      new ImageminPlugin({
        bail: false,
        cache: true,
        imageminOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
              {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                ],
              },
            ],
          ],
        },
      })
    );
  }
  return basePlugins;
};

//=======-->
module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: `./js/index.js`,
  output: {
    filename: `./js/${filename("js")}`,
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  // resolve: {
  //   extensions: [".js", ".css", ".scss", ".svg", ".jpeg", ".jpg"],
  //   alias: {
  //     "@nm": path.resolve(__dirname, "../node_modules/"),
  //   },
  // },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "dist"),
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },
  optimization: optimization(),
  plugins: plugins(),
  devtool: isProd ? false : "source-map",
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // не удалять тест babel
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
      // {
      //   test: /\.js$/i,
      //   exclude: /node_modules/,
      //   use: ["babel-loader"],
      // },

      {
        test: /\.(sa|sc|c])ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + "/";
              },
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(?:|png|jpg|jpeg|svg)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: `./img/${filename("[ext]")}`,
          },
        },
      },
      {
        test: /\.(?:|woff2|woff)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: `./fonts/${filename("[ext]")}`,
          },
        },
      },
    ],
  },
};
