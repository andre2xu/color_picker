const { merge } = require('webpack-merge');
const common_configs = require('./webpack.config.ts');

module.exports = merge(common_configs, {
    entry: './src/demo.ts',
    mode: 'production'
});

export {};