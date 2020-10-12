/**
 * 麦位逻辑
 */
'use strict';

import RoomInfoCache from "../../cache/RoomInfoCache";
import UserInfoCache from "../../cache/UserInfoCache";

/**
 * 点击主麦位
 */
export const pressMainSeat = (left,top) => {
    if (require("./RoomModel").isSelfOnMainSeat()) {
        require("../../router/level3_router").showSeatOpMenuView(true, null);
        return;
    }

    require("../../router/level3_router").showUserCardView(RoomInfoCache.mainMicUserInfo.userId,left,top);

    //打开礼物面板
    // require("../../router/level3_router").showRoomGiftPanelView(RoomInfoCache.mainMicUserInfo.userId);
}

/**
 * 点击其他麦位
 * @param {MicInfo} micInfo 
 */
export const pressOtherSeat = (micInfo,left,top) => {

    //打开菜单
    if (RoomInfoCache.haveRoomPermiss || micInfo.base.userId == UserInfoCache.userId) {
        require("../../router/level3_router").showSeatOpMenuView(false, micInfo);
    } else {
        require('../../router/level3_router').showUserCardView(micInfo.base.userId,left,top)
    }
}