/**
 * 房间更多界面
 */

'use strict';

import React,
{ PureComponent } from 'react';
import BaseView from "../base/BaseView";
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput } from "react-native";
import DesignConvert from '../../utils/DesignConvert';
import {
    ic_lock,
    ic_unlock,
    ic_change_bg,
    ic_bgm,
    ic_manager,
    ic_big_emoji,
    ic_ear_back_open,
    ic_ear_back_close,
    ic_movie_open,
    ic_movie_close,
    ic_room_movie_open,
    ic_room_movie_close,
    ic_clear_chat,
    ic_black,
    ic_offline_close,
    ic_offline_open,
    ic_room_bg,
    ic_music,
    ic_room_set,
} from '../../hardcode/skin_imgs/room_more';
import { ERoomModify, ERoomActionType } from '../../hardcode/ERoom';
import RoomInfoCache from '../../cache/RoomInfoCache';
import ModelEvent from '../../utils/ModelEvent';
import { SOCK_BRO_RoomResultRoomActionBroadcast } from '../../hardcode/HSocketBroadcastEvent';
import { EVT_LOGIC_REFRESH_ROOM_MORE } from '../../hardcode/HLogicEvent';
import HResultStatus from '../../hardcode/HResultStatus';
import ToastUtil from '../base/ToastUtil';

class _Item extends PureComponent {


    render() {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.getW(71),
                    alignItems: 'center',
                    marginBottom: DesignConvert.getH(18),
                }}
                onPress={this.props.onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(44),
                        height: DesignConvert.getH(44),
                    }}
                    source={this.props.icon}
                />
                <Text
                    style={{
                        marginTop: DesignConvert.getH(5),
                        color: '#FFFFFF80',
                        fontSize: DesignConvert.getF(10)
                    }}
                >{this.props.name}</Text>
            </TouchableOpacity>
        );
    }
}

export default class RoomMoreView extends BaseView {
    constructor(props) {
        super(props);

        this._selectBgId = RoomInfoCache.roomData.bg;

        this._inRoomFunRobotManua = false//是否在机器人配置协议里，用于是否显示离线模式
        if (RoomInfoCache.haveRoomPermiss) {
            require('../../model/staticdata/StaticDataModel').getFunRobotManual(RoomInfoCache.createUserInfo.userId)
                .then(data => {
                    this._inRoomFunRobotManua = data
                    this.forceUpdate()
                })
        }
    }


