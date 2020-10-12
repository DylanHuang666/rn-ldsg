/**
 * 房间公屏逻辑
 */
'use strict';

import {
    doAddInfo,
    TYPE_ENTER_ROOM,
    TYPE_FOLLOW_NOTICE,
    TYPE_GIFT,
    TYPE_GIFT_ALL_MIC,
    TYPE_IM_PHOTO,
    TYPE_IM_TEXT,
    TYPE_MAGIC_EMOJI,
    TYPE_SMASH_EGG,
    TYPE_SYSTEM_NOTICE,
    TYPE_TEXT,
    TYPE_ACTIVITY_TEXT,
    TYPE_TREASURE_BOX,
    TYPE_TREASURE_BOX_ALL_MIC
} from "../../cache/RoomPublicScreenCache";
import { EUserDataType } from "../../hardcode/EUserDataType";
import HResultStatus from "../../hardcode/HResultStatus";


/**
 * 系统公告
 * @param {String} content 
 */
export const systemNotice = content => {
    doAddInfo({
        type: TYPE_SYSTEM_NOTICE,
        content,
    });
}

/**
 * 进入房间
 * @param {EnterRoomBroadcast}  result
 */
export const enterRoom = (result) => {
    //TODO:
    //????????????

    doAddInfo({
        type: TYPE_ENTER_ROOM,
        result,
    });
}

/**
 * 砸蛋
 * @param {boolean} isWorld 是否全服
 * @param {{
 *  data: SmashEggResultBroadcast,
 *  giftVo: ReceiveGiftInfo,
 *  giftData: CS_GiftList,
 * }[]} list
 */
export const smashEgg = (isWorld, list) => {
    for (let vo of list) {
        doAddInfo({
            type: TYPE_SMASH_EGG,
            isWorld,
            vo,
        });
    }
}

/**
 * 活动砸蛋
 * @param {boolean} isWorld 是否全服
 * @param {{
    *  data: SmashEggResultBroadcast,
    *  giftVo: ReceiveGiftInfo,
    *  giftData: CS_GiftList,
    * }[]} list
    */

export const smashActivityEgg = (isWorld, list) => {
    for (let vo of list) {
        doAddInfo({
            type: TYPE_ACTIVITY_TEXT,
            isWorld,
            vo,
        });
    }
}

/**
 * 送礼物
 * @param {{
 *      data : LiveRoomSendGiftsBroadcast,
 *      receiverInfo: LiveRoomGiftReceiverInfo,
 *      giftData: CS_GiftList,
 * }[]} list
 */
export const gift = (list) => {
    // 房间送礼物广播通知
    // message LiveRoomSendGiftsBroadcast {
    // 	required UserResult.UserBase fromUserBase = 1;// 送礼用户Id
    // 	//required string fromNickName = 2;// 送礼用户昵称
    // 	required string giftId = 2;//赠送的礼物ID
    // 	required int32 giftNum = 3;//赠送的礼物数量
    // 	optional int32 fromCharmLevel = 4;// 送礼用户魅力等级
    // 	optional int32 fromContributeLevel = 5;// 送礼用户土豪等级
    // 	optional string roomId = 6;//房间ID
    // 	repeated LiveRoomGiftReceiverInfo receiverInfos = 7;//房间礼物接收者数据数组
    // 	optional int32 groupNum = 8;//礼物分组数量，默认1
    // 	optional int32 charm = 9;// 当前房间日贡献值:已无用
    // 	optional int32 broadcastType = 10;//播放类型:0默认普通播放,1房间跑道,2全服跑道
    // 	optional string roomName = 11;//房间名字(2全服跑道时传值)
    // 	optional string boxId = 12;//赠送的宝箱ID
    // 	optional int64 contribute = 13;// 当前房间日贡献值
    // 	optional bool roomAll = 14;//是否全房间
    // 	optional int64 newContribute = 15;// 当前房间日新贡献值(神豪值)
    // 	optional int32 price = 16;// 礼物单价(金贝数)
    // }

    //获取玩家基本信息
    // message UserBase {
    // 	required string userId = 1;//用户ID
    // 	optional string nickName = 2;//用户昵称
    // 	optional int32 logoTime = 3;//修改logo的时间 0为没修改过
    // 	optional string thirdIconurl = 4;//第三方头像
    // 	optional string headFrameId = 5;// 头像框
    // 	optional int32 sex = 6; // 姓别 0 未知 1:男 2:女
    //     optional int32 age = 7; //年龄
    //     optional int32 vipLv = 8; //VIP等级
    // 	optional string slogan = 9;//
    // 	optional int32 contributeLv = 10;// 土豪等级
    // 	optional string position = 11;//地标
    // 	optional string channelId = 12;//用户渠道id
    // 	optional int32 friendStatus = 13;// 好友状态
    // }

    // "keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]

    if (list.length > 1) {

        //全麦送礼
        doAddInfo({
            type: TYPE_GIFT_ALL_MIC,
            vo: list[0],
        });

    } else {
        for (let vo of list) {
            doAddInfo({
                type: TYPE_GIFT,
                vo,
            });
        }
    }

}

