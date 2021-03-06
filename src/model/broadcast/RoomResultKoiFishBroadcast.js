'use strict';

import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_FULL_SERVICE_KOIFISH_BANNER } from "../../hardcode/HLogicEvent";


//锦鲤砸蛋活动结果广播
// message SmashEggActivityResultBroadcast {
// 	optional UserResult.UserBase smashUserBase = 1;// 砸蛋用户信息
// 	repeated ReceiveGiftInfo giftList = 2;//活动礼物列表,一般只有一个
// 	optional int32 broadcastType = 3;//播放类型:0公屏显示,1房间跑道,2全服跑道,3:全服公屏流水
// 	optional int32 action = 4;//砸蛋动作(0:自动砸,1:单砸,10:十砸,100:百砸,暂不用)
//     optional string eggType = 5; //蛋的类型(1:铁蛋 2:银蛋 3:金蛋) 
//     optional string roomId = 6; //砸蛋所在房间Id	
//     optional string roomName = 7; //砸蛋所在房间名称
//     optional int32 activityType = 8; //活动类型,目前只有锦鲤活动(1:锦鲤活动)
//     optional int32 activityMode = 9; //活动模式(锦鲤活动 1:抽一送一,2:返还固定金币 3:返还砸蛋总消耗比例金币)
//     optional int32 activityValue = 10; //活动获得金币值(锦鲤活动:抽一送一就是礼物的价值,其他的就是返还金币数量)

// }

export default async function (evName, data) {
    // console.log('活动礼物广播', data)
    //数据校验
    if (!data.giftList || data.giftList.lenth == 0) {
        return;
    }
    const list = [];
    const listActivity = await require('../staticdata/StaticDataModel').getEggDisplayConfig()
    const tracktext = listActivity[0]['tracktext']
    const trackstylemedia = listActivity[0]['trackstylemedia']
    const bubbletext = listActivity[0]['bubbletext']
    const bubblestylemedia = listActivity[0]['bubblestylemedia']

    for (const giftVo of data.giftList) {
        //查出礼物数据存入data
        const giftData = await require('../staticdata/StaticDataModel').getGiftById(giftVo.giftId);


        giftVo.alterdatetime = giftData.alterdatetime.toDateTimeTick()
        list.push({
            data,
            giftVo,
            giftData,
            tracktext,
            trackstylemedia,
            bubbletext,
            bubblestylemedia
        });


    }
    switch (data.broadcastType) {
        case 0:
            //普通公屏
            //xxx在砸蛋中获得[名称]([价格])
            // require("../room/RoomPublicScreenModel").smashEgg(false, list);
            break;
        case 1:
            //房间跑道，只在直播间显示
            // ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_ZADAN_BANNER, list);
            break;
        case 2:
            //全服跑道，app内都显示
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_FULL_SERVICE_KOIFISH_BANNER, list);
            break;
        case 3:
            //全服公屏流水
            //【全服】xxx在砸蛋中获得[名称]([价格])
            require("../room/RoomPublicScreenModel").smashActivityEgg(true, list);
            break;
    }
    // ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_FULL_SERVICE_KOIFISH_BANNER, list);


}