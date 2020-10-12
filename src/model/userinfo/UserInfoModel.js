/**
 * 用户资料逻辑
 */
'use strict';

import RoomInfoCache from "../../cache/RoomInfoCache";
import { EVT_UPDATE_RELATIONSHIP, EVT_UPDATE_ROOM_MAIN_MIC } from "../../hardcode/HGlobalEvent";
import HResultStatus from "../../hardcode/HResultStatus";
import ModelEvent from "../../utils/ModelEvent";


const UserInfoModel = {
    /**
     * 获取GiftList表数据
     * 
     */
    getGiftListTableData() {
        //"keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]
        return require("../staticdata/StaticDataModel").getGiftListTableData();
    },

    /**
     * 获取用户信息
     *friendStatus //好友状态 0是自己,1是好友,2已关注,3已被关注,4未被关注也没关注	
     */
    async getPersonPage(userId) {
        const res = await require("../ServerCmd").MyCmd_getPersonPage({
            userId,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return null;
        }

        if (!res.data) {
            return null;
        }

        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()
        res.data.info.isBigV = !!vipIds[res.data.info.userId];
        return res.data.info;
    },

    /**
     * 获取用户所在房间的信息
     */
    async getUserRoom(roomId) {
        const res = await require("../ServerCmd").RoomCmd_getRoomInfo({
            roomId,
        });
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }

        if (!res.data) {
            return;
        }
        return res.data
    },
    /**
     * 获取在线人数
     */
    async getUserRoomOnline(roomId) {
        const res = await require("../ServerCmd").RoomCmd_getRoomData({
            roomId,
        });
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }

        if (!res.data) {
            return;
        }
        return res.data
    },
    /**
     * 是否拉黑(状态不与好友状态相冲)
     */
    async pullBlackStatus(targetId) {
        // "targetId": "21004544"
        const res = await require("../ServerCmd").MyCmd_pullBlackStatus({
            targetId,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        //0-自己 5-无被拉黑或拉黑 6-拉黑 7-被拉黑 8-互相拉黑
        return res.data;
    },

    /**
     * 拉黑,返回最新拉黑状态
     */
    async pullBlackStatus(targetId, action) {
        // "targetId": "21004544","action": true
        const res = await require("../ServerCmd").MyCmd_pullBlack({
            targetId,
            action,// 操作类型：true-拉黑 false-解除拉黑
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        //0-自己 5-无被拉黑或拉黑 6-拉黑 7-被拉黑 8-互相拉黑
        return res.data;
    },

    /**
     * 举报个人
     */
    async reportUser(illegalId, entrance, reason) {
        // "illegalId": "21004544","entrance": 1,"reason": 2
        const res = await require("../ServerCmd").MyCmd_reportUser({
            illegalId,
            entrance,// 举报入口，1-个人主页，2-个人签名卡片，3-个人动态，4-聊天页面 5-群举报
            reason,//// 举报理由，1-政治敏感内容，2-色情暴力违规，3-诈骗垃圾消息，4-攻击他人恶意挑衅
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        return true;
    },

    /**
     * 关注好友
     */
    async addLover(friendId, flag) {
        // "friendId": "21004544","flag": true
        const res = await require("../ServerCmd").MyCmd_addLover({
            friendId,
            flag,//true关注,false取消关注
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        if (RoomInfoCache.createUserInfo && friendId == RoomInfoCache.createUserInfo.userId) {
            RoomInfoCache.createUserInfo.friendStatus = flag ? 2 : 4;
            ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_MAIN_MIC, null);
        }

        ModelEvent.dispatchEntity(null, EVT_UPDATE_RELATIONSHIP, null);
        return true;
    },

    /**
     * 获取用户收到的礼物
     */
    async getReceiveGifts(userId) {
        // "userId": "17529980","type": 1
        const res = await require("../ServerCmd").BagCmd_getReceiveGifts({
            userId,
            type: 1,
        });
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
                if (element.giftid == item.giftId) {
                    item.logoTime = element.alterdatetime.replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '');
                }
            }
        });

        return res.data.list;
    },

    /**
     * 获取用户收到的礼物(查找礼物名)
     */
    async getReceiveGiftsByChange(userId) {
        let data = await Promise.all([UserInfoModel.getReceiveGifts(userId), UserInfoModel.getGiftListTableData()]);

        let Gifts = data[1];
        let giftList = data[0];

        giftList.forEach(element => {
            element.key = element.giftId;
            Gifts.forEach(gift => {
                if (element.giftId == gift.giftid) {
                    element.giftname = gift.giftname;
                    element.logoTime = gift.alterdatetime.replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '');
                }
            })
        });

        giftList.sort((a, b) => b.price - a.price)
        return giftList;
    },

    /**
     * 获取用户靓号
     */
    async getGoodId(userId) {
        const list = await require("../staticdata/StaticDataModel").getCuteNumberByUserIds([userId]);

        if (!list) {
            return null;
        }

        return list[userId];
    },


    /**
     * 是否关注
     */
    isAddLover(friendStatus) {
        return friendStatus == 0 || friendStatus == 1 || friendStatus == 2
    },


    /**
     * 获取vip配置列表
     */
    async getVipAuthentication() {
        //userId -> "keys":["userId","userName","startTime","endTime"]
        const map = await require('../staticdata/StaticDataModel').getVipAuthentication();
        if (!map) {
            require('../ErrorStatusModel').default.showTips(HResultStatus.Fail);
            return {};
        }
        return map;
    },


}

export default UserInfoModel;