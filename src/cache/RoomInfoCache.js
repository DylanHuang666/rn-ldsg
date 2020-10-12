/**
 * 房间缓存数据
 */

'use strict';

import ModelEvent from "../utils/ModelEvent";
import { EVT_UPDATE_ROOM_MAIN_MIC, EVT_UPDATE_ROOM_OTHER_MIC, EVT_UPDATE_ROOM_DATA } from "../hardcode/HGlobalEvent";
import Config from "../configs/Config";
import { EVT_LOGIC_ENTER_ROOM, EVT_LOGIC_LEAVE_ROOM,EVT_LOGIC_REFRESH_ROOM_MORE } from "../hardcode/HLogicEvent";
import UserInfoCache from "./UserInfoCache";

//当前所在的房间数据
//非 null 表示在房间
//房间数据
// message RoomData {
// 	required string roomId = 1;//房间ID
// 	required int32 type = 2;//分类
// 	required string createId = 3;//主播ID(主麦位)
// 	optional string notic = 4;//公告内容（小黑板）
// 	repeated MicInfo infos = 5;//麦位数据
// 	required string bg = 6;//背景图片地址
// 	optional int64 myForbid = 7;//我被禁言过期时间(时间戳)
// 	optional int32 onlineNum = 8;//在线人数
// 	optional string roomName = 9;//房间名字(要做UrlDecode)
// 	optional bool needPassword = 10;//是否需要密码
// 	optional bool createOnline = 11;//房主是否在线
// 	optional bool myForbidMic = 12;//我是否被禁麦
// 	optional int64 myForbidTime = 13;//我被禁麦过期时间(时间戳) 0为没有禁麦
// 	optional int32 charm = 14;//魅力值(改成周贡献值):已没用
// 	optional int32 roomType = 15;//所在房间类型 ERoomMainType	
// 	optional bool createOpenMic = 16;//房主是否开麦中
// 	optional int32 jobId = 17;// 身份id, 0-官方人员 1-房主 2-房主 3-管理员 4-嘉宾
// 	optional UserResult.UserBase roomContribute = 18;//本日房间土豪玩家
// 	optional string worldContribute = 19;//本日语音土豪玩家ID
// 	optional FriendRoomData friendRoomData = 20; //交友房数据(或抢帽子玩法数据)
// 	repeated UserResult.UserBase micQues = 21;//排麦列表 
// 	repeated KickData kickData = 22;//被踢列表(管理员才有数据)
// 	optional int32 roomMode = 23;//房间发言模式:0自由,1非自由f
// 	optional int32 freeGiftRemainTime = 24;//免费礼物领取剩余时间S(-1代表未启动计时包裹免费礼物未送出)
// 	optional CPRoomData cpRoomData = 25; //情侣房数据
// 	optional int32 guardMemberCount = 26;// 守护成员数量
// 	optional string guardName = 27;// 当前直播间守护团名称
// 	optional bool isGuardian = 28;// 我是否是当前直播间守护团成员
// 	optional int32 guardianLv = 29;// 我在当前直播间守护团的亲密等级
// 	optional UserResult.UserBase roomCharm = 30;//本日房间魅力玩家
// 	optional string worldCharm = 31;//本日语音魅力玩家ID
// 	optional int32 logoTime = 32;//房间修改logo的时间 0为没修改过
// 	repeated int32 dragonBalls = 33;//黑8结果:为空未开结果,0值为?
// 	optional string hatId = 34;//抢帽子玩法我戴的帽子Id
// 	optional string anchorHatId = 35;//抢帽子玩法房主戴的帽子Id
// 	optional int64 contribute = 36;//日贡献值
// 	optional string roomOwnerId = 37;//房主
// 	optional string roomGroupId = 38;//房间群聊Id
// 	optional bool isInRoomGroup = 39;//是否已加入房间群聊
// 	optional string liveflowUrl = 40;//视频房推流地址
// 	optional bool createOpenVideo = 41;//房主是否开视频中
// 	optional int32 roomH5 = 42;// 进入房间弹出h5页面(没有值或者为0时不弹, >0时弹)
// 	optional int32 cardType = 43; //我的贵宾卡类型(3:星耀 2:钻石 1:白银 0:无卡)
// 	optional int32 anchorCardType = 44; //主播的贵宾卡类型(3:星耀 2:钻石 1:白银 0:无卡)
// 	repeated int32 micQuesCardType = 45;//排麦用户在当前房间的贵宾卡类型(与21:micQues一一对应)
// 	optional int64 newContribute = 46;//日新贡献值(神豪值)
// 	optional bool isFavourHall = 47;//是否我收藏的厅(true:是 false:否)
// 	optional int64 createHeartValue = 48;//房主心动值
// 	optional bool offlineMode = 49;//厅是否开启离线模式(true:是 false:否)
// 	optional CrossRoomPk crossRoomPk = 50;// 跨房pk数据
// 	optional bool giftAnimation = 51;//是否显示礼物特效
// }

