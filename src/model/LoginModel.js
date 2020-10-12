/**
 * 登陆逻辑
 */
'use strict';

import CryptoJS from 'crypto-js';
import { NativeModules, Platform } from "react-native";
import RoomInfoCache from "../cache/RoomInfoCache";
import UserInfoCache from "../cache/UserInfoCache";
import Config, { APP_KEY, LOGIN_APP_ID, QQ_APP_ID, WECHAT_API_SECRET, WECHAT_APPID } from "../configs/Config";
import { ESex_Type_FEMALE, ESex_Type_MALE } from "../hardcode/HGLobal";
import HResultStatus from "../hardcode/HResultStatus";


async function _doLogin(param, user_from, mobileInfos) {

    if (!mobileInfos) {
        mobileInfos = await Config.getMobileInfosAsync();
    }

    const deviceType = Platform.OS == 'android' ? '1' : '2';   //'设备类型1:安卓,2:IOS',

    param.paramKey.push("user_from"); param.paramValue.push(user_from);
    param.paramKey.push("deviceId"); param.paramValue.push(mobileInfos.deviceId);
    param.paramKey.push("deviceType"); param.paramValue.push(deviceType);
    param.paramKey.push("version"); param.paramValue.push(Config.version);
    param.paramKey.push("channelId"); param.paramValue.push(mobileInfos.channel);
    if (mobileInfos.model) {
        param.paramKey.push("model"); param.paramValue.push(mobileInfos.model);
    }
    if (mobileInfos.imei) {
        param.paramKey.push("imei"); param.paramValue.push(mobileInfos.imei);
    }
    param.paramKey.push("release"); param.paramValue.push(mobileInfos.release);
    param.paramKey.push("appId"); param.paramValue.push(LOGIN_APP_ID);
    param.paramKey.push("isSimulator"); param.paramValue.push(mobileInfos.isEmu ? "1" : "0");


    // //登陆:返回UserResult.Login
    // message login {
    //     repeated string paramKey = 1;//参数key
    //     repeated string paramValue = 2;//参数值
    // }
    const state = await require("./ServerCmd").requestLogin(param);

    if (HResultStatus.Success != state) {
        require("./ErrorStatusModel").default.showTips(state);
        return false;
    }

    //登陆成功
    // if (require("../cache/UserInfoCache").default.needSetPersonData) {
    //     require("../router/level1_router").showRegisteredView();
    //     return true;
    // }

    //重置当前跟页面到主界面
    require("../router/level1_router").showMainRootView();

    return true;
}

