const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: "NoSleepApp",
    libraryTarget: "umd",
    globalObject: "this",
  },
  mode: 'production', 
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: ['json-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', 
          'css-loader',  
          'sass-loader',  
        ],
      },
    ],
  }
};
