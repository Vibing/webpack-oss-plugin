const webpack = require('webpack');
const path = require('path');
const WebpackOssPlugin = require('../lib')

module.exports = {
  entry: path.resolve(__dirname, './src/index'),
  mode: 'production',
  output: {
    filename: 'bundle-[name]-[hash].js',
    chunkFilename: 'chunk-[name]-[hash].js',
    // 配置oss的publicPath
    publicPath: `http://bucket.oss-cn-shanghai.aliyuncs.com`
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(ts|js)/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },
  plugins: [
    // 注意：你需要配置 output 中的 publicPath
    new WebpackOssPlugin({
      // oss 的配置
      oss: {
        region: 'region',
        endpoint: 'endpoint',
        accessKeyId: 'accessKeyId',
        accessKeySecret: 'accessKeySecret',
        bucket: 'bucket'
      },
      // 上传后的文件路径为：publicPath/{prefix}/your-file.js
      prefix: `dir1/dir2-dir3/`,
      // 上传完成后会调用该回调
      onComplete: (complation) => {
        console.log('done')
      }
    })
  ]
}