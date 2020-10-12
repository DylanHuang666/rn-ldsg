/**
 * 我的收益逻辑
 */
'use strict';

import UserInfoCache from "../../cache/UserInfoCache";
import { EUserDataType } from "../../hardcode/EUserDataType";
import HResultStatus from "../../hardcode/HResultStatus";


//去绑定手机界面
function toBindPhoneView() {
    require("../../router/level3_router").showBindPhoneView();
}

//去设置支付密码界面
function toSetPayPassword() {
    require("../../router/level3_router").showUpdatePasswordView(666);
}

async function _showWithdrawalFromBankView(accountMoney) {
    // require("../../router/level2_router").showMyWebView('提现', Config.geth5Url('/html/withdrawal.html'));
    const data = await require("../staticdata/StaticDataModel").getPublicConfigByIds([128, 129]);
    if (!data) {
        return;
    }

    const minCatch = Number(data[0].value);
    const maxCatch = Number(data[1].value);

    //是否满足最低提现金额
    if (accountMoney < minCatch) {
        require("../../view/base/ToastUtil").default.showCenter(`最低提现金额不低于${minCatch}`)
        return;
    }

    require("../../router/level3_router").showWithdrawalFromBankView(accountMoney, minCatch, maxCatch);
}

const AnchorIncomeModel = {
    /**
     * 获取收益页数据
     */
    // dayLiveRecv: 0
    // dayLiveEarn: 0
    // totalLiveEarn: 0
    // weekLiveEarn: 0
    // balance: 0
    // totalLiveRecv: 0
    // dayBaseSalary: 0
    // monthBaseSalary: 0
    // monthLiveRecv: 0
    // dayBaseEarn: 0
    // dayRewardEarn: 0
    async getIncomeData() {
        // await require("../ServerCmd").DataCmd_actionData({
        //     actionType: 1,
        // });
        const res = await require("../ServerCmd").LiveRoomCmd_getLiveData();
        // await require("../ServerCmd").LiveRoomCmd_getMyFamily();

        // console.log("获取收益页数据", res);
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }
        // console.log("请求成功", res.data);
        return res.data;
    },

    /**
     * 获取实名认证数据
     */
    async getUserCertification() {
        const res = await require("../ServerCmd").UserCertificationCmd_getUserCertification();
        if (HResultStatus.Success != res.state) {
            return false;
        }
        return res.data == undefined ? false : res.data.status == 2;
    },

    /**
     * 获取实名认证数据
     * 审核状态  0:审核中， 1:认证不通过，2:认证通过
     * 
     * 未认证都返回-1
     */
    async getUserCertificationStatus() {
        const res = await require("../ServerCmd").UserCertificationCmd_getUserCertification();
        if (HResultStatus.Success == 77) {
            // 还没实名认证
            return -1;
        }
        if (!res.data) {
            return -1;
        }
        return res.data.status;
    },

    /**
     * 获取PublicConfig表数据
     */
    async getPublicConfigTableData() {
        const data = await require("../staticdata/StaticDataModel").getPublicConfigByIds([11, 12]);
        if (!data) {
            return null;
        }

        // "keys":["id","desc","os","type","goldShell","price","addGoldShell","firstAddGoldShell","buyLimit","goods","validTime"]
        return { minCatch: Number(data[0].value), maxCatch: Number(data[1].value), };
    },

    //点击兑换
    //1、检查是否绑定手机号
    //2、是否设置支付密码
    async onClickExchange() {
        //用户信息
        const userInfoList = await require('../ServerCmd').MyCmd_getUserInfoList({
            userIds: [UserInfoCache.userId],
            type: EUserDataType.PHONENUM,
        })

        if (HResultStatus.Success != userInfoList.state) {
            require('../ErrorStatusModel').default.showTips(userInfoList.state)
            return
        }

        const userInfo = userInfoList.data.list[0]

        if (!userInfo.phoneNum) {
            //未设置手机号
            require("../../router/level2_router").showNormInfoDialog('手机号未绑定',
                "去绑定", toBindPhoneView,
                "我知道了", undefined);
            return
        }
        const result = await require('../ServerCmd').NewLiveRoomCmd_checkIsSetPayPassword()
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }
        if (!result.data.data) {
            //未设置支付密
            require("../../router/level2_router").showNormInfoDialog('支付密码未设置',
                "去设置", toSetPayPassword,
                "我知道了", undefined);
            return
        }

        require("../../router/level3_router").showConVertView();
    },


    //点击提现
    //1、检查是否绑定手机号
    //2、检查是否实名认证
    //3、检查是否设置支付密码
    //4、检查金额是否够提现
    async toWithdraw(accountMoney, minCatchValue, maxCatchValue) {
        //用户信息
        const userInfoList = await require('../ServerCmd').MyCmd_getUserInfoList({
            userIds: [UserInfoCache.userId],
            type: EUserDataType.PHONENUM + EUserDataType.IS_SET_PAY_PASSWORD,
        })

        if (HResultStatus.Success != userInfoList.state) {
            require('../ErrorStatusModel').default.showTips(userInfoList.state)
            return
        }
        const userInfo = userInfoList.data.list[0]

        if (!userInfo.phoneNum) {
            //未设置手机号
            require("../../router/level2_router").showNormInfoDialog('绑定了手机号才能提现',
                "去绑定", toBindPhoneView,
                "我知道了", undefined);
            return
        }

        const userCertification = await require('../../model/mine/UserCertificationModel').default.getUserCertification('实名认证才能提现哦')

        if (!userCertification) {
            return
        }

        const result = await require('../ServerCmd').NewLiveRoomCmd_checkIsSetPayPassword()
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }
        if (!result.data.data) {
            //未设置支付密
            require("../../router/level2_router").showNormInfoDialog('支付密码未设置',
                "去设置", toSetPayPassword,
                "我知道了", undefined);
            return
        }

        //是否满足最低提现金额
        if (accountMoney < minCatchValue) {
            require("../../view/base/ToastUtil").default.showCenter(`最低提现金额不低于${minCatchValue}`)
            return
        }

        const result2 = await require('../staticdata/StaticDataModel').getPublicConfigByIds([139])

        if (result2 && result2[0] && result2[0].value == 1) {
            _showWithdrawalFromBankView(accountMoney);
        } else {
            require("../../router/level3_router").showWithdrawView(accountMoney, maxCatchValue);
        }
    },

}

export default AnchorIncomeModel;