    componentDidMount() {
        super.componentDidMount()
        ModelEvent.addEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)

    }

    componentWillUnmount() {
        super.componentWillUnmount()
        ModelEvent.removeEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)
    }

    _refresh = () => {
        this.forceUpdate()
    }


    _onLock = () => {
        if (RoomInfoCache.isNeedPassword) {
            //解锁
            require('../../router/level3_router').showCanclePassword();
        } else {
            //上锁
            require('../../router/level3_router').showSetPassword(0, RoomInfoCache.roomId);
        }
    }

    _onChangeBg = () => {
        this.popSelf();
        require('../../router/level3_router').showRoomBgChooseView(
            this._selectBgId,
            this._onChooseBg
        );
    }

    _onChooseBg = (bg) => {
        this._selectBgId = bg.backgroundid;
        require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_BG_KEY, this._selectBgId)
        this.forceUpdate();
    }

    _onManager = () => {
        this.popSelf();
        require("../../router/level3_router").showRoomManagerView(RoomInfoCache.roomId);
    }

    _onBigEmoji = () => {
        this.popSelf();
        require('../../router/level3_router').showRoomBigFaceView()
    }

    _onEarBack = () => {
        require('../../model/room/RoomModel').switchInEarMonitoring();
        this.forceUpdate()
    }

    _onOpenMovie = () => {
        RoomInfoCache.setSelfAnimation(!RoomInfoCache.isSelfAnimation)
        RoomInfoCache.isSelfAnimation ? ToastUtil.showCenter('礼物特效已开启') : ToastUtil.showCenter('礼物特效已关闭')
        this.forceUpdate()
    }

    _onOpenRoomMovie = () => {
        if (RoomInfoCache.isGiftAnimation) {
            //关闭
            require("../../router/level2_router").showNormInfoDialog("关闭后将看不到礼物特效，运作更加流畅，是否确认关闭礼物特效。",
                "确定", this._onCloseRoomMovie,
                "取消", undefined);
        } else {
            //打开
            require('../../model/room/RoomModel').default.action(ERoomActionType.OPEN_GIFT_ANIMATION, 0, '')
        }
    }

    _onCloseRoomMovie = () => {
        require('../../model/room/RoomModel').default.action(ERoomActionType.CLOSE_GIFT_ANIMATION, 0, '')
    }

    _onClearChat = () => {
        //清空公屏
        require('../../model/room/RoomModel').default.action(ERoomActionType.CLEAR_ROOM_MSG, 0, '')
            .then(data => {

            })
    }

    _openRoomSet = () => {
        this.popSelf()
        require('../../router/level3_router').showRoomSetView()
    }

    _onBlack = () => {
        this.popSelf();
        require('../../router/level3_router').showRoomBlackListView();
    }

    _onOffline = () => {
        //todo
        // alert('todo: 离线模式');
        const roomData = RoomInfoCache.roomData;
        const bOffline = roomData && roomData.offlineMode;
        require('../../model/room/RoomModel').default.action(bOffline ? ERoomActionType.CLOSE_OFFLINEMODE : ERoomActionType.OPEN_OFFLINEMODE, 0, '')
            .then(bSuc => {
                if (!bSuc) {
                    return;
                }
                if (!roomData) return;
                roomData.offlineMode = !bOffline;
                this.forceUpdate();
            })
    }

    _onMusic = () => {
        this.popSelf()
        require('../../router/level3_router').showRoomMusicPlayView()
    }

    render() {
        const roomData = RoomInfoCache.roomData;

        //是否上锁
        const bEar = require('../../model/room/RoomModel').getOpenEarMonitor();
        const bOffline = roomData && roomData.offlineMode;

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
                        bottom: 0,
                        width: DesignConvert.swidth,
                        backgroundColor: '#000000f0',
                        paddingStart: DesignConvert.getW(10),
                        paddingEnd: DesignConvert.getW(10),
                        paddingTop: DesignConvert.getH(21),
                        paddingBottom: DesignConvert.getH(14),
                        paddingHorizontal: DesignConvert.getW(16),
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                >

                    <_Item
                        onPress={this._onMusic}
                        name='音乐'
                        icon={ic_music()}
                    />

                    <_Item
                        onPress={this._onChangeBg}
                        name='背景'
                        icon={ic_room_bg()}
                    />

                    <_Item
                        onPress={this._onBigEmoji}
                        name='大表情'
                        icon={ic_big_emoji()}
                    />

                    <_Item
                        onPress={this._onEarBack}
                        name={bEar ? '耳返开启' : '耳返关闭'}
                        icon={bEar ? ic_ear_back_open() : ic_ear_back_close()}
                    />

                    {(RoomInfoCache.jobId == 0 || RoomInfoCache.jobId == 1 || RoomInfoCache.jobId == 2) &&
                        <_Item
                            onPress={this._onLock}
                            name={RoomInfoCache.isNeedPassword ? '房间已上锁' : '房间上锁'}
                            icon={RoomInfoCache.isNeedPassword ? ic_lock() : ic_unlock()}
                        />
                    }


                    <_Item
                        onPress={this._onOpenMovie}
                        name={RoomInfoCache.isSelfAnimation ? '动画开启' : '动画关闭'}
                        icon={RoomInfoCache.isSelfAnimation ? ic_movie_open() : ic_movie_close()}
                    />


                    <_Item
                        onPress={this._onOpenRoomMovie}
                        name={RoomInfoCache.isGiftAnimation ? '房间动画开启' : '房间动画关闭'}
                        icon={RoomInfoCache.isGiftAnimation ? ic_room_movie_open() : ic_room_movie_close()}
                    />


                    {(RoomInfoCache.jobId == 0 || RoomInfoCache.jobId == 1 || RoomInfoCache.jobId == 2) &&
                        <_Item
                            onPress={this._onManager}
                            name='管理员'
                            icon={ic_manager()}
                        />
                    }

                    <_Item
                        onPress={this._onBlack}
                        name='黑名单'
                        icon={ic_black()}
                    />

                    {(RoomInfoCache.jobId == 0 || RoomInfoCache.jobId == 1 || RoomInfoCache.jobId == 2) && this._inRoomFunRobotManua &&
                        <_Item
                            onPress={this._onOffline}
                            name={bOffline ? '离线模式开启' : '离线模式关闭'}
                            icon={bOffline ? ic_offline_open() : ic_offline_close()}
                        />
                    }



                    <_Item
                        onPress={this._onClearChat}
                        name='清空公屏'
                        icon={ic_clear_chat()}
                    />

                    {(RoomInfoCache.jobId == 0 || RoomInfoCache.jobId == 1 || RoomInfoCache.jobId == 2) &&
                        <_Item
                            onPress={this._openRoomSet}
                            name='房间设置'
                            icon={ic_room_set()}
                        />
                    }


                </View>
            </TouchableOpacity>

        );
    }
}