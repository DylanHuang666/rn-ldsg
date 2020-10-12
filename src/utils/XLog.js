/**
 * 日志
 */
'use strict';

import { NativeModules } from "react-native";


let XLog;
if (NativeModules.XLog) {

    XLog = {
        debug: NativeModules.XLog.debug,
        info: NativeModules.XLog.info,
        warn: NativeModules.XLog.warn,
        error: NativeModules.XLog.error,
    };

} else {
    XLog = {
        debug: console.debug,
        info: console.log,
        warn: console.log,
        error: console.warn,
    };
}




export default XLog;