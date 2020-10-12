/**
 * 商城业务逻辑
 */

'use strict';

import { getCarData, getUserHeadData, setCarData, setUserHeadData } from '../../cache/MallCache';
import UserInfoCache from '../../cache/UserInfoCache';
import Config from '../../configs/Config';
import HResultStatus from '../../hardcode/HResultStatus';
import { EVT_UI_MALL_ENTER_EFFECT, EVT_UI_MALL_HEAD_FRAME_CHANGE } from '../../hardcode/HUIEvent';
import ModelEvent from '../../utils/ModelEvent';

/**
 * 获得商城头像框列表，当前使用的头像框
 */
export const getMyHeadFrameData = async () => {
    //获取物品列表:返回BagResult.GoodsList
    // message getGoodsList {
    // 	required int32 type = 1;//物品类型0全部,1免费礼物,2包裹礼物,3座驾,4头像框,5对话框,7勋章
    // 	required string targetUserId = 2;// 目标用户id，传空查自己
    // }
    const result = await require('../ServerCmd').BagCmd_getGoodsList({
        type: 4,
        targetUserId: '',
    });

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state);
        return null;
    }

    //"keys":["animationname","avatarboxid","createtime","duration","endtime","gifttype","h5url","id","name","onedayprice","pictype","price","sevendayprice","starttime","updatetime","valid","weight"]
    const avatarBoxList = await require('../staticdata/StaticDataModel').getAvatarBoxList();
    if (!avatarBoxList) {
        require('../ErrorStatusModel').default.showTips(HResultStatus.Fail);
        return null;
    }

    //玩家当前的物品列表(目前只有系统赠送,后期开通购买)
    // message GoodsList {
    // 	repeated GoodsInfo goods = 1;
    // 	optional string useCarId = 2;//使用中的坐驾ID
    // 	optional string useHeadFrameId = 3;//使用中的头像框ID
    // 	optional string useDialogFrameId = 4;//使用中的对话框ID
    // 	repeated string useMedals = 5;//使用中的勋章
    // }

    // message GoodsInfo {
    // 	optional string goodsId = 1;//物品ID
    // 	optional int32 num = 2;//物品数量
    // 	optional int32 remainTime = 3;//有效剩余时间S(有时效物品专用字段,不存在时代表座驾未使用)
    // 	optional int32 updateTime = 4;//创建或续期时间
    // 	optional bool isNew = 5;//是否新物品
    // }
    const list = [];
    let equiped = null;

    for (const hdata of avatarBoxList) {
        let vo = null;
        if (result.data && result.data.goods) {
            for (const goodsInfo of result.data.goods) {
                if (goodsInfo.goodsId == hdata.avatarboxid) {
                    if (goodsInfo.num > 0 && goodsInfo.remainTime > 0) {
                        vo = goodsInfo;
                    }
                    break;
                }
            }
        }

        const entity = {
            key: hdata.avatarboxid,
            hdata,
            goodsInfo: vo,
        };

        if (hdata.avatarboxid == result.data.useHeadFrameId) {
            equiped = entity;
        }

        list.push(entity)
    }

    //刷新缓存
    if (UserInfoCache.userInfo) {
        UserInfoCache.userInfo.headFrameId = result.data.useHeadFrameId;
    }

    const ret = {
        list,
        selectedInfo: equiped,
        equiped,
    };
    setUserHeadData(ret);

    ModelEvent.dispatchEntity(null, EVT_UI_MALL_HEAD_FRAME_CHANGE, null);
    return ret;
}

/**
 * 获得头像框价格选择列表
 * @param {AvatarBoxList} hdata 
 *  //"keys":["animationname","avatarboxid","createtime","duration","endtime","gifttype","h5url","id","name","onedayprice","pictype","price","sevendayprice","starttime","updatetime","valid","weight"]
 * 
 */
