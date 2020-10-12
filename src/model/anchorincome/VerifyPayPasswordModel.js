/**
 * 兑换密码验证逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import CryptoJS from 'crypto-js';


const VerifyPayPasswordModel = {
    /**
     * 主播收益兑换金贝
     */
    async exchangeGoldShell(rechargeId, targetId, money, payPassword) {
        
        payPassword = CryptoJS.MD5(payPassword).toString().toUpperCase();

        const res = await require("../ServerCmd").NewLiveRoomCmd_exchangeGoldShell({
            rechargeId, //充值ID(自定义回调传空字符串)
            targetId,   //充值用户id
            money,      //转账金额，单位：分
            payPassword,//支付密码(MD5)
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },

}

export default VerifyPayPasswordModel;