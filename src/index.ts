
import chalk from 'chalk'
import inquirer from 'inquirer'
import OSS from 'ali-oss'
import path from 'path'

export interface IOtions {
  oss: { region: string; endpoint: string; accessKeyId: string; accessKeySecret: string; bucket: string };
  prefix?: string;
  onComplete?: (compilation: any) => {}
}

class WebpackOssUploadPlugin {
  compiler: any;
  compilation: any;
  oss: OSS | any;
  options: IOtions;
  ossOptions: string[] = ['region', 'endpoint', 'accessKeyId', 'accessKeySecret', 'bucket'];

  constructor(options: IOtions) {
    this.options = options
  }

  apply(compiler: any) {
    this.compiler = compiler;

    compiler.hooks.done.tap('OssUploadPlugin', async (compilation: any) => {
      this.compilation = compilation;


      try {
        await this.uploadConfirm('打包已完成，是否上传至OSS？');
      } catch (error) {
        console.info(chalk.yellow('😊 Have a nice day'));
        return;
      }

      const errResult = this.errLogs();
      if (!errResult) return;


      this.oss = new OSS(this.options.oss);

      try {
        await this.checkUrl();
      } catch (error) {
        console.info(chalk.yellow('😊 Have a nice day'));
        return;
      }

      try {
        await this.uploadFiles();
        console.info(chalk.green('上传完成 🚀'));
      } catch (error) {
        console.info(chalk.red('上传完成出错，请检查网络或过会再试 ❌'));
        return;
      }

      const { onComplete } = this.options;
      onComplete && onComplete(this.compilation)
    })
  }


  /**
   * 上传文件
   * @returns {(Promise<UploadFilesTypes | void>)}
   * @memberof WebpackOssUploadPlugin
   */
  uploadFiles(): Promise<boolean> {
    const { prefix = '' } = this.options;
    const { path: outPath } = this.compiler.options.output;
    const { assets } = this.compilation.toJson();
    return new Promise(async (resolve, reject) => {
      try {

        for (let i = 0; i < assets.length; i++) {
          const filePath = `/${prefix}/${assets[i].name}`
          const localPath = path.join(outPath, assets[i].name);
          const res = await this.oss.put(filePath.replace(/\\/g, '/').replace(/\/\//g, '/'), localPath)
          console.info(chalk.green(`上传成功：${res.url}`));
        }
        resolve(true)
      } catch (err) {
        resolve(false)
        return;
      }
    })

  }

  checkUrl(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const compilerObj = this.compilation.toJson();
      const { prefix = '' } = this.options;
      const { assets } = compilerObj;
      const filePath = assets[0].name;

      // 若文件上传至根目录 判断每个文件是否存在
      if (!prefix) {
        for (let i = 0; i < assets.length; i++) {
          const curAsset = assets[i];
          const rootFile = await this.oss.list({
            prefix: filePath.replace(/\\/g, '/').replace(/\/\//g, '/')
          });
          if (rootFile.objects && rootFile.objects.length) {
            console.info(chalk.red(`文件已存在！文件名：${curAsset.name}`));
          }
        }
        reject(false)
        return;
      }

      const list = await this.oss.list({
        prefix: `${prefix}/`.replace(/\\/g, '/').replace(/\/\//g, '/')
      })

      if (list.objects && list.objects.length) {
        try {
          await this.uploadConfirm('prefix路径已存在，仍继续上传？(ps:建议修改 prefix 后再试)');
        } catch (error) {
          reject(false)
          return;
        }
      }

      resolve(true);

    })
  }


  /**
   * 错误检查
   * @returns {boolean}
   * @memberof WebpackOssUploadPlugin
   */
  errLogs(): boolean {
    const { oss } = this.options;
    const { publicPath } = this.compiler.options.output;

    if (!publicPath) {
      console.info(
        chalk.red('请配置 output.publicPath 再试 😞')
      );
      return false;
    }

    if (!oss) {
      console.info(
        chalk.red('oss配置错误')
      );
      return false;
    }

    for (let i = 0; i < this.ossOptions.length; i++) {
      const curOption = this.ossOptions[i];
      if (!oss[curOption]) {
        console.info(
          chalk.red(`oss配置项：${curOption} 不能为空`)
        );
        return false;
      }
    }

    return true;
  }


  /**
   * 上传前confirm
   * @returns {Promise<boolean>}
   * @memberof WebpackOssUploadPlugin
   */
  uploadConfirm(msg: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        inquirer.prompt([{
          type: 'confirm',
          name: 'result',
          message: msg
        }]).then(async (answers) => {
          answers.result ? resolve(true) : reject(false)
        })
      }, 1000)
    })
  }


}

module.exports = WebpackOssUploadPlugin