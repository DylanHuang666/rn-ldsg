/**
 * 兑换页逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import UserInfoCache from "../../cache/UserInfoCache";


const RecordViewModel = {
    /**
     * // 获取陪聊流水明细，返回：SkillChatResult.LiveChatList
message getChatEarningList {
	required string anchorId = 1;// 主播Id
	optional string lastId = 2;// 每页最后1条记录的Id
	optional int32 row = 3;// 分页条数
	optional string startDate = 4;//开始日期(2017-09-01)
	optional string endDate = 5;//结束日期(2017-09-30)
}
     * @param {*} startDate 
     * @param {*} endDate 
     * @param {*} row 
     * @param {*} lastId 
     */
    /**
     * 获取流水记录数据
     */
    //"startDate": "2020-04-11","endDate": "2020-04-11","row": 10,"lastId": ""
    async getChatEarningList(startDate, endDate, row = 10, lastId = "") {

        const res = await require("../ServerCmd").SkillChatCmd_getChatEarningList({
            anchorId: UserInfoCache.userId,
            startDate,
            endDate,
            row,
            lastId,

        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }

        if (!res.data || !res.data.logInfo) {
            return [];
        }

        return res.data.logInfo;
    },


    /**
     * 获取流水记录数据
     */
    //"startDate": "2020-04-11","endDate": "2020-04-11","row": 10,"lastId": ""
    async getLiveRecvList(startDate, endDate, row = 10, lastId = "") {

        const res = await require("../ServerCmd").LiveRoomCmd_getLiveRecvList({
            startDate,
            endDate,
            row,
            lastId,

        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }

        if (!res.data || !res.data.list) {
            return [];
        }
        let liveRecvList = res.data.list;
        let giftList = await RecordViewModel.getGiftListTableData();

        liveRecvList.forEach((item) => {
            let hadGift = false;
            if (item.giftId != '' && item.giftId.slice(0, 5) == 'Guard_') {
                let arr = item.giftId.split('_');
                item.content = '守护*' + arr[1] + '天';
                hadGift = true;
            } else {
                giftList.forEach((gift) => {
                    //gift.giftid == item.giftId
                    if (gift.giftid == item.giftId) {
                        item.giftLogoTime = gift.alterdatetime.replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '');

                        item.content = gift.giftname + '*' + item.groupNum + '*' + item.giftNum;
                        hadGift = true;
                    }
                });
            }
            if(!hadGift) {
                item.content = `未知礼物（${item.giftId}）*${item.groupNum}*${item.giftNum}`;
            }
        });

        return liveRecvList;
    },



    /**
     * 获取提现记录数据
     * 
     */
    async getLiveExpenseList(startDate, endDate, row = 10, lastId = "") {

        const res = await require("../ServerCmd").LiveRoomCmd_getLiveExpenseList({
            startDate,
            endDate,
            row,
            lastId,

        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }

        if (!res.data || !res.data.list) {
            return [];
        }

        return res.data.list;
    },

    /**
     * 获取提现汇总
     * required string startDate = 1;//开始日期(2017-09-01)
        required string endDate = 2;//结束日期(2017-09-30)
     */
    async getLiveExpense(startDate, endDate) {

        const res = await require("../ServerCmd").LiveRoomCmd_getLiveExpense({
            startDate,
            endDate,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }

        //单个长整形数据
        return res.data;
    },

    /**
     * 获取GiftList表数据
     * 
     */
    getGiftListTableData() {
        //"keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]
        return require("../staticdata/StaticDataModel").getGiftListTableData();
    },

    /**
     * 获取兑换记录数据
     */
    //"startDate": "2020-04-11","endDate": "2020-04-11","row": 10,"lastId": ""
    async getLiveExchangeList(startDate, endDate, row = 10, lastId = "") {

        const res = await require("../ServerCmd").LiveRoomCmd_getLiveExchangeList({
            startDate,
            endDate,
            row,
            lastId,

        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }


        if (!res.data || !res.data.list) {
            return []
        }

        return res.data.list;
    },

    /**
     * 获取自己的开播房间信息
     */
    async getMyLiveList() {

        const res = await require("../ServerCmd").RoomCmd_getStartRoomInfo();

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }
        let roomids = [];
        for (i in res.data.halls) {
            roomids[i] = res.data.halls[i].roomId;
        }
        return roomids;
    },

    /**
     * 获取直播间流水数据
     */
    //"ym": "2020-04","type": 1,"roomId": "A7529427","lastId": "","row": 20
    async getLiveEarningData(ym, type, roomId, row = 20, lastId = "") {

        const res = await require("../ServerCmd").LiveRoomCmd_getLiveEarningData({
            ym,
            type,
            roomId,
            lastId,
            row,

        });

        // console.log("获取直播间流水数据", res)
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }

        if (!res.data) {
            return
        }

        if (!res.data.list) {
            res.data.list = [];
            return res.data;
        }

        //repeated LiveEarning list = 1;
        // required int64 total = 2;// 汇总
        return res.data;
    },

    /**
     * 钻石转赠记录，一次返回30：RechargeResult.SendGoldShelLogList
     */
    async getSendGoldShellLog(ym, lastId = "") {

        const res = await require("../ServerCmd").RechargeCmd_getSendGoldShellLog({
            ym,//月份(2019-10)
            lastId,//当前已经获取的数据最后一条的ID(分页用，第一页传空字符串，后面传最后一条的ID)
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }
        if (!res.data || !res.data.list) {
            return []
        }

        return res.data.list;
    },

    /**
     * 受赠记录
     * required string ym = 1;//月份(2019-10)
	optional string lastId = 2;//当前已经获取的数据最后一条的ID(分页用，第一页传空字符串，后面传最后一条的ID)
     * @param {*} ym 
     * @param {*} lastId 
     */
    async getReceivedGoldShellData(ym, lastId = "") {

        const res = await require("../ServerCmd").RechargeCmd_getReceivedGoldShellData({
            ym,//月份(2019-10)
            lastId,//当前已经获取的数据最后一条的ID(分页用，第一页传空字符串，后面传最后一条的ID)
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }
        if (!res.data || !res.data.list) {
            return []
        }

        return res.data.list;
    },

    /**
     * 获得充值数据 RechargeResult.RechargeData
     */
    async getRechargeData(startDate, endDate, row = 10, lastId = "") {

        const res = await require("../ServerCmd").RechargeCmd_getRechargeData({
            startDate,
            endDate,
            row,
            lastId,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }
        if (!res.data || !res.data.list) {
            return []
        }

        return res.data.list;
    },
}

export default RecordViewModel;