const LoginModel = {

    /**
     * 登陆时候，获取验证码
     * @param {string} phoneNumber 
     */
    getSmsByPhoneLogin(phoneNumber) {
        // //发起获取手机短信验证码
        // message sendGetMsgCode {
        // 	required string phoneNumber = 1;//手机号码
        // 	optional int32 msgType = 2;//短信类型 1:注册验证 2:找回密码
        // 	required bool nocheck = 3;//是否不检查时效性:默认false检查时效
        // 	optional string appId = 4;//appId
        // }

        require("./ServerCmd").ServiceCmd_sendGetMsgCode({
            phoneNumber,
            msgType: 10,
            nocheck: false,
            appId: LOGIN_APP_ID,
        })
            .then(res => {
                if (HResultStatus.Success == res.state) {
                    require("../view/base/ToastUtil").default.showCenter('获取验证码成功');
                    return true;
                }

                require("./ErrorStatusModel").default.showTips(res.state);
                return false;
            });
    },

    /**
     * 手机验证码登陆
     * @param {string} phone 
     * @param {string} code 
     */
    async loginByMobile(phone, code) {

        const param = {
            paramKey: [
                "phoneNumber",
                "msgCode",
            ],
            paramValue: [
                phone,
                code,
            ],
        };
        return await _doLogin(param, "mobileSms");
    },

    /**
     * 帐号密码登陆
     * @param {string} id 
     * @param {string} psw 
     */
    async loginByPsw(id, psw) {
        const param = {
            paramKey: [
                "phoneNumber",
                "password",
            ],
            paramValue: [
                id,
                CryptoJS.MD5(psw).toString().toUpperCase(),
            ],
        };
        return await _doLogin(param, "mobile");
    },

    /**
     * 游客模式登陆
     */
    async newDeviceLogin() {
        const time = String(Math.floor(Date.now() / 1000));

        const mobileInfos = await Config.getMobileInfosAsync();

        const param = {
            paramKey: [
                "time",
                "sign",
            ],
            paramValue: [
                time,
                CryptoJS.MD5(mobileInfos.deviceId + time + APP_KEY).toString().toUpperCase(),
            ],
        };

        return await _doLogin(param, "visitor", mobileInfos);
    },

    /**
     * 微信登陆
     */
    async wechatLogin() {
        let code;
        try {
            code = await NativeModules.WeChat.login(WECHAT_APPID);
        } catch (error) {
            // console.log(error.message);
            require("../view/base/ToastUtil").default.showBottom(error.message);
            return false;
        }

        // console.log(code);
        let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APPID}&secret=${WECHAT_API_SECRET}&code=${code}&grant_type=authorization_code`;
        let weChatToken = await require("./network/ApiModel").default.getJSON(url);
        if (!weChatToken || !weChatToken.access_token) {
            require("../view/base/ToastUtil").default.showBottom('登陆失败');
            return false;
        }
        // * access_token : 17_RGR9xxoBDkPAjWMjx3QjpsBQ0tvzGzGW7jhlSVS2HL4v0FSvVM6JjSaM-NbTeJ2BLou24qyBHoU2lzAXOrfcCK0QYYBnNGMY8h1RA2IBr4c
        // * expires_in : 7200
        // * refresh_token : 17_gR7kbFKfaOzwWRdg6Em0GFYg3DYtGjdCCkDk2kVBK7hvKH8M7gQvgbXSSWF1aQLdC3gq9pKbVp7Zd9pPjzzfMrXt-TrgRdSL2iPBwukMC00
        // * openid : oZvNy547G1cJ4Ibs9N_Ocr1tHrP0
        // * scope : snsapi_userinfo
        // * unionid : oi7Cr1dlzEKmJlcv6seZrPTXS35g

        url = `https://api.weixin.qq.com/sns/userinfo?access_token=${weChatToken.access_token}&openid=${weChatToken.openid}`;
        let weChatInfoEntity = await require("./network/ApiModel").default.getJSON(url);
        if (!weChatInfoEntity) {
            require("../view/base/ToastUtil").default.showBottom('登陆失败');
            return false;
        }
        // * openid : oZvNy547G1cJ4Ibs9N_Ocr1tHrP0
        // * nickname : Mr Mo
        // * sex : 1
        // * language : zh_CN
        // * city : Guangzhou
        // * province : Guangdong
        // * country : CN
        // * headimgurl : http://thirdwx.qlogo.cn/mmopen/vi_32/mtudhOyuBmbyWic5HxBicvTN4IyRuMAicbRicQsq07aicrDibqZiblNua6DW1k4X0RVX9PUknUO7zTBicQHOWxDa7xaTRQ/132
        // * privilege : []
        // * unionid : oi7Cr1dlzEKmJlcv6seZrPTXS35g

        const param = {
            paramKey: [
                'openid',
                "access_token",
                "sex",
            ],
            paramValue: [
                weChatToken.openid,
                weChatToken.access_token,
                String(weChatInfoEntity.sex == 1 ? ESex_Type_MALE : ESex_Type_FEMALE),
            ],
        };

        if (weChatInfoEntity.nickName) {
            param.paramKey.push('nickName');
            param.paramValue.push(weChatInfoEntity.nickName);
        }
        if (weChatInfoEntity.headimgurl) {
            param.paramKey.push('headIcon');
            param.paramValue.push(weChatInfoEntity.headimgurl);
        }

        return await _doLogin(param, "weixin");
    },

    /**
     * qq登陆
     */
    async qqLogin() {
        let data;
        try {
            data = await NativeModules.QQ.login(QQ_APP_ID);
        } catch (error) {
            // console.log(error.message);
            require("../view/base/ToastUtil").default.showBottom(error.message);
            return;
        }

        const param = {
            paramKey: [
                'openid',
                "access_token",
            ],
            paramValue: [
                data.openId,
                weChatToken.accessToken,
            ],
        };

        if (data.nickName) {
            param.paramKey.push('nickName');
            param.paramValue.push(data.nickName);
        }
        if (data.headIcon) {
            param.paramKey.push('headIcon');
            param.paramValue.push(data.headIcon);
        }
        if (data.sex) {
            param.paramKey.push('sex');
            param.paramValue.push(data.sex);
        }

        _doLogin(param, "qq");
    },

    async logout() {
        //玩家主动断开
        // message offline {
        // }
        
        //退出房间,必须优先处理。。。
        require('./room/RoomModel').default.leave();

        const res = require("./ServerCmd").UserCmd_offline({
        });
        await require("./ServerCmd").logout();

        //友盟统计
        require('./umeng/UmengModel').onProfileSignOff();

        //退出房间,必须优先处理。。。
        require('./room/RoomModel').notifyLeaveRoom();

        //清空缓存
        UserInfoCache.clear();
        RoomInfoCache.clear();
    },

};

export default LoginModel;

/**
 * 断线后检查是否需要重新进入房间
 */
async function _doCheckEnterRoom() {
    //判定是否在房间
    if (!RoomInfoCache.isInRoom) {
        return;
    }

    //尝试3次吧
    for (let i = 0; i < 3; ++i) {
        const res = await require("./ServerCmd").checkLogon();
        if (HResultStatus.Success != res.state) {
            continue;
        }

        //下面逻辑不用了，因为在logon成功会触发重进房间逻辑

        // //判定是否在房间
        // if (!RoomInfoCache.isInRoom) {
        //     return;
        // }

        // require('./room/RoomModel').default.reCheckEnter();
        return;
    }

    //退出声网
    NativeModules.Agora.offSeat();

    // alert('你的网络有问题，重连进入房间失败');
    //5s后重试
    setTimeout(() => {
        _doCheckEnterRoom();
    }, 5000)
}

/**
 * 已经连接成功的逻辑socket断开了
 */
export const onSocketDisconnect = () => {
    //判定是否在房间，在房间需要尝试多次重进房间
    _doCheckEnterRoom();

}