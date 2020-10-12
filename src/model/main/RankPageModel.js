/**
 * 榜单逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import { EUserDataType } from "../../hardcode/EUserDataType";

const AnchorIncomeModel = {
    /**
     * 获取砸蛋榜单列表(返回:SmashEggResult.SmashEggLogs)
     */
    async getSmashList() {
        const res = await require("../ServerCmd").SmashEggCmd_getSmashList();

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }
        if (!res.data || !res.data.list) {
            return [];
        }
        //查出礼物数据存入data
        const giftData = await require('../staticdata/StaticDataModel').getGiftListTableData();

        res.data.list.forEach(item => {
            for (let index = 0; index < giftData.length; index++) {
                let element = giftData[index];
                if (element.giftid == item.gift.giftId) {
                    item.gift.logoTime = element.alterdatetime.replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '');
                }
            }
        });

        // console.log("-----------------", res.data.list);
        return res.data.list;
    },
    /**
     * 排行榜类型 返回:RankResult.LiveRankList
     * 
    * 获取榜单数据
    * rankType 排行榜类型
    * 魅力榜  日榜：1 周榜：2 月榜：3
    * 土豪榜  日榜：4 周榜：5 月榜：6
    * 人气榜  日榜：11 周榜：12 月榜：13
    * 
    * {"userId": "1001071","rankType": 5,"start": 1,"end": 30}
    */
    async getRankList(userId, rankType, start, end) {
        const res = await require("../ServerCmd").CenterCmd_getRankList({
            userId,
            rankType,
            start,
            end,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }
        // console.log(res.data.list);

        if (!res.data || !res.data.list) {
            return [];
        }
        let liveRankInfos = res.data.list;
        let Ids = [];
        liveRankInfos.forEach(element => {
            if (Ids.indexOf(element.userId) == -1) {
                Ids.push(element.userId)
            }
        });

        if (Ids.length == 0) {
            return [];
        }
        // console.log("根据返回的数据获取详细信息", Ids);
        //MyCmd$getUserList
        //根据返回的数据获取详细信息
        const res2 = await require("../ServerCmd").MyCmd_getUserInfoList({
            userIds: Ids,
            type: EUserDataType.NICKNAME + EUserDataType.LOGOTIME + EUserDataType.ThirdIconurl + EUserDataType.SEX_ANG_AGE
                + EUserDataType.SLOGAN + EUserDataType.CONTRIBUTELEVEL + EUserDataType.FRIENDSTATUS + EUserDataType.CHARMEVE
        })

        if (HResultStatus.Success != res2.state) {
            require("../ErrorStatusModel").default.showTips(res2.state);
            return [];
        }

        if (!res2.data || !res2.data.list) {
            return [];
        }
        //合并数据
        liveRankInfos.forEach(liveRankInfo => {
            res2.data.list.forEach(element => {
                if (element.userId == liveRankInfo.userId) {
                    liveRankInfo.nickName = element.nickName;
                    liveRankInfo.logoTime = element.logoTime;
                    liveRankInfo.thirdIconurl = element.thirdIconurl;
                    liveRankInfo.slogan = element.slogan;
                    liveRankInfo.key = element.userId;
                    liveRankInfo.sex = element.sex
                    liveRankInfo.age = element.age
                    liveRankInfo.contributeLv = element.contributeLv
                    liveRankInfo.charmLv = element.charmLv
                    liveRankInfo.friendStatus = element.friendStatus
                }
            });
        });
        return liveRankInfos;
    },
    // 获取个人的排名
    async getRankInfo(userId, type) {
        const res = await require("../ServerCmd").CenterCmd_getRankInfo({
            userId,
            type,
        });
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return null;
        }
        if (!res.data) {
            return null;
        }
        return res.data
    }
}

export default AnchorIncomeModel;