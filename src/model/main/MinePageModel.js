
/**
 * 兑换页逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import HClientTables from "../../hardcode/HClientTables";
import UserInfoModel from "../userinfo/UserInfoModel";


const MinePageModel = {
    /**
     * 获取用户信息
     */
    async getPersonPage() {
        const res = await require("../ServerCmd").MyCmd_getPersonPage({
            userId: "",
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }
        if (!res.data || !res.data.info) {
            return
        }
        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()
        res.data.info.isBigV = !!vipIds[res.data.info.userId];
        return res.data.info;
    },
    /**
     * 获取用户信息+魅力财富
     */
    async getPersonPageAndLevel() {
        const res = await Promise.all([MinePageModel.getPersonPage(), require("../mine/LevelDescriptionModel").default.getUserLevel()]);

        res[0].charm = res[1].charm;
        res[0].contribute = res[1].contribute;
        // console.log("获取用户信息+魅力财富", res[1]);
        return res[0];
    },

    // /**
    //  * 获得用户钱包数据
    //  */
    // async getWallet() {
    //     const res = await require("../ServerCmd").BagCmd_getWallet();

    //     if (HResultStatus.Success != res.state) {
    //         require("../ErrorStatusModel").default.showTips(res.state);
    //         return ;
    //     }
    //     //optional int32 goldShell = 1;//金贝
    //     //optional int32 rabbitCoin = 2;//兔子币
    //     return res.data;
    // },

    /**
     * 获取用户反馈建议列表
     */
    async getAdviseList() {
        //"start": 0,"size": 20
        const res = await require("../ServerCmd").AdviseCmd_adviseList({
            start: 1,
            size: 20,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }
        // console.log("用户反馈建议列表", res.data);
        let hasNotRead = false;
        res.data.list.forEach((item) => {
            if (item.status == 1) {
                hasNotRead = true;
            }
        }
        );
        return hasNotRead;
    },

}

export default MinePageModel;