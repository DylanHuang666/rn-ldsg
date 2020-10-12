/**
 * 首页数据
 */
'use strict';


import HResultStatus from '../../hardcode/HResultStatus';

let sm_funRoomList = {};
let sm_bLoadFunRoomList = {};

/**
 * 用于数据去重
 * @param {RoomInfo[]} a 
 * @param {String} roomId 
 */
function indexOfFunRoomList(a, roomId) {
    for (let i = a.length - 1; i >= 0; --i) {
        const vo = a[i];
        if (vo.roomId == roomId) {
            return i;
        }
    }
    return -1;
}

const HomePageModel = {
    getBannerList: () => {
        return require("../../model/staticdata/StaticDataModel").bannerList();
    },
    // SquareBanner 
    getSquareBannerList: () => {
        return require("../../model/staticdata/StaticDataModel").getSquareBanner();
    },

    getRoomTypeList: async () => {
        const roomType = [{ type: "推荐", id: 0, },];
        const res = await require("../../model/staticdata/StaticDataModel").getRoomType();
        if (!res) {
            return roomType;
        }
        return roomType.concat(res);
    },

    /**
     * 获取跑道
     */
    getHorseLamp: async () => {
        const res = await require('../ServerCmd').SmashEggCmd_getSmashList();

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }

        if (!res.data || !res.data.list) {
            return [];
        }

        for (let i in res.data.list) {
            res.data.list[i].key = i;
        }

        return res.data.list;
    },

    /**
     * 获得娱乐房间列表
     */
    getFunRoomList: async (type, bRefresh) => {
        if (sm_bLoadFunRoomList[type]) {
            return sm_funRoomList[type] || [];
        }

        sm_bLoadFunRoomList[type] = true;

        if (!sm_funRoomList[type]) {
            bRefresh = true;
        }
        const index = bRefresh ? 0 : sm_funRoomList[type].length;
        //获得娱乐房间的列表 返回：RoomResult.RoomList
        // message getFunRoomList {
        // 	required string userId = 1; //玩家id
        //     optional int32 type = 2; //类型:0推荐;-1之前的搜索;-2新秀
        //     optional int32 index = 3; //分页下标
        // }
        let res = await require('../ServerCmd').CenterCmd_getFunRoomList({
            userId: require('../../cache/UserInfoCache').default.userId, //玩家id
            type, //类型:0推荐;-1之前的搜索;-2新秀 或者传入
            index,//分页下标
        });

        if (!sm_funRoomList[type] || bRefresh) {
            sm_funRoomList[type] = [];
        }

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            sm_bLoadFunRoomList[type] = false;
            return sm_funRoomList[type];
        }

        if (!res.data || !res.data.list) {
            sm_bLoadFunRoomList[type] = false;
            return sm_funRoomList[type];
        }

        //房间列表
        // message RoomList {
        // 	repeated RoomInfo list = 1;
        // }
        //房间信息
        // message RoomInfo {
        // 	required string roomId = 1;//房间id
        // 	optional string roomName = 2;//房间名字
        // 	optional string createId = 3;//房主ID(厅的话是创厅会长id)
        // 	optional int32 onlineNum = 4;//在线人数
        // 	optional UserResult.UserBase base = 5;//主播用户基本信息(厅的话是当前大头位主播信息)
        // 	optional bool password = 6;//是否上锁
        // 	optional int32 roomType = 7;//房间类型
        // 	optional int32 lableId = 8;//房间标签Id
        // 	optional int32 logoTime = 9;//房间修改logo的时间 0为没修改过
        // 	optional UserResult.UserBase micUserBase = 10;//(男女)用户视觉不同的(异性)麦上嘉宾信息
        // 	optional bool homoMicUser = 11;//同性麦位上是否有人(true:有 false:没有)
        // 	optional int32 favourType = 12;//收藏类型(1:我关注的主播 2:我收藏的厅)
        // }
        for (let vo of res.data.list) {
            if (indexOfFunRoomList(sm_funRoomList[type], vo.roomId) >= 0) {
                continue;
            }
            vo.key = vo.roomId;
            sm_funRoomList[type].push(vo);
        }

        sm_bLoadFunRoomList[type] = false;
        return sm_funRoomList[type];
    },

    /**
     * 获取GiftList表数据
     * 
     */
    getGiftListTableData() {
        //"keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]
        return require("../staticdata/StaticDataModel").getGiftListTableData();
    },
};

export default HomePageModel;
