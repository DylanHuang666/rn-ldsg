/**
* 麦位操作菜单
*/

'use strict';

import React from 'react';
import BaseView from "../base/BaseView";
import { View, Image, Text, TouchableOpacity, NativeModules } from "react-native";
import DesignConvert from '../../utils/DesignConvert';
import RoomInfoCache from '../../cache/RoomInfoCache';
import UserInfoCache from '../../cache/UserInfoCache';
import ToastUtil from '../base/ToastUtil';
import { ERoomActionType, ERoomJob } from '../../hardcode/ERoom';

export default class SeatOpMenuView extends BaseView {


    _onClearAllMicBeckoning = () => {
        this.popSelf();
        //确认清空全麦心动值
        require("../../router/level2_router").showNormInfoDialog('是否确认清空全麦的心动值？清空后无法复原哦',
            "确定", this._onClearAllHeartValue,
            "取消", undefined);
    }

    _onClearAllHeartValue = () => {
        // console.log("确认清空全麦心动值")
        require('../../model/room/RoomModel').default.action(ERoomActionType.CLEAR_ALL_HEART_VALUE, this._userId, 0, '')
    }

    _onClearPersonalBeckoning = () => {
        this.popSelf();
        //清空个人心动值
        require("../../router/level2_router").showNormInfoDialog('是否确认清空个人的心动值？清空后无法复原哦',
            "确定", this._onClearHeartVaule,
            "取消", undefined);
    }

    _onClearHeartVaule = () => {
        require('../../model/room/RoomModel').default.action(ERoomActionType.CLEAR_HEART_VALUE, this._userId, 0, '')
    }

    _onKick = () => {
        this.popSelf();
        //踢出房间
        require('../../model/room/RoomModel').default.action(ERoomActionType.KICK_MEMBER, this._userId, this._position, '30')
    }

    _onBlack = () => {
        this.popSelf();
        //加入房间小黑屋
        require("../../router/level2_router").showNormInfoDialog('拉进小黑屋后该用户将被踢出房间，且后续无法再次进入房间，可在"工具箱-小黑屋"中解除，是否确定拉入小黑屋?',
            "确定", this._onAddToDarkRoom,
            "取消", undefined);
    }

    _onAddToDarkRoom = () => {
        require('../../model/room/RoomModel').default.action(ERoomActionType.ADD_TO_DARK_ROOM, this._userId, 0, '')
    }

    _onUserInfo = () => {
        this.popSelf();
        //查看个人资料,打开资料卡
        require('../../router/level3_router').showUserCardView(this._userId)
    }

    _onSetManager = () => {
        this.popSelf();
        //设为房间管理员
        require('../../model/room/RoomModel').default.setManager(RoomInfoCache.roomId, this._userId, ERoomJob.MANAGER)
    }

    _onUnsetManager = () => {
        this.popSelf();
        //撤销房间管理员
        require('../../model/room/RoomModel').default.setManager(RoomInfoCache.roomId, this._userId, ERoomJob.REVOKE_MANAGER)
    }

