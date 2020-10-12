'use strict';

import {
    SOCK_BRO_CommonResultCommonBroadcast,
    SOCK_BRO_RoomResultRoomActionBroadcast,
    SOCK_BRO_RoomResultEnterRoomBroadcast,
    SOCK_BRO_RoomResultLeaveRoomBroadcast,
    SOCK_BRO_BroadcastResultRefreshRoomBanner,
    SOCK_BRO_LiveResultLiveRoomSendGiftsBroadcast,
    SOCK_BRO_RoomResultRecreationBroadcast,
    SOCK_BRO_BagResultSmashEggResultBroadcast,
    SOCK_BRO_RechargeResultOrderPayTimeOutBroadcast,
    SOCK_BRO_BroadcastResultEnterImGroupBroadcast,
    SOCK_BRO_UserResultUpdateAttributes,
    SOCK_BRO_BroadcastResultUpdateDataVersion,
    SOCK_BRO_BroadcastResultPublicChatSendMessageBroadcast,
    SOCK_BRO_BroadcastResultSkillChatBroadcast,
    SOCK_BRO_BroadcastMomentBroadCast,
    SOCK_BRO_RoomResultKoiFishBroadcast,
} from "../../hardcode/HSocketBroadcastEvent";
import CommonResultCommonBroadcast from "./CommonResultCommonBroadcast";
import RoomResultRoomActionBroadcast from "./RoomResultRoomActionBroadcast";
import RoomResultEnterRoomBroadcast from "./RoomResultEnterRoomBroadcast";
import RoomResultLeaveRoomBroadcast from "./RoomResultLeaveRoomBroadcast";
import BroadcastResultRefreshRoomBanner from "./BroadcastResultRefreshRoomBanner";
import LiveRoomSendGiftsBroadcast from "./LiveResultLiveRoomSendGiftsBroadcast";
import RoomResultRecreationBroadcast from "./RoomResultRecreationBroadcast";
import BagResultSmashEggResultBroadcast from "./BagResultSmashEggResultBroadcast";
import RechargeResultOrderPayTimeOutBroadcast from "./RechargeResultOrderPayTimeOutBroadcast";
import BroadcastResultEnterImGroupBroadcast from "./BroadcastResultEnterImGroupBroadcast";
import UserResultUpdateAttributes from "./UserResultUpdateAttributes";
import BroadcastResultUpdateDataVersion from "./BroadcastResultUpdateDataVersion";
import BroadcastResultPublicChatSendMessage from "./BroadcastResultPublicChatSendMessage";
import BroadcastResultSkillChatBroadcast from "./BroadcastResultSkillChatBroadcast";
import BroadcastMomentBroadCast from "./BroadcastMomentBroadCast";
import RoomResultKoiFishBroadcast from "./RoomResultKoiFishBroadcast";

export default {

    [SOCK_BRO_CommonResultCommonBroadcast]: CommonResultCommonBroadcast,

    [SOCK_BRO_BroadcastResultRefreshRoomBanner]: BroadcastResultRefreshRoomBanner,

    [SOCK_BRO_RoomResultRoomActionBroadcast]: RoomResultRoomActionBroadcast,

    [SOCK_BRO_RoomResultEnterRoomBroadcast]: RoomResultEnterRoomBroadcast,

    [SOCK_BRO_RoomResultLeaveRoomBroadcast]: RoomResultLeaveRoomBroadcast,

    [SOCK_BRO_LiveResultLiveRoomSendGiftsBroadcast]: LiveRoomSendGiftsBroadcast,

    [SOCK_BRO_RoomResultRecreationBroadcast]: RoomResultRecreationBroadcast,

    [SOCK_BRO_BagResultSmashEggResultBroadcast]: BagResultSmashEggResultBroadcast,

    [SOCK_BRO_RechargeResultOrderPayTimeOutBroadcast]: RechargeResultOrderPayTimeOutBroadcast,

    [SOCK_BRO_BroadcastResultEnterImGroupBroadcast]: BroadcastResultEnterImGroupBroadcast,

    [SOCK_BRO_UserResultUpdateAttributes]: UserResultUpdateAttributes,

    [SOCK_BRO_BroadcastResultUpdateDataVersion]: BroadcastResultUpdateDataVersion,

    [SOCK_BRO_BroadcastResultPublicChatSendMessageBroadcast]: BroadcastResultPublicChatSendMessage,

    [SOCK_BRO_BroadcastResultSkillChatBroadcast]: BroadcastResultSkillChatBroadcast,

    [SOCK_BRO_BroadcastMomentBroadCast]: BroadcastMomentBroadCast,

    [SOCK_BRO_RoomResultKoiFishBroadcast]: RoomResultKoiFishBroadcast,

};