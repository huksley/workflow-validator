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
        test: /\.jXXXs(x?)$/,
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
        transform: content => {
          let s = String(content)
          s = s.replace('"bpmn-moddle"', '"bpmn-moddle-gen"')
          return s
        },
      },
      {
        from: 'src/bpmn-moddle-gen.d.ts',
        toFile: './node_modules/bpmn-moddle-gen/index.d.ts',
        transformPath: (dst, abs) => 'index.d.ts',
      },
    ]),
  ],
}
