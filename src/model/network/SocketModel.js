/**
 * websocket链接处理
 * 1、连接，附带appInit处理,内部会执行多次重试
 * 2、断开
 * 3、请求命令，附带处理连接处理；由于有这个功能，就不做断线重连处理，抛出断开事件，让业务处理
 * 4、遇到需要登录的接口，内部尝试登录
 * 5、心跳处理
 * 6、需要重登陆事件抛出            ????
 * 7、广播事件抛出                  ????
 */

'use strict';

import AsyncStorage from '@react-native-community/async-storage';
import { Reader } from 'protobufjs/minimal';
import Config from '../../configs/Config';
import { KEY_LOGIN_REQ_PARAMS, KEY_LOGON_REQ_PARAMS } from '../../hardcode/HLocalStorageKey';
import HResultStatus from '../../hardcode/HResultStatus';
import { getEventName } from '../../hardcode/HSocketBroadcastEvent';
import ResultMap from '../../protobuf/ResultMap';
import ModelEvent from '../../utils/ModelEvent';
import XLog from '../../utils/XLog';
import broadcast from '../broadcast';
import ApiModel from './ApiModel';


//-------------------------------- _LoginModel ----------------------------------------------------------------------------

const _LoginModel = function () {
    let sm_reqs;
    let sm_bReaded = false;
    let sm_loginReqParmas;
    let sm_logonReqParams;

    async function _doLoad() {
        try {
            sm_loginReqParmas = await AsyncStorage.getItem(KEY_LOGIN_REQ_PARAMS);
            if (sm_loginReqParmas) {
                sm_loginReqParmas = JSON.parse(sm_loginReqParmas);
            }
        } catch (error) {

        }

        try {
            sm_logonReqParams = await AsyncStorage.getItem(KEY_LOGON_REQ_PARAMS);
            if (sm_logonReqParams) {
                sm_logonReqParams = JSON.parse(sm_logonReqParams);
            }
        } catch (error) {

        }

        sm_bReaded = true;

        const a = sm_reqs;
        sm_reqs = null;
        for (let resolve of a) {
            resolve();
        }
    }

    return {
        loadLocalLoginParams() {
            return new Promise((resolve, reject) => {
                if (sm_bReaded) {
                    resolve();
                    return;
                }

                if (sm_reqs) {
                    sm_reqs.push(resolve);
                    return;
                }

                sm_reqs = [resolve];
                _doLoad();
            });

        },

        async getLogonResult() {
            try {
                const s = await AsyncStorage.getItem(KEY_LOGON_REQ_PARAMS);
                if (s) {
                    return JSON.parse(s);
                }
            } catch (error) {

            }
            return null;
        },

        async saveLoginParams(params) {
            try {
                await AsyncStorage.setItem(KEY_LOGIN_REQ_PARAMS, JSON.stringify(params));
                sm_loginReqParmas = params;
                return true;
            } catch (error) {

            }
            return false;
        },

        async saveLogonParams(params) {
            try {
                await AsyncStorage.setItem(KEY_LOGON_REQ_PARAMS, JSON.stringify(params));
                sm_logonReqParams = params;
                return true;
            } catch (error) {

            }
            return false;
        },

        async saveLogonResult(data) {
            try {
                await AsyncStorage.setItem('@logonResult', JSON.stringify(data));
                return true;
            } catch (error) {

            }
            return false;
        },

        async clearLocalLoginParams() {
            sm_loginReqParmas = null;
            sm_logonReqParams = null;
            try {
                await AsyncStorage.removeItem(KEY_LOGIN_REQ_PARAMS);
            } catch (error) {

            }

            try {
                await AsyncStorage.removeItem(KEY_LOGON_REQ_PARAMS);
            } catch (error) {

            }
        },

        get logonReqParmas() {
            return sm_logonReqParams;
        },

        get loginReqParams() {
            return sm_loginReqParmas;
        },
    };
}();


//-------------------------------- SocketModel ----------------------------------------------------------------------------

//--- 命令调用,这个是为了解耦，降低反向依赖
let sm_fnLogin;     //登录命令
let sm_fnLogon;     //logon命令
let sm_fnHeartBeat; //心跳命令
let sm_fnLoginCmdEncoder;//UserCmd.login.encode
let sm_fnLogonCmdEncoder;//UserCmd.logon.encode

//--  内部逻辑需要通知给业务的回调，这个是为了解耦，降低反向依赖
let sm_fnOnDisconnet;   //连接成功后，断开了
let sm_fnToLogin;       //需要返回登录界面
let sm_fnLogonSuccess;   //登录成功后回调

/**
 * {
 *  waitConnectCallbacks    //resolve[], 等待连接完成的回调等待数组
 *  ws              //WebSocket，连接成功的标志
 *  tickToken       //已经登录的凭据，表示已经登录了
 *  isCallLogin     //boolean, 是否调用了UserCmd.login
 *  isCallLogon     //boolean, 是否调用了UserCmd.logon
 *  sendSeq         //发送序列，从1开始
 *  reqs            //seq ->  发送的map，用于回调
 *  heartbeatTimer  //timer句柄
 *  contactTick     //通讯的时间戳
 * }
 */
