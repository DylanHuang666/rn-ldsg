'use strict';

import ModelEvent from "../../utils/ModelEvent"
import { EVT_LOGIC_UPDATE_ROOM_ONLINE } from "../../hardcode/HLogicEvent"
import RoomInfoCache from "../../cache/RoomInfoCache"
import UserInfoCache from "../../cache/UserInfoCache";


//用户离开房间通知
// message LeaveRoomBroadcast {
// 	required string roomId = 1;//房间ID
// 	required int32 mainType = 3;//房间类型
// 	required string userId = 4;//用户ID
// 	required int32 onlineNum = 5;//在线成员数
// }
export default async function (evtName, data) {

    if (data.userId == UserInfoCache.userId) {
        if (RoomInfoCache.roomId == data.roomId) {
            //通知退出房间
            require("../room/RoomModel").notifyLeaveRoom();

        }


        //有可能是被顶号，后期宾治找后端优化
        require('../../model/main/MinePageModel').default.getPersonPage();
        return
    }

    if (RoomInfoCache.roomId != data.roomId) {
        return
    }

    const mainMicUserInfo = RoomInfoCache.mainMicUserInfo;


    if (mainMicUserInfo && data.userId == mainMicUserInfo.userId) {

        //主麦有变化
        await require('../../model/room/RoomModel').default.getRoomData();
        await require('../../model/room/RoomModel').default.getOwnerData(RoomInfoCache.createUserInfo.userId, RoomInfoCache.roomData.roomOwnerId)
        // await require('../../model/room/RoomModel').default.getRoomMicData(0);
    }

    //更新房间人数
    const onlineNum = data.onlineNum

    //通知更新房间人数
    ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_ROOM_ONLINE, data.onlineNum)
}