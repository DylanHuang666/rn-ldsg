'use strict';

import ModelEvent from "../../utils/ModelEvent";

// message CommonBroadcast {
// 	required int32 type = 1;//广播类型:1头橡框,2活动跑道
// 	repeated string params = 2;//参数列表  类型1:[头象模框ID]
// }

export default function(evtName, data) {
    ModelEvent.dispatchEntity(null, evtName, data);
}
