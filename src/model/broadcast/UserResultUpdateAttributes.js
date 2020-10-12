
//todo：后期优化

import ModelEvent from "../../utils/ModelEvent"
import { EVT_UPDATE_WALLET } from "../../hardcode/HLogicEvent"
import UserInfoCache from '../../cache/UserInfoCache';


//更新基础属性数据
// message UpdateAttributes {
// 	repeated int32 attrIds = 1;//属性ID列表
// 	repeated int64 attrValues = 2;//属性值列表
// }

const GoldShell = 103;//更新金币
const CharmLevel = 107;//更新魅力等级
const ContributeLevel = 109;//更新财富等级

export default async function (evName, data) {


    // console.log('userResultupdateattribues==', data)


    data.attrIds.forEach((element, index) => {

        switch (element) {
            case GoldShell:
                ModelEvent.dispatchEntity(null, EVT_UPDATE_WALLET, data.attrValues[index])
                break
            case CharmLevel:
                UserInfoCache.setCharmLv(data.attrValues[index])
                break;
            case ContributeLevel:
                UserInfoCache.setContributeLv(data.attrValues[index])
                break;
        }
    });

}