/**
 * 送宝箱
 * @param {{
    *      data : LiveRoomSendGiftsBroadcast,
    *      receiverInfo: LiveRoomGiftReceiverInfo,
    *      giftData: CS_GiftList,
    * }[]} list
    */
export const treasureBox = (list) => {
    // 房间送礼物广播通知
    // message LiveRoomSendGiftsBroadcast {
    // 	required UserResult.UserBase fromUserBase = 1;// 送礼用户Id
    // 	//required string fromNickName = 2;// 送礼用户昵称
    // 	required string giftId = 2;//赠送的礼物ID
    // 	required int32 giftNum = 3;//赠送的礼物数量
    // 	optional int32 fromCharmLevel = 4;// 送礼用户魅力等级
    // 	optional int32 fromContributeLevel = 5;// 送礼用户土豪等级
    // 	optional string roomId = 6;//房间ID
    // 	repeated LiveRoomGiftReceiverInfo receiverInfos = 7;//房间礼物接收者数据数组
    // 	optional int32 groupNum = 8;//礼物分组数量，默认1
    // 	optional int32 charm = 9;// 当前房间日贡献值:已无用
    // 	optional int32 broadcastType = 10;//播放类型:0默认普通播放,1房间跑道,2全服跑道
    // 	optional string roomName = 11;//房间名字(2全服跑道时传值)
    // 	optional string boxId = 12;//赠送的宝箱ID
    // 	optional int64 contribute = 13;// 当前房间日贡献值
    // 	optional bool roomAll = 14;//是否全房间
    // 	optional int64 newContribute = 15;// 当前房间日新贡献值(神豪值)
    // 	optional int32 price = 16;// 礼物单价(金贝数)
    // }

    //获取玩家基本信息
    // message UserBase {
    // 	required string userId = 1;//用户ID
    // 	optional string nickName = 2;//用户昵称
    // 	optional int32 logoTime = 3;//修改logo的时间 0为没修改过
    // 	optional string thirdIconurl = 4;//第三方头像
    // 	optional string headFrameId = 5;// 头像框
    // 	optional int32 sex = 6; // 姓别 0 未知 1:男 2:女
    //     optional int32 age = 7; //年龄
    //     optional int32 vipLv = 8; //VIP等级
    // 	optional string slogan = 9;//
    // 	optional int32 contributeLv = 10;// 土豪等级
    // 	optional string position = 11;//地标
    // 	optional string channelId = 12;//用户渠道id
    // 	optional int32 friendStatus = 13;// 好友状态
    // }

    // "keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]

    //    boxData: 
    //    [ { picurl: '',
    //        maxtoast: '白银宝箱上线',
    //        maxcount: 10000,
    //        id: 31,
    //        gifurl: '',
    //        giftlable: '',
    //        createdate: '2020-09-28 12:03:41',
    //        boxtype: 0,
    //        updatedate: '2020-09-28 18:32:45',
    //        startdate: '2020-09-28 12:03:06',
    //        serialnumber: 1,
    //        price: 10,
    //        isonline: 1,
    //        enddate: '2020-10-31 00:00:00',
    //        detail: 'G113=100%',
    //        createuser: 'A',
    //        boxname: '白银宝箱',
    //        boxid: 'B1' } ] }


    if (list.length > 1) {

        //全麦送礼
        doAddInfo({
            type: TYPE_TREASURE_BOX_ALL_MIC,
            vo: list[0],
        });

    } else {
        for (let vo of list) {
            doAddInfo({
                type: TYPE_TREASURE_BOX,
                vo,
            });
        }
    }

}


