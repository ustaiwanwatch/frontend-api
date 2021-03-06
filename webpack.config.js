var glob = require('glob')
var path = require('path')
var nodeExternals = require('webpack-node-externals')
var _ = require('lodash')
var webpack = require('webpack')

// Required for Create React App Babel transform
process.env.NODE_ENV = 'development'

module.exports = {
  mode: 'development',
  // Use all js files in project root (except
  // the webpack config) as an entry
  entry: _.merge(globEntries('functions/**/*.js'), globEntries('functions/**/*.ts')),
  target: 'node',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx']
  },

  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],
  plugins: [
    new webpack.LoaderOptionsPlugin({ options: {} })
  ],
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: __dirname,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        enforce: 'pre',
        include: __dirname,
        exclude: /node_modules/,
        options: {
          configFile: 'tslint.json'
        }
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  // We are going to create multiple APIs in this guide, and we are
  // going to create a js file to for each, we need this output block
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
}

function globEntries(globPath) {
  var files = glob.sync(globPath)

  var entries = {}

  for (var i = 0; i < files.length; i++) {
    var entry = files[i]
    entries[entry.replace(/\.[^/.]+$/, '')] = './' + entry
  }

  return entries
}