let sm_nowWebSocket = null;

//{cmdId, params, resolve, tick}[]，由于需要等待连接成功或者登录成功，需要进入请求队列
let sm_reqs = null;


function _doDestroyWebSocket(ws) {
    if (!ws) return;

    ws.onopen = null;
    ws.onerror = null;
    ws.onclose = null;
    ws.onmessage = null;

    try {
        //这里必须是[1000, 5000)，okhttp限制在这个范围
        ws.close(1000);
    } catch (error) {
    }
}

function _connectWebSocket() {
    return new Promise(async (resolve, reject) => {

        let url = Config.webSocketUrl;
        if (!url) {
            let bSuc = false;
            try {
                bSuc = await ApiModel.appInit();
            } catch (error) {
                console.warn(error);
            }
            if (!bSuc) {
                resolve(null);
                return;
            }

            url = Config.webSocketUrl;
        }
        XLog.debug(`[websocket] connect url:${url}`);

        let ws = new WebSocket(url);
        ws.url = url;

        //5s连接超时，这里只处理连接逻辑
        setTimeout(() => {
            if (!resolve) return;
            XLog.error(`[websocket] connect timeout 5s ws:${!!ws}, url:${url}`);

            const l_ws = ws;
            if (ws) {
                ws = null;
                _doDestroyWebSocket(l_ws);
            }

            resolve(null);
            resolve = null;
        }, 5000);

        ws.onopen = () => {
            XLog.info(`[websocket] onopen ws:${!!ws}, url:${url}`);
            if (!resolve) return;

            //注意!!!!!
            //onopen后不能设置 ws为null，因为要处理 onerror、onclose问题!!!!

            //设置一个标记，代表这个socket是连接成功的
            ws._hasConnected = true;

            resolve(ws);
            resolve = null;
        };

        ws.onerror = (e) => {
            XLog.error(`[websocket] onerror ws:${!!ws}, url:${url}, e:${e.message}`);

            //这里有可能 连接中， 连接失败回调，
            //也可能是已经连接了，断开回调

            const l_ws = ws;
            if (ws) {
                ws = null;
                _doDestroyWebSocket(l_ws);
            }

            if (resolve) {
                resolve(null);
                resolve = null;
            }

            //处理连接成功之后的断开
            if (sm_nowWebSocket && l_ws == sm_nowWebSocket.ws) {
                _doDestroyNowWebSocket();
            }

        };

        ws.onclose = (e) => {
            XLog.warn(`[websocket] onclose ws:${!!ws}, url:${url}, e:${e.message}`);

            //这里有可能 连接中， 连接失败回调，
            //也可能是已经连接了，断开回调

            const l_ws = ws;
            if (ws) {
                ws = null;
                _doDestroyWebSocket(l_ws);
            }

            if (resolve) {
                resolve(null);
                resolve = null;
            }

            //处理连接成功之后的断开
            if (sm_nowWebSocket && l_ws == sm_nowWebSocket.ws) {
                _doDestroyNowWebSocket();
            }
        };

        ws.onmessage = _onMessage;
    });
}

async function _tryConnectWebSocketTimes() {
    //尝试三次连接
    for (let i = 0; i < 3; ++i) {
        let ws = await _connectWebSocket();

        if (ws) {
            return ws;
        }
    }

    //多次连接失败后，清除websocket的配置，让下次连接的时候，再调用appInit
    Config.clearWebSocket();

    return null;
}

function _doDestroyNowWebSocket() {
    let bConnected = false;
    let bCanNotice = false;

    if (sm_nowWebSocket) {
        let nowWebSocket = sm_nowWebSocket;
        sm_nowWebSocket = null;

        if (nowWebSocket.heartbeatTimer) {
            clearInterval(nowWebSocket.heartbeatTimer);
            nowWebSocket.heartbeatTimer = null;
        }

        if (nowWebSocket.ws) {
            bConnected = nowWebSocket.ws._hasConnected ? true : false;
            bCanNotice = bConnected;

            _doDestroyWebSocket(nowWebSocket.ws);
            nowWebSocket.ws = null;
        }

        if (nowWebSocket.waitConnectCallbacks) {
            const a = nowWebSocket.waitConnectCallbacks;
            nowWebSocket.waitConnectCallbacks = null;

            for (let resolve of a) {
                resolve(bConnected);
            }
        }

        if (nowWebSocket.reqs) {
            const reqs = nowWebSocket.reqs;
            nowWebSocket.reqs = null;
            for (let vo of reqs) {
                vo.resolve({
                    state: HResultStatus.ERROR_DISCONNECT,
                });
            }
        }
    }

    _doCallReqsFail(HResultStatus.ERROR_NOT_CONNECT);

    //通知外部业务断开
    if (bCanNotice) {
        if (!sm_fnOnDisconnet) {
            alert('没有断开连接回调逻辑');
        } else {
            sm_fnOnDisconnet();
        }
    }
}

