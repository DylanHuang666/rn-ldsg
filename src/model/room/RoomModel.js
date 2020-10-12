
/**
 * 房间逻辑
 */

'use strict';

import { NativeModules } from "react-native";
import RoomInfoCache, { isChatRoom } from "../../cache/RoomInfoCache";
import UserInfoCache from "../../cache/UserInfoCache";
import Config from "../../configs/Config";
import { ERoomActionType, ERoomMainType, ERoomModify, ERoomType } from "../../hardcode/ERoom";
import { SECRETARY_NAME } from "../../hardcode/HGLobal";
import HResultStatus from "../../hardcode/HResultStatus";
import { icon_luobo_banner } from "../../hardcode/skin_imgs/room";
import ToastUtil from "../../view/base/ToastUtil";
import { chkChatRoom } from "../announcer/ChatRoomModel";

// 是否开启耳返
let sm_isOpenEarMonitor = false;
let _bgRef = null;

function _toCertificationView() {
    require("../../router/level2_router").showCertificationPage();
}


async function _toEnterLiveRoom(roomId, password) {

    //获取房间状态:返回RoomResult.RoomState
    // message getRoomState {
    // 	repeated string roomIds = 1;//房间ID列表	
    // }
    const result = await require('../ServerCmd').RoomCmd_getRoomState({
        roomIds: [roomId],
    })

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state)
        return
    }

    if (result.data.status == 2 && !password) {
        //需要密码
        require('../../router/level3_router').showSetPassword(1, roomId)
        return
    }

    if (password) {
        //验证密码
        const pwdResult = await require('../ServerCmd').RoomCmd_checkPwd({
            roomId,
            password
        })
        if (HResultStatus.Success != pwdResult.state) {
            ToastUtil.showCenter('密码错误')
            return
        }
        //密码正确,进入房间
        enter(roomId, password, 0)
    } else {
        //进入房间
        enter(roomId, password, 0)
    }
}



//进入房间
// message enter {
// 	required string roomId = 1;//房间ID
// 	required string password = 2;//密码
// 	optional int32 source = 3;//来源
// }
async function enter(roomId, password, source) {
    //如果是断线重连
    if (isChatRoom(roomId)) {
        let roomStatus = await chkChatRoom()
        if (roomStatus === 0) {
            return
        }
    }

    const result = await require('../ServerCmd').RoomCmd_enter({
        roomId,
        password,
        source,
    })
    if (HResultStatus.Success != result.state) {
        if (result.state == 15) {
            //需要密码，弹出密码弹框
            require('../../router/level3_router').showSetPassword(1, roomId)
        } else if (result.state == 20295) {
            ToastUtil.showCenter('由于权限问题，您暂时无法进入该房间')
        } else {
            require('../ErrorStatusModel').default.showTips(result.state)
        }
        return
    }
    getRoomDataAndShowView(roomId);

}


async function _doGetUserCertification() {
    // "keys":["identifymode","needrealname"]
    const datas = await require("../staticdata/StaticDataModel").getLiveSetUp();
    if (!datas) {
        //读取数据表失败
        require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
        return;
    }

    if (datas[0] && datas[0].needrealname) {
        //需要实名认证

        // //获取实名认证信息 返回 UserCertificationResult.UserCertification
        // message getUserCertification {

        // }
        let res = await require("../ServerCmd").UserCertificationCmd_getUserCertification({});

        if (77 == res.state) { //从未提交认证、跳到实名认证
            _toCertificationView();
            return;
        } else if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }

        if (!res.data) {
            //服务器没有返回数据，正常情况下不会发生的吧
            return;
        }

        // //用户实名认证
        // message UserCertification {
        //     required int32 status = 1;//审核状态  0:审核中， 1:认证不通过，2:认证通过
        //     optional string userId = 2;//用户Id
        //     optional string idCard = 3;//身份证号
        //     optional string realName = 4;//真实姓名
        //     optional int32 coverTime = 5;//修改身份证头像的时间 0为没修改过
        // }

        if (2 == res.data.status) {

        } else if (0 == res.data.status) {
            alert(`审核中，请耐心等待~\n审核人员会在提交后的3个工作日内审核，并在${SECRETARY_NAME}通知审核结果。`);
            return;
        } else {
            _toCertificationView();
            return;
        }

    }

    require("../../router/level2_router").showReadyToStartBroadcastingView();
}


/**
 * 当执行了 RoomCmd.enter 或者 RoomCmd.start 后调用
 * 又或者在房间中
 * @param {String} roomId 
 */
