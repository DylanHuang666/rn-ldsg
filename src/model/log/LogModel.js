/**
 * 日志逻辑
 */

'use strict';

import { NativeModules } from "react-native";


let sm_bRunning = false;

/**
 * 上传日志
 */
export const upload = async () => {

    if (!NativeModules.XLog) return;

    if (sm_bRunning) return;

    sm_bRunning = true;

    do {

        //清除4天前日志
        await NativeModules.XLog.clearOldLogs();

        //压缩日志
        const zipFilePath = await NativeModules.XLog.zipLogFiles();
        if (!zipFilePath) {
            require('../../view/base/ToastUtil').default.showCenter('压缩日志失败');
            break;
        }

        //删除不包含当前使用的日志
        await NativeModules.XLog.clearAllLogs();

        //上传日志
        try {
            await require('../UploadModel').default.uploadXLog(zipFilePath);
        } catch (error) {
            require('../../view/base/ToastUtil').default.showCenter('上传失败');
            break;
        }

        require('../../view/base/ToastUtil').default.showCenter('上传成功');
    } while(false);


    sm_bRunning = false;
}