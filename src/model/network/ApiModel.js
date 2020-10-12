/**
 * Api调用model
 */

'use strict';

import { Platform, NativeModules } from "react-native";
import CryptoJS from 'crypto-js';
import { Reader } from 'protobufjs/minimal';
import Config, { APP_INIT_SERVERS, APP_KEY } from "../../configs/Config";
import HResultStatus from "../../hardcode/HResultStatus";
import PromiseResolveQueue from "../../utils/PromiseResolveQueue";
import ResultMap from "../../protobuf/ResultMap";
import XLog from "../../utils/XLog";


const requestByProtobuf = NativeModules.HttpUtil.requestByProtobuf;

let sm_centerSeq = 0;

function _getSignParam(sortKeys, data) {
    let ret = null;
    for (let i = 0, l = sortKeys.length; i < l; ++i) {
        const k = sortKeys[i];

        //空字符串不参与加密
        if (data[k] === '') continue;

        if (ret != null) {
            ret += '&';
        } else {
            ret = '';
        }
        ret += k + '=' + data[k];
    }

    return ret;
}

function _getSignParam2(sortKeys, data) {
    let ret = null;
    for (let i = 0, l = sortKeys.length; i < l; ++i) {
        const k = sortKeys[i];

        if (ret != null) {
            ret += '&';
        } else {
            ret = '';
        }
        ret += k + '=' + encodeURIComponent(data[k]);
    }
    return ret;
}

function _doGetBody(params, mobileInfos) {
    if (!params) {
        params = {};
    }


    params.channelId = mobileInfos.channel;                 // 渠道ID
    params.deviceId = mobileInfos.deviceId;                 // 设备号
    params.deviceType = Platform.OS == 'android' ? 1 : 2;   //'设备类型1:安卓,2:IOS',
    params.mac = mobileInfos.mac;                           // 网卡的mac地址
    params.imei = mobileInfos.imei;                         // imei
    params.model = mobileInfos.model;                       // 手机型号
    params.release = mobileInfos.release;                   // 系统版本号
    params.version = Config.version;                        // app版本号

    const sortKeys = Object.keys(params).sort();
    const signParam = _getSignParam(sortKeys, params);
    const signData = CryptoJS.MD5(signParam + APP_KEY).toString().toUpperCase();

    const signParam2 = _getSignParam2(sortKeys, params);
    return signParam2 + '&sign=' + signData;

    // params.sign = signData;
    // return JSON.stringify(params);

}

async function _doPost(url, params) {
    let mobileInfos = Config.mobileInfos;
    if (!mobileInfos) {
        mobileInfos = await Config.getMobileInfosAsync();
    }
    const body = _doGetBody(params, mobileInfos);

    XLog.debug(`[API] req url:${url}, body:${body}`);

    let ret;
    try {
        ret = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'Accept': 'application/json',
                    // 'Content-Type': 'application/json',
                },
                body,
            }
        );
    } catch (error) {
        XLog.warn(`[API] res url:${url}, body:${body}, error:${error}`);

        throw error;
    }

    if (200 !== ret.status) {
        XLog.warn(`[API] res url:${url}, body:${body}, status:${ret.status}`);
        throw ret.status;
    }

    try {
        const ret2 = await ret.json();
        XLog.info(`[API] res url:${url}, body:${body}, \ndata:${JSON.stringify(ret2, null, 2)}`);
        return ret2;
    } catch (error) {
        XLog.warn(`[API] res url:${url}, body:${body}, error:${error}`);
        throw error;
    }
}