export const getRoomDataAndShowView = async (roomId) => {
    //不同房间的话，先退出原来房间
    if (RoomInfoCache.roomId != roomId) {
        notifyLeaveRoom();
    }

    //获得房间的数据 返回:根据房间类型不同返回不同数据
    //娱乐房间返回:RoomResult.RoomData
    // message getRoomData {
    // 	required string roomId = 1;//房间ID
    // }
    let res = await require("../ServerCmd").RoomCmd_getRoomData({
        roomId: roomId,
    });
    if (HResultStatus.Success != res.state) {
        require("../ErrorStatusModel").default.showTips(res.state);
        return;
    }
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
    // 	optional int32 jobId = 17;// 身份id, 0-官方人员 1-房主 2-嘉宾 3-管理员
    // 	optional UserResult.UserBase roomContribute = 18;//本日房间土豪玩家
    // 	optional string worldContribute = 19;//本日语音土豪玩家ID
    // 	optional FriendRoomData friendRoomData = 20; //交友房数据(或抢帽子玩法数据)
    // 	repeated UserResult.UserBase micQues = 21;//排麦列表 
    // 	repeated KickData kickData = 22;//被踢列表(管理员才有数据)
    // 	optional int32 roomMode = 23;//房间发言模式:0自由,1非自由
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
    // 	optional string dashBoardToken = 52;//声网Token
    // }
    if (!res.data) {
        require("../ErrorStatusModel").default.showTips(HResultStatus.ERROR_SERVER_DATA_ERROR);
        return;
    }

    //缓存数据
    RoomInfoCache.onEnterRoom(res.data);

    //进入声网房间
    NativeModules.Agora.enterVoiceRoom(res.data.dashBoardToken || null, Config.agoraSdkAppId, res.data.roomId, parseInt(UserInfoCache.userId));
    if (isSelfOnSeat()) {
        const bOpenMic = isOpeMic();
        NativeModules.Agora.onSeat(bOpenMic);

        if (bOpenMic) {
            require('../PermissionModel').checkAudioRoomPermission()
                .then(permissStatus => {
                    if (permissStatus == 'denied' || permissStatus == 'blocked') {
                        //麦克风没打开，默认闭麦状态
                        RoomModel.action(ERoomActionType.MIC_CLOSE, UserInfoCache.userId, 0, '')
                        ToastUtil.showCenter('麦克风权限未打开')
                    }
                })
        }
    } else {
        //这个用来解决通知服务器下麦，但是因为断网了，没有通知声网服务器下麦
        NativeModules.Agora.offSeat();
    }

    //语音球数据更新
    require('../SuspendModel').updateInfo();

    //设置缓存到待添加队列
    require('../../cache/RoomPublicScreenCache').setIsCacheAddInfos(false);

    switch (res.data.type) {
        case ERoomType.FUN_FRIEND_ROOM:// 交友房（主类型是 娱乐房）
            // intent.setClass(activity, LiveRoomMFriendsActivity.class);
            //todo
            alert('todo: LiveRoomMFriendsActivity');
            break;
        case ERoomType.FUN_VIDEO_ROOM:// 相亲视频房（主类型是 娱乐房）
            // intent.setClass(activity, VideoMakeFriendActivity.class);
            //todo
            alert('todo: VideoMakeFriendActivity');
            break;
        default:
            if (ERoomMainType.CP_ROOM == res.data.roomType) {
                // 情侣房
                // intent.setClass(activity, LoversRoomActivity.class);
                //todo
                alert('todo: LoversRoomActivity');
            } else if (ERoomMainType.CHAT_ROOM == res.data.roomType) {
                //陪聊房
                require("../../router/level3_router").showChatRoomView();
            } else {
                // 娱乐房
                // 临时房
                // 厅房
                // intent.setClass(activity, LiveRoomActivity.class);

                require("../../router/level2_router").showLiveRoomView();
            }
    }
}



/**
 * 是否开启耳返
 *
 * @param isOpenEarMonitor true 开启，false 不开启
 */
export const switchInEarMonitoring = () => {
    sm_isOpenEarMonitor = !sm_isOpenEarMonitor;
    NativeModules.Agora.enableInEarMonitoring(sm_isOpenEarMonitor);
}

/**
 * 返回耳返的状态
 */
export const getOpenEarMonitor = () => {
    return sm_isOpenEarMonitor;
}


/**
 * 点击开播按钮触发的逻辑
 */
export const beforeOpenLive = () => {
    //在房间
    if (RoomInfoCache.isInRoom) {
        getRoomDataAndShowView(RoomInfoCache.roomId);
        return;
    }

    //境外及港澳台IP使用开关处理
    //这个代码不迁移了

    //进入房间前先检验是否实名
    _doGetUserCertification();
}

