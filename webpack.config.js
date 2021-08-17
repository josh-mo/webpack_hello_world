const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    ticket_sidebar: './src/javascripts/ticket_sidebar/index.js',
    top_bar: './src/javascripts/top_bar/index.js',
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'ticket_sidebar.html',
      template: 'src/templates/ticket_sidebar.html',
      chunks: ['ticket_sidebar'],
    }),

    new HtmlWebpackPlugin({
      filename: 'top_bar.html',
      template: 'src/templates/top_bar.html',
      chunks: ['top_bar'],
    }),

    // Empties the dist folder
    new CleanWebpackPlugin(),

    // Copy over static assets
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '../[name][ext]' },
        { from: 'src/images/*', to: './[name][ext]' },
        { from: 'requirements.json', to: '../[name][ext]' },
      ],
    }),
  ],
};
