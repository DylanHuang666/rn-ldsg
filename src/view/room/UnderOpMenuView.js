/**
* 麦下用户操作菜单
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
import { user } from '../../hardcode/skin_imgs/login';
import { SOCK_BRO_RoomResultRoomActionBroadcast } from '../../hardcode/HSocketBroadcastEvent';
import ModelEvent from '../../utils/ModelEvent';

export default class UnderOpMenuView extends BaseView {

    constructor(props) {
        super(props)

        this._userId = this.props.params.userId
        this._isManger = false;//是否是管理员
        this._jobId = 4;//默认是观众
        this._inMic = false;//是否在麦上
        this._inMicPosition = 0;

        require('../../model/room/RoomModel').default.getJobId(RoomInfoCache.roomId, this._userId)
            .then(data => {
                this._jobId = data
                this._isManger = data < 4
                this.forceUpdate()
            })


        RoomInfoCache.roomData.infos.forEach((element, index) => {
            if (element && element.base && (element.base.userId == this._userId)) {
                this._inMic = true
                this._inMicPosition = index + 1
                this.forceUpdate()
            }
        });
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
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_DOWN, this._userId, this._inMicPosition, 'true')
    }

    _onUpMic = () => {
        this.popSelf()
        //抱上麦
        require('../../model/room/RoomModel').default.action(ERoomActionType.MIC_UP, this._userId, 0, 'true');
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

        this._userId = this.props.params.userId

        const isSelfOnMainSeat = require('../../model/room/RoomModel').isSelfOnMainSeat();
        const isSelfOnOtherSeat = require('../../model/room/RoomModel').isSelfOnOtherSeat();


        const menus = [];


        //踢出房间
        if (RoomInfoCache.haveRoomPermiss) {
            menus.push(['踢出房间', this._onKick]);
        }
        //加入房间小黑屋
        if (RoomInfoCache.haveRoomPermiss) {
            menus.push(['加入房间小黑屋', this._onBlack]);
        }
        //查看个人资料
        menus.push(['查看个人资料', this._onUserInfo]);

        //房间管理员
        if (isSelfOnMainSeat) {
            //需要查询用户是否是管理员
            // console.log('需要查询用户是否是管理员', this._jobId)
            if (this._jobId == 3) {
                menus.push(['撤销房间管理员', this._onUnsetManager]);
            } else {
                menus.push(['设为房间管理员', this._onSetManager]);
            }
        }
        // menus.push(['送礼物', this._onGift]);

        //抱上麦
        if (RoomInfoCache.haveRoomPermiss && !this._inMic) {
            menus.push(['抱上麦', this._onUpMic]);
        }

        //抱下麦
        if (RoomInfoCache.haveRoomPermiss && this._inMic) {
            menus.push(['抱下麦', this._onDownMic]);
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
                    <Text
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(48),

                            textAlign: 'center',
                            textAlignVertical: 'center',

                            color: 'black',
                            fontSize: DesignConvert.getF(16),

                            backgroundColor: 'white',
                            borderRadius: DesignConvert.getW(10),
                        }}
                    >{menus[0][0]}</Text>
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
                    <Text
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(48),

                            textAlign: 'center',
                            textAlignVertical: 'center',

                            color: 'black',
                            fontSize: DesignConvert.getF(16),

                            backgroundColor: 'white',
                            borderTopLeftRadius: DesignConvert.getW(10),
                            borderTopRightRadius: DesignConvert.getW(10),

                            // borderBottomWidth: DesignConvert.getH(1),
                            // borderBottomColor: '#FFFFFF19',
                        }}
                    >{menus[0][0]}</Text>

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
                    <Text
                        style={{
                            width: DesignConvert.getW(340),
                            height: DesignConvert.getH(48),

                            textAlign: 'center',
                            textAlignVertical: 'center',

                            color: 'black',
                            fontSize: DesignConvert.getF(16),

                            backgroundColor: 'white',
                        }}
                    >{menus[i][0]}</Text>

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
                <Text
                    style={{
                        width: DesignConvert.getW(340),
                        height: DesignConvert.getH(48),

                        textAlign: 'center',
                        textAlignVertical: 'center',

                        color: 'black',
                        fontSize: DesignConvert.getF(16),

                        backgroundColor: 'white',
                        borderBottomLeftRadius: DesignConvert.getW(10),
                        borderBottomRightRadius: DesignConvert.getW(10),
                    }}
                >{menus[l - 1][0]}</Text>
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
                        <Text
                            style={{
                                marginTop: DesignConvert.getH(12),

                                width: DesignConvert.getW(340),
                                height: DesignConvert.getH(48),

                                textAlign: 'center',
                                textAlignVertical: 'center',

                                color: 'black',
                                fontSize: DesignConvert.getF(16),

                                backgroundColor: 'white',
                                borderRadius: DesignConvert.getW(10),
                            }}
                        >取消</Text>
                    </TouchableOpacity>

                    {this._renderMenus()}
                </View>

            </TouchableOpacity>

        );
    }
}