/**
 * 是否自己在主麦位
 * @returns {boolean}
 */
export const isSelfOnMainSeat = () => {
    if (!RoomInfoCache.roomData) return false;

    //房主
    if (UserInfoCache.userId == RoomInfoCache.roomData.createId) {
        return true;
    }

    return false;
}

/**
 * 获得指定用户的座位位置
 * @param {String} userId 
 * @returns {int}
 *  -1: 不在座位上
 *  0:  主麦位
 *  >= 1: 其他麦位
 */
export const getUserSeatPosition = (userId) => {
    if (!RoomInfoCache.roomData) return -1;

    //房主
    if (userId == RoomInfoCache.roomData.createId) {
        return 0;
    }

    if (!RoomInfoCache.roomData.infos) {
        return -1;
    }

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
    for (let vo of RoomInfoCache.roomData.infos) {
        if (!vo.base) continue;

        if (userId == vo.base.userId) {
            return vo.position;
        }
    }

    return -1;
}

/**
 * 是否指定的用户在麦位
 * @param {String} userId 
 * @returns {boolean}
 */
export const isUserOnSeat = (userId) => {
    if (!RoomInfoCache.roomData) return false;

    //房主
    if (userId == RoomInfoCache.roomData.createId) {
        return true;
    }

    if (!RoomInfoCache.roomData.infos) {
        return false;
    }

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
    for (let vo of RoomInfoCache.roomData.infos) {
        if (!vo.base) continue;

        if (userId == vo.base.userId) {
            return true;
        }
    }

    return false;
}

/**
 * 是否自己在非主麦位
 * @returns {boolean}
 */
export const isSelfOnOtherSeat = () => {
    if (!RoomInfoCache.roomData) return false;

    if (!RoomInfoCache.roomData.infos) {
        return false;
    }

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
    for (let vo of RoomInfoCache.roomData.infos) {
        if (!vo.base) continue;

        if (UserInfoCache.userId == vo.base.userId) {
            return true;
        }
    }

    return false;
}

/**
 * 是否自己在麦位上
 * @returns {boolean}
 */
export const isSelfOnSeat = () => {
    return isUserOnSeat(UserInfoCache.userId);
}

/**
 * 自己是否开麦
 * @returns {boolean}
 */
export const isOpeMic = () => {
    if (!RoomInfoCache.roomData) return false;

    //房主
    if (UserInfoCache.userId == RoomInfoCache.roomData.createId) {
        return RoomInfoCache.roomData.createOpenMic;
    }

    if (!RoomInfoCache.roomData.infos) {
        return false;
    }

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
    for (let vo of RoomInfoCache.roomData.infos) {
        if (!vo.base) continue;

        if (UserInfoCache.userId == vo.base.userId) {
            return !vo.forbidMic && vo.openMic;
        }
    }

    return false;
}

/**
 * 设置mic是否开启
 * @param {boolean} b 
 * @returns {boolean}
 */
export const enableMic = (b) => {
    if (!RoomInfoCache.roomData) return false;

    //房主
    if (UserInfoCache.userId == RoomInfoCache.roomData.createId) {
        if (RoomInfoCache.roomData.createOpenMic == b) {
            return false;
        }
        RoomInfoCache.roomData.createOpenMic = b;

        NativeModules.Agora.enableMic(b);
        return true;
    }

    if (!RoomInfoCache.roomData.infos) {
        // console.log('设置mic是否开启------' + b)
        return false;
    }

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
    for (let vo of RoomInfoCache.roomData.infos) {
        if (!vo.base) continue;

        if (UserInfoCache.userId == vo.base.userId) {
            if (vo.forbidMic) {
                return false;
            }

            if (vo.openMic == b) {
                return false;
            }

            vo.openMic = b;

            NativeModules.Agora.enableMic(b);
            return true;
        }
    }
    return false;
}

/**
 * 设置自己服务器缓存数据的mic状态
 * 目前只用于抱上麦，强制设置
 * 别乱用！！！！！
 * @param {boolean} b 
 */
