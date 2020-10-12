
'use strict';

import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD } from "../../hardcode/HLogicEvent";
import { EVT_UPDATE_NOTIFICATION } from "../../hardcode/HGlobalEvent";

export default async function (evName, data) {
    //有关动态的广播
    //2020-07-21 17:36:34.211 28221-12078/com.xstudio.lizi W/ReactNativeJS: '有关动态的广播', {}
    // console.warn("有关动态的广播", data)
    ModelEvent.dispatchEntity(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, data);
    ModelEvent.dispatchEntity(null, EVT_UPDATE_NOTIFICATION, data);
}