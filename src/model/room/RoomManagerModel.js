
/**
 * 房间管理逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";

const RoomManagerModel = {
    /**
     * 管理员列表:RoomResult.ManagerList
     */
    async getRoomManagerList(roomId) {
        const res = await require("../ServerCmd").RoomCmd_managers({
            roomId,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return[];
        }
        if(!res.data || !res.data.list) {
            return[];
        }
        // console.log(res.data);
        return res.data.list;
    },

    /**
     * 设置管理员
     */
    async removeRoomManager(roomId, targetId) {
        const res = await require("../ServerCmd").RoomCmd_setManager({
            roomId,// 房间id
            targetId,// 管理员id
            jobId: -1,// 现在只有3，默认传3, 若是收回权限，传-1
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        return true;
    },


    /**
     * 房间在线:RoomResult.MemberList
     */
    async getOnlineMembers(roomId, start) {
        const res = await require("../ServerCmd").RoomCmd_getOnlineMembers({
            roomId,
            start: start,
            end: start + 21,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return[];
        }
        if(!res.data || !res.data.list) {
            return[];
        }
        // console.log(res.data);
        return res.data.list;
    },

    /**
     * 排行榜类型 返回:RankResult.LiveRankList
     *     * rankType 排行榜类型
    * 魅力榜  日榜：21 周榜：22 月榜：23
    * 土豪榜  日榜：24 周榜：25 月榜：26
     */
    async getRoomRankList(roomId, rankType, start = 0, end = 10) {
        const res = await require("../ServerCmd").CenterCmd_getRoomRankList({
            userId: require("../../cache/UserInfoCache").default.userId,
            roomId,// 房间id
            rankType,
            start,
            end,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return ;
        }

        if (!res.data) {
            return ;
        }

        if (!res.data.list || res.data.list.length == 0) {
            //如果没有list则获取score
            //totalScore: 0
            // myScore: 0
            // newTotalScore: 0
            // newMyScore: 0
            return res.data;
        }

        let liveRankInfos = res.data.list;
        let Ids = [];
        for (let i = 0; i < liveRankInfos.length; i ++) {
            let element = liveRankInfos[i];
            Ids[i] = element.userId;
        }

        if(Ids.length == 0) {
            return[];
        }
        // console.log("根据返回的数据获取详细信息", Ids);
        //MyCmd_getUserInfoList
        //根据返回的数据获取详细信息
        const res2 = await require("../ServerCmd").MyCmd_getUserInfoList({
            userIds: Ids,
            type: 40967,
        })

        // console.log("getUserInfoList", res2);
        if (HResultStatus.Success != res2.state) {
            require("../ErrorStatusModel").default.showTips(res2.state);
            return res.data;
        }

        //合并数据
        for (let i = 0; i < liveRankInfos.length; i ++) {
            let element = liveRankInfos[i];
            element.nickName = res2.data.list[i].nickName;
            element.logoTime = res2.data.list[i].logoTime;
            element.thirdIconurl = res2.data.list[i].thirdIconurl;
            element.charmLv = res2.data.list[i].charmLv;
            element.contributeLv = res2.data.list[i].contributeLv;
        }

        // console.log("合并数据", res.data);
        return res.data;
    },

}

export default RoomManagerModel;