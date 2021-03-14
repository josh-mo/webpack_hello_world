const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    ticket_sidebar: [
      'babel-polyfill',
      path.resolve('src/javascripts/ticket_sidebar/index.js'),
    ],
    top_bar: [
      'babel-polyfill',
      path.resolve('src/javascripts/top_bar/index.js'),
    ],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets'),
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      lib: path.resolve(__dirname, 'src/javascripts/lib'),
    },
  },

  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "src/html/ticket_sidebar.html"),
    //   filename: 'ticket_sidebar.html'
    // }),

    // Empties the dist folder
    new CleanWebpackPlugin(),

    // Copy over static assets
    new CopyWebpackPlugin({
      patterns: [
        {from: 'src/manifest.json', to: '../[name][ext]'},
        {from: 'src/html/*', to: './[name][ext]'},
        {from: 'src/images/*', to: './[name][ext]'},
        {from: 'requirements.json', to: '../[name][ext]'},
      ],
    }),
  ],
}
