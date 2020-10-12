
'use strict';

import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_FULL_SERVICE_ZADAN_BANNER, EVT_LOGIC_UPDATE_ZADAN_BANNER } from "../../hardcode/HLogicEvent";
import { gift } from "../room/RoomPublicScreenModel";

//砸蛋结果广播
// message SmashEggResultBroadcast {
// 	optional UserResult.UserBase smashUserBase = 1;// 砸蛋用户信息
// 	repeated ReceiveGiftInfo giftList = 2;//中奖礼物列表
// 	optional int32 broadcastType = 3;//播放类型:0公屏显示,1房间跑道,2全服跑道,3:全服公屏流水
// 	optional int32 action = 4;//砸蛋动作(0:自动砸,1:单砸,10:十砸,100:百砸)	
//     optional string eggType = 5; //蛋的类型(1:铁蛋 2:银蛋 3:金蛋) 
//     optional string roomId = 6; //砸蛋所在房间Id	
//     optional string roomName = 7; //砸蛋所在房间名称
// }

// 礼物信息
// message ReceiveGiftInfo {
// 	required string giftId = 1;//礼物ID
// 	required int64 num = 2;//数量
// 	required int32 price = 3;//价格(用户排序用)
// 	optional string name = 4;//名称
// }

export default async function (evName, data) {

    //数据校验
    if (!data.giftList || data.giftList.lenth == 0) {
        return;
    }

    const list = [];
    for (const giftVo of data.giftList) {
        //查出礼物数据存入data
        const giftData = await require('../staticdata/StaticDataModel').getGiftById(giftVo.giftId);

        giftVo.alterdatetime = giftData.alterdatetime.toDateTimeTick()
        list.push({
            data,
            giftVo,
            giftData,
        });
    }

    switch (data.broadcastType) {
        case 0:
            //普通公屏
            //xxx在砸蛋中获得[名称]([价格])
            require("../room/RoomPublicScreenModel").smashEgg(false, list);
            break;
        case 1:
            //房间跑道，只在直播间显示
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_ZADAN_BANNER, list);
            break;
        case 2:
            //全服跑道，app内都显示
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_ZADAN_BANNER, list);
            break;
        case 3:
            //全服公屏流水
            //【全服】xxx在砸蛋中获得[名称]([价格])
            require("../room/RoomPublicScreenModel").smashEgg(true, list);
            break;
    }


}