function _addReq(encode, cmdId, params, isNeedLogin, timeout, cmdName, resolve) {
    const vo = {
        encode,
        cmdId,
        params,
        isNeedLogin,
        timeout,
        resolve,
        cmdName,
        tick: Date.now(),
    };

    if (sm_reqs) {
        sm_reqs.push(vo);
    } else {
        sm_reqs = [vo];
    }

    XLog.info(`[websocket] send add req index:${sm_reqs.length - 1}, tick:${vo.tick}, cmdId:${cmdId}, cmdName:${cmdName}, params:${JSON.stringify(params)}`);
}

function _addReqAfterConnected(vo) {
    if (sm_reqs) {
        sm_reqs.push(vo);
    } else {
        sm_reqs = [vo];
    }

    // XLog.info(`[websocket] send add req index:${sm_reqs.length - 1}, tick:${vo.tick}, cmdId:${vo.cmdId}, cmdName:${vo.cmdName}, params:${JSON.stringify(vo.params)}`);
}

function _doCallReqsFail(state) {
    if (!sm_reqs) return;

    const a = sm_reqs;
    sm_reqs = null;

    for (let i = 0; i < a.length; ++i) {
        const vo = a[i];

        XLog.error(`[websocket] send fail index:${i}, tick:${vo.tick}, state:${state}`);

        vo.resolve({
            state
        })
    }
}

function _doCallReqsRequest() {
    if (!sm_reqs) return;
    const a = sm_reqs;
    sm_reqs = null;
    for (const vo of a) {
        _doRequest(vo.encode, vo.cmdId, vo.params, vo.timeout, vo.cmdName, vo.resolve);
    }
}

function _doCallReqsRequestAfterConnected() {
    if (!sm_reqs) return;
    const a = sm_reqs;
    sm_reqs = null;
    for (const vo of a) {
        //不需要登录的接口
        if (!vo.isNeedLogin) {
            //请求
            _doRequest(vo.encode, vo.cmdId, vo.params, vo.timeout, vo.cmdName, vo.resolve);
            continue;
        }

        //登录中
        if (sm_nowWebSocket.isCallLogin || sm_nowWebSocket.isCallLogon) {
            _addReqAfterConnected(vo);
            continue;
        }

        //尝试登录
        _addReqAfterConnected(vo);
        _tryRequestLogin(sm_nowWebSocket);
    }

}

async function _doCheckHeartbeat(nowWebSocket) {

    //需要判定异步处理，是否当前websocket处理
    if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
        return;
    }

    for (let i = 0; i < 3; ++i) {
        let res = await sm_fnHeartBeat({});

        //需要判定异步处理，是否当前websocket处理
        if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
            return;
        }


        //成功就可以了
        if (HResultStatus.Success == res.state) {
            return;
        }
    }

    //尝试多次都失败就要断开了
    _doDestroyNowWebSocket();

}

function _doStartHeartbeat() {
    if (sm_nowWebSocket.heartbeatTimer) return;

    sm_nowWebSocket.heartbeatTimer = setInterval(() => {
        const now = Date.now();

        // 检查请求超时
        let i = 0;
        while (i < sm_nowWebSocket.reqs.length) {
            const vo = sm_nowWebSocket.reqs[i];
            if (now - vo.sendTick > vo.timeout) {
                //超时
                sm_nowWebSocket.reqs.splice(i, 1);
                XLog.error(`[websocket] timeout url:${sm_nowWebSocket.ws.url}, seq:${vo.seq}, cmdId:${vo.cmdId}`);

                vo.resolve({
                    state: HResultStatus.ERROR_TIME_OUT,
                })
            } else {
                ++i;
            }
        }

        //检查是否需要发送心跳
        if (now - sm_nowWebSocket.contactTick > 15 * 1000) {
            _doCheckHeartbeat(sm_nowWebSocket);
        }
    }, 1000);
}

