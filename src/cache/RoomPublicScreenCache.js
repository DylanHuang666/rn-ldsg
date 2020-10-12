/**
 * 房间公屏信息缓存
 */
'use strict';

import ModelEvent from "../utils/ModelEvent";
import { EVT_UPDATE_ROOM_PUBLIC_SCREEN } from "../hardcode/HGlobalEvent";

//---------------------  类型枚举 ----------------------------------

//消息类型
export const TYPE_SYSTEM_NOTICE = 1;//系统公告
export const TYPE_ENTER_ROOM = 2;//进入房间
export const TYPE_SMASH_EGG = 3;//砸蛋
export const TYPE_GIFT = 4;//送礼
export const TYPE_TEXT = 5;//纯文本提示
export const TYPE_IM_TEXT = 6;//im发送文本消息
export const TYPE_IM_PHOTO = 7;//im发送图片消息
export const TYPE_FOLLOW_NOTICE = 8;//点击关注房主提醒；类型
export const TYPE_GIFT_ALL_MIC = 9;//送礼全麦
export const TYPE_MAGIC_EMOJI = 10;//魔法表情
export const TYPE_ACTIVITY_TEXT = 11;//砸蛋活动
export const TYPE_TREASURE_BOX = 12;//送宝箱
export const TYPE_TREASURE_BOX_ALL_MIC = 13;//送宝箱全麦

export const TYPE_NEW_MESSAGE = 100;//新消息

//分类类型
export const CLASSIC_ALL = 0;
export const CLASSIC_GIFT = 1;
export const CLASSIC_IM = 2;

//最大消息数量
const MAX_COUNT = 100;

//-------------------------------------------------------------

let sm_infos;       //全部信息列表
let sm_giftInfos;   //礼物分类
let sm_imInfos;     //im聊天分类

let sm_updateTimes = 0;


let sm_bAutoToEnd = true;  //是否自动到底部
let sm_curClassic = CLASSIC_ALL;//当前选中的类型

const NEW_MESSAGE_INFO = {
    key: 'NEW_MESSAGE_INFO',
    type: TYPE_NEW_MESSAGE,
    bReaded: true,
}
let sm_curNewMessageIndex = -1;
let sm_curNewMessageList = null;
let sm_bNeedMoveCurNewMessage = false;


let sm_bCacheAdd = false;   //是否缓存等待加载队列
let sm_cacheAddInfos;
let sm_lastVisibleInfo;


//-------------------- 工具函数 -------------------------------------

function _clearNewMessageItem() {
    sm_bNeedMoveCurNewMessage = false;
    if (!sm_curNewMessageList) return;
    sm_curNewMessageList.splice(sm_curNewMessageIndex, 1);
    sm_curNewMessageList = null;
    sm_curNewMessageIndex = -1;
    NEW_MESSAGE_INFO.bReaded = true;
}

function _addInfoToList(list, info, classic) {
    if (!list) {
        if (classic == sm_curClassic) {
            sm_bAutoToEnd = true;
            _clearNewMessageItem();
        }
        return [info];
    }

    if (list.length < MAX_COUNT) {
        if (classic == sm_curClassic && !sm_bAutoToEnd) {
            if (sm_curNewMessageList != list) {
                _clearNewMessageItem();
                sm_curNewMessageList = list;
                sm_curNewMessageIndex = list.length;
                NEW_MESSAGE_INFO.bReaded = false;
                sm_curNewMessageList.push(NEW_MESSAGE_INFO);
            } else if (sm_bNeedMoveCurNewMessage) {
                sm_bNeedMoveCurNewMessage = false;
                sm_curNewMessageList.splice(sm_curNewMessageIndex, 1);
                sm_curNewMessageIndex = list.length;
                NEW_MESSAGE_INFO.bReaded = false;
                sm_curNewMessageList.push(NEW_MESSAGE_INFO);
            }
        }
        list.push(info);
        return list;
    }

    if (classic != sm_curClassic) {
        list.shift();
        list.push(info);

        if (sm_curNewMessageList == list) {
            _clearNewMessageItem();
        }
        return list;
    }

    if (sm_bAutoToEnd) {
        sm_bNeedMoveCurNewMessage = false;
        list.shift();
        if (sm_curNewMessageList == list) {
            --sm_curNewMessageIndex;
            if (sm_curNewMessageIndex < 0) {
                sm_curNewMessageList = null;
            }
        }
        list.push(info);
        return list;
    }

    if (sm_curNewMessageList == list) {
        list.splice(sm_curNewMessageIndex + 1, 1);
        if (sm_bNeedMoveCurNewMessage) {
            sm_bNeedMoveCurNewMessage = false;
            sm_curNewMessageList.splice(sm_curNewMessageIndex, 1);
            sm_curNewMessageIndex = list.length;
            NEW_MESSAGE_INFO.bReaded = false;
            sm_curNewMessageList.push(NEW_MESSAGE_INFO);
        }
        list.push(info);
        return list;
    }

    list.shift();
    list.shift();
    _clearNewMessageItem();
    sm_curNewMessageList = list;
    sm_curNewMessageIndex = list.length;
    NEW_MESSAGE_INFO.bReaded = false;
    sm_curNewMessageList.push(NEW_MESSAGE_INFO);
    list.push(info);
    return list;
}

