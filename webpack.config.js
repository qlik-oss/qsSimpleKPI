var webpack = require('webpack');
var path = require('path');
var settings = require('./settings');

var name = require('./package.json').name;
var outputFilename = name + '.js';
var devServerPort = settings.port || 8080;

// default configuration
var config = {
  entry: {
    js: [
      "./src/component.js" // input file
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  },
  output: {
    path: path.resolve(__dirname, settings.buildDestination),
    filename: outputFilename // output file
  },
  externals: {
    jquery: {
      amd: 'jquery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      root: '_'
    },
  },
  plugins: [],
  module: {
    noParse: ["react"],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /semantic/],
        loaders: ['babel']
      },
    ]
  }
};

if(process.env.NODE_ENV !== 'production') {
  console.log('DEVELOPMENT configuration');
  config.devtool = 'source-map';
  config.debug = true;
  config.output.path = path.resolve(settings.buildDestination);
  config.entry.js.unshift("webpack-dev-server/client?http://localhost:" + devServerPort);
  config.plugins.push(new webpack.NoErrorsPlugin());
} else {
  console.log('PRODUCTION configuration');
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify('production') }
  }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    // Compression specific options
    compress: {
      warnings: false,
      // Drop `console` statements
      drop_console: true
    },
    comments: false,
    output: {
      comments: false,
    },
    mangle: true,
    sourcemap: false,
    beautify: false,
    dead_code: true
  }));
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

module.exports = config;
