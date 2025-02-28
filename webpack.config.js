import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = true;

export default {
  mode: isProduction ? "production" : "development",
  entry: "./src/js/app.js",
  resolve: {
    extensions: [".js", ".json"],
  },
  devtool: isProduction ? false : "source-map",
  output: {
    filename: "main.[contenthash].js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "> 0.25%, not dead",
                    useBuiltIns: "usage",
                    corejs: 3,
                  },
                ],
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|gif|svg|webp|ico)$/,
        type: "asset/resource",
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: { quality: 75 },
              optipng: { enabled: true },
              svgo: { cleanupIDs: true },
            },
          },
        ],
        generator: {
          filename: "assets/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.ejs",
      title: "Settings Menu",
      favicon: "./src/img/game.ico",
    }),
    new ESLintPlugin({
      fix: true,
      context: path.resolve(__dirname, "src/.js"),
    }),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: "styles.[contenthash].css",
          }),
        ]
      : []),
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devServer: {
    static: path.resolve(__dirname, "build"),
    hot: true,
    liveReload: true,
    compress: true,
    port: 3000,
    open: true,
  },
};