function _checkAddTypeInfos(info) {
    switch (info.type) {
        case TYPE_GIFT:
        case TYPE_GIFT_ALL_MIC:
            sm_giftInfos = _addInfoToList(sm_giftInfos, info, CLASSIC_GIFT);
            break;

        case TYPE_IM_TEXT:
        case TYPE_IM_PHOTO:
            sm_imInfos = _addInfoToList(sm_imInfos, info, CLASSIC_IM);
            break;
    }
}

export const doAddInfo = (info) => {

    //判定是否缓存到等待添加队列
    //一般用于直播间最小化
    if (sm_bCacheAdd) {
        if (sm_cacheAddInfos) {
            sm_cacheAddInfos.push(info);
        } else {
            sm_cacheAddInfos = [info];
        }
        return;
    }

    ++sm_updateTimes;

    info.key = sm_updateTimes.toString();

    _checkAddTypeInfos(info);
    sm_infos = _addInfoToList(sm_infos, info, CLASSIC_ALL);

    ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, null);
}


/**
 * 获得公屏信息列表
 */
export const getInfos = () => {
    switch (sm_curClassic) {
        case CLASSIC_ALL:
            return sm_infos;

        case CLASSIC_GIFT:
            return sm_giftInfos;

        // case CLASSIC_IM:
        default:
            return sm_imInfos;
    }
}

/**
 * 获得当前选中的消息分类
 */
export const getCurClassic = () => {
    return sm_curClassic;
}

/**
 * 设置当前修改的消息分类
 * @param {CLASSIC_????} classic 
 */
export const setCurClassic = (classic) => {
    sm_bAutoToEnd = true;
    sm_curClassic = classic;
    _clearNewMessageItem();

    ++sm_updateTimes;

    ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, null);
}

export const setAutoToEnd = (b) => {
    sm_bNeedMoveCurNewMessage = !b;

    if (sm_bAutoToEnd == b) return;
    sm_bAutoToEnd = b;

    if (b) {
        NEW_MESSAGE_INFO.bReaded = true;
    }
}

export const isAutoToEnd = () => {
    return sm_bAutoToEnd;
}

export const getNewMessageInfo = () => {
    return NEW_MESSAGE_INFO;
}

export const isNewItemReaded = () => {
    return NEW_MESSAGE_INFO.bReaded;
}

export const setNewItemReaded = () => {
    if (NEW_MESSAGE_INFO.bReaded) return;
    NEW_MESSAGE_INFO.bReaded = true;
    ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, null);
}

export const getUnreadNum = () => {
    if (!sm_curNewMessageList) return 0;
    return sm_curNewMessageList.length - sm_curNewMessageIndex - 1;
}

/**
 * 获得列表更新次数
 * 用来刷新公屏显示
 */
export const getUpdateTimes = () => {
    return sm_updateTimes;
}

/**
 * 设置是否缓存到待添加队列
 * @param {boolean} b 
 */
export const setIsCacheAddInfos = (b) => {
    if (sm_bCacheAdd == b) return;

    sm_bCacheAdd = b;

    if (b) return;
    if (!sm_cacheAddInfos) return;

    const a = sm_cacheAddInfos;
    sm_cacheAddInfos = null;
    for (const info of a) {
        ++sm_updateTimes;

        info.key = sm_updateTimes.toString();
    
        _checkAddTypeInfos(info);
        sm_infos = _addInfoToList(sm_infos, info, CLASSIC_ALL);
    }

    ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, null);
}

/**
 * 获得最后一个显示的数据
 */
export const getLastVisibleInfo = () => {
    return sm_lastVisibleInfo;
}

/**
 * 设置最后一个显示的数据
 * @param {*} info 
 */
export const setLastVisibleInfo = (info) => {
    sm_lastVisibleInfo = info;
}

/**
 * 清空公屏
 */
export const clear = () => {
    sm_lastVisibleInfo = null;
    sm_cacheAddInfos = null;
    sm_infos = null;
    sm_giftInfos = null;
    sm_imInfos = null;
    sm_bAutoToEnd = true;
    _clearNewMessageItem();
    ++sm_updateTimes;

    ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, null);
}

/**
 * 重置公屏（退房间时）
 */
export const reset = () => {
    sm_lastVisibleInfo = null;
    sm_cacheAddInfos = null;
    sm_bCacheAdd = false;

    sm_infos = null;
    sm_giftInfos = null;
    sm_imInfos = null;
    sm_bAutoToEnd = true;
    _clearNewMessageItem();
    ++sm_updateTimes;
}
