'use strict';

import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_PHONE_CANCEL, EVT_LOGIC_PHONE_START, EVT_LOGIC_PHONE_UPDATE, EVT_LOGIC_PHONE_STOP } from "../../hardcode/HLogicEvent";
import UserInfoCache from "../../cache/UserInfoCache";
import RoomInfoCache from "../../cache/RoomInfoCache";
import { duration2Time } from "../../utils/CDTick";

/**
 * //陪聊广播
//status 0:发起呼叫 1:主播接听 2:主播拒绝 3:用户取消呼叫 4:呼叫超时
//       5:一方退出陪聊 6:用户时长到(余额不足)退出陪聊 9:陪聊房内每分钟信息广播
message SkillChatBroadcast {
	required int32 status = 1;//状态	
	optional string callerId = 2;//呼叫人Id
	optional string anchorId = 3;//主播Id
	optional UserResult.UserBase caller = 4;//呼叫人信息
	optional UserResult.UserBase anchor = 5;//主播信息	
	optional string roomId = 6;//陪聊房Id
	optional int32 chatTime = 7;//陪聊时长(秒)
	optional int32 totalMoney = 8;//主播分成前收入(分)
	optional int32 anchorMoney = 9;//主播分成后收入(分)
	optional int32 ltMinute = 10;//呼叫人余额不足x分钟
}
 */

export default function (evtName, data) {

	switch (data.status) {
		case 0:
			RoomInfoCache.set1V1Calling(true);

			require("../../router//ScreensHelper").default.closeAllStackTopOverlays()
			if (require("../../router/level2_router").isLiveRoomViewShow()) {
				require("../../router/level4_router").showPhoneDialog(data.caller.userId, data);
			} else {
				require("../../router/level3_router").showPhoneView(data.caller.userId, false, data);
			}

			require('../SuspendModel').updateInfo();

			break
		case 1:
			RoomInfoCache.set1V1Calling(true);
			RoomInfoCache.set1V1CallingUserId(data.callerId == UserInfoCache.userId ? data.anchorId : data.callerId);

			require("../../model/room/RoomModel").getRoomDataAndShowView(data.roomId)
			require('../SuspendModel').updateInfo();
			ModelEvent.dispatchEntity(null, EVT_LOGIC_PHONE_START, data);
			break
		case 2:
		case 4:
			if (data.anchorId == UserInfoCache.userId) {
				data.message = `抱歉，主播当前正忙，可以试试给 TA留言哦~`;
				require("../../model/chat/ChatModel").sendC2CMessage(data.callerId == UserInfoCache.userId ? data.anchorId : data.callerId, [[4, "announcerFinish#" + JSON.stringify(data)]]);
			}
		case 3:
			RoomInfoCache.set1V1Calling(false);

			require('../SuspendModel').updateInfo();

			ModelEvent.dispatchEntity(null, EVT_LOGIC_PHONE_CANCEL, data);
			break
		case 5:
		case 6:
			require("../../model/announcer/ChatRoomModel").leaveChatRoom(data)
			break
		case 9:
			//刷新数据
			if (RoomInfoCache.roomData && RoomInfoCache.roomData.chatRoomData) {
				RoomInfoCache.roomData.chatRoomData = data;
			}
			ModelEvent.dispatchEntity(null, EVT_LOGIC_PHONE_UPDATE, data);
			break
		default:
			console.warn("陪聊广播", data)
	}

	ModelEvent.dispatchEntity(null, evtName, data);
}