//Mic位数据
// message MicInfo {
//     optional UserResult.UserBase base = 1;//用户(空为没有人)
// 	optional int32 position = 2;//麦位1-N
// 	optional bool lock = 3;//是否上锁
// 	optional bool forbidMic = 4;//被禁麦
// 	optional string friendRemark = 5;//好友备注名
// 	optional bool openMic = 6;//是否开麦中
// 	optional int64 forbidTime = 7;//被禁麦过期时间(时间戳) 0为没有禁麦
// 	optional int64 heartValue = 8; //交友房(或抢帽子玩法或相亲视频房)此mic位上用户的心动值
// 	optional string chooseId = 9; //交友房此mic位上用户选择的对象Id(空为没有选择)
// 	optional int32 jobId = 10;// 身份id 0-官方人员 1-房主 2-嘉宾 3-管理员
// 	optional string hatId = 11;// 抢帽子玩法的帽子id
// 	optional bool isHatBuff = 12;// 是否在抢帽子玩法buff状态
// 	repeated int32 dragonBalls = 13;// 黑8结果:为空未开结果,0值为?
// 	repeated UserResult.UserBase contributeUser = 14;// 相亲视频房心动值贡献者信息
// 	optional string banners = 15;// mic位上用户的banner图
// 	optional bool openVideo = 16;// 是否开启了视频
// 	optional int64 micOverTime = 17;//视频房男嘉宾mic位倒计时过期时间(-1为没限制)
// 	optional int32 cardType = 18; //用户贵宾卡类型(3:星耀 2:钻石 1:白银 0:无卡)
// }
let sm_roomData;

/**
 * {UserResult.UserInfo}
 */
let sm_roomCreateUserInfo;//创建房间的用户信息
let sm_roomOwnerUserInfo;//房主的用户信息

let sm_viewRoomId;

let is_selfAnimation;//是否显示房间动画(个人)

let sm_bPhone;  //是否在打电话中
let sm_phone_userId;  //在打电话中对方的userId

function _doUpdateViewRoomId() {
    if (!sm_roomData) {
        sm_viewRoomId = null;
        return;
    }

    sm_viewRoomId = sm_roomData.roomId.substr(1);
}

//是否普通房
export function isNormalRoom(roomId) {
    return roomId && roomId.charAt(0) === "A"
}

//是否1v1陪聊
export function isChatRoom(roomId) {
    return roomId && roomId.charAt(0) === "C"
}


