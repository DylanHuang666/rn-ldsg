/**
 * 商城缓存数据
 */

'use strict';


//------------------ 头像框商城 -------------------------------

// {
//     UserHeadEntity[] list,
//     UserHeadEntity selectedInfo,
//     UserHeadEntity equiped;
// }

// UserHeadEntity
// {
//     String           key: hdata.avatarboxid,
//     CS_AvatarBox     hdata,
//     GoodsInfo        goodsInfo,
// }

// CS_AvatarBox
//"keys":["animationname","avatarboxid","createtime","duration","endtime","gifttype","h5url","id","name","onedayprice","pictype","price","sevendayprice","starttime","updatetime","valid","weight"]

//GoodsInfo
// message GoodsInfo {
// 	optional string goodsId = 1;//物品ID
// 	optional int32 num = 2;//物品数量
// 	optional int32 remainTime = 3;//有效剩余时间S(有时效物品专用字段,不存在时代表座驾未使用)
// 	optional int32 updateTime = 4;//创建或续期时间
// 	optional bool isNew = 5;//是否新物品
// }

let sm_userHeadData = null;

export const setUserHeadData = (data) => {
    sm_userHeadData = data;
}

export const getUserHeadData = () => {
    return sm_userHeadData;
}


//------------------ 座驾商城 -------------------------------

let sm_carData = null;

export const setCarData = (data) => {
    sm_carData = data;
}

export const getCarData = () => {
    return sm_carData;
}


//----------------- all ---------------------------------------

/**
 * 清空缓存
 */
export const clearAll = () => {
    sm_userHeadData = null;
    sm_carData = null;
}