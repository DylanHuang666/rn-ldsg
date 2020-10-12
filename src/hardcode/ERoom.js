/**
 * 房间枚举
 */

'use strict';

/*
    * 房间主(大)类型
    */
export const ERoomMainType = {
    FUN_ROOM: 1,// 娱乐房
    TEMP_ROOM: 2,// 临时房
    CP_ROOM: 3,// 情侣房
    HALL_ROOM: 4,// 厅房
    CHAT_ROOM: 5,//陪聊房
}

/*
    * 房间(子)类型
    */
export const ERoomType = {
    FUN_FRIEND_ROOM: 3, // 交友房（主类型是 娱乐房）
    FUN_VIDEO_ROOM: 6, // 相亲视频房（主类型是 娱乐房）
}

/**
 * 修改房间配置
 */
export const ERoomModify = {

    UPDATE_NOTIC_KEY: "notic",// 更新公告(小黑版) param=公告
    UPDATE_BG_KEY: "bg",// 更新背景

    UPDATE_PASSWORD_KEY: "password",// 更新了房间密码
    UPDATE_DIVIDEDID_KEY: "dividedId",
    UPDATE_ROOM_MODE_KEY: "roomMode",// 更新房间模式:0自由,1非自由
    UPDATE_GROUPID_KEY: "groupId",

    UPDATE_ROOM_NAME: 'roomName',//更新房间名称
    UPDATE_ROOM_LOGO: 'logo',//更新房间logo
    UPDATE_ROOM_TYPE: 'type',//更新房间类型
}

export const ERoomJob = {

    REVOKE_MANAGER: -1,// 撤销管理员

    OFFICIAL: 0,// 官方人员

    PRESIDENT: 1,// 会长

    ROOMOWNER: 2,// 房主

    MANAGER: 3,// 房间(Common)管理员

    GUESST: 4,// 嘉宾

    NOT_UP_MIC: -1,// 用户不在麦位上
}


export const ERoomActionType = {


    MIC_UP: 1,// 上Mic position位置1-N param=true(抱上麦)
    MIC_DOWN: 2,// 下Mic position位置1-N
    // param=true(抱下麦)
    // param=kick_member（被踢下麦）
    APPLY_UP_MIC: 3,//申请上麦|申请连麦)
    CANCAL_CONNECT_MIC: 4,//取消连麦(移出麦列表)
    AGGRE_APPLY_UP_MIC: 5,//同意申请上麦
    MIC_FORBID: 6,// 禁麦position传分钟
    MIC_UNFORBID: 7,// 解除禁麦position传0
    MIC_LOCK: 8,// 锁Mic位 position位置1-N
    MIC_UNLOCK: 9,// 解锁Mic位 position位置1-
    KICK_MEMBER: 10,// 踢人出房间
    MIC_CLOSE: 11,// 闭麦
    MIC_OPEN: 12,// 开Mic
    FORBID: 13,// 禁言 position传分钟
    UNFORBID: 14,// 解除禁言position传0
    VIDEO_INVITE_UP_MIC: 15,
    MIC_QUE_UP: 18,// 进排麦队列
    MIC_QUE_DOWN: 19,// 退出排麦队列
    MIC_QUE_TOP: 20,// 置顶排麦队列
    FRIEND_NEXT_STAGE: 21, // 交友房主播点击(开始)下一步
    FRIEND_END_STAGE: 22, // 交友房主播点击结束
    FRIEND_HEART_CHOOSE: 23, // 交友房心动选择
    FRIEND_HEART_CANCEL: 24, // 交友房取消心动
    ADD_HEART_VALUE: 25, // 增加心动值(服务器调用):position为心动值
    INVITE_CP: 27, // 邀请情侣进入情侣房
    CP_ACCEPT_INVITE: 28, // 接受进入情侣房邀请
    CP_CANCEL_INVITE: 29, // 拒绝进入情侣房邀请(超时或拒绝时调用)
    MAIN_MIC_UP: 30,//上主麦
    MAIN_MIC_DOWN: 31,//下主麦
    CLEAR_HEART_VALUE: 39,// 清空个人心动值
    CLEAR_ALL_HEART_VALUE: 42,// 清空全麦心动值
    PULL_INTO_DARK_ROOM: 43,// 加入房间小黑屋
    UPDATE_PASSWORD: 51,// 更新了房间密码
    UPDATE_NOTIC: 52,// 更新公告(小黑版) param=公告
    UPDATE_BG: 53,//更新房间背景
    UPDATE_ROOM_TITLE: 55,//更新房间标题
    UPDATE_DIVIDED_RATE: 56,// 更新房间分成比率
    UPDATE_INCOME: 57,// 更新房间魅力值
    UPDATE_ROOM_MODE1: 58,//切换房间模式 param=模类型（语音房就是分类）
    SETTING_MANAGER: 59,// 设置管理员
    CANCEL_SET_MANAGER: 60,// 撤销管理员
    UPDATE_ROOM_MODE: 61,//更新房间发言模式
    VIDEO_CLOSE: 63,
    VIDEO_OPEN: 64,
    CARD_GRANT: 66,// 发放贵宾卡
    CARD_CANCEL: 67,// 撤销贵宾卡
    OPEN_OFFLINEMODE: 68,// 开启离线模式
    CLOSE_OFFLINEMODE: 69,// 关闭离线模式
    OPEN_GIFT_ANIMATION: 70,//开启显示动画
    CLOSE_GIFT_ANIMATION: 71,//关闭显示动画
    CLEAR_ROOM_MSG: 72,//清空房间公屏
    ADD_TO_DARK_ROOM: 73,//添加目标用户到小黑屋
    REMOVE_TO_DARK_ROOM: 74,//从小黑屋移除目标用户
}

// 展示礼物播放效果
export const GIFT_FLASH = 'GIFT_FLASH'
