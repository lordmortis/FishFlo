const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

const rules = [
  {
    test: /\.(js|jsx)$/,
    include: [path.join(__dirname, "src", "js")],
    exclude: [path.join(__dirname, "node_modules")],
    use: {
      loader: "babel-loader",
    },
  },
  {
    test: /\.(css|sass|scss)$/,
    include: [
      path.join(__dirname, "src", "css"),
      path.join(__dirname, "src", "sass"),
    ],
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          // importLoaders allows to configure how many loaders before css-loader should be applied to @imported resources.
          // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
          importLoaders: 2,
          //          modules: true,
          sourceMap: true,
        },
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  // rule for shaders
  {
    test: /\.glsl$/,
    use: [
      {
        loader: "webpack-glsl-loader",
      },
    ],
  },
  // rule for textures (images)
  {
    test: /\.(jpe?g|png)$/i,
    include: path.join(__dirname, "src", "textures"),
    loaders: [
      "file-loader",
      {
        loader: "image-webpack-loader",
        query: {
          gifsicle: {
            interlaced: false,
          },
          mozjpeg: {
            progressive: true,
            quality: 65,
          },
          pngquant: {
            quality: "65-90",
            speed: 4,
          },
        },
      },
    ],
  },
];

const optimization = {
  splitChunks: {
    cacheGroups: {
      js: {
        test: /\.js$/,
        name: "commons",
        chunks: "all",
        minChunks: 7,
      },
      css: {
        test: /\.(css|sass|scss)$/,
        name: "commons",
        chunks: "all",
        minChunks: 2,
      },
    },
  },
};

const devServer = {
  host: "0.0.0.0",
  port: 8080,
  compress: true,
  contentBase: path.join(__dirname, "build"),
  inline: true,
  disableHostCheck: true,
  stats: {
    colors: true,
    reasons: true,
    chunks: false,
    modules: false,
  },
};

module.exports = (env, argv) => {
  console.log(`Prepare ${argv.mode.toUpperCase()} build`);
  const isProduction = argv.mode === "production";
  const plugins = [
    new CleanWebpackPlugin(["build"], {
      root: __dirname,
      exclude: ["favicon.ico"],
      verbose: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[chunkhash].css",
      chunkFilename: "[id].bundle.css",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "templates", "index.html"),
      hash: true,
      filename: "index.html",
      chunks: ["commons", "home"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "templates", "about.html"),
      hash: true,
      filename: "about.html",
      chunks: ["commons", "about"],
    }),
  ];
  if (isProduction) {
    // The BundleAnalyzerPlugin must be the FIRST plugin
    const bundleAnalyzerProd = new BundleAnalyzerPlugin({
      analyzerMode: "static",
      generateStatsFile: true,
      reportFilename: "bundleAnalyzerReport.html",
    });
    plugins.splice(0, 0, bundleAnalyzerProd);
    plugins.push(
      new CompressionPlugin({
        algorithm: "gzip",
        test: /\.(js|html)$/,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  } else {
    // The BundleAnalyzerPlugin must be the FIRST plugin
    const bundleAnalyzerDev = new BundleAnalyzerPlugin({
      analyzerMode: "server",
      analyzerPort: 8888,
      openAnalyzer: false,
    });
    plugins.splice(0, 0, bundleAnalyzerDev);
  }
  const config = {
    context: __dirname,
    target: "web",
    entry: {
      home: ["./src/js/index.js", "./src/sass/home.sass"],
      about: ["./src/js/about.js", "./src/css/about.css"],
    },
    output: {
      path: path.join(__dirname, "build"),
      filename: "[chunkhash].js",
      chunkFilename: "[id].bundle.js",
    },
    devtool: isProduction ? "source-map" : "cheap-source-map",
    module: {
      rules,
    },
    optimization,
    plugins,
    devServer,
    performance: {
      hints: "warning",
    },
  };
  return config;
};
