'use strict';

import RoomInfoCache from '../../cache/RoomInfoCache';
import ModelEvent from '../../utils/ModelEvent';
import {
    EVT_LOGIC_UPDATE_GIFT_BANNER, EVT_LOGIC_UPDATE_FULL_SERVICE_GIFT_BANNER, EVT_LOGIC_SHOW_FULL_SCREEN_WEBP,
    EVT_LOGIC_UPDATE_OTHER_PERSON_GIFT_FLY,
    EVT_LOGIC_GIFT_MY_ROOM,
    EVT_LOGIC_SHOW_FULL_SCREEN_FLASH,
} from '../../hardcode/HLogicEvent';
import Config from '../../configs/Config';
import UserInfoCache from '../../cache/UserInfoCache';
import { EUserDataType } from '../../hardcode/EUserDataType';
import { NativeModules } from 'react-native';


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

// //房间礼物接收者数据
// message LiveRoomGiftReceiverInfo {
// 	required string toUserId = 1;// 接收用户Id
// 	required string toNickName = 2;// 接收用户昵称
// 	optional int32 toCharmLevel = 3;// 接收用户魅力等级
// 	optional int32 toContributeLevel = 4;// 接收用户土豪等级
// 	optional int64 toHeartValue = 5;// 接收用户交友心动值
// 	optional int32 toSex = 6;//接收用户性别
// }

// //Mic位数据
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

const SHOW_GIFT_TYPE_SMALL = 1;//小礼物

const SHOW_GIFT_TYPE_BIG = 2;//大礼物

const SMALL_GIFT_TYPE = 0;//小礼物

const BIG_GIFT_TYPE = 1;//大礼物

const FREE_GIFT_TYPE = 3;//免费礼物

const SPEC_GIFT_TYPE = 5;//专属礼物

function _doShowGiftFly(giftUrl, data) {
    if (data.fromUserBase.userId == UserInfoCache.userId) {
        return;
    }
    const roomData = RoomInfoCache.roomData;
    const micInfos = roomData.infos;
    const mainMicUserInfo = RoomInfoCache.mainMicUserInfo;


    const imageUri = { uri: giftUrl };
    const list = [];
    for (const receiverInfo of data.receiverInfos) {
        if (mainMicUserInfo && mainMicUserInfo.userId == receiverInfo.toUserId) {
            //主麦
            list.push({
                micPostion: 0,
                imageUri,
            });
            continue;
        }

        //其他麦位
        if (!micInfos) continue;

        for (const micInfo of micInfos) {
            if (!micInfo.base) continue;
            if (micInfo.base.userId == receiverInfo.toUserId) {
                list.push({
                    micPostion: micInfo.position,
                    imageUri,
                });
                break;
            }
        }
    }

    ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_OTHER_PERSON_GIFT_FLY, list);
}

export default async function (evName, data) {
    //数据校验
    if (
        !data.fromUserBase
        || !data.receiverInfos
        || data.receiverInfos.length == 0
    ) {
        return;
    }


    data.fromUserBase.fromContributeLevel = data.fromContributeLevel

    //该广播为当前所在房间广播才需要刷新房间数据
    if (data.roomId == RoomInfoCache.roomId) {
        await require('../../model/room/RoomModel').default.getRoomData();
        await require('../../model/room/RoomModel').default.getOwnerData(
            RoomInfoCache.createUserInfo && RoomInfoCache.createUserInfo.userId,
            RoomInfoCache.roomData.roomOwnerId
        );
        await require('../../model/room/RoomModel').default.getRoomMicData(0);
    }

    //查出礼物数据存入data
    const giftData = await require('../staticdata/StaticDataModel').getGiftById(data.giftId)
    const boxId = data.boxId

    //组装数据
    const list = [];
    let boxData
    // 宝箱数据
    if (boxId) {
        boxData = await require('../staticdata/StaticDataModel').getTreasureBoxByBoxId(boxId)
    } else {
        boxData = null
    }

    for (const receiverInfo of data.receiverInfos) {
        const res = await require("../ServerCmd").MyCmd_getUserInfoList({
            userIds: [receiverInfo.toUserId],
            type: EUserDataType.LOGOTIME + EUserDataType.ThirdIconurl + EUserDataType.CHARMEVE,
        });
        receiverInfo.logoTime = res.data.list[0].logoTime
        receiverInfo.thirdIconurl = res.data.list[0].thirdIconurl

        list.push({
            data,
            receiverInfo,
            giftData,
            boxData,
        });
    }

    // 全屏特效
    if (data.roomId == RoomInfoCache.roomId) {
        const _gifttype = giftData.gifttype
        const _showtype = giftData.showtype


        const time = require('../room/GiftModel').getGiftDataAnimationTime(giftData);
        if (RoomInfoCache.isPlayAnimaion) {

            // 如果是礼盒开出的礼物
            if (boxId) {

                const url = Config.getGiftUrl(giftData.giftid, giftData.alterdatetime.toDateTimeTick())
                const replaceTexFileName = giftData.giftid + '.png'
                const animName = boxData && boxData.animationname

                const retFile = await NativeModules.HttpUtil.downloadFlashTextureFile(
                    url,//礼物icon的url
                    replaceTexFileName,//替换的贴图文件名字，例如： G10.png
                    animName,//flash动画的名称，例如：silverbox
                );



                if (1 == retFile.state) {
                    ModelEvent.dispatchEntity(
                        null,
                        EVT_LOGIC_SHOW_FULL_SCREEN_FLASH,
                        {
                            boxData,
                            giftData,
                            animName,
                            replaceTexFileName,
                            url,
                        }
                    );
                }

            }

            //动画播放开关开、可播放全屏大礼物
            if (_showtype == SHOW_GIFT_TYPE_BIG || _gifttype == BIG_GIFT_TYPE) {
                //播放大礼物    

                //大礼物url
                const giftWebpUrl = Config.getAnimaorUrl(giftData.animationname, time)
                const giftUrl = Config.getGiftUrl(giftData.giftid, time)

                ModelEvent.dispatchEntity(
                    null,
                    EVT_LOGIC_SHOW_FULL_SCREEN_WEBP,
                    {
                        giftWebpUrl,
                        giftData,
                    }
                );

                _doShowGiftFly(giftUrl, data);
            }



        }

        if (_showtype == SHOW_GIFT_TYPE_SMALL || _gifttype == SPEC_GIFT_TYPE || _gifttype == FREE_GIFT_TYPE || _gifttype == SMALL_GIFT_TYPE) {
            //播放小礼物

            //小礼物url
            const giftUrl = Config.getGiftUrl(giftData.giftid, time);
            _doShowGiftFly(giftUrl, data);
        }


    }

    // 公屏
    if (boxId) {
        //房间公屏
        //xxx给xxx送了[宝箱]
        require("../room/RoomPublicScreenModel").treasureBox(list);
    } else {
        //房间公屏
        //xxx给xxx送了[礼物]
        require("../room/RoomPublicScreenModel").gift(list);

    }


    switch (data.broadcastType) {
        case 0:

            ModelEvent.dispatchEntity(null, EVT_LOGIC_GIFT_MY_ROOM, list);
            break;
        case 1:

            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_GIFT_BANNER, list);
            ModelEvent.dispatchEntity(null, EVT_LOGIC_GIFT_MY_ROOM, list);
            break;
        case 2:
            //全服公屏
            //【全服】xxx给xxx送了[礼物]
            require("../room/RoomPublicScreenModel").gift(list);

            //全服跑道，APP全站显示
            //xxx给xxx送了[礼物]
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_FULL_SERVICE_GIFT_BANNER, list);
            break;
    }

}