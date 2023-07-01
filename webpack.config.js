/* eslint-disable @typescript-eslint/naming-convention */
"use strict";
const path = require("path");

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const extensionConfig = {
  target: "node",
  mode: "none",
  entry: "./src/extension.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2"
  },
  externals: {
    vscode: "commonjs vscode"
  },
  resolve: {
    extensions: [".ts", ".js", ".mjs"],
    alias: {
      "tailwind-merge/src": path.resolve(__dirname, "node_modules/tailwind-merge/dist")
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules\/(?!tailwind-merge)/,
        loader: "ts-loader",
        options: {
          allowTsInNodeModules: true
        }
      }
    ]
  },
  devtool: "nosources-source-map",
  infrastructureLogging: {
    level: "log"
  }
};

module.exports = [extensionConfig];