export const getHeadFramePriceChooseList = (hdata) => {
    const ret = [];
    if (hdata.onedayprice > 0) {
        ret.push({
            money: hdata.onedayprice,
            day: 1,
            timeType: 0,
        });
    }
    if (hdata.sevendayprice > 0) {
        ret.push({
            money: hdata.sevendayprice,
            day: 7,
            timeType: 3,
        });
    }

    ret.push({
        money: hdata.price,
        day: 30,
        timeType: 1,
    });

    return ret;
}

/**
 * 购买头像框
 * @param {String} frameId 
 * @param {int} timeType 
 */
export const buyHeadFrame = async (frameId, timeType) => {
    //购买头像框
    // message buyHeadFrame {
    // 	required string frameId = 1;//购买的头像框ID
    // 	required int32 timeType = 2;//购买时间类型(0:1天 1:1个月，2:1年 3:7天)
    // }
    const result = await require('../ServerCmd').BagCmd_buyHeadFrame({
        frameId,
        timeType,
    });

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state);
        return false;
    }

    return true;
}

/**
 * 使用头象框
 * @param {String} goodsId 
 * @param {bool} flag 
 */
async function _useHeardFrame(goodsId, flag) {
    //使用头象框
    // message useHeardFrame {
    // 	required string goodsId = 1;//头象框ID
    // 	required bool flag = 2;//true为使用，false为取消使用
    // }
    const result = await require('../ServerCmd').BagCmd_useHeardFrame({
        goodsId,
        flag,
    });

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state);
        return false;
    }

    //更新缓存
    if (UserInfoCache.userInfo) {
        UserInfoCache.userInfo.headFrameId = flag ? goodsId : null;
    }

    return true;
}

/**
 * 点击头像框处理逻辑
 * @param {Object} entity 
 *  {
 *  key,
 *  hdata,
 *  goodsInfo
 * }
 */
export const pressHeadFrame = (entity) => {
    const cache = getUserHeadData();
    if (!cache) return false;

    if (entity.goodsInfo) {
        if (cache.equiped == entity) {
            cache.equiped = null;
            _useHeardFrame(entity.goodsInfo.goodsId, false);
        } else {
            cache.equiped = entity;
            _useHeardFrame(entity.goodsInfo.goodsId, true);
        }
    }

    cache.selectedInfo = entity;

    //通知刷新界面
    ModelEvent.dispatchEntity(null, EVT_UI_MALL_HEAD_FRAME_CHANGE, null);
}



/**
 * 获得商城座驾列表，当前使用的座驾
 */
export const getMyEnterEffectData = async () => {
    //获取物品列表:返回BagResult.GoodsList
    // message getGoodsList {
    // 	required int32 type = 1;//物品类型0全部,1免费礼物,2包裹礼物,3座驾,4头像框,5对话框,7勋章
    // 	required string targetUserId = 2;// 目标用户id，传空查自己
    // }
    const result = await require('../ServerCmd').BagCmd_getGoodsList({
        type: 3,
        targetUserId: '',
    });

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state);
        return null;
    }

    //"keys":["alterdatetime","animationname","animationurl","biganimationname","biganimationurl","carid","carname","carpictureurl","carsummary","cartype","coinmonth","coinyear","endtime","exclusiveid","funlevel","gamecdkey","gameid","gifttype","h5url","id","indate","inserttime","mallurl","onedayprice","pictype","sequenceid","sevendayprice","starttime","valid"]
    const carList = await require('../staticdata/StaticDataModel').getCarList();
    if (!carList) {
        require('../ErrorStatusModel').default.showTips(HResultStatus.Fail);
        return null;
    }

    //玩家当前的物品列表(目前只有系统赠送,后期开通购买)
    // message GoodsList {
    // 	repeated GoodsInfo goods = 1;
    // 	optional string useCarId = 2;//使用中的坐驾ID
    // 	optional string useHeadFrameId = 3;//使用中的头像框ID
    // 	optional string useDialogFrameId = 4;//使用中的对话框ID
    // 	repeated string useMedals = 5;//使用中的勋章
    // }

    // message GoodsInfo {
    // 	optional string goodsId = 1;//物品ID
    // 	optional int32 num = 2;//物品数量
    // 	optional int32 remainTime = 3;//有效剩余时间S(有时效物品专用字段,不存在时代表座驾未使用)
    // 	optional int32 updateTime = 4;//创建或续期时间
    // 	optional bool isNew = 5;//是否新物品
    // }
    const list = [];
    let equiped = null;

    for (const hdata of carList) {
        let vo = null;
        if (result.data && result.data.goods) {
            for (const goodsInfo of result.data.goods) {
                if (goodsInfo.goodsId == hdata.carid) {
                    if (goodsInfo.num > 0 && goodsInfo.remainTime > 0) {
                        vo = goodsInfo;
                    }
                    break;
                }
            }
        }

        const entity = {
            key: hdata.carid,
            hdata,
            goodsInfo: vo,
        };

        if (hdata.carid == result.data.useCarId) {
            equiped = entity;
        }

        list.push(entity);
    }

    //刷新缓存
    if (UserInfoCache.userInfo) {
        UserInfoCache.userInfo.carId = result.data.useCarId;
    }

    const ret = {
        list,
        selectedInfo: equiped,
        equiped,
    };

    setCarData(ret);
    return ret;
}

