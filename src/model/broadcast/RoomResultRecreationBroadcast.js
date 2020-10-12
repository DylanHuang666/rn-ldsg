

//娱乐玩法/魔法表情广播通知
// message RecreationBroadcast {
//     required string roomId = 1;//房间id
//     required string userId = 2;//触发的用户id
//     required string recreationId = 3;//配置id
//     repeated int32 results = 4;//结果

import ModelEvent from "../../utils/ModelEvent";

// }
export default async function (evtName, data) {

    //通过recreationId查找大表情data

    // "keys":["id","name","playType","num","range","msg","flashName","flashVersion","isShowScreen"]
    const hdata = await require('../../model/staticdata/StaticDataModel').getRecreationById(data.recreationId);

    if (0 == hdata.playType) {
        //数据不合法
        return;
    }

    data.hdata = hdata;

    //分发通知界面
    ModelEvent.dispatchEntity(null, evtName, data)

}