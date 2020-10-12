'use strict';

import RoomInfoCache from "../../cache/RoomInfoCache";
import { EVT_LOGIC_CAR_ENTER, EVT_LOGIC_UPDATE_ROOM_ONLINE } from "../../hardcode/HLogicEvent";
import ModelEvent from "../../utils/ModelEvent";
import UserInfoCache from "../../cache/UserInfoCache";


function doLogic(data) {
    if (data.jobId != 5) {
        //TODO:发送公屏消息
        //xxx进入房间
        require("../room/RoomPublicScreenModel").enterRoom(data);

        //座驾处理
        if (data.carId) {
            require('../staticdata/StaticDataModel').getCarByCarId(data.carId)
                .then(hcar => {
                    if (!hcar) return;

                    data.hcar = hcar;
                    ModelEvent.dispatchEntity(null, EVT_LOGIC_CAR_ENTER, data);
                })
        }
    } else {
        //机器人不显示公屏
    }
}

/**
 * 用户进入房间通知
 * 
 */

//用户进入房间通知
// message EnterRoomBroadcast {
// 	required string roomId = 1;//房间ID
// 	required int32 mainType = 2;//房间类型
// 	required UserResult.UserBase base = 3;//用户基本信息
// 	optional int32 onlineNum = 4;//在线成员数	
// 	required int32 index = 5;//位置
// 	optional string carId = 6;//坐驾ID
// 	optional int32 charmLv = 7;//魅力等级
// 	optional int32 contributeLv = 8;// 财富等级	
// 	optional bool openMirror = 9;//是否开启镜像
// 	optional int32 identity = 10;// 1-普通用户，2-vip，3-富豪
// 	optional int32 source = 11;//来源 1：寻友 
// 	optional int64 loginTime = 12;//登陆房间时间
// 	optional bool showCar = 13;// 是否播放座驾动画
// 	optional int32 jobId = 14;//职位
// 	optional bool isGuardian = 15;// 是否是守护团成员，true是，false不是
// 	optional int32 guardianLv = 17;// 用户在守护团的等级
// 	optional int32 cardType = 18;//用户贵宾卡类型	
// }
export default async function (evName, data) {


    if (!RoomInfoCache.roomData) {
        if (data && data.base && data.base.userId && data.base.userId == UserInfoCache.userId) {
            setTimeout(() => {
                doLogic(data);
            }, 500);
        }
        return
    }

    if (RoomInfoCache.mainMicUserInfo && data.base.userId == RoomInfoCache.mainMicUserInfo.userId) {
        await require('../../model/room/RoomModel').default.getRoomData();
        await require('../../model/room/RoomModel').default.getOwnerData(RoomInfoCache.createUserInfo.userId, RoomInfoCache.roomData.roomOwnerId)
        // await require('../../model/room/RoomModel').default.getRoomMicData(0);
    }


    doLogic(data);


    //通知更新房间人数
    ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_ROOM_ONLINE, data.onlineNum)
}