function _doRequest(encode, cmdId, params, timeout, cmdName, resolve) {

    //用于处理，连接后、或者登录后的直接回调
    //一般就是 cmdId = 0, params = null, cmdName = 'localTryLogin',
    if (!encode) {
        resolve({
            state: HResultStatus.Success,
        });
        return;
    }

    //判定是否登录接口
    if (encode == sm_fnLoginCmdEncoder) {//UserCmd.login
        //登录了 或者 登录中
        if (sm_nowWebSocket.tickToken || sm_nowWebSocket.isCallLogin || sm_nowWebSocket.isCallLogon) {
            //不能重复登录，必须退出才能登陆
            XLog.error(`[websocket] send fail tickToken:${sm_nowWebSocket.tickToken}, isCallLogin:${sm_nowWebSocket.isCallLogin}, isCallLogon:${sm_nowWebSocket.isCallLogon}, url:${sm_nowWebSocket.ws.url}, cmdId:${cmdId}, cmdName:${cmdName}, params:${JSON.stringify(params)}`);
            resolve({
                state: HResultStatus.ERROR_RELOGIN,
            });
            return;
        }

        sm_nowWebSocket.isCallLogin = true;
    } else if (encode == sm_fnLogonCmdEncoder) {//UserCmd.logon
        sm_nowWebSocket.isCallLogon = true;

        //不知道logon重复调用会不会有问题。。。。
        // if (sm_nowWebSocket.tickToken || sm_nowWebSocket.isCallLogin || sm_nowWebSocket.isCallLogon) {
        //     XLog.error(`[websocket] send fail tickToken:${sm_nowWebSocket.tickToken}, isCallLogin:${sm_nowWebSocket.isCallLogin}, isCallLogon:${sm_nowWebSocket.isCallLogon}, url:${sm_nowWebSocket.ws.url}, cmdId:${cmdId}, cmdName:${cmdName}, params:${JSON.stringify(params)}`);
        //     resolve({
        //         state: HResultStatus.ERROR_RELOGIN,
        //     });
        //     return;
        // }
    }

    const bodyBytes = encode(params).finish();
    const bodyLen = bodyBytes ? bodyBytes.length : 0;

    ++sm_nowWebSocket.sendSeq;
    const seq = sm_nowWebSocket.sendSeq;

    const bytes = new Uint8Array(4 + 4 + 4 + 4 + bodyLen);
    //        4 bytes		(state)随意，用于表示链路类型 websocket为 00 00 00 02
    bytes[0] = 0;
    bytes[1] = 0;
    bytes[2] = 0;
    bytes[3] = 2;
    //        4 bytes		cmdId	probuf的id
    bytes[4] = (cmdId >> 24 & 0xff);
    bytes[5] = (cmdId >> 16 & 0xff);
    bytes[6] = (cmdId >> 8 & 0xff);
    bytes[7] = (cmdId & 0xff);
    //        4 bytes		seq		序列号
    bytes[8] = (seq >> 24 & 0xff);
    bytes[9] = (seq >> 16 & 0xff);
    bytes[10] = (seq >> 8 & 0xff);
    bytes[11] = (seq & 0xff);
    //        4 bytes     bodyLen body大小
    bytes[12] = (bodyLen >> 24 & 0xff);
    bytes[13] = (bodyLen >> 16 & 0xff);
    bytes[14] = (bodyLen >> 8 & 0xff);
    bytes[15] = (bodyLen & 0xff);
    //        body
    if (null != bodyBytes) {
        bytes.set(bodyBytes, 16);
        // for (let i = 0; i < bodyLen; ++i) {
        //     bytes[i + 16] = bodyBytes[i];
        // }
    }

    if (!timeout) {
        //默认10秒超时
        timeout = 10 * 1000;
    }

    const sendTick = Date.now();
    sm_nowWebSocket.contactTick = sendTick;

    sm_nowWebSocket.reqs.push({
        seq,
        cmdId,
        resolve,
        timeout,
        sendTick,
    });

    XLog.debug(`[websocket] send url:${sm_nowWebSocket.ws.url}, seq:${seq}, cmdId:${cmdId}, cmdName:${cmdName}, params:${JSON.stringify(params)}`);

    try {
        sm_nowWebSocket.ws.send(bytes);
    } catch (error) {

    }

}

function _removeReq(seq) {
    const l = sm_nowWebSocket.reqs.length;
    for (let i = 0; i < l; ++i) {
        const vo = sm_nowWebSocket.reqs[i];
        if (vo.seq == seq) {
            sm_nowWebSocket.reqs.splice(i, 1);
            return vo;
        }
    }
    return null;
}

