const { merge } = require('webpack-merge');
const common_configs = require('./webpack.config.js');

module.exports = merge(common_configs, {
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  mode: 'development'
});