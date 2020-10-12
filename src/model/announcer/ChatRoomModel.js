/**
 * 陪聊聊天室
 */

'use strict';

import RoomInfoCache from "../../cache/RoomInfoCache";
import UserInfoCache from "../../cache/UserInfoCache";
import HResultStatus from "../../hardcode/HResultStatus";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_PHONE_STOP } from "../../hardcode/HLogicEvent";



/**
 * 获得对方的MicInfo
 * @returns {MicInfo}
 */
export const getPeerMicInfo = () => {
    const roomData = RoomInfoCache.roomData;
    if (!roomData) return null;

    if (!roomData.infos) return null;

    for (const micInfo of roomData.infos) {
        if (!micInfo) continue;

        if (!micInfo.base) continue;

        if (micInfo.base.userId == UserInfoCache.userId) continue;

        return micInfo;
    }

    return null;
}

/**
 * // 检查陪聊房间状态，返回CommonResult.Co 1:正常开启 0:房间已关闭或销毁
message chkChatRoom {
	required string roomId = 1;// 陪聊房间Id
}
 */
export async function chkChatRoom() {
    const result = await require('../ServerCmd').SkillChatCmd_chkChatRoom({
        roomId: RoomInfoCache.roomId,
    })
    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state)
        return
    }

    /**
     * //单个整形数据
message IntResult {
	required int32 data = 1;
}
     */
    return result.data.data

}

let checkChatRoomTimer;

export async function startCheckChatRoomTimer() {
    if (checkChatRoomTimer) {
        return;
    }

    checkChatRoomTimer = setInterval(checkChatRoom, 5000)
}

function stopCheckChatRoomTimer() {
    if (checkChatRoomTimer) {
        clearInterval(checkChatRoomTimer);
        checkChatRoomTimer = null;
    }

}


async function checkChatRoom() {
    if (!RoomInfoCache.is1V1Calling) {
        stopCheckChatRoomTimer()
        return
    }

    const result = await chkChatRoom()
    //1:正常开启 0:房间已关闭或销毁

    if (result === 0) {
        leaveChatRoom()
    }
}

export async function leaveChatRoom(data) {
    stopCheckChatRoomTimer();

    RoomInfoCache.set1V1Calling(false);


    require('../SuspendModel').updateInfo();
    require("../../router//ScreensHelper").default.closeAllStackTopOverlays()
    ModelEvent.dispatchEntity(null, EVT_LOGIC_PHONE_STOP, null);

    //离开房间
    //data == null 则为处理断线重连不通知服务器退房，有数据则为广播通知主动退房，须通知服务器
    require('../../model/room/RoomModel').default.leave(!!data);

    if (!data) {
        return
    }
    setTimeout(() => {
        if (!require("../../router/level4_router").isChatRoomStopDialogExist()) {

            if (data.anchorId == UserInfoCache.userId) {
                require("../../router/level4_router").showChatRoomIncomeDialog(data);

                require("../../model/chat/ChatModel").sendC2CMessage(data.callerId, [[4, "announcerFinish#" + JSON.stringify(data)]]);
            } else {
                require("../../router/level4_router").showChatEvaluationDialog(data.anchorId, data);
            }
        }
    }, 500)
}