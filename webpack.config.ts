import * as webpack from "webpack";
import * as path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import CopyPlugin from "copy-webpack-plugin";
import resolvePkg from "resolve-pkg";
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const rootPath = path.resolve(__dirname, "../");
const appPath = (nextPath: string) => path.join(rootPath, nextPath);
const pkg = require("./package.json");

export const find = (searchPath: string) => {
  const result = resolvePkg(searchPath);
  if (result) {
    return result;
  }
  throw new Error(`Not found: ${searchPath}`);
};

export const generatePublicPath = (isProduction: boolean): string => {
  if (isProduction) {
    return pkg.homepage;
  }
  return "http://localhost:9000";
};

export interface Option {
  output: webpack.Output;
  isProduction: boolean;
  entry: webpack.Entry;
}

export const generateConfig = ({
  isProduction,
  ...option
}: Option): webpack.Configuration => {
  console.log(`isProduction = ${isProduction}`);
  const publicPath = generatePublicPath(isProduction);

  const tsLoader: webpack.RuleSetUse = {
    loader: "ts-loader",
    options: {
      configFile: "tsconfig.json",
      transpileOnly: true,
    },
  };

  const babelLoader: webpack.RuleSetUse = {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets: ["@babel/preset-env"],
    },
  };

  return {
    mode: isProduction ? "production" : "development",
    target: "web",
    entry: option.entry,
    devtool: isProduction ? undefined : "inline-source-map",
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new CleanWebpackPlugin(),
      new ManifestPlugin(),
      new CopyPlugin({
        // @ts-ignore
        patterns: [
          {
            to: "scripts",
            from: find("react-dom/umd/react-dom.production.min.js"),
          },
          { to: "scripts", from: find("react/umd/react.production.min.js") },
        ],
      }),
    ].filter(Boolean),
    output: option.output,
    externals: [
      {
        react: "React",
        "react-dom": "ReactDOM",
      },
    ].filter(Boolean),
    performance: { hints: false },
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".scss", ".json"],
      alias: {
        React: appPath("node_modules/react"),
        ReactDOM: appPath("node_modules/react-dom"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/__tests__/, /node_modules/],
          loaders: [babelLoader, tsLoader],
        },
      ].filter(Boolean) as webpack.RuleSetRule[],
    },
  };
};

export default generateConfig({
  isProduction: process.env.NODE_ENV === "production",
  entry: {
    application: ["core-js", "regenerator-runtime/runtime", "./src/client.tsx"],
  },
  output: {
    filename: "scripts/[name].[hash].js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/",
  },
});
