const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: 'bpmn-moddle',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  target: 'node',
  mode: 'development',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'node_modules/bpmn-moddle-gen'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'node_modules/bpmn-moddle/package.json',
        toFile: './node_modules/bpmn-moddle-gen/package.json',
      },
    ]),
  ],
}
