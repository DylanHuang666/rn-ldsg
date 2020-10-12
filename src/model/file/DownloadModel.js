/**
 * 下载文件逻辑
 */

'use strict';

'use strict'

import CryptoJS from 'crypto-js';
import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import { HTTP_UTIL_DOWNLOAD_FILE_PROGRESS } from "../../hardcode/HNativeEvent";
import PromiseResolveQueue from "../../utils/PromiseResolveQueue";

const emmiter = new NativeEventEmitter(NativeModules.HttpUtil);

let sm_soundSaveFolder;
function _getSoundSaveFolder() {
    if (!sm_soundSaveFolder) {
        sm_soundSaveFolder = require("../../utils/StringUtil").joinPath(NativeModules.HttpUtil.RNFSDocumentDirectoryPath, 'music');
    }
    return sm_soundSaveFolder;
}


/**
 * 音乐文件下载对象
 */
export class SoundDownloader {

    /**
     * 构造函数
     * @param {string} url          下载的url
     * @param {Function} fnProgress 下载进度回调
     * @param {Function} fnComplete 下载完成后回调
     */
    constructor(url, fnProgress, fnComplete) {
        this._url = url;
        this._fnProgress = fnProgress;
        this._fnComplete = fnComplete;

        this._saveFolder = null;
        this._bDownloading = false;

        this._saveFile = null;
    }

    _onProgress = ({ url, saveFolder, downloadBytes, fileSize }) => {
        if (this._url != url || this._saveFolder != saveFolder) {
            return;
        }

        this._fnProgress && this._fnProgress(downloadBytes, fileSize);
    }

    /**
     * 下载
     */
    download() {
        if (this._bDownloading) return;
        if (this._saveFile) return;

        this._saveFolder = _getSoundSaveFolder();

        emmiter.addListener(HTTP_UTIL_DOWNLOAD_FILE_PROGRESS, this._onProgress);

        NativeModules.HttpUtil.downloadFile(this._url, this._saveFolder)
            .then(ret => {
                emmiter.removeListener(HTTP_UTIL_DOWNLOAD_FILE_PROGRESS, this._onProgress);

                this._bDownloading = false;

                if (1 == ret.state) {
                    this._saveFile = ret.file;
                }

                this._fnComplete && this._fnComplete(1 == ret.state);
            })
    }
}

/**
 * 获得指定音乐url路径 已经下载完成的 存放路径
 * @param {String[]} urls 
 * 
 */
export const getSoundFilesDownloadedPath = async (urls) => {
    const saveFolder = _getSoundSaveFolder();

    return await NativeModules.HttpUtil.getFilesDownloadedPath(urls, saveFolder);
}

/**
 * 删除音乐文件
 * @param {String} url 
 */
export const deleteDownloadFile = (url) => {
    const saveFolder = _getSoundSaveFolder();

    return NativeModules.HttpUtil.deleteDownloadFile(url, saveFolder);
}


//----------------- cos文件下载逻辑 --------------------------------------------------------------
let sm_fileSaveFolder;
export function _getFileSaveFolder(path) {
    if (Platform.OS == 'android') {
        sm_fileSaveFolder = require("../../utils/StringUtil").joinPath(NativeModules.HttpUtil.RNFSPicturesDirectoryPath, path);
    } else {
        sm_fileSaveFolder = require("../../utils/StringUtil").joinPath(NativeModules.HttpUtil.RNFSDocumentDirectoryPath, path);
    }
    return sm_fileSaveFolder;
}

/**
 * 获得指定url路径 已经下载完成的 存放路径
 * @param {String[]} urls 
 * 
 */
export const getFilesDownloadedPath = async (urls) => {
    return await NativeModules.HttpUtil.getFilesDownloadedPath(urls, sm_fileSaveFolder);
}


//下载完成
function _downLoadComplete(bool) {
    if (bool) {
        ToastUtil.showCenter("下载成功")
    } else {
        ToastUtil.showCenter("下载失败")
    }
}
/**
 * COS文件下载对象
 */
export class FileDownloader {

    /**
     * 构造函数
     * @param {string} url          下载的url
     * @param {Function} fnProgress 下载进度回调
     * @param {Function} fnComplete 下载完成后回调
     */
    constructor(url, fnProgress, fnComplete) {
        this._url = url;
        this._fnProgress = fnProgress;
        this._fnComplete = fnComplete ? fnComplete : _downLoadComplete;

        this._saveFolder = null;
        this._bDownloading = false;

        this._saveFile = null;
    }

    _onProgress = ({ url, saveFolder, downloadBytes, fileSize }) => {
        if (this._url != url || this._saveFolder != saveFolder) {
            return;
        }

        this._fnProgress && this._fnProgress(downloadBytes, fileSize);
    }

