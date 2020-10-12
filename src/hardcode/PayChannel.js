

/**
 * 支付渠道
 */
 const PayChannel = {

    /**
     * 支付宝
     */
    PAY_TYPE_ALIPAY: 1,
    /**
     * 微信
     */
    PAY_TYPE_WECHAT: 2,

    /**
     * 银联支付
     */
    PAY_TYPE_UNION: 3,

    GaoFuTongAliPay: 9,

    WECHAT_MINI_PROGRAM: 10,//汇聚微信支付

    AliPayWapNative: 12,//手机wap支付

    SanDongAliPay: 14,//山东支付宝H5支付
    SanDongWeChat: 15,//山东微信H5支付
    SanDongAliPayQR: 16,//山东支付宝二维码支付
    SanDongWeChatQR: 17,//山东微信二维码支付
    D0ShouPay: 18,//未来支付
    ZPay3: 19,//zpay支付宝
    ZPay2: 20,//zpay微信

    ARYA_AliPay: 21,//ARYA 支付宝支付
    ARYA_AliPayQR: 22,//ARYA 支付宝二维码支付
    ARYA_Weixin: 23,//ARYA 微信支付
    ARYA_WeixinQR: 24,//ARYA 微信二维码支付
    ARYA_UnionPay: 25,//ARYA 银联支付

    Talker_AliPay: 26,//Talker 支付宝支付
    Talker_AliPayQR: 27,//Talker 支付宝二维码支付
    Talker_Weixin: 28,//Talker 微信支付
    Talker_WeixinQR: 29,//Talker 微信二维码支付
    Talker_UnionPay: 30,//Talker 银联支付

    HiCard_WeixinMp: 41,//汇卡 微信公众号支付
    HiCard_Weixin: 42,//汇卡 微信App支付
    HiCard_WeixinH5: 43,//汇卡 微信H5支付
    HiCard_WeixinQR: 44,//汇卡 微信扫码支付

    HiCard_AliPay: 45,//汇卡 支付宝App支付
    HiCard_AliH5: 46,//汇卡 支付宝H5支付
    HiCard_AliQR: 47,//汇卡 支付宝扫码支付

    HuiLian_AliPay: 48,//汇联 支付宝支付

    HuiJuAgreementPay: 50,//汇聚 银行卡快捷(协议)支付 

    HeLiBao_AliPay: 51,//合利宝支付宝
    HeLiBao_Weixin: 52,//合利宝微信
    HeLiBao_AliPay_MP: 53,//合利宝支付宝小程序

}

export default PayChannel;