function _onMessage(evt) {
    // XLog.debug(`[websocket] recv url:${sm_nowWebSocket.ws.url}, evt:${evt.data}`);

    sm_nowWebSocket.contactTick = Date.now();

    const bytes = new Uint8Array(evt.data);

    if (bytes.length < 20) {
        XLog.error(`[websocket] recv error url:${sm_nowWebSocket.ws.url}, len < 20`);
        return;
    }

    //            4 bytes		CLIENTVERSION  00 00 00 c8
    //            final int CLIENTVERSION = (bytes[0] & 0xff) << 24
    //                    | (bytes[1] & 0xff) << 16
    //                    | (bytes[2] & 0xff) << 8
    //                    | (bytes[3] & 0xff);
    //            4 bytes		cmdId	probuf的id
    const cmdId = (bytes[4] & 0xff) << 24
        | (bytes[5] & 0xff) << 16
        | (bytes[6] & 0xff) << 8
        | (bytes[7] & 0xff);
    //            4 bytes		seq		序列号
    const seq = (bytes[8] & 0xff) << 24
        | (bytes[9] & 0xff) << 16
        | (bytes[10] & 0xff) << 8
        | (bytes[11] & 0xff);
    //            4 bytes		bodyLen body大小
    //            final int bodyLen = (bytes[12] & 0xff) << 24
    //                    | (bytes[13] & 0xff) << 16
    //                    | (bytes[14] & 0xff) << 8
    //                    | (bytes[15] & 0xff);
    //            2 bytes		cmdId	probuf的id
    //            final int cmdId = (bytes[16] & 0xff) << 8
    //                            | (bytes[17] & 0xff);
    //            2 bytes		state	状态码
    const state = (bytes[18] & 0xff) << 8
        | (bytes[19] & 0xff);
    //                    body
    let data;
    if (cmdId > 0) {
        const decode = ResultMap[cmdId];
        if (decode) {
            try {
                const r = Reader.create(bytes);
                r.skip(20);
                data = decode(r);
            } catch (error) {
                console.error(error);
                XLog.error(`[websocket] decode error url:${sm_nowWebSocket.ws.url}, state:${state}, cmdId:${cmdId}`);
                return;
            }

        }
    }


    if (0 == seq) {
        //广播
        XLog.info(`[websocket] broadcast url:${sm_nowWebSocket.ws.url}, state:${state}, cmdId:${cmdId}, \ndata:${JSON.stringify(data, null, 2)}`);
        const evtName = getEventName(cmdId);
        const fn = broadcast[evtName];
        if (fn) {
            fn(evtName, data);
        } else {
            ModelEvent.dispatchEntity(null, getEventName(cmdId), data);
        }
    } else {
        //返回
        const vo = _removeReq(seq);
        XLog.info(`[websocket] recv url:${sm_nowWebSocket.ws.url}, seq:${seq}, state:${state}, cmdId:${cmdId}, cancb:${vo != null}, \ndata:${JSON.stringify(data, null, 2)}`);
        if (vo) {
            vo.resolve({
                state,
                data,
            });
        }
    }


}

export function _toLoginUI() {
    // console.log('=====================被顶号', '1')
    if (!sm_fnToLogin) {
        alert('没有返回登录界面逻辑');
        return;
    }

    sm_fnToLogin();
}

async function _doReqLogon(nowWebSocket, logonParams, bSaveLogonParams) {
    if (nowWebSocket && nowWebSocket.isCallLogon) {
        return HResultStatus.ERROR_RELOGIN;
    }

    //登录服务器:返回UserResult.Logon
    // message logon {
    //     required string userId = 1;//玩家内部ID
    //     required string tickToken = 2;//登录成功的tocken
    //     required bool relogon = 3;//是否重连
    //     optional string channelId = 4;//包渠道ID
    //     optional bool refToken = 5;//刷新token
    //     optional string version = 6;//当前包的版本号
    // }
    let res = await sm_fnLogon(logonParams);

    //需要判定异步处理，是否当前websocket处理
    if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
        return HResultStatus.ERROR_DISCONNECT;
    }

    // message Logon {
    //     required string serverId = 1;// 当前服务器ID
    //     required string tlsSig = 2;//腾讯Tls后台签名
    //     required string roomId = 3;//当前所在的房间ID
    //     repeated int32 dataVersions = 4;//静态数据版本号
    //     optional string host = 5;//socket连接host
    //     optional int32 port = 6;//socket连接port
    //     optional bool setpassword = 7;//是否已经设置密码
    //     optional string sessionId = 8;//当前请求交互的sessionId
    //     optional bool needSetPersonData = 15;//是否需要设置个人资料
    //     optional string headUrl = 16;//第三方头象	
    //     optional string version = 17;//当前版本号
    //     optional UserInitData initData = 18;//App初始化数据
    //     optional int32 forceUpdate = 19;//0不更新,1强更,2提示更新
    //     optional int32 iosPayType = 20;// IOS支付方式:0使用第三方支付,1苹果内购
    //     optional bool isSanBox = 21;//是否沙盒环境
    //     optional bool isBlack = 22;//是否黑名单用户
    //     //login
    //     optional string userId = 9;
    //     optional string tickToken = 10;// 登录成功返回的tocken
    //     optional bool addSysGMember = 11;//true需要前端调用加入系统总群
    //     optional string phoneNumber = 12;//电话号码
    //     optional string userName = 13;//用户登录帐号
    //     optional string password = 14;//用户密码	
    //     optional int32 authType = 23;//认证类型:1手机认证2支付宝认证
    //     optional int32 youngType = 24;//青少年弹框类型:1弹开启2弹时间限制模式(为2的时候每次都返回)
    //     optional bool youngOpen = 25;//是否开启青少年模式
    //     optional int64 deviceSeq = 26;//设备注册序列号:AB测试用(0不分AB,单数A,双数B)
    //     optional string channelRoom = 27;//渠道推送房间ID
    //     optional string channelRoomTips = 28;//渠道推送房间软提示(如果为空则为硬打开)
    //     optional bool isRegister = 29;// 是否是注册，true是，false否
    //     optional bool setPayPassword = 30;//是否已经设置支付密码（用在提现，回购）
    // }

    //数据检查
    if (HResultStatus.Success == res.state) {
        if (!res.data || !res.data.tickToken) {
            res.state = HResultStatus.ERROR_SERVER_DATA_ERROR;
        }
    }

    //重登失败
    if (HResultStatus.Success != res.state) {
        sm_nowWebSocket.isCallLogin = false;
        sm_nowWebSocket.isCallLogon = false;

        //通知那些等待接口，需要登录
        _doCallReqsFail(res.state);
        return res.state;
    }

    //成功
    sm_nowWebSocket.tickToken = res.data.tickToken;

    if (sm_fnLogonSuccess) {
        sm_fnLogonSuccess(res.data, _LoginModel.loginReqParams);
    } else {
        alert('没有设置登录成功回调处理');
    }

    //友盟统计
    require('../umeng/UmengModel').onProfileSignIn('', logonParams.userId);

    //可以调用那些等待接口了
    _doCallReqsRequest();

    if (bSaveLogonParams) {
        //保存logon请求参数
        const bSaved = await _LoginModel.saveLogonParams(logonParams);
        if (!bSaved) {
            return HResultStatus.ERROR_SAVE;
        }

        //需要判定异步处理，是否当前websocket处理
        if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
            return HResultStatus.ERROR_DISCONNECT;
        }
    }

    //保存Logon
    _LoginModel.saveLogonResult(res.data);

    return HResultStatus.Success;
}

