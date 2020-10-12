import { NativeModules } from "react-native";
import HResultStatus from "../../hardcode/HResultStatus";
import PayChannel from "../../hardcode/PayChannel";
import { LOGIN_APP_ID } from "../../configs/Config";


function _doWechatPay(result) {
    if (!result.payChannelData || !result.payChannelData.payInfo) {
        require("../../view/base/ToastUtil").default.showCenter('返回参数不正确！！！');
        return;
    }

    NativeModules.WeChat.pay(
        result.payChannelData.payInfo.partnerid,
        result.payChannelData.payInfo.prepayid,
        result.payChannelData.payInfo.noncestr,
        result.payChannelData.payInfo.timestamp,
        result.payChannelData.payInfo.sign,
        result.payChannelData.payInfo.appid,
        result.payChannelData.payInfo.package || 'Sign=WXPay'
    )
}

function _doMiniProgramPay(result) {
    if (!result.payChannelData || !result.payChannelData.orderString) {
        require("../../view/base/ToastUtil").default.showCenter('返回参数不正确！！！');
        return;
    }

    let dic_orderString;
    try {
        dic_orderString = JSON.parse(result.payChannelData.orderString);
    } catch (error) {
    }
    if (!dic_orderString || !dic_orderString.rc_Result) {
        require("../../view/base/ToastUtil").default.showCenter('返回参数不正确！！！');
        return;
    }

    const str_rc_Result = dic_orderString.rc_Result;
    let dic_rc_Result;
    try {
        str_rc_Result = JSON.parse(dic_orderString.rc_Result);
    } catch (error) {
    }
    if (!dic_rc_Result) {
        require("../../view/base/ToastUtil").default.showCenter('返回参数不正确！！！');
        return;
    }

    const appId = dic_rc_Result.app_id;
    const userName = dic_rc_Result.original_id;//拉起的小程序的username
    const path = `/pages/payIndex/payIndex?rc_result= {\"order_amout\":\"${dic_rc_Result.order_amout}\",\"payee_name\":\"${dic_rc_Result.payee_name}\",\"original_id\":\"${dic_rc_Result.original_id}\",\"trx_no\":\"${dic_rc_Result.trx_no}\",\"product_name\":\"${dic_rc_Result.product_name}\",\"app_id\":\"${dic_rc_Result.app_id}\"}`;

    // String appId, String userName, String path
    NativeModules.WeChat.payByMini(appId, userName, path);
}

/**
 * 内部浏览器打开
 */
function _innerWebViewOpen(result) {
    if (!result.payChannelData || !result.payChannelData.orderString) {
        require("../../view/base/ToastUtil").default.showCenter('返回参数不正确！！！');
        return;
    }
    require("../../router/level2_router").showMyWebView('支付', result.payChannelData.orderString);
}

/**
 * 外部浏览器打开
 */
function _outterWebViewOpen(result) {
    if (!result.payChannelData || !result.payChannelData.orderString) {
        require("../../view/base/ToastUtil").default.showCenter('返回参数不正确！！！');
        return;
    }
    NativeModules.HttpUtil.openUrl(encodeURI(result.payChannelData.orderString))
}

/**
 * 外部浏览器打开
 */
function _outterWebViewOpen2(result) {
    if (!result.payChannelData || !result.payChannelData.orderString) {
        require("../../view/base/ToastUtil").default.showCenter('返回参数不正确！！！');
        return;
    }
    NativeModules.HttpUtil.openUrl(result.payChannelData.orderString)
}

