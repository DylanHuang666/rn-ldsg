/**
 * 直播间点击公屏用户昵称逻辑
 */
'use strict';

import { user } from "../../hardcode/skin_imgs/login";
import UserInfoCache from "../../cache/UserInfoCache";
import RoomInfoCache from "../../cache/RoomInfoCache";
import { EUserDataType } from "../../hardcode/EUserDataType";

export const onClickUser = async (userId, nickName = '') => {
    if (!RoomInfoCache.roomData) {
        //只能在直播间操作
        return
    }
    //如果点击的是自己，进入自己的个人资料页
    if (userId == UserInfoCache.userId) {
        require("../../router/level2_router").showUserInfoView(userId);
        return
    }

    //判断是否有直播间操作权限
    if (RoomInfoCache.haveRoomPermiss) {
        //判断点击的用户是否在当前直播间
        const res = await require('../ServerCmd').MyCmd_getPersonPage({
            userId
        })

        const userInfo = res.data && res.data.info;
        if (userInfo && userInfo.roomId && userInfo.roomId == RoomInfoCache.roomId) {
            //用户在当前房间,非机器人
            //弹出功能菜单（报上麦等...)
            require("../../router/level3_router").showUnderOpMenuView(userId);
            return
        }
    }

    //进入资料卡片
    require('../../router/level3_router').showUserCardView(userId)

}