async function _tryRequestLogin(nowWebSocket) {

    //需要判定异步处理，是否当前websocket处理
    if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
        return HResultStatus.ERROR_DISCONNECT;
    }

    //判定是否再次调用登录了
    if (sm_nowWebSocket.isCallLogin || sm_nowWebSocket.isCallLogon) {
        return HResultStatus.ERROR_RELOGIN;
    }

    await _LoginModel.loadLocalLoginParams();

    //需要判定异步处理，是否当前websocket处理
    if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
        return HResultStatus.ERROR_DISCONNECT;
    }

    if (_LoginModel.logonReqParmas) {
        //重登陆
        const state = await _doReqLogon(nowWebSocket, _LoginModel.logonReqParmas, false);

        //需要判定异步处理，是否当前websocket处理
        if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
            return HResultStatus.ERROR_DISCONNECT;
        }

        //重登陆成功
        if (HResultStatus.Success == state) {
            return HResultStatus.Success;
        }

        //这个错误必定返回登录界面
        if (HResultStatus.Login_Param_Wrong == state) {
            sm_nowWebSocket.isCallLogin = false;
            sm_nowWebSocket.isCallLogon = false;
            _LoginModel.clearLocalLoginParams();

            //通知那些等待接口，需要登录
            _doCallReqsFail(state);

            //这个需要退到登录界面
            _toLoginUI();
            return state;
        }

        //session过期
        if (
            HResultStatus.Session_TimeLimit == state
            || HResultStatus.Fail == state
        ) {
            // 又没有 login参数
            if (!_LoginModel.loginReqParams) {
                sm_nowWebSocket.isCallLogin = false;
                sm_nowWebSocket.isCallLogon = false;
                _LoginModel.clearLocalLoginParams();

                //通知那些等待接口，需要登录
                _doCallReqsFail(state);

                //这个需要退到登录界面
                _toLoginUI();
                return state;
            }

            //尝试下面调用登录接口

        } else {
            // 没有成功，就等下次吧

            return state;
        }
    }


    //没有登录参数
    if (!_LoginModel.loginReqParams) {
        sm_nowWebSocket.isCallLogin = false;
        sm_nowWebSocket.isCallLogon = false;

        //通知那些等待接口，需要登录
        _doCallReqsFail(HResultStatus.ERROR_TRY_LOGON_FAIL);

        //这个需要退到登录界面
        _toLoginUI();
        return HResultStatus.ERROR_TRY_LOGON_FAIL;
    }

    //重登陆
    let res = await sm_fnLogin(_LoginModel.loginReqParams);

    //需要判定异步处理，是否当前websocket处理
    if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
        return HResultStatus.ERROR_DISCONNECT;
    }


    // message Login {
    //     required string userId = 1;
    //     required string tickToken = 2;// 登录成功返回的tocken
    //     required bool addSysGMember = 3;//true需要前端调用加入系统总群
    //     optional string phoneNumber = 4;//电话号码
    //     optional string userName = 5;//用户登录帐号
    //     optional string password = 6;//用户密码
    //     //以下等前端全改成读logon后可取消
    //     optional int64 deviceSeq = 7;//设备注册序列号:AB测试用(0不分AB,单数A,双数B)
    //     optional int32 authType = 10;//认证类型:1手机认证2支付宝认证
    //     optional int32 youngType = 11;//青少年弹框类型:1弹开启2弹时间限制模式(只处理1)
    //     optional bool youngOpen = 12;//是否开启青少年模式
    //     optional bool isRegister = 13;// 是否是注册，true是，false否
    // }
    //重登失败
    if (HResultStatus.Success != res.state || !res.data) {
        sm_nowWebSocket.isCallLogin = false;
        sm_nowWebSocket.isCallLogon = false;

        //通知那些等待接口，需要登录
        _doCallReqsFail(HResultStatus.ERROR_TRY_LOGIN_FAIL);

        //这个需要退到登录界面
        _toLoginUI();
        return HResultStatus.ERROR_TRY_LOGIN_FAIL;
    }

    let mobileInfos = Config.mobileInfos;
    if (!mobileInfos) {
        mobileInfos = await Config.getMobileInfosAsync();

        //需要判定异步处理，是否当前websocket处理
        if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
            return HResultStatus.ERROR_DISCONNECT;
        }
    }

    //保存logon参数
    const logonParams = {
        userId: res.data.userId,
        tickToken: res.data.tickToken,
        relogon: true,
        channelId: mobileInfos.channel,
        refToken: false,
        version: Config.version,
    };
    res = await _LoginModel.saveLogonParams(logonParams);

    //需要判定异步处理，是否当前websocket处理
    if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
        return HResultStatus.ERROR_DISCONNECT;
    }

    //保存失败
    if (!res) {
        sm_nowWebSocket.isCallLogin = false;
        sm_nowWebSocket.isCallLogon = false;

        //通知那些等待接口，需要登录
        _doCallReqsFail(HResultStatus.ERROR_TRY_LOGIN_SAVE_FAIL);

        //这个需要退到登录界面
        _toLoginUI();
        return HResultStatus.ERROR_TRY_LOGIN_SAVE_FAIL;
    }

    //请求logon
    const state = await _doReqLogon(nowWebSocket, logonParams, false);

    //需要判定异步处理，是否当前websocket处理
    if (nowWebSocket && nowWebSocket != sm_nowWebSocket) {
        return HResultStatus.ERROR_DISCONNECT;
    }

    //session过期
    if (
        HResultStatus.Session_TimeLimit == state
        || HResultStatus.Login_Param_Wrong == state
        || HResultStatus.Fail == state
    ) {
        sm_nowWebSocket.isCallLogin = false;
        sm_nowWebSocket.isCallLogon = false;

        //通知那些等待接口，需要登录
        _doCallReqsFail(state);

        //这个需要退到登录界面
        _toLoginUI();
    }

    return state;
}



