import CryptoJS from 'crypto-js';
import UserInfoCache from "../../cache/UserInfoCache";
import { EUserDataType } from "../../hardcode/EUserDataType";
import { CLICK_INTERVAL, COIN_NAME } from "../../hardcode/HGLobal";
import HResultStatus from "../../hardcode/HResultStatus";
import ToastUtil from '../../view/base/ToastUtil';

//去充值界面
function toRechargeView() {
    require("../../router/level2_router").showMyWalletView();
}

function onExchangePress() {
    require("../../router/level3_router").showConVertView();
}

//去绑定手机界面
function toBindPhoneView() {
    require("../../router/level3_router").showBindPhoneView();
}

//去设置支付密码界面
function toSetPayPassword() {
    require("../../router/level3_router").showUpdatePasswordView(666);
}

/**
     * 点击转赠
     * 1、检查余额是否够转赠
     * 2、检查转赠是否需要实名认证
     * 3、是否绑定手机号
     * 4、是否设置支付密码
     * @param {int} from  来源：1：钱包  2：直播间
     * @param {String} userId 
     */
async function onClickSendGoldShell(from, userId, nickname, headurl) {
    
    let res = await require('../../model/mine/MyWalletModel').default.getMoneyGivingList()
    if (!res) {
        ToastUtil.showCenter("请联系运营配置权限");
        return
    }

    const wallet = await require('../ServerCmd').BagCmd_getWallet()

    //检查金币是否够转赠
    if (HResultStatus.Success != wallet.state) {
        require('../ErrorStatusModel').default.showTips(wallet.state)
        return
    }

    if (wallet.data.goldShell == 0) {
        require("../../router/level2_router").showNormInfoDialog(`当前无${COIN_NAME}可转赠。需充值或进行收益兑换哦~`,
            "进行充值", toRechargeView,
            "收益兑换", onExchangePress);
        return
    }

    //转赠实名认证权限判断
    const result = await require('../../model/mine/UserCertificationModel').default.sendGoldShellUserCertificatin()

    if (!result) {
        return
    }

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
        require("../../router/level2_router").showNormInfoDialog('手机号未绑定',
            "去绑定", toBindPhoneView,
            "我知道了", undefined);
        return
    }

    const resultPwd = await require('../ServerCmd').NewLiveRoomCmd_checkIsSetPayPassword()
    if (HResultStatus.Success != resultPwd.state) {
        require('../ErrorStatusModel').default.showTips(resultPwd.state)
        return
    }
    if (!resultPwd.data.data) {
        //未设置支付密
        require("../../router/level2_router").showNormInfoDialog('支付密码未设置',
            "去设置", toSetPayPassword,
            "我知道了", undefined);
        return
    }
    
    if (from == 2) {

        //直播间，私聊转赠跳转     
        require('../../router/level3_router').showSendGoldShellDialog(userId, nickname, headurl)
    } else {
        //钱包转赠跳转
        // require("../../router/level3_router").showDiamondGiftView(userId);
        require("../../router/level2_router").showDiamondGiftDialog(userId);
    }
}


let g_clickTime = 0;

const MyWalletModel = {

    /**
     * 钻石转赠
     * @param {string} targetId 
     * @param {int} goldShell 
     * @param {string} payPassword 
     * @param {string} nickName 只用于发送IM消息
     */
    async sendGoldShell(targetId, goldShell, payPassword, nickName) {
        let now = Date.now();
        if (g_clickTime + CLICK_INTERVAL > now) {
            return
        }
        g_clickTime = now;
        payPassword = CryptoJS.MD5(payPassword).toString().toUpperCase();
        const result = await require("../ServerCmd").RechargeCmd_sendGoldShell({
            targetId,// 充值用户id
            goldShell,//钻石数量
            payPassword,//支付密码(MD5)
        });

        if (HResultStatus.Success != result.state) {
            require("../ErrorStatusModel").default.showTips(result.state)
            return false
        }

        if (nickName) {
            let luckryMoneyMsg = {
                amount: parseInt(goldShell),
                toUserId: targetId,
                toUserName: nickName,
            }
            require("../../model/chat/ChatModel").sendC2CMessage(targetId, [[4, "luckryMoney#" + JSON.stringify(luckryMoneyMsg)]]);
        }
        return true

    },

    /**
     * 获取充值页banner
     */
    async getWalletBanner() {

        const result = await require("../staticdata/StaticDataModel").getCommonBanner(1)

        if (!result) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return null;
        }

        return result

    },

    /**
     * 是否有转赠权限
     */
    async getMoneyGivingList() {
        const result = await require("../staticdata/StaticDataModel").getMoneyGivingList()
        if (!result) {
            return false;
        }
        return result
    },


    /**
     * 获取充值档次
     */
    async getRecharge() {
        const result = await require("../staticdata/StaticDataModel").getRechargeTableData()
        if (!result) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return false;
        }
        return result
    },

    /**
     * 获取所有充值档次，不分客户端
     */
    async getAllRechargeData() {
        const result = await require('../staticdata/StaticDataModel').getAllRechargeData()
        return result
    },

    /**
     * 支付渠道开关，1 为开 0为关  格式：支付宝,微信,银联 
     */
    async getPayType() {
        const result = await require("../staticdata/StaticDataModel").getPublicConfig(110)
        if (!result) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return [false, false, false];
        }

        // console.log("支付渠道开关", result);

        const array = result.value.split(',')
        const alipay = array[0] == "1"
        const wechat = array[1] == "1"
        const union = array[2] == "1"

        return [alipay, wechat, union]
    },


    async onWalletSendGoldShell(userId = UserInfoCache.userId) {
        console.log('wwwwwwwwww',userId)
        onClickSendGoldShell(1, userId, '', '')
    },

    async onLiveSendGoldShell(userId, nickname, headurl) {
        console.log('ddddddddddddd')
        onClickSendGoldShell(2, userId, nickname, headurl)
    }
}

export default MyWalletModel;