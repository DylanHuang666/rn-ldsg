

//订单支付超时通知
// message OrderPayTimeOutBroadcast {
// 	optional string orderId =1;//订单号
// 	optional string desc = 2;//通知内容
// }
export default function (evName, data) {
    require("../pay/PayModel").default.confirmOrderPayTimeOut(data.orderId);

    require("../staticdata/StaticDataModel").getPublicConfig(1139)
        .then(data2 => {
            require("../../router/level2_router").showInfoDialog(data2.value.format(data.orderId), "确定", "风险提示");
        })
    
}