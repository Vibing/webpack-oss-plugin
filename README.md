#### 该 Webpack 插件用于在本地打包完成后，将打包后的文件上传至 阿里云OSS，并提供上传完成的回调
---

### 使用
安装 webpack-oss-upload-plugin
```shell
npm install webpack-oss-upload-plugin -D
```

在 webpack config 中使用
```js
const prefix = `${dir}/${projectName}/${version}/`;

{
  output:{
    publicPath: `http://e-package.oss-cn-shanghai.aliyuncs.com/${prefix}`
  },
  plugins: [
    new WebpackOssUploadPlugin({
      // oss 的配置
      oss: {
        region: 'region',
        endpoint: 'endpoint',
        accessKeyId: 'accessKeyId',
        accessKeySecret: 'accessKeySecret',
        bucket: 'bucket'
      },
      // 上传后的文件路径为：publicPath/{prefix}/your-file.js
      prefix,
      // 上传完成后会调用该回调
      onComplete: (complication) => {
        
      }
    })
  ]
}

```
在 `onComplete` 的参数暴露了 `complication` 对象，里面包含当前打包的信息，你可以合理使用它

选项说明
- oss: 阿里 oss 配置，region、endpoint、accessKeyId、accessKeySecret、bucket 这些参数是必须的
- dir：可选项，默认为空数组，数组中的每一项表示上传至 oss 形成的目录名。比如 `prefix: a/c/c/`，那么上传后你的文件位置是：`publicPath/a/b/c/your-file.js`
- onComplete: 可选项，当 OSS 将所有需要上传的文件上传完成后，会被调用,该方法参数为 `complication` 对象，里面包含当前打包的信息，你可以合理使用它


## 其他
如果你有其他需求或好的建议，请在 issue 中提给我