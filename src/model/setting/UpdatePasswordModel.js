
/**
 * 设置密码逻辑
 */
'use strict';

import Config from "../../configs/Config";
import HResultStatus from "../../hardcode/HResultStatus";
import CryptoJS from 'crypto-js';

const UpdatePasswordModel = {
    /**
     * 获取验证码
     * ServiceCmd$sendGetMsgCode
     */
    async sendGetMsgCode(phoneNumber) {
        //{"phoneNumber": "13232131996","msgType": 12,"nocheck": true,"appId": "pudding"}
        const res = await require("../ServerCmd").ServiceCmd_sendGetMsgCode({
            phoneNumber,
            msgType: 12,
            nocheck: true,
            appId: Config.appId,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },

    /**
     * 设置密码
     * MyCmd$updatePassword, {"password": "DC1F0F8CA86384D373A462052016EA95","smsCode": "500770"}
     */
    async updatePasswor(password, smsCode) {
        password = CryptoJS.MD5(password).toString().toUpperCase();

        const res = await require("../ServerCmd").MyCmd_updatePassword({
            password,
            smsCode,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },

    /**
         * 首次设置密码
         * MyCmd$updatePassword, {"password": "DC1F0F8CA86384D373A462052016EA95","smsCode": "500770"}
         */
    async fitstUpdatePasswor(password) {
        password = CryptoJS.MD5(password).toString().toUpperCase();

        const res = await require("../ServerCmd").MyCmd_updatePassword({
            password,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },

    /**
     * 设置支付密码
     * NewLiveRoomCmd$setPayPassword, {"smsCode": "270042","payPassword": "DC1F0F8CA86384D373A462052016EA95"}
     */
    async setPayPassword(payPassword, smsCode) {
        payPassword = CryptoJS.MD5(payPassword).toString().toUpperCase();

        const res = await require("../ServerCmd").NewLiveRoomCmd_setPayPassword({
            payPassword,
            smsCode,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },
    /**
     * 是否设置过支付密码
     * NewLiveRoomCmd$setPayPassword, {"smsCode": "270042","payPassword": "DC1F0F8CA86384D373A462052016EA95"}
     */
    async isSetPayPassword() {
        const resultPwd = await require('../ServerCmd').NewLiveRoomCmd_checkIsSetPayPassword()
        if (HResultStatus.Success != resultPwd.state) {
            require('../ErrorStatusModel').default.showTips(resultPwd.state)
            return
        }
        return resultPwd.data.data
    },
}

export default UpdatePasswordModel;