const PayModel = {

    /**
     * 确认订单超时
     * @param {*} orderId 
     */
    async confirmOrderPayTimeOut(orderId) {
        let result = require("../ServerCmd").RechargeCmd_confirmOrderPayTimeOut(orderId);
        if (HResultStatus.Success != result.state) {
            require("../ErrorStatusModel").default.showTips(result.state)
            return result
        }
        return result
    },

    /**
     * 支付宝,微信,银联  1,2,3
     * @param {int} payType 
     * @param {Recharge} recharge 
     */
    async toPay(payType, recharge) {
        // "keys":["id","desc","os","type","goldShell","price","addGoldShell","firstAddGoldShell","buyLimit","goods","validTime"]

        const payChannle = await PayModel.getPayChannle(payType)

        const param = {}
        param.appName = LOGIN_APP_ID
        param.appPackage = NativeModules.PackageInfo.applicationId
        param.money = recharge.price * 100
        param.payChannel = payChannle
        param.productId = recharge.id
        param.productDesc = recharge.desc
        param.productName = recharge.desc || ''
        param.isWapPay = false
        param.userId = require('../../cache/UserInfoCache').default.userId
        param.userName = require('../../cache/UserInfoCache').default.userName

        /**
         * orderId : 1264704788763770880
         * payChannelData : {"token_id":"2039564e2dc3173c7db44ea2b2b945575","services":"pay.weixin.jspay|pay.weixin.micropay|pay.weixin.native|pay.weixin.app"}
         * state : 1
         */

        const result = await require("../network/ApiModel").default.requestApi("/Api/PayOrder.do", param);
        if (!result) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return;
        }
        if (1 != result.state) {
            result.desc
                ? require("../../view/base/ToastUtil").default.showCenter(result.desc)
                : require("../ErrorStatusModel").default.showTips(result.state);
            return;
        }

        switch (payChannle) {
            case PayChannel.PAY_TYPE_ALIPAY:
                break//支付宝原生
            case PayChannel.PAY_TYPE_WECHAT:
                _doWechatPay(result);
                break//微信原生
            case PayChannel.WECHAT_MINI_PROGRAM:
                _doMiniProgramPay(result);
                break//微信小程序打开
            case PayChannel.AliPayWapNative:
                _outterWebViewOpen(result)//外部浏览器打开
                break;
            case PayChannel.HiCard_WeixinMp:
            case PayChannel.HiCard_Weixin:
            case PayChannel.HiCard_WeixinH5:
            case PayChannel.HiCard_WeixinQR:
            case PayChannel.HiCard_AliPay:
            case PayChannel.HiCard_AliH5:
            case PayChannel.HiCard_AliQR:
                _innerWebViewOpen(result)//内部webview打开
                break
            case PayChannel.GaoFuTongAliPay:
            case PayChannel.SanDongAliPay:
            case PayChannel.SanDongAliPayQR:
            case PayChannel.SanDongWeChat:
            case PayChannel.SanDongWeChatQR:
            case PayChannel.D0ShouPay:
            case PayChannel.ZPay3:
            case PayChannel.ZPay2:
            case PayChannel.Talker_AliPay:
            case PayChannel.Talker_AliPayQR:
            case PayChannel.Talker_Weixin:
            case PayChannel.Talker_WeixinQR:
            case PayChannel.Talker_UnionPay:
            case PayChannel.HuiLian_AliPay:
                _outterWebViewOpen(result)//外部浏览器打开
                break
            case PayChannel.ARYA_AliPay:
            case PayChannel.ARYA_AliPayQR:
            case PayChannel.ARYA_Weixin:
            case PayChannel.ARYA_WeixinQR:
            case PayChannel.ARYA_UnionPay:

                break//http请求支付参数，再用外部浏览器打开
            case PayChannel.HeLiBao_AliPay_MP:
                _outterWebViewOpen2(result)//外部浏览器打开
                break
        }


    },

    /**
     * h5直接调起支付
     * @param {*} payType 
     * @param {*} id 
     * @param {*} price 
     */
    async h5ToPay(payType, id, price) {
        //查找充值表对应的充值id
        const data = await require('../../model/mine/MyWalletModel').default.getAllRechargeData();
        if (!data) {
            require("../../view/base/ToastUtil").default.showCenter('充值表异常');
            return;
        }
        for (const element of data) {
            if (element.id == id) {
                PayModel.toPay(payType, element);
                break;
            }
        }
    },

    /**
     * 获取配置充值渠道
     */
    async getPayChannle(payType) {
        let id = payType == 1 ? 131 : 130

        const result = await require('../staticdata/StaticDataModel').getPublicConfig(id);

        if (!result) {
            return payType
        }

        // console.log("充值渠道", result)
        const channel = parseInt(result.value.split(',')[0])

        if (channel == 2) {
            if (payType == 1) {
                //支付宝支付 转为 高富通的支付宝支付
                return PayChannel.GaoFuTongAliPay
            } else {
                //微信支付 转为 汇聚的小程序支付
                return PayChannel.WECHAT_MINI_PROGRAM
            }
        } else if (channel == 3) {
            //配置了这个必定是支付宝支付方式
            // 转为 手机wap支付
            return PayChannel.AliPayWapNative;
        } else if (channel == 4) {
            //山东支付 H5
            if (payType == 1) {
                //支付宝支付 转为 山东H5支付宝支付
                return PayChannel.SanDongAliPay
            } else {
                //微信支付 转为 山东H5微信支付
                return PayChannel.SanDongWeChat
            }
        } else if (channel == 5) {
            if (payType == 1) {
                //支付宝支付 转为 山东二维码支付宝支付
                return PayChannel.SanDongAliPayQR
            } else {
                //微信支付 转为 山东二维码微信支付
                return PayChannel.SanDongWeChatQR
            }
        } else if (channel == 6) {
            if (payType == 1) {
                //支付宝支付 转为 zpay支付宝
                return PayChannel.D0ShouPay
            } else {
                //微信支付 转为 zpay微信
                return PayChannel.ZPay2
            }
        } else if (channel == 7) {
            //zpay支付宝
            return PayChannel.ZPay3
        } else if (channel == 8) {
            if (payType == 1) {
                //ARYA支付宝宝支付
                return PayChannel.ARYA_AliPay
            } else {
                return PayChannel.ARYA_Weixin
            }
        } else if (channel == 9) {
            //ARYA 扫码
            if (payType == 1) {
                return PayChannel.ARYA_AliPayQR
            } else {
                return PayChannel.ARYA_WeixinQR
            }
        } else if (channel == 10) {
            //ARYA 银联
            return PayChannel.ARYA_UnionPay
        } else if (channel == 11) {
            if (payType == 1) {
                //Talker支付宝支付
                return PayChannel.Talker_AliPay
            } else {
                //Talker微信支付
                return PayChannel.Talker_Weixin
            }
        } else if (channel == 12) {
            if (payType == 1) {
                //Talker支付宝二维码支付
                return PayChannel.Talker_AliPayQR
            } else {
                //Talker微信二维码支付
                return PayChannel.Talker_WeixinQR
            }
        } else if (channel == 13) {
            //Taler银联支付
            return PayChannel.Talker_UnionPay
        } else if (channel == 14) {
            if (payType == 1) {
                //汇卡转支付宝
                return PayChannel.HiCard_AliPay
            } else {
                //汇卡微信
                return PayChannel.HiCard_Weixin
            }
        } else if (channel == 15) {
            if (payType == 1) {
                //汇卡 支付宝H5支付
                return PayChannel.HiCard_AliH5
            } else {
                //汇卡 微信H5支付
                return PayChannel.HiCard_WeixinH5
            }
        } else if (channel == 16) {
            if (payType == 1) {
                //汇卡 支付宝扫码支付
                return PayChannel.HiCard_AliQR
            } else {
                //汇卡 微信扫码支付
                return PayChannel.HiCard_WeixinQR
            }
        } else if (channel == 17) {
            //汇卡 微信公众号支付
            return PayChannel.HiCard_WeixinMp
        } else if (channel == 48) {
            return PayChannel.HuiLian_AliPay
        } else if (channel == 53) {
            ////合利宝支付宝小程序
            return PayChannel.HeLiBao_AliPay_MP;
        }
        return payType;

    }
}


export default PayModel;