/**
 * 兑换页逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";


const ConvertModel = {
    /**
     * 获取Recharge表数据
     */
    getRechargeTableData() {
        // "keys":["id","desc","os","type","goldShell","price","addGoldShell","firstAddGoldShell","buyLimit","goods","validTime"]
        return require("../staticdata/StaticDataModel").getRechargeTableData();
    },

    /**
     * 获取收益页数据
     */
    async getIncomeData() {
        const res = await require("../ServerCmd").LiveRoomCmd_getLiveData();

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return ;
        }
        return res.data;
    },

    /**
     * 检测id对应昵称
     * MyCmd$getUserInfoList
     */
    async getUserInfoList(userIds) {

        const res = await require("../ServerCmd").MyCmd_getUserInfoList({
            userIds: [userIds,],
            type: 1
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return ;
        }
        return res.data.list[0];
    },
}

export default ConvertModel;