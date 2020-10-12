/**
 * 悬浮球逻辑
 */

'use strict';

import { NativeModules } from "react-native";
import RoomInfoCache from "../cache/RoomInfoCache";
import UserInfoCache from "../cache/UserInfoCache";
import Config from "../configs/Config";
import { ERoomMainType } from "../hardcode/ERoom";


export const updateInfo = () => {
    if (!NativeModules.Suspend) return;
    if (!UserInfoCache.userInfo) return;

    //1v1呼叫中
    if (RoomInfoCache.is1V1Calling) {
        NativeModules.Suspend.updateInfo(
            Config.getHeadUrl(UserInfoCache.userId, UserInfoCache.userInfo.logoTime, UserInfoCache.userInfo.thirdIconurl, 200),
            1
        );
        return;
    }

    if (!RoomInfoCache.isInRoom) {
        NativeModules.Suspend.updateInfo(
            Config.getHeadUrl(UserInfoCache.userId, UserInfoCache.userInfo.logoTime, UserInfoCache.userInfo.thirdIconurl, 200),
            0
        )
        return;
    }

    //1v1
    if (ERoomMainType.CHAT_ROOM == RoomInfoCache.roomData.roomType) {
        const micInfo = require('./announcer/ChatRoomModel').getPeerMicInfo();
        if (micInfo) {
            NativeModules.Suspend.updateInfo(
                Config.getHeadUrl(micInfo.userId, micInfo.base.logoTime, micInfo.base.thirdIconurl, 200),
                2
            );
            return;
        }
    }

    //其他房间
    NativeModules.Suspend.updateInfo(
        Config.getHeadUrl(UserInfoCache.userId, UserInfoCache.userInfo.logoTime, UserInfoCache.userInfo.thirdIconurl, 200),
        1
    );
}