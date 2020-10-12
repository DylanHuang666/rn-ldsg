

//更新静态数据版本号
// message UpdateDataVersion {
// 	required string tableName = 1;//表名
// 	required int32 version = 2;//版本号

import { EVT_LOGIC_VOICE_FRIEND_BANNER } from '../../hardcode/HLogicEvent';
import ModelEvent from '../../utils/ModelEvent';

// }
export default async function (evtName, data) {

    const HClientTables = require('../../hardcode/HClientTables').default;

    const vo = HClientTables[data.tableName];
    if (!vo) return;

    if (vo.version === data.version) return;

    vo.version = data.version;


    //通知外部刷新
    if (HClientTables.CS_VoiceFriendBanner == vo) {
        //通知更新
        ModelEvent.dispatchEntity(null, EVT_LOGIC_VOICE_FRIEND_BANNER, null);
    }
}