/**
 * 纯文本提示
 * @param {String} content 
 */
export const textTips = content => {
    doAddInfo({
        type: TYPE_TEXT,
        content,
    });
}

/**
 * im图片信息
 * @param {Object} data 
 */
export const imPhoto = data => {

    // data = {    { broadcastType: 0,
    //             showWelcome: false,
    //             groupNum: 0,
    //             isHatBuff: false,
    //             isShowPrice: false,
    //             levelType: 0,

    //             content: '7529881/eb633b0747b1aa7d0417fe124b734b05',
    //             sender: 
    //             { charmLv: 3,
    //             contributeLv: 11,
    //             guardianLv: 0,
    //             guardianName: '',
    //             hatId: '',
    //             headFrameId: '',
    //             headUrl: 'http://xvoice-outtest-1301112906.image.myqcloud.com/app/logo/user/7529881?imageView2/auto-orient/w/150/h/150&logotime=74032137',
    //             isGuardian: false,
    //             isHatBuff: false,
    //             isNewUser: false,
    //             nickName: '活泼的北极熊',
    //             sex: 2,
    //             userId: '7529881',
    //             vipLv: 7 },
    //             type: 7 }
    //         }

    doAddInfo({
        type: TYPE_IM_PHOTO,
        data,
    });
}

/**
 * im纯文本信息
 * @param {Object} data 
 */
export const imText = data => {


    // const data = {
    //     type: 1,    //MessageConstant.TEXT
    //     content,
    //     sender: {
    //         headUrl: Config.getHeadUrl(userInfo.userId, userInfo.logoTime, userInfo.thirdIconurl),
    //         charmLv: userInfo.charmLv,
    //         vipLv: userInfo.vipLv,
    //         sex: userInfo.sex,
    //         headFrameId: userInfo.headFrameId,
    //         contributeLv: userInfo.contributeLv,
    //         nickName: userInfo.nickName,
    //         userId: userInfo.userId,
    //         isNewUser: userInfo.isNew,

    //         hatId,
    //         guardianName,
    //         isGuardian,
    //         guardianLv,
    //     },
    // };

    doAddInfo({
        type: TYPE_IM_TEXT,
        data,
    });
}

/**
 * im纯文本信息
 * @param {Object} data 
 */
export const followText = data => {
    doAddInfo({
        type: TYPE_FOLLOW_NOTICE,
        data
    })
}

/**
 * 魔法表情信息
 * @param {Object} data 
 */
export const magicEmoji = async data => {
    // { results: [],
    //     roomId: 'A1001048',
    //     userId: '1001078',
    //     recreationId: 'R001',
    // }

    //hdata
    // "keys":["id","name","playType","num","range","msg","flashName","flashVersion","isShowScreen"]

    const userInfoList = await require('../../model/ServerCmd').MyCmd_getUserInfoList({
        userIds: [data.userId],
        type: EUserDataType.NICKNAME + EUserDataType.CONTRIBUTELEVEL + EUserDataType.CONTRIBUTE,
    })

    if (HResultStatus.Success != userInfoList.state) {
        require('../ErrorStatusModel').default.showTips(userInfoList.state)
        return
    }
    if (!userInfoList.data) {
        return;
    }

    const userInfo = userInfoList.data.list[0];
    data.userInfo = userInfo;

    doAddInfo({
        type: TYPE_MAGIC_EMOJI,
        data
    })
}