export const setMicStatusCache = (b) => {
    if (!RoomInfoCache.roomData) return false;

    //房主
    if (UserInfoCache.userId == RoomInfoCache.roomData.createId) {
        if (RoomInfoCache.roomData.createOpenMic == b) {
            return false;
        }
        RoomInfoCache.roomData.createOpenMic = b;

        return true;
    }

    if (!RoomInfoCache.roomData.infos) {
        // console.log('设置mic是否开启------' + b)
        return false;
    }

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
    for (let vo of RoomInfoCache.roomData.infos) {
        if (!vo.base) continue;

        if (UserInfoCache.userId == vo.base.userId) {
            if (vo.forbidMic) {
                return false;
            }

            if (vo.openMic == b) {
                return false;
            }

            vo.openMic = b;

            return true;
        }
    }
    return false;
}

/**
 * 设置扬声器是否开启
 * @param {boolean} b
 * @returns {boolean} 
 */
export const enableSpeaker = (b) => {
    // if (!isSelfOnSeat()) return false;

    if (RoomInfoCache.enableSpeaker == b) return false;

    RoomInfoCache.enableSpeaker = b;
    NativeModules.Agora.enableSpeaker(b);
    return true;
}

/**
 * 修改房间公告
 * @param {string} s 
 */
export const modifyNotice = async (s) => {
    if (!s) {
        require('../../view/base/ToastUtil').default.showBottom("输入内容不能为空！");
        return;
    }

    let check1 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(s);
    if ((check1 != null) && (check1 === true)) {
        ToastUtil.showCenter('当前内容含有不规范内容')
        return false
    }

    RoomModel.modifyRoom(ERoomModify.UPDATE_NOTIC_KEY, s);
}

/**
 * 通知退出房间
 * 一般是主动退房，或者服务器通知退房
 */
export const notifyLeaveRoom = () => {
    const roomId = RoomInfoCache.roomId;
    if (!roomId) {
        return null;
    }

    //清空公屏
    require('../../cache/RoomPublicScreenCache').clear();

    //通知缓存离开房间
    RoomInfoCache.onLeaveRoom();

    //退出当前声网房间
    NativeModules.Agora.leave();

    //退出房间im群聊
    require('../chat/ChatModel').quitGroup(roomId);

    //语音球数据更新
    require('../SuspendModel').updateInfo();

    return roomId;
}