const SocketModel = {

    /**
     * 由协议类（ServerCmd）主动安装命令调用
     * @param {Function} fnLogin 
     * @param {Function} fnLogon 
     * @param {Function} fnHeartBeat 
     * @param {Function} fnLoginCmdEncoder 
     * @param {Function} fnLogonCmdEncoder 
     */
    setup(fnLogin, fnLogon, fnHeartBeat, fnLoginCmdEncoder, fnLogonCmdEncoder) {
        sm_fnLogin = fnLogin;
        sm_fnLogon = fnLogon;
        sm_fnHeartBeat = fnHeartBeat;

        sm_fnLoginCmdEncoder = fnLoginCmdEncoder;
        sm_fnLogonCmdEncoder = fnLogonCmdEncoder;
    },

    /**
     * 连接
     */
    connect() {
        return new Promise((resolve, reject) => {

            //已经连上了
            if (sm_nowWebSocket && sm_nowWebSocket.ws) {
                resolve(true);
                return;
            }

            //正在连接
            if (sm_nowWebSocket) {
                sm_nowWebSocket.waitConnectCallbacks.push(resolve);
                return;
            }

            //执行连接
            sm_nowWebSocket = {
                waitConnectCallbacks: [resolve],
                sendSeq: 0,
            };
            _tryConnectWebSocketTimes()
                .then(ws => {
                    if (!ws) {
                        // 连接失败
                        _doDestroyNowWebSocket();
                        return;
                    }

                    //连接成功
                    sm_nowWebSocket.ws = ws;
                    sm_nowWebSocket.reqs = [];
                    sm_nowWebSocket.contactTick = Date.now();

                    //通知连接成功回调
                    const waitConnectCallbacks = sm_nowWebSocket.waitConnectCallbacks;
                    sm_nowWebSocket.waitConnectCallbacks = null;
                    for (let resolve of waitConnectCallbacks) {
                        resolve(true);
                    }

                    //调用请求等待队列
                    _doCallReqsRequestAfterConnected();

                    //开始心跳检测
                    _doStartHeartbeat();

                });
        });
    },

    /**
     * 断开
     */
    disconnect() {
        //这里必须使用Promise，因为有可能 disconnect 和 connect在同一个堆栈过程中，否则可能引起调用顺序问题
        return new Promise((resolve, reject) => {
            _doDestroyNowWebSocket();

            resolve();
        })
    },

    /**
     * 请求
     * 只能在 ServerCmd调用
     * @param {Function} encode         协议的序列化函数，由ServerCmd调用
     * @param {int} cmdId               命令id
     * @param {Object} params           参数
     * @param {boolean} isNeedLogin     是否需要登录
     * @param {int} timeout             请求超时时间
     * @param {string} cmdName          命令名称，其实只用于调试
     */
    request(encode, cmdId, params, isNeedLogin, timeout, cmdName) {
        return new Promise((resolve, reject) => {
            //未连接
            if (!sm_nowWebSocket) {
                //连接
                _addReq(encode, cmdId, params, isNeedLogin, timeout, cmdName, resolve);

                SocketModel.connect();
                return;
            }

            //正在连接
            if (!sm_nowWebSocket.ws) {
                _addReq(encode, cmdId, params, isNeedLogin, timeout, cmdName, resolve);
                return;
            }

            //已经登录
            if (sm_nowWebSocket.tickToken) {
                //请求
                _doRequest(encode, cmdId, params, timeout, cmdName, resolve);
                return;
            }

            //不需要登录的接口
            if (!isNeedLogin) {
                //请求
                _doRequest(encode, cmdId, params, timeout, cmdName, resolve);
                return;
            }

            //登录中
            if (sm_nowWebSocket.isCallLogin || sm_nowWebSocket.isCallLogon) {
                _addReq(encode, cmdId, params, isNeedLogin, timeout, cmdName, resolve);
                return;
            }

            //尝试登录
            _addReq(encode, cmdId, params, isNeedLogin, timeout, cmdName, resolve);
            _tryRequestLogin(sm_nowWebSocket);
        });
    },

    /**
     * 启动时候调用
     * 在之前是否登录过
     * @param {Function} fnToLogin          设置返回登录界面的回调
     * @param {Function} fnLogonSuccess     设置登录成功后回调
     * @param {Function} fnPrevLogon        设置上次登录数据回调
     * @param {Function} fnOnDisconnet      设置连接成功后连接,断开的回调
     */
    async checkLogonByLaunch(fnToLogin, fnLogonSuccess, fnPrevLogon, fnOnDisconnet) {
        sm_fnToLogin = fnToLogin;
        sm_fnLogonSuccess = fnLogonSuccess;
        sm_fnOnDisconnet = fnOnDisconnet;

        //加载之前登录的数据
        await _LoginModel.loadLocalLoginParams();

        //之前没有登录过
        if (!_LoginModel.logonReqParmas) {
            return false;
        }

        //回调上次登录数据
        const logon = await _LoginModel.getLogonResult();
        logon && fnPrevLogon(logon, _LoginModel.loginReqParams);

        //尝试登录
        SocketModel.request(null, 0, null, true, 0);

        return true;
    },

    /**
     * 检查调用登录，一般用于外部断线后重登调用
     */
    checkLogon() {
        //判定是否登录了的
        if (!_LoginModel.logonReqParmas) {
            return {
                state: HResultStatus.Fail,
            };
        }

        //尝试登录
        return SocketModel.request(null, 0, null, true, 0);
    },

    /**
     * 请求登录
     * @param {UserCmd.loginReqParams} param 
     */
    async requestLogin(param) {
        let res = await sm_fnLogin(param);

        const nowWebSocket = sm_nowWebSocket;

        if (HResultStatus.Success != res.state) {
            if (sm_nowWebSocket) {
                sm_nowWebSocket.isCallLogin = false;
                sm_nowWebSocket.isCallLogon = false;
            }
            return res.state;
        }

        //未连接
        if (!nowWebSocket) {
            return HResultStatus.ERROR_DISCONNECT;
        }

        let mobileInfos = Config.mobileInfos;
        if (!mobileInfos) {
            mobileInfos = await Config.getMobileInfosAsync();
        }

        //需要判定异步处理，是否当前websocket处理
        if (nowWebSocket != sm_nowWebSocket) {
            return HResultStatus.ERROR_DISCONNECT;
        }

        //保存logon参数
        const logonParams = {
            userId: res.data.userId,
            tickToken: res.data.tickToken,
            relogon: true,
            channelId: mobileInfos.channel,
            refToken: false,
            version: Config.version,
        };

        //保存login请求参数
        let bSaved = await _LoginModel.saveLoginParams(param);

        //需要判定异步处理，是否当前websocket处理
        if (nowWebSocket != sm_nowWebSocket) {
            return HResultStatus.ERROR_DISCONNECT;
        }

        if (!bSaved) {
            if (sm_nowWebSocket) {
                sm_nowWebSocket.isCallLogin = false;
                sm_nowWebSocket.isCallLogon = false;
            }
            return HResultStatus.ERROR_SAVE;
        }

        //正在连接
        if (!nowWebSocket.ws) {
            return HResultStatus.ERROR_DISCONNECT;
        }

        //已经登录
        if (nowWebSocket.tickToken) {
            return HResultStatus.Success;
        }

        //登录
        return await _doReqLogon(nowWebSocket, logonParams, true);
    },

    /**
     * 退出登录的时候必须要调用
     * 清除登录状态
     */
    async logout() {
        await _LoginModel.clearLocalLoginParams();

        await SocketModel.disconnect();

        _toLoginUI();
    },

};

export default SocketModel;