    _onGift = () => {
        this.popSelf();
        require('../../router/level3_router').showRoomGiftPanelView(this._userId)
    }
    _onDownMic = () => {
        this.popSelf();
        //抱下麦
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_DOWN, this._userId, this._position, 'true')
    }

    _onUpMic = async () => {
        this.popSelf()
        //权限处理
        const permissStatus = await require("../../model/PermissionModel").checkAudioRoomPermission();
        if (permissStatus == 'denied' || permissStatus == 'blocked') {
            ToastUtil.showCenter('麦克风权限未打开')
            return
        }

        //上麦
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_UP, UserInfoCache.userId, this._position, 'true');
    }

    _onSelfDownMic = () => {
        this.popSelf();
        //下麦
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_DOWN, this._userId, this._position, 'true');
    }
    _onUnforbidMic = () => {
        this.popSelf();
        //解麦
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_UNFORBID, this._userId, 0, '')
    }
    _onForbidMic = () => {
        this.popSelf();
        //禁麦
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_FORBID, this._userId, 30, '')
    }
    _onUnlock = () => {
        this.popSelf();
        //解锁麦位
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_UNLOCK, '', this._position, '')
    }
    _onLock = () => {

        this.popSelf();
        //封锁麦位
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_LOCK, '', this._position, '')
    }

    _getMenus() {
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
        const micInfo = this.props.params.micInfo;
        const isMainMic = this.props.params.isMainMic;//是否点击主麦位置

        if (isMainMic) {
            this._userId = RoomInfoCache.mainMicUserInfo.userId
        } else {
            this._userId = micInfo.base ? micInfo.base.userId : ''
            this._position = micInfo.position
        }

        const isSelfOnMainSeat = require('../../model/room/RoomModel').isSelfOnMainSeat();
        const isSelfOnOtherSeat = require('../../model/room/RoomModel').isSelfOnOtherSeat();

        const menus = [];
        // console.log('直播间权限', RoomInfoCache.roomData.jobId)
        //清空全麦心动值
        if (RoomInfoCache.haveRoomPermiss && (isMainMic || micInfo.base)) {
            menus.push(['清空全麦心动值', this._onClearAllMicBeckoning]);
        }

        //清空个人心动值
        if (this._userId == UserInfoCache.userId) {
            menus.push(['清空个人心动值', this._onClearPersonalBeckoning]);
        }

        //踢出房间
        if (!isMainMic && RoomInfoCache.haveRoomPermiss && micInfo.base && micInfo.base.userId != UserInfoCache.userId) {
            menus.push(['踢出房间', this._onKick]);
        }
        //加入房间小黑屋
        if (RoomInfoCache.haveRoomPermiss && !isMainMic && micInfo.base && micInfo.base.userId != UserInfoCache.userId) {
            menus.push(['加入房间小黑屋', this._onBlack]);
        }
        //查看个人资料

        if (!isMainMic && (micInfo && micInfo.base && micInfo.base.userId) && this._userId != UserInfoCache.userId) {//其他麦位置，自己不在这个麦位置
            menus.push(['查看个人资料', this._onUserInfo]);
        }
        //房间管理员
        if (isSelfOnMainSeat && micInfo) {
            if (micInfo.jobId == 3) {
                menus.push(['撤销房间管理员', this._onUnsetManager]);
            } else if (micInfo.jobId == 4) {
                menus.push(['设为房间管理员', this._onSetManager]);
            }
        }
        //送礼物
        if (this._userId) {
            menus.push(['送礼物', this._onGift]);
        }
        //抱下麦
        if (!isMainMic && RoomInfoCache.haveRoomPermiss && micInfo.base && micInfo.base.userId != UserInfoCache.userId) {
            menus.push(['抱下麦', this._onDownMic]);
        }

        //下麦
        if (isSelfOnOtherSeat && (this._userId == UserInfoCache.userId)) {
            menus.push(['下麦', this._onSelfDownMic])
        }
        //禁麦、解麦
        if (!isMainMic && RoomInfoCache.haveRoomPermiss && micInfo.base && micInfo.base.userId != UserInfoCache.userId) {
            if (micInfo.forbidMic) {
                menus.push(['解麦', this._onUnforbidMic]);
            } else {
                menus.push(['禁麦', this._onForbidMic]);
            }
        }
        //上麦
        if (RoomInfoCache.haveRoomPermiss && !isSelfOnMainSeat && micInfo && !micInfo.lock && !micInfo.base) {
            menus.push(['上麦', this._onUpMic]);
        }
        //封锁、解锁
        if (!isMainMic && RoomInfoCache.haveRoomPermiss && !micInfo.base) {
            if (micInfo.lock) {
                menus.push(['解锁麦位', this._onUnlock]);
            } else {
                menus.push(['封锁麦位', this._onLock]);
            }
        }

        return menus;
    }

    _renderMenus() {
        const menus = this._getMenus();

        const l = menus.length;
        if (l == 0) return null;

        if (l == 1) {
            return (
                <TouchableOpacity
                    onPress={menus[0][1]}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(48),

                            backgroundColor: 'white',
                            borderRadius: DesignConvert.getW(10),

                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: DesignConvert.getF(16),
                            }}
                        >{menus[0][0]}</Text>
                    </View>

                </TouchableOpacity>
            )
        }

        //第一个
        const renderItems = [
            (
                <TouchableOpacity
                    key={0}
                    onPress={menus[0][1]}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(48),

                            backgroundColor: 'white',
                            borderTopLeftRadius: DesignConvert.getW(10),
                            borderTopRightRadius: DesignConvert.getW(10),

                            // borderBottomWidth: DesignConvert.getH(1),
                            // borderBottomColor: '#FFFFFF19',

                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: DesignConvert.getF(16),
                            }}
                        >{menus[0][0]}</Text>
                    </View>


                    <View
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(1),
                            backgroundColor: '#FFFFFF80',
                        }}
                    />
                </TouchableOpacity>
            )
        ];

        for (let i = 1; i < l - 1; ++i) {
            renderItems.push((
                <TouchableOpacity
                    key={i}
                    onPress={menus[i][1]}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(48),

                            backgroundColor: 'white',

                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: DesignConvert.getF(16),
                            }}
                        >{menus[i][0]}</Text>
                    </View>

                    <View
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(1),
                            backgroundColor: '#FFFFFF80',
                        }}
                    />
                </TouchableOpacity>
            ));
        }

        //最后一个
        renderItems.push((
            <TouchableOpacity
                key={l - 1}
                onPress={menus[l - 1][1]}
            >
                <View
                    style={{
                        width: DesignConvert.getW(340),
                        height: DesignConvert.getH(48),

                        backgroundColor: 'white',
                        borderBottomLeftRadius: DesignConvert.getW(10),
                        borderBottomRightRadius: DesignConvert.getW(10),

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontSize: DesignConvert.getF(16),

                        }}
                    >{menus[l - 1][0]}</Text>
                </View>
            </TouchableOpacity>
        ));

        return (
            <View
                style={{
                    width: DesignConvert.getW(340),
                }}
            >
                {renderItems}
            </View>
        )
    }

    render() {

        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                }}
                onPress={this.popSelf}
            >

                <View
                    style={{
                        position: 'absolute',
                        bottom: DesignConvert.getH(10),

                        width: '100%',

                        flexDirection: 'column-reverse',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={this.popSelf}
                    >
                        <View
                            style={{
                                marginTop: DesignConvert.getH(12),

                                width: DesignConvert.getW(340),
                                height: DesignConvert.getH(48),

                                justifyContent: 'center',
                                alignItems: 'center',

                                backgroundColor: 'white',
                                borderRadius: DesignConvert.getW(10),
                            }}
                        >
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: DesignConvert.getF(16),
                                }}
                            >取消</Text>
                        </View>

                    </TouchableOpacity>

                    {this._renderMenus()}
                </View>

            </TouchableOpacity>

        );
    }
}