/**
 * 获得进场特效价格选择列表
 * @param {CS_CarList} hdata 
 *  //"keys":["alterdatetime","animationname","animationurl","biganimationname","biganimationurl","carid","carname","carpictureurl","carsummary","cartype","coinmonth","coinyear","endtime","exclusiveid","funlevel","gamecdkey","gameid","gifttype","h5url","id","indate","inserttime","mallurl","onedayprice","pictype","sequenceid","sevendayprice","starttime","valid"]
 * 
 */
export const getEnterRoomPriceChooseList = (hdata) => {
    const ret = [];
    if (hdata.onedayprice > 0) {
        ret.push({
            money: hdata.onedayprice,
            day: 1,
            timeType: 0,
        });
    }
    if (hdata.sevendayprice > 0) {
        ret.push({
            money: hdata.sevendayprice,
            day: 7,
            timeType: 3,
        });
    }

    ret.push({
        money: hdata.coinyear,
        day: 30,
        timeType: 1,
    });

    return ret;
}

/**
 * 购买头像框
 * @param {String} carId 
 * @param {int} timeType 
 */
export const buyEnterEffect = async (carId, timeType) => {
    //购买座驾
    // message buyCar {
    // 	required string carId = 1;//购买的座驾ID
    // 	required int32 timeType = 2;//购买时间类型(0:1天 1:1个月，2:1年 3:7天)
    // }
    const result = await require('../ServerCmd').BagCmd_buyCar({
        carId,
        timeType,
    });

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state);
        return false;
    }

    return true;
}

async function _useCar(goodsId, flag) {
    //使用座驾(上车)
    // message useCar {
    // 	required string goodsId = 1;
    // 	required bool flag = 2;//true为使用座驾，false为取消座驾
    // }
    const result = await require('../ServerCmd').BagCmd_useCar({
        goodsId,
        flag,
    });

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state);
        return false;
    }

    //更新缓存
    if (UserInfoCache.userInfo) {
        UserInfoCache.userInfo.carId = flag ? goodsId : null;
    }

    return true;
}

/**
 * 点击座驾处理逻辑
 * @param {Object} entity 
 *  {
 *  key,
 *  hdata,
 *  goodsInfo
 * }
 */
export const pressCar = (entity) => {
    const cache = getCarData();
    if (!cache) return false;

    if (entity.goodsInfo) {
        if (cache.equiped == entity) {
            cache.equiped = null;
            _useCar(entity.goodsInfo.goodsId, false);
        } else {
            cache.equiped = entity;
            _useCar(entity.goodsInfo.goodsId, true);
        }
    }

    cache.selectedInfo = entity;

    ModelEvent.dispatchEntity(null, EVT_UI_MALL_ENTER_EFFECT, Config.getCarAnimationUrl(entity.hdata.carid, entity.hdata.alterdatetime));
}