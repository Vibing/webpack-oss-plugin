"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var inquirer_1 = __importDefault(require("inquirer"));
var ali_oss_1 = __importDefault(require("ali-oss"));
var path_1 = __importDefault(require("path"));
var WebpackOssUploadPlugin = /** @class */ (function () {
    function WebpackOssUploadPlugin(options) {
        this.ossOptions = ['region', 'endpoint', 'accessKeyId', 'accessKeySecret', 'bucket'];
        this.options = options;
    }
    WebpackOssUploadPlugin.prototype.apply = function (compiler) {
        var _this = this;
        this.compiler = compiler;
        compiler.hooks.done.tap('OssUploadPlugin', function (compilation) { return __awaiter(_this, void 0, void 0, function () {
            var error_1, errResult, error_2, error_3, onComplete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.compilation = compilation;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.uploadConfirm('打包已完成，是否上传至OSS？')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.info(chalk_1.default.yellow('😊 Have a nice day'));
                        return [2 /*return*/];
                    case 4:
                        errResult = this.errLogs();
                        if (!errResult)
                            return [2 /*return*/];
                        this.oss = new ali_oss_1.default(this.options.oss);
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.checkUrl()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        console.info(chalk_1.default.yellow('😊 Have a nice day'));
                        return [2 /*return*/];
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.uploadFiles()];
                    case 9:
                        _a.sent();
                        console.info(chalk_1.default.green('上传完成 🚀'));
                        return [3 /*break*/, 11];
                    case 10:
                        error_3 = _a.sent();
                        console.info(chalk_1.default.red('上传完成出错，请检查网络或过会再试 ❌'));
                        return [2 /*return*/];
                    case 11:
                        onComplete = this.options.onComplete;
                        onComplete && onComplete(this.compilation);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * 上传文件
     * @returns {(Promise<UploadFilesTypes | void>)}
     * @memberof WebpackOssUploadPlugin
     */
    WebpackOssUploadPlugin.prototype.uploadFiles = function () {
        var _this = this;
        var _a = this.options.prefix, prefix = _a === void 0 ? '' : _a;
        var outPath = this.compiler.options.output.path;
        var assets = this.compilation.toJson().assets;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var i, filePath, localPath, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < assets.length)) return [3 /*break*/, 4];
                        filePath = "/" + prefix + "/" + assets[i].name;
                        localPath = path_1.default.join(outPath, assets[i].name);
                        return [4 /*yield*/, this.oss.put(filePath.replace(/\\/g, '/').replace(/\/\//g, '/'), localPath)];
                    case 2:
                        res = _a.sent();
                        console.info(chalk_1.default.green("\u4E0A\u4F20\u6210\u529F\uFF1A" + res.url));
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        resolve(true);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        resolve(false);
                        return [2 /*return*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    WebpackOssUploadPlugin.prototype.checkUrl = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var compilerObj, _a, prefix, assets, filePath, i, curAsset, rootFile, list, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        compilerObj = this.compilation.toJson();
                        _a = this.options.prefix, prefix = _a === void 0 ? '' : _a;
                        assets = compilerObj.assets;
                        filePath = assets[0].name;
                        if (!!prefix) return [3 /*break*/, 5];
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < assets.length)) return [3 /*break*/, 4];
                        curAsset = assets[i];
                        return [4 /*yield*/, this.oss.list({
                                prefix: filePath.replace(/\\/g, '/').replace(/\/\//g, '/')
                            })];
                    case 2:
                        rootFile = _b.sent();
                        if (rootFile.objects && rootFile.objects.length) {
                            console.info(chalk_1.default.red("\u6587\u4EF6\u5DF2\u5B58\u5728\uFF01\u6587\u4EF6\u540D\uFF1A" + curAsset.name));
                        }
                        _b.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        reject(false);
                        return [2 /*return*/];
                    case 5: return [4 /*yield*/, this.oss.list({
                            prefix: (prefix + "/").replace(/\\/g, '/').replace(/\/\//g, '/')
                        })];
                    case 6:
                        list = _b.sent();
                        if (!(list.objects && list.objects.length)) return [3 /*break*/, 10];
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.uploadConfirm('prefix路径已存在，仍继续上传？(ps:建议修改 prefix 后再试)')];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        error_4 = _b.sent();
                        reject(false);
                        return [2 /*return*/];
                    case 10:
                        resolve(true);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * 错误检查
     * @returns {boolean}
     * @memberof WebpackOssUploadPlugin
     */
    WebpackOssUploadPlugin.prototype.errLogs = function () {
        var oss = this.options.oss;
        var publicPath = this.compiler.options.output.publicPath;
        if (!publicPath) {
            console.info(chalk_1.default.red('请配置 output.publicPath 再试 😞'));
            return false;
        }
        if (!oss) {
            console.info(chalk_1.default.red('oss配置错误'));
            return false;
        }
        for (var i = 0; i < this.ossOptions.length; i++) {
            var curOption = this.ossOptions[i];
            if (!oss[curOption]) {
                console.info(chalk_1.default.red("oss\u914D\u7F6E\u9879\uFF1A" + curOption + " \u4E0D\u80FD\u4E3A\u7A7A"));
                return false;
            }
        }
        return true;
    };
    /**
     * 上传前confirm
     * @returns {Promise<boolean>}
     * @memberof WebpackOssUploadPlugin
     */
    WebpackOssUploadPlugin.prototype.uploadConfirm = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                inquirer_1.default.prompt([{
                        type: 'confirm',
                        name: 'result',
                        message: msg
                    }]).then(function (answers) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        answers.result ? resolve(true) : reject(false);
                        return [2 /*return*/];
                    });
                }); });
            }, 1000);
        });
    };
    return WebpackOssUploadPlugin;
}());
module.exports = WebpackOssUploadPlugin;
