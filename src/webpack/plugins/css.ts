const ExtractTextPlugin = require('extract-text-webpack-plugin')

export default (config: any) =>
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    ...config
  })
