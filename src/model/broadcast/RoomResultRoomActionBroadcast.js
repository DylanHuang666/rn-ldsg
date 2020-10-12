
'use strict';

import ModelEvent from "../../utils/ModelEvent";
import RoomInfoCache from "../../cache/RoomInfoCache";
import { ERoomActionType } from "../../hardcode/ERoom";
import UserInfoCache from "../../cache/UserInfoCache";
import { EVT_LOGIC_ROOM_JOB_CHANGE, EVT_LOGIC_UPDATE_ROOM_NOTIC, EVT_LOGIC_SELF_MIC_CHANGE, EVT_LOGIC_REFRESH_ROOM_MORE, EVT_LOGIC_SELF_BY_KICK, EVT_LOGIC_UPDATE_ROOM_BG } from "../../hardcode/HLogicEvent";
import { NativeModules } from "react-native";
import ToastUtil from "../../view/base/ToastUtil";


//房间操作通知
// message RoomActionBroadcast {
// 	required string roomId = 1;//房间ID	
// 	required int32 actType = 2;//操作类型:见ERoomActionType
// 	required string userId = 3;//操作者ID
// 	required string targetId = 4;//操作对象
// 	required int32 position = 5;//mic的位置(针对上锁,解锁,邀请好友)；actType为25、28，此字段代表pc模式，0代表app，1代表pc
// 	optional string param = 6;//扩展参数
// 	optional int32 mainType = 7;//房间类型
// 	optional string nickName = 8;//操作者昵称
// 	optional int32 sex = 9;//操作者性别
// 	optional string targetNickName = 10;//被操作者昵称
// 	optional int32 targetSex = 11;//被操作者昵称性别
// }
export default async function (evtName, data) {

    // console.log('RoomResulteRoomActionBroadcast=======', data.actType)

    if (!RoomInfoCache.roomData) {
        return
    }

    //处理逻辑(需要重新请求麦位数据来刷新麦位)
    switch (data.actType) {
        case ERoomActionType.CLEAR_ALL_HEART_VALUE://清空房间心动值
        case ERoomActionType.CLEAR_HEART_VALUE://清空个人心动值
            await require('../../model/room/RoomModel').default.getOwnerData(RoomInfoCache.createUserInfo.userId, RoomInfoCache.roomData.roomOwnerId)//请求主麦数据
        case ERoomActionType.MIC_UP://上麦
        case ERoomActionType.MIC_DOWN://下麦
        case ERoomActionType.MIC_FORBID://禁麦
        case ERoomActionType.MIC_UNFORBID://解除禁麦
        case ERoomActionType.MIC_LOCK://锁麦位
        case ERoomActionType.MIC_UNLOCK://解锁麦位
        case ERoomActionType.MIC_CLOSE://闭麦
        case ERoomActionType.MIC_OPEN://开麦
        case ERoomActionType.CANCEL_SET_MANAGER://撤销房间管理员
        case ERoomActionType.SETTING_MANAGER: //设置房间管理员
            await require('../../model/room/RoomModel').default.getRoomMicData(0);//请求麦位数据
        case ERoomActionType.MIC_QUE_UP:
        case ERoomActionType.MIC_QUE_DOWN:
        case ERoomActionType.UPDATE_ROOM_MODE:
            await require('../../model/room/RoomModel').default.getRoomData();//请求房间数据
            break;
        default:
            break;
    }


    //更新缓存
    switch (data.actType) {
        case ERoomActionType.UPDATE_PASSWORD:
            //更新房间密码
            RoomInfoCache.setNeedPassword(data.position == 1)
            ModelEvent.dispatchEntity(null, EVT_LOGIC_REFRESH_ROOM_MORE, null)
            break;
        case ERoomActionType.UPDATE_ROOM_TITLE:
            //更新房间标题
            RoomInfoCache.setRoomName(data.param)
            ModelEvent.dispatchEntity(null, EVT_LOGIC_REFRESH_ROOM_MORE, null)
            break;
        case ERoomActionType.OPEN_GIFT_ANIMATION:
            //开启全局动画
            RoomInfoCache.setGiftAnimation(true)
            require("../room/RoomPublicScreenModel").textTips('管理员已开启房间内礼物特效，可在工具栏重新关闭');
            ModelEvent.dispatchEntity(null, EVT_LOGIC_REFRESH_ROOM_MORE, null)
            break;
        case ERoomActionType.CLOSE_GIFT_ANIMATION:
            //关闭全局动画
            RoomInfoCache.setGiftAnimation(false)
            require("../room/RoomPublicScreenModel").textTips('管理员已关闭房间内礼物特效，可在工具栏重新开启');
            ModelEvent.dispatchEntity(null, EVT_LOGIC_REFRESH_ROOM_MORE, null)
            break;
        case ERoomActionType.CLEAR_ROOM_MSG:
            //清空公屏
            require('../../cache/RoomPublicScreenCache').clear()
            break;
        case ERoomActionType.MIC_UP:
            if (data.targetId == UserInfoCache.userId) {
                //上麦

                if (data.userId != data.targetId) {
                    //被抱上麦

                    //这里要设置一下缓存，有点强制了。。。不保证有bug哈
                    require('../room/RoomModel').setMicStatusCache(false);
                    NativeModules.Agora.onSeat(false);

                    //通知服务器闭麦
                    require('../room/RoomModel').default.action(ERoomActionType.MIC_CLOSE, UserInfoCache.userId, 0, '')

                    //逻辑：弹窗提示被抱上麦
                    //默认闭麦操作
                    require("../room/RoomPublicScreenModel").textTips('你已被抱上麦');
                    const permissStatus = await require('../PermissionModel').checkAudioRoomPermission()
                    if (permissStatus == 'denied' || permissStatus == 'blocked') {
                        //麦克风没打开，默认闭麦状态
                        require('../room/RoomModel').default.action(ERoomActionType.MIC_CLOSE, UserInfoCache.userId, 0, '')
                        ToastUtil.showCenter('麦克风权限未打开')
                    }
                } else {
                    //自己上麦
                    NativeModules.Agora.onSeat(require("../room/RoomModel").isOpeMic());
                }

                ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_JOB_CHANGE, null);
            }
            break;
        case ERoomActionType.MIC_DOWN:
            if (data.targetId == UserInfoCache.userId) {
                ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_JOB_CHANGE, null)
            }
            //下麦
            if (data.targetId != data.userId && data.param == 'true' && data.targetId == UserInfoCache.userId) {
                //被抱下麦
                NativeModules.Agora.offSeat()
                require("../room/RoomPublicScreenModel").textTips('你已被抱下麦');
            }
            break;
        case ERoomActionType.MIC_FORBID:
            //禁麦
            if (data.targetId == UserInfoCache.userId) {
                require("../room/RoomPublicScreenModel").textTips('你被管理员操作了禁麦');
                ModelEvent.dispatchEntity(null, EVT_LOGIC_SELF_MIC_CHANGE, null)
                NativeModules.Agora.enableMic(false);
            }

            break;
        case ERoomActionType.MIC_UNFORBID:
            //解除禁麦
            if (data.targetId == UserInfoCache.userId) {
                require("../room/RoomPublicScreenModel").textTips('你被管理员操作了解除禁麦');
                ModelEvent.dispatchEntity(null, EVT_LOGIC_SELF_MIC_CHANGE, null)
                NativeModules.Agora.enableMic(require("../room/RoomModel").isOpeMic())
            }

            break;
        case ERoomActionType.MIC_CLOSE://需要刷新麦位
        case ERoomActionType.MIC_OPEN://需要刷新麦位
            //关麦，开麦
            if (data.targetId == UserInfoCache.userId) {
                ModelEvent.dispatchEntity(null, EVT_LOGIC_SELF_MIC_CHANGE, null)
            }
            break;
        case ERoomActionType.FORBID:
            //禁言
            if (data.targetId == UserInfoCache.userId) {
                require("../room/RoomPublicScreenModel").textTips('你已被禁言');
            }
            break;
        case ERoomActionType.UNFORBID:
            //解除禁言
            if (data.targetId == UserInfoCache.userId) {
                require("../room/RoomPublicScreenModel").textTips('你已被解除禁言');
            }
            break;
        case ERoomActionType.SETTING_MANAGER:
            //设置房间管理员
            if (data.targetId == UserInfoCache.userId) {
                ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_JOB_CHANGE, null)
                require("../room/RoomPublicScreenModel").textTips('你已被设为房间管理员');
            }
            break;
        case ERoomActionType.CANCEL_SET_MANAGER:
            //撤销房间管理员
            if (data.targetId == UserInfoCache.userId) {
                ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_JOB_CHANGE, null)
                require("../room/RoomPublicScreenModel").textTips('你已被撤销房间管理员');
            }
            break;
        case ERoomActionType.KICK_MEMBER:
            if (data.targetId == UserInfoCache.userId) {
                //被踢出房间
                //逻辑：退出房间
                ModelEvent.dispatchEntity(null, EVT_LOGIC_SELF_BY_KICK, null)
            }
            break;
        case ERoomActionType.ADD_TO_DARK_ROOM:

            if (data.targetId == UserInfoCache.userId) {
                //被加入房间黑名单
                //逻辑：1、退出房间  2、弹窗提示 "抱歉，由于房间管理员的相关设置，您无法进入该房间"
                ModelEvent.dispatchEntity(null, EVT_LOGIC_SELF_BY_KICK, null)
            }
            break;
        case ERoomActionType.UPDATE_NOTIC:
            //更新房间公告
            RoomInfoCache.roomData.notic = data.param
            require("../room/RoomPublicScreenModel").textTips('房间公告：\n' + data.param);
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_ROOM_NOTIC, data.param)
            break;
        case ERoomActionType.UPDATE_BG:
            //更换房间背景
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_ROOM_BG, data.param)
            break;
        case ERoomActionType.OPEN_OFFLINEMODE:
            //开启离线模式

            break;
        case ERoomActionType.CLOSE_OFFLINEMODE:
            //关闭离线模式

            break;
        default:
            break;


    }
}