const RoomModel = {

    async getEggGameSwitch(roomId, roomType) {
        const results = await Promise.all([
            require("../staticdata/StaticDataModel").getPrizeRule(),
            require("../staticdata/StaticDataModel").getEggDisplayConfig(),
        ]);

        if (!results[0]) {
            return null;
        }
        if (!results[1]) {
            return null;
        }

        // const vo = results[1][0]
        // console.warn(vo.playname, vo.playobj, vo.playunit, vo.egg1name, vo.egg2name, vo.egg3name)

        // "keys":["allgoldshell","allswitch","bigrpool","bigrratio","buygiftids","canbigrdivide","canbigrratio","canbigrvalue","canhighcount","canhighratio","canhighvalue","canhighweekvalue","channelhide","createtime","daygoldshell","dayincome","effectiveroom","effectiveuserid","eggtype","gameswitch","giftids","giftnames","giftswitch","highpoolratio","id","income","luckfullvalue","luckratio","max","maxtoast","noticeswitch","officialswitch","priority","privategoldshell","prizetype","ratio1","ratio2","ratio3","ratio4","resetpoolratio","resetpoolvalue","riskswitch","roomgoldshell","s1cartoon","s1goldshell","s1ratio","s2cartoon","s2goldshell","s2ratio","s3cartoon","s3goldshell","s3ratio","screengoldshell","showgiftids","showgiftnames","smltpoolswitch","sms","tabswitch","telephone","toast","updatetime","userid","username","versionhide","visibleroom","wewinratio2"]
        const prizeRuleList = results[0];
        // "keys":["activitygifts","allimgoldshell","channelhide","consumemode","contribute","egg1mode","egg2mode","iconname","id","imgoldshell","landh5url","privategoldshell","renewcount","renewgoldshell","renewratio","renewvaluepercent","roomgoldshell","servergoldshell","updatetime","versionhide"]
        const eggDisplayConfigList = results[1];

        const eggDisplayConfig = eggDisplayConfigList[0];
        let contribute = 0;
        const eggDisplayVo = {
            iconName: null,
            updateTime: null,
            landh5url: null,
            open: false,
        };
        if (eggDisplayConfig) {
            contribute = parseInt(eggDisplayConfig.contribute);
            eggDisplayVo.iconName = eggDisplayConfig.iconname;
            eggDisplayVo.updateTime = eggDisplayConfig.updatetime;
            eggDisplayVo.landh5url = eggDisplayConfig.landh5url;
        }
        if (
            prizeRuleList
            && UserInfoCache.userInfo
            && UserInfoCache.userInfo.contribute >= contribute
        ) {
            //满足砸蛋可见的土豪值
            let visibleRoom = '';
            for (let vo of prizeRuleList) {
                if (vo.visibleroom) {
                    visibleRoom += vo.visibleroom + ',';
                }
            }

            if (
                !visibleRoom
                && eggDisplayConfig.channelhide.indexOf(Config.mobileInfos.channel) < 0
                && eggDisplayConfig.versionhide.indexOf(Config.version) < 0
                && eggDisplayConfig.channelhide.indexOf("all") < 0
                && eggDisplayConfig.versionhide.indexOf("all") < 0
            ) {
                //没有填可见房间
                eggDisplayVo.open = true;
            } else if (
                visibleRoom.indexOf(roomId) >= 0//是可见房间
                && eggDisplayConfig.channelhide.indexOf(Config.mobileInfos.channel) < 0
                && eggDisplayConfig.versionhide.indexOf(Config.version) < 0
                && eggDisplayConfig.channelhide.indexOf("all") < 0
                && eggDisplayConfig.versionhide.indexOf("all") < 0
            ) {
                //非不可见版本
                eggDisplayVo.open = true;
            }
        }

        if (eggDisplayVo.open && roomType == ERoomType.FUN_VIDEO_ROOM) {
            // "keys":["id","value","desc"]
            const publicConfig = await require("../staticdata/StaticDataModel").getPublicConfig(98);//视频房砸蛋开关
            if (!publicConfig) {
                //拿数据失败
                eggDisplayVo.open = false;
            } else {
                eggDisplayVo.open = '1' === publicConfig.value;
            }
        }

        if (!eggDisplayVo.open) {
            return null;
        }

        let gameIcon;
        if (eggDisplayVo.iconName) {
            gameIcon = Config.getLogoUrl(`eggicon/${eggDisplayVo.iconName}`, eggDisplayVo.updateTime);
        } else {
            gameIcon = icon_luobo_banner();
        }

        return {
            landh5url: eggDisplayVo.landh5url,
            gameIcon: gameIcon,
        }

    },
    //获取主播、房主信息
    async getOwnerData(createId, roomOwnerId) {

        // console.log('房间主麦信息id=', createId, roomOwnerId)

        const result = await Promise.all([
            createId
                ? require('../ServerCmd').MyCmd_getPersonPage({
                    userId: createId,
                })
                : Promise.resolve({ state: HResultStatus.Success, data: null })
            ,
            roomOwnerId
                ? require('../ServerCmd').MyCmd_getPersonPage({
                    userId: roomOwnerId,
                })
                : Promise.resolve({ state: HResultStatus.Success, data: null })
        ])


        if (
            HResultStatus.Success != result[0].state
            || HResultStatus.Success != result[1].state
        ) {
            return false;
        }

        let createUserInfo = result[0].data && result[0].data.info
        let roomOwnerInfo = result[1].data && result[1].data.info


        //更新缓存
        RoomInfoCache.updateCreatorAndOwner(createUserInfo, roomOwnerInfo);

        return true;
    },

    //获取房间数据
    async getRoomData() {
        const result = await require('../ServerCmd').RoomCmd_getRoomData({
            roomId: RoomInfoCache.roomId,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }
        //更新房间缓存数据
        RoomInfoCache.updateRoomData(result.data)
    },

    //获取直播间小banner
    async getRoomSmallBanner() {
        //目前没有用，暂时不实现

    },


    //停播
    // message stop {	
    // }
    async stop() {
        const result = await require('../ServerCmd').RoomCmd_stop()

    },

    //房间里操作类型
    // message action {
    // 	required string roomId = 1;//房间ID	
    // 	required int32 actType = 2;//操作类型:见ERoomActionType
    // 	required string targetId = 3;//为空时为全员操作(设密码时把密码放在targetId)
    // 	required int32 position = 4;//mic的位置(针对上锁,解锁,邀请好友)；actType为25、28，此字段代表pc模式，0代表app，1代表pc
    // 	optional string param = 5;//扩展参数
    // }
    async action(actType, targetId, position, param) {
        const result = await require('../ServerCmd').RoomCmd_action({
            roomId: RoomInfoCache.roomId,
            actType,
            targetId,
            position,
            param,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }

        if (ERoomActionType.MIC_DOWN == actType) {
            //主动下麦
            if (UserInfoCache.userId == targetId) {
                NativeModules.Agora.offSeat();
            }
        }
        // else if (ERoomActionType.MIC_UP == actType) {
        //     //主动上麦
        //     if (UserInfoCache.userId == targetId) {
        //         NativeModules.Agora.onSeat(true);
        //     }
        // }

        return true
    },



    //检查密码
    // message checkPwd {
    // 	required string roomId = 1;//房间ID
    // 	required string password = 2;//密码
    // }
    async checkPwd(roomId, password) {
        const result = await require('../ServerCmd').RoomCmd_checkPwd({
            roomId: roomId,
            password: password,
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }
        return true
    },

    //进入直播间
    async enterLiveRoom(roomId, password) {
        if (RoomInfoCache.isInRoom && isChatRoom(RoomInfoCache.roomId)) {
            //因为这样会弹出收益/评价dialog，导致进入房间的View进行Push，会报错
            // require("../../router/level2_router").showNormInfoDialog("确认退出热聊，进入房间吗", "确认", _toEnterLiveRoom);
            require("../../router/level2_router").showInfoDialog("退出热聊后才能进入房间哦");
            return
        }

        await _toEnterLiveRoom(roomId, password);

    },

    /**
     * 断线重进房间
     */
    reCheckEnter() {
        if (RoomInfoCache.roomData) {
            enter(RoomInfoCache.roomId, '', 1)
        }
    },


    /**
     * 主动退房
     */
    leave(bNotifyServer = true) {
        const roomId = notifyLeaveRoom();
        if (!roomId || !bNotifyServer) {
            return;
        }

        //退出房间(要处理离线自动退出以及房主切换)
        // message leave {
        // 	required string roomId = 1;//房间ID
        // }
        require('../ServerCmd').RoomCmd_leave({
            roomId,
        });

    },


    //修改房间配置
    // message modifyRoom {
    // 	required string roomId = 1;//房间ID
    // 	repeated string keys = 2;//修改的key （见ERoomModify)
    // 	repeated string values = 3;//修改的值
    // }
    async modifyRoom(keys, values) {
        const result = await require('../ServerCmd').RoomCmd_modifyRoom({
            roomId: RoomInfoCache.roomId,
            keys: [keys],
            values: [values],
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }
        RoomModel.getRoomData()
        return true
    },



    //获得房间的麦位数据 返回:RoomResult.RoomMicData
    // message getRoomMicData {
    // 	required string roomId = 1;//房间ID
    // 	required int32 position = 2;//获取mic的位置,0获取全部
    // }
    async getRoomMicData(position) {
        const result = await require('../ServerCmd').RoomCmd_getRoomMicData({
            roomId: RoomInfoCache.roomId,
            position,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }
        //更新麦位缓存
        RoomInfoCache.updateRoomMicData(result.data.infos)
    },


    //获得房间在线成员 返回:RoomResult.MemberList
    // message getOnlineMembers {
    // 	required string roomId = 1;//房间id
    // 	required int32 start = 2;//
    // 	required int32 end = 3;//
    // }
    async getOnlineMembers(roomId, start, end) {
        const result = await require('../ServerCmd').RoomCmd_getOnlineMembers({
            roomId,
            start,
            end,
        })
        if (HResultStatus.Success != result.state) {
            return {
                list: [],
                onlineNum: 0,
            }
        }

        return {
            list: result.data.list,
            onlineNum: result.data.onlineNum,
        }

    },



    // 获得语音房分成信息列表，返回：RoomResult.FunRoomDividedRateInfos
    // message getFunRoomDividedRateInfos {
    // 	required string roomId = 1;// 语音房id
    // }
    async getFunRoomDividedRateInfos(roomId) {
        const result = await require('../ServerCmd').RoomCmd_getFunRoomDividedRateInfos({
            roomId,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return []
        }

        return result.data.list

    },


    //获取房间类型
    async getRoomType(type) {
        const result = await require('../staticdata/StaticDataModel').getRoomTypeById(type)

        if (!result) {
            return '其他'
        }

        return result.type
    },

    //获取房间名字:返回RoomResult.RoomName
    // message getRoomName {
    // 	required string roomId = 1;//房间ID	
    // }
    async getRoomName(roomId) {
        const result = await require('../ServerCmd').RoomCmd_getRoomName({
            roomId
        })
        if (HResultStatus.Success != result.state) {
            return ""
        }
        return result.data.name
    },



    //获取房间信息:返回RoomResult.RoomOpenInfo
    // message getRoomInfo {
    // 	required string roomId = 1;//房间ID	
    // }
    async getRoomInfo(roomId) {
        const result = await require('../ServerCmd').RoomCmd_getRoomInfo({
            roomId
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }

        //房间开播信息
        // message RoomOpenInfo {
        // 	required string roomName = 1;//开播房间名
        // 	required int32 roomType = 2;//开播房间类型
        // 	optional UserResult.UserBase anchorData = 3;//主播信息(logoTime=0时传)
        // 	optional int32 logoTime = 4;//修改logo的时间 0为没修改过
        // 	repeated string bgs = 5;//最近使用的背景图
        // 	repeated HallData halls = 6;//厅配置信息(调新命令RoomCmd.getStartRoomInfo时返回)
        // }
        return result.data
    },


    //获取房间或频道在线人数:返回CommonResult.IntDatas
    // message getOnlines {
    // 	repeated string roomIds = 1;//房间id
    // }
    async getOnlines(roomIds) {
        const result = await require('../ServerCmd').RoomCmd_getOnlines({
            roomIds,
        })
        if (HResultStatus.Success != result.state) {
            return 0
        }
        return result.data
    },




    //获取当前在线的房间ID:CommonResult.StringResult
    // message getOnlineRoomId {
    // }
    async getOnlineRoomId() {
        const result = await require('../ServerCmd').RoomCmd_getOnlineRoomId()
        if (HResultStatus.Success != result.state) {
            return
        }
        return result.data
    },


    //获取用户是否被禁言(只有房主才能调用):返回CommonResult.LongResult:0代表没被禁言
    // message getForbidTime {
    // 	required string roomId = 1;//房间ID	
    // 	required string targetId = 2;//查找的对方id
    // }
    async getForbidTime(roomId, targetId) {
        const result = await require('../ServerCmd').RoomCmd_getForbidTime({
            roomId,
            targetId,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return 0
        }
        return result.data
    },


    //@房间用户
    // message atRoomUser {
    // 	required string roomId = 1;//房间ID
    // 	repeated string atTargetIds = 2;//被@的用户ID数组
    // }
    async atRoomUser(roomId, atTargetIds) {
        const result = await require('../ServerCmd').RoomCmd_atRoomUser({
            roomId,
            atTargetIds,
        })
    },

    // 举报房间
    // message reportRoom {
    // 	required string roomId = 1;//房间ID
    // 	required int32 reason = 2;//举报理由
    // }
    async reportRoom(roomId, reason) {
        const result = await require('../ServerCmd').RoomCmd_reportRoom({
            roomId,
            reason,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
        }
        if(HResultStatus.Success == result.state)   return true;
        return result;
    },


    //判断是否在麦上
    // message isInMic {
    //         required string roomId = 1;//房间Id
    // }
    async isInMic(roomId) {
        const result = await require('../ServerCmd').RoomCmd_isInMic({
            roomId
        })
        if (HResultStatus.Success != result.state) {
            return false
        }
        return result.data
    },



    //获取关注推送信息:返回RoomResult.LivePushInfo
    // message getLivePushInfo {
    // }
    async getLivePushInfo() {

    },

    //娱乐玩法/魔法表情，CommonResult.IntDatas
    // message getRecreations {
    //     required string id = 1;//配置id
    //     required string roomId = 2;//房间id
    // }
    async getRecreations(id, roomId) {
        const result = await require('../ServerCmd').RoomCmd_getRecreations({
            id,
            roomId,
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
        }
    },


    //获取最近进入的房间ID列表:返回RoomResult.EnterRoomList
    // message getEnterRoomList {
    // }
    async getEnterRoomList() {
        const result = await require('../ServerCmd').RoomCmd_getEnterRoomList()
        if (HResultStatus.Success != result.state) {
            return []
        }
        //最近进入的房间ID列表
        // message EnterRoomList {
        // 	repeated string roomIds = 1;//房间Id列表
        // }
        return result.data.roomIds
    },

    // 设置管理员
    // message setManager {
    //     required string roomId = 1;// 房间id
    //     required string targetId = 2;// 管理员id
    //     required int32 jobId = 3;// 现在只有3，默认传3, 若是收回权限，传-1
    // }
    async setManager(roomId, targetId, jobId) {
        const result = await require('../ServerCmd').RoomCmd_setManager({
            roomId,
            targetId,
            jobId
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
        }
    },

    // 管理员列表:RoomResult.ManagerList
    // message managers {
    // required string roomId = 1;// 房间id
    // }
    async getManagers(roomId) {
        const result = await require('../ServerCmd').RoomCmd_managers({
            roomId,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return {
                num: 0,
                list: [],
            }
        }
        //管理员列表
        // message ManagerList {
        // 	repeated ManagerInfo list = 1;//管理员数据
        // 	required int32 num = 2;//管理员人数

        return {
            num: result.data.num,
            list: result.data.list,
        }
    },

    // 获取用户在房间的职位:CommonResult.IntResult  0:官方人员 1:会长 2:房主 3:房间(Common)管理员 4:嘉宾
    // message getJobId {
    //     required string roomId = 1;// 房间id
    //     required string targetId = 2;// 目标id
    // }
    async getJobId(roomId, targetId) {

        const result = await require('../ServerCmd').RoomCmd_getJobId({
            roomId,
            targetId,
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return 4
        }

        return result.data.data
    },

    //获取开播房间信息:返回RoomResult.RoomOpenInfo
    // message getStartRoomInfo {
    // }
    async getStartRoomInfo() {
        const result = await require('../ServerCmd').RoomCmd_getStartRoomInfo()

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }

        //房间开播信息
        // message RoomOpenInfo {
        // 	required string roomName = 1;//开播房间名
        // 	required int32 roomType = 2;//开播房间类型
        // 	optional UserResult.UserBase anchorData = 3;//主播信息(logoTime=0时传)
        // 	optional int32 logoTime = 4;//修改logo的时间 0为没修改过
        // 	repeated string bgs = 5;//最近使用的背景图
        // 	repeated HallData halls = 6;//厅配置信息(调新命令RoomCmd.getStartRoomInfo时返回)
        // }R
        return result.data
    },

    //获得房间用户心动榜 返回:RoomResult.HeartRankList
    // message getUserHeartRank {
    // 	required string roomId = 1;// 房间id
    // 	required string userId = 2;// 用户id
    // 	optional int32 row = 3;//前row条
    // }
    async getUserHeartRank(roomId, userId, row) {
        const result = await require('../ServerCmd').RoomCmd_getUserHeartRank({
            roomId,
            userId,
            row,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }

        return result.data
    },

    /// 获取房间信息:RoomResult.BaseRoomInfoList
    // message getRoomInfoList {
    // 	repeated string roomIds = 1;// 房间id数组
    // }
    async getRoomInfoList(roomIds) {
        const result = await require('../ServerCmd').RoomCmd_getRoomInfoList({
            roomIds
        })

        if (HResultStatus.Success != result.state) {
            return []
        }

        // 房间基础信息列表
        // message BaseRoomInfoList {
        // 	repeated BaseRoomInfo infos = 1;//
        // }
        return result.data.infos
    },


    // 用户所有的厅Id:CommonResult.StringArrayResult
    async getUserHallIds() {
        const result = await require('../ServerCmd').RoomCmd_getUserHallIds()
        if (HResultStatus.Success != result.state) {
            return []
        }
        return result
    },



    // 获得小黑屋人员列表 UserResult.UserBaseList
    // message getDarkRoomMemberList {
    //     required string roomId = 1;// 查询的房间id
    //     optional int32 index = 2;// 当前已获得的列表长度(每次返回20条，index用于分页)
    // }
    async getDarkRoomMemberList(roomId, index) {
        const result = await require('../ServerCmd').RoomCmd_getDarkRoomMemberList({
            roomId,
            index
        })


        if (HResultStatus.Success != result.state) {
            return []
        }

        //用户数据列表(用户昵称+头像)
        // message UserBaseList {
        // 	repeated UserBase list = 1;
        // }
        return result.data.list
    },

    //房间配置数据
    // message getRoomConfigData {
    //     required string roomId = 1;//房间ID
    // }
    async getRoomConfigData() {
        const result = await require('../ServerCmd').RoomCmd_getRoomConfigData({
            roomId: RoomInfoCache.roomId,
        })

        if (HResultStatus.Success != result.state) {
            return false
        }
        return result.data.hasFreeModeEntrance
    },


    //获取房间靓号
    async getRoomIdCuteNumber(roomId) {
        roomId = roomId.replace('T', '')


    },

    //是否关注
    async isAttentionBtn(roomId, createId, friendStatus) {
        return roomId && !(createId == require('../../cache/UserInfoCache').default.userId)
            && !(roomId.indexOf('T') >= 0) && friendStatus != 0 && !(friendStatus == 1 || friendStatus == 2)
    },

    //砸蛋表
    async getEggData() {

        const results = Promise.all([
            require('../staticdata/StaticDataModel')
        ])
    },

    setBgRef(ref) {
        _bgRef = ref;
    },

    getBgRef() {
        return _bgRef;
    },



    jobName(id) {
        switch (id) {
            case 0:
                return '官方'
            case 1:
                return '房主'
            case 2:
                return '房主'
            case 3:
                return '管理'
            default:
                return ''
        }
    },


};

export default RoomModel;

