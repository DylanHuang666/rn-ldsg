/**
 * 提现页逻辑
 */
'use strict';

import AsyncStorage from "@react-native-community/async-storage";
import CryptoJS from 'crypto-js';
import UserInfoCache from "../../cache/UserInfoCache";
import { KEY_WITHDRAWAL_BANK } from "../../hardcode/HLocalStorageKey";
import HResultStatus from "../../hardcode/HResultStatus";

export const getLocalSaveBankInfo = async () => {
    try {
        let ret = await AsyncStorage.getItem(KEY_WITHDRAWAL_BANK);
        if (ret) {
            ret = JSON.parse(ret);
        }
        return ret;
    } catch (error) {

    }
    return null;
}

async function _saveLocalBankInfo(account, accountName) {
    try {
        await AsyncStorage.setItem(
            KEY_WITHDRAWAL_BANK,
            JSON.stringify({
                account,
                accountName,
            })
        );
        return true;
    } catch (error) {

    }
    return false;
}

export const bankWithdrawal = async (money, account, accountName, password) => {
    //汇聚大额(单笔代付)提现申请(返回LiveResult.joinPayExpenseResult)
    // message joinPayExpense {
    // 	required int32 money = 1;//提现金额(分)
    // 	required string account = 2;//收款方银行卡账号
    // 	required string accountName = 3;//收款方银行账户名
    // 	required string password = 4;//支付密码(MD5)
    // 	optional string type = 5;//提现类型(默认:user代表个人提现)
    // 	optional string smsCode = 6;//短信验证码(可选)
    // }
    password = CryptoJS.MD5(password).toString().toUpperCase();

    const res = await require("../ServerCmd").NewLiveRoomCmd_joinPayExpense({
        type: 'user',
        userId: UserInfoCache.userId,
        money,
        account,
        accountName,
        password,
    });

    if (HResultStatus.Success != res.state) {
        require("../ErrorStatusModel").default.showTips(res.state);
        return false;
    }

    // 汇聚大额(单笔代付)提现申请结果
    // message joinPayExpenseResult {
    // 	required int32 state = 1;// 状态码
    // 	optional string message = 2;// 说明
    // }
    if (res.data && HResultStatus.Success != res.data.state) {
        res.data.message
            ? require("../../view/base/ToastUtil").default.showCenter(res.data.message)
            : require("../ErrorStatusModel").default.showTips(res.data.state);
        return false;
    }

    _saveLocalBankInfo(account, accountName);

    return true;
}


const WithdrawModel = {
    /**
     * 获取收益页数据
     */
    async applyExpense(payeeRealName, payeeAccount, payPassword, amount) {
        // "payeeRealName": "zhaoqin","payeeAccount": "1257555","payPassword": "C81E728D9D4C2F636F067F89CC14862C","amount": 2000}
        payPassword = CryptoJS.MD5(payPassword).toString().toUpperCase();
        const res = await require("../ServerCmd").NewLiveRoomCmd_applyExpense({
            payeeRealName,
            payeeAccount,
            payPassword,//支付密码(MD5)
            amount,//转账金额，单位：分
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        _saveLocalBankInfo(payeeAccount, payeeRealName);
        return true;
    },

}

export default WithdrawModel;