    /**
     * 下载
     */
    download(path) {
        if (this._bDownloading) return;
        if (this._saveFile) return;

        this._saveFolder = _getFileSaveFolder(path);

        emmiter.addListener(HTTP_UTIL_DOWNLOAD_FILE_PROGRESS, this._onProgress);

        NativeModules.HttpUtil.downloadFile(this._url, this._saveFolder)
            .then(ret => {
                emmiter.removeListener(HTTP_UTIL_DOWNLOAD_FILE_PROGRESS, this._onProgress);

                this._bDownloading = false;

                if (1 == ret.state) {
                    this._saveFile = ret.file;
                }

                this._fnComplete && this._fnComplete(1 == ret.state);
            })
    }
}




export class FileDownloaderWithPath {

    /**
     * 构造函数
     * @param {string} url          下载的url
     * @param {Function} fnProgress 下载进度回调
     * @param {Function} fnComplete 下载完成后回调
     */
    constructor(url, fnProgress, fnComplete) {
        this._url = url;
        this._fnProgress = fnProgress;
        this._fnComplete = fnComplete ? fnComplete : _downLoadComplete;

        this._saveFolder = null;
        this._bDownloading = false;

        this._savePath = null

        this._saveFile = null;
    }

    _onProgress = ({ url, saveFolder, downloadBytes, fileSize }) => {
        if (this._url != url || this._saveFolder != saveFolder) {
            return;
        }

        this._fnProgress && this._fnProgress(downloadBytes, fileSize);
    }

    /**
     * 下载到指定的文件路径且命名
     */
    download(path) {
        if (this._bDownloading) return;
        if (this._saveFile) return;

        // this._saveFolder = _getFileSaveFolder(path);

        this._savePath = _getFileSaveFolder(path)

        emmiter.addListener(HTTP_UTIL_DOWNLOAD_FILE_PROGRESS, this._onProgress);

        NativeModules.HttpUtil.downloadFileWithPath(this._url, this._savePath)
            .then(ret => {
                emmiter.removeListener(HTTP_UTIL_DOWNLOAD_FILE_PROGRESS, this._onProgress);
                this._bDownloading = false;
                if (1 == ret.state) {
                    this._saveFile = ret.file;
                }

                this._fnComplete && this._fnComplete(ret);
            })
    }
}

//----------------- mp4更新逻辑 --------------------------------------------------------------

export function downloadMp4File(url) {
    const saveFile = CryptoJS.MD5(url).toString() + '.mp4';
    const savePath = require("../../utils/StringUtil").joinPath(NativeModules.HttpUtil.RNFSCachesDirectoryPath, 'mp4/' + saveFile);

    return NativeModules.HttpUtil.downloadFileWithPath(url, savePath);
}


//----------------- jsbundle更新逻辑 --------------------------------------------------------------

async function _doLoopDownloadJsbundle(nowVersion, nextVersion) {
    //zip下载
    const url = `http://xvoice-outtest-1301112906.file.myqcloud.com/app/rn/__jsbundles__/${Platform.OS}/${NativeModules.PackageInfo.versionName}.${NativeModules.PackageInfo.versionCode}.${nextVersion}`;
    // const url = `http://xvoice-outtest-1301112906.file.myqcloud.com/app/rn/__jsbundles_test__/${Platform.OS}/${NativeModules.PackageInfo.versionName}.${NativeModules.PackageInfo.versionCode}.${nextVersion}`;
    const zipFolder = require("../../utils/StringUtil").joinPath(NativeModules.HttpUtil.RNFSDocumentDirectoryPath, 'jsbundle_zips');
    const ret = await NativeModules.HttpUtil.downloadFile(url, zipFolder);
    if (1 != ret.state) {
        //清除旧版本的
        await NativeModules.HttpUtil.clearOldBundles(nowVersion);
        return nextVersion;
    }

    //解压
    await NativeModules.HttpUtil.unzipBundle(ret.file);

    //尝试下载下一个版本的
    return await _doLoopDownloadJsbundle(nowVersion, nextVersion + 1);
}

let sm_checkJsbundleQueue;

/**
 * 检查更新jsbundle
 */
export const checkNewJsbundle = () => {
    if (__DEV__) return Promise.resolve(1);

    if (!NativeModules.HttpUtil.clearOldBundles) return Promise.resolve(1);

    return new Promise(async (resolve, reject) => {
        if (sm_checkJsbundleQueue) {
            sm_checkJsbundleQueue.add(resolve);
            return;
        }

        sm_checkJsbundleQueue = new PromiseResolveQueue(resolve);

        const nowVersion = require('../../configs/Version').default;

        const nextVersion = await _doLoopDownloadJsbundle(nowVersion, nowVersion);

        if (nextVersion != nowVersion) {
            //reload处理
        }

        const queue = sm_checkJsbundleQueue;
        sm_checkJsbundleQueue = null;
        queue.end(1);
    });
}