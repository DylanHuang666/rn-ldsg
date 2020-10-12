

/**
 * 设置密码逻辑
 */
'use strict';

import Config from "../../configs/Config";
import HResultStatus from "../../hardcode/HResultStatus";
import UserInfoCache from "../../cache/UserInfoCache";

const UpdatePasswordModel = {
    /**
     * 获取验证码
     * ServiceCmd$sendGetMsgCode
     * msgType 校验原手机2  绑定新手机(没绑)8
     */
    async sendGetMsgCode(phoneNumber, msgType) {
        //{"phoneNumber": "13232131996","msgType": 2,"nocheck": true,"appId": "pudding"}
        const res = await require("../ServerCmd").ServiceCmd_sendGetMsgCode({
            phoneNumber,
            msgType,
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
     * 校验是否原来手机
     * cmdName:ServiceCmd$checkMatchSms, {"phoneNumber": "13232131996","code": "601146"}
     */
    async checkMatchSms(phoneNumber, code) {

        const res = await require("../ServerCmd").ServiceCmd_checkMatchSms({
            phoneNumber,
            code,
        });
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },

    /**
     * 更换绑定手机号
     * cmdName:MyCmd$changeMobile, {"msgCode": "601146","newPhoneNum": "13232131996","newMsgCode": "2356"}
     */
    async changeMobile(newPhoneNum, msgCode, newMsgCode) {

        const res = await require("../ServerCmd").MyCmd_changeMobile({
            newPhoneNum,
            msgCode,
            newMsgCode,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        UserInfoCache.setPhoneNumber(newPhoneNum);
        return true;
    },


    /**
     * 绑定手机号
     * cmdName:MyCmd$bindMobile, {"mobile": "18924044942","msgCode": "12"}
     */
    async bindMobile(mobile, msgCode) {

        const res = await require("../ServerCmd").MyCmd_bindMobile({
            mobile,
            msgCode,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        UserInfoCache.setPhoneNumber(mobile);
        return true;
    },

}

export default UpdatePasswordModel;

/**
 * 手机绑定
 */
export const checkBindPhoneAndShowView = () => {
    //已绑定
    if (UserInfoCache.phoneNumber) {
        require("../../router/level3_router").showAlreadyBindPhoneView();
        return;
    }

    //打开手机绑定界面
    require("../../router/level3_router").showBindPhoneView();
}