const RoomInfoCache = {
    /**
     * 当进入房间，获得数据后调用
     * @param {RoomResult.RoomData} roomData 
     */
    onEnterRoom(roomData) {
        sm_roomData = roomData;
        is_selfAnimation = roomData.giftAnimation
        _doUpdateViewRoomId();


        ModelEvent.dispatchEntity(null, EVT_LOGIC_ENTER_ROOM, null)

        //加入房间im群聊
        require('../model/chat/ChatModel').applyJoinGroup(sm_roomData.roomId);
    },

    /**
     * 在房间内，更新数据调用
     * @param {RoomResult.RoomData} roomData 
     */
    updateRoomData(roomData) {
        if (!sm_roomData) return;
        sm_roomData = roomData;
        _doUpdateViewRoomId();

        //通知更新
        ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_DATA, null)
    },

    /**
     * 更新麦位数据
     */
    updateRoomMicData(infos) {
        if (!sm_roomData) return;
        sm_roomData.infos = infos

        //通知更新
        ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_OTHER_MIC, null);
    },

    /**
     * 退出房间的时候调用
     */
    onLeaveRoom() {
        if (!sm_roomData) {
            return
        }
        sm_roomOwnerUserInfo = null;
        sm_roomCreateUserInfo = null;
        sm_roomData = null;
        sm_viewRoomId = null;

        //退出房间重置扬声器状态
        RoomInfoCache.enableSpeaker = true;
        ModelEvent.dispatchEntity(null, EVT_LOGIC_LEAVE_ROOM, null)

    },

    /**
     * 获得 RoomResult.RoomData
     */
    get roomData() {
        return sm_roomData;
    },

    /**
     * 是否电话发起人
     */
    get isCall() {
        return sm_roomData && sm_roomData.roomOwnerId && sm_roomData.roomOwnerId != UserInfoCache.userId;
    },

    /**
     * sm_bPhone
     */
    get is1V1Calling() {
        return sm_bPhone;
    },

    /**
     * {bool} bPhone
     */
    set1V1Calling(bPhone) {
        sm_bPhone = bPhone;
    },

    /**
     * {string} userId
     */
    set1V1CallingUserId(userId) {
        sm_phone_userId = userId;
    },

    /**
     * 获取打电话中对方的userId，用于聊天室通过麦位获取不到对方userId
     */
    get callingUserId() {
        return sm_phone_userId;
    },

    /**
     * 是否在房间内
     */
    get isInRoom() {
        return Boolean(sm_roomData);
    },

    /**
     * 当前房间id
     */
    get roomId() {
        return sm_roomData && sm_roomData.roomId;
    },

    /**
     * 是否上锁
     */
    get isNeedPassword() {
        if (!sm_roomData) {
            return false
        }
        return sm_roomData.needPassword;
    },

    setNeedPassword(b) {
        if (!sm_roomData) return;
        sm_roomData.needPassword = b
    },

    get roomName() {
        if (!sm_roomData) {
            return ''
        }
        return sm_roomData.roomName
    },

    setRoomName(b) {
        if (!sm_roomData) {
            return
        }
        sm_roomData.roomName = b
    },

    /**
     * 是否显示礼物动效（全局）
     */
    get isGiftAnimation() {
        return !!sm_roomData && sm_roomData.giftAnimation
    },

    /**
     * 修改全局礼物开关
     */
    setGiftAnimation(b) {
        is_selfAnimation = b
        if (sm_roomData) {
            sm_roomData.giftAnimation = b
        }
    },

    /**
     * 是否显示礼物礼物（个人）
     */
    get isSelfAnimation() {
        return is_selfAnimation
    },

    setSelfAnimation(b) {
        is_selfAnimation = b
    },

    /**
     * 是否能播放动画
     */
    get isPlayAnimaion() {
        return is_selfAnimation
    },

    /**
     * 获得显示的房间id
     */
    get viewRoomId() {
        return sm_viewRoomId;
    },


    /**
     * 是否有房间操作权限
     */
    get haveRoomPermiss() {
        if (!sm_roomData) {
            return false
        }
        return sm_roomData.jobId <= 3
    },

    /**
     * 角色id
     * 身份id, 0-官方人员 1-房主 2-房主 3-管理员 4-嘉宾
     */
    get jobId() {
        if (!sm_roomData) {
            return 4
        }
        return sm_roomData.jobId
    },


    /**
     * 是否开启扬声器
     */
    enableSpeaker: true,


    /**
     * 排麦列表
     */
    get MicQues() {
        if (!sm_roomData) {
            return []
        }
        return sm_roomData.micQues
    },

    /**
     * 当前有多少空麦位
     */
    get NullMicNum() {
        if (!sm_roomData) {
            return 0
        }
        let num = 0
        sm_roomData.infos.forEach(element => {
            if (!element.base && !element.lock) {
                num++
            }
        });
        return num
    },

    /**
     * 获得主麦位用户信息
     * @returns {UserResult.UserInfo}
     */
    get mainMicUserInfo() {
        return sm_roomCreateUserInfo || sm_roomOwnerUserInfo;
    },

    /**
     * 获取当前所在房间封面图
     */
    get roomLogoUrl() {

        //取主播头像
        if (sm_roomCreateUserInfo) {
            return Config.getRoomCreateLogoUrl(sm_roomData.logoTime, RoomInfoCache.roomId, sm_roomCreateUserInfo.userId, sm_roomCreateUserInfo.logoTime, sm_roomCreateUserInfo.thirdIconurl)
        }
        if (sm_roomOwnerUserInfo) {
            return Config.getRoomCreateLogoUrl(sm_roomData.logoTime, RoomInfoCache.roomId, sm_roomOwnerUserInfo.userId, sm_roomOwnerUserInfo.logoTime, sm_roomOwnerUserInfo.thirdIconurl)

        }
        return Config.getRoomLogoUrl(0, RoomInfoCache.roomId, 50)

    },

    /**
     * 获得创建房间的用户信息
     * @returns {UserResult.UserInfo}
     */
    get createUserInfo() {
        return sm_roomCreateUserInfo;
    },

    /**
     * 获得房主的用户信息
     * @returns {UserResult.UserInfo}
     */
    get ownerUserInfo() {
        return sm_roomOwnerUserInfo;
    },

    /**
     * 更新房主、创建房间用户信息
     * @param {UserResult.UserInfo} roomCreateUserInfo 
     * @param {UserResult.UserInfo} roomOwnerUserInfo 
     */
    updateCreatorAndOwner(roomCreateUserInfo, roomOwnerUserInfo) {
        // console.warn("更新房主、创建房间用户信息", roomCreateUserInfo, roomOwnerUserInfo)
        sm_roomCreateUserInfo = roomCreateUserInfo;
        sm_roomOwnerUserInfo = roomOwnerUserInfo;

        //通知更新
        ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_MAIN_MIC, null);
        ModelEvent.dispatchEntity(null, EVT_LOGIC_REFRESH_ROOM_MORE, null);
    },

    /**
     * 退出登陆时候调用
     * 清除用户当前所有状态
     */
    clear() {
        sm_roomOwnerUserInfo = null;
        sm_roomCreateUserInfo = null;
        sm_roomData = null;
        sm_viewRoomId = null;
        sm_phone_userId = null;
    },
};

export default RoomInfoCache;