const path = require('path');

module.exports = {
   entry: './js/script.js',
	mode: "development",
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
   },
   devtool: "source-map",
   module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
}    