async function _doGet(url) {
    XLog.debug(`[API] req url:${url}`);

    let ret;
    try {
        ret = await fetch(
            url,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        XLog.warn(`[API] res url:${url}, error:${error}`);
        throw error;
    }

    if (200 !== ret.status) {
        XLog.warn(`[API] res url:${url}, status:${ret.status}`);
        throw ret.status;
    }

    try {
        const ret2 = await ret.json();
        XLog.info(`[API] res url:${url}, data:${ret2}`);
        return ret2;
    } catch (error) {
        XLog.warn(`[API] res url:${url}, error:${error}`);
        throw error;
    }
}


let sm_appInitQueue;
async function _doAppInit() {
    let lastRes;
    for (const appInitServerVo of APP_INIT_SERVERS) {
        const url = appInitServerVo.url + '/Api/AppInit.do';

        let params = null;
        if (appInitServerVo.EXT_PARAMS) {
            params = {};
            for (const key in appInitServerVo.EXT_PARAMS) {
                params[key] = appInitServerVo.EXT_PARAMS[key];
            }
        }

        let res;
        try {
            res = await _doPost(url, params);
        } catch (error) {
            continue;
        }

        if (!Config.updateServerConfig(res)) {
            lastRes = res;
            console.warn('[API] AppInit.do reponse data error');
            continue;
        }

        return true;
    }

    //都失败


    if (lastRes) {
        return false;
    }

    return false;
}


const ApiModel = {

    /**
     * appInit接口，返回服务器配置
     * 单例任务执行
     */
    appInit() {
        return new Promise(async (resolve, reject) => {
            //等待
            if (sm_appInitQueue) {
                sm_appInitQueue.add(resolve);
                return;
            }

            //创建等待队列
            sm_appInitQueue = new PromiseResolveQueue(resolve);

            //执行业务
            const bSuc = await _doAppInit();

            //结束
            const queue = sm_appInitQueue;
            sm_appInitQueue = null;
            queue.end(bSuc);
        });

    },

    /**
     * 请求中心服（protobuf）
     * @param {function} encode 命令的序列化函数
     * @param {int} cmdId 命令id
     * @param {object} params 命令的参数
     * @param {int} timeout 超时时间
     */
    async requestCenter(encode, cmdId, params, timeout) {
        let url = Config.centerUrl;
        if (!url) {
            const bSuc = await ApiModel.appInit();
            if (!bSuc) {
                //appInit不成功
                return {
                    state: HResultStatus.ERROR_NOT_CONNECT,
                };
            }
            url = Config.centerUrl;
        }

        const bodyBytes = encode(params).finish();
        const seq = ++sm_centerSeq;

        XLog.debug(`[center] req url:${url}, seq:${seq}, cmdId:${cmdId}, params:${JSON.stringify(params)}`);
        let ret;
        try {
            ret = await requestByProtobuf(url, cmdId, seq, bodyBytes ? Array.from(bodyBytes) : null);
        } catch (error) {
            XLog.warn(`[center] res url:${url}, seq:${seq}, error:${error}`);
            return {
                state: HResultStatus.ERROR_NOT_CONNECT,
            };
        }

        let data;
        if (ret.cmdId > 0 && ret.data) {
            const decode = ResultMap[ret.cmdId];
            if (decode) {
                const r = Reader.create(new Uint8Array(ret.data));
                data = decode(r);
            }
        }
        XLog.info(`[center] res url:${url}, seq:${seq}, state:${ret.state}, cmdId:${ret.cmdId}, \ndata:${JSON.stringify(data, null, 2)}`);

        return {
            state: ret.state,
            data,
        }
    },

    /**
     * 请求api接口（protobuf）
     * @param {String} refUrl 命令的路径
     * @param {object} params post的参数
     * @param {int} timeout 超时时间
     */
    async requestApi(refUrl, params, timeout) {
        let url = Config.getApiUrl(refUrl);
        if (!url) {
            const bSuc = await ApiModel.appInit();
            if (!bSuc) {
                //appInit不成功
                return null;
            }
            url = Config.getApiUrl(refUrl);
        }

        try {
            return await _doPost(url, params);
        } catch (error) {
            return null;
        }
    },

    /**
     * 请求表的版本号
     * @param {string} tableName 表名
     */
    async requestTableVersion(tableName) {
        const path = `/data/getVersion.do?tableNames=${tableName}`;
        let url = Config.getAppUrl(path);
        if (!url) {
            const bSuc = await ApiModel.appInit();
            if (!bSuc) {
                //appInit不成功
                return {
                    state: HResultStatus.ERROR_NOT_CONNECT,
                };
            }
            url = Config.getAppUrl(path);
        }

        try {
            let data = await _doGet(url);

            return {
                state: HResultStatus.Success,
                data
            }
        } catch (error) {
            return {
                state: HResultStatus.ERROR_NOT_CONNECT,
            };
        }
    },

    /**
     * http get 请求url，返回json object
     * @param {string} url 
     */
    async getJSON(url) {
        try {
            return await _doGet(url);
        } catch (error) {
            return null;
        }
    },

};

export default ApiModel;