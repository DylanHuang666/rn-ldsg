/**
 * 打电话
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground, Vibration, NativeModules, AppState, Platform } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from '../base/BaseView';
import LinearGradient from "react-native-linear-gradient";
import { phone_status, phone_stop, phone_start, status_svga, phone_modal } from "../../hardcode/skin_imgs/announcer";
import Config from "../../configs/Config";
import RNSvgaPlayer from 'react-native-svga-player'
import AnnouncerModel from "../../model/main/AnnouncerModel";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_PHONE_CANCEL, EVT_LOGIC_PHONE_START } from "../../hardcode/HLogicEvent";
import ToastUtil from "../base/ToastUtil";
import UserInfoCache from "../../cache/UserInfoCache";
import RoomInfoCache from "../../cache/RoomInfoCache";
import { ERoomActionType } from "../../hardcode/ERoom";
import SexAgeWidget from "../userinfo/SexAgeWidget";
import { DES } from "crypto-js";



export const [CALL, RING] = ["CALL", "RING"]
export default class PhoneView extends BaseView {
    constructor(props) {
        super(props);

        this._userId = this.props.params.userId;
        this._phoneStatus = this.props.params.viewType;
        this._data = this.props.params.data;

        this._userInfo = null;
        this._bOnCall = false;
        this._bPopSelf = false;
    }

    componentDidMount() {
        super.componentDidMount();
        this._initData();
        if (this._phoneStatus == RING) {
            Vibration.vibrate([0, 1000, 2000, 3000], true);
        }
        ModelEvent.addEvent(null, EVT_LOGIC_PHONE_CANCEL, this._cancelPhoneEvent)
        ModelEvent.addEvent(null, EVT_LOGIC_PHONE_START, this._enterRoom)

        if (RoomInfoCache.isInRoom) {
            // NativeModules.Agora.enableSpeaker(false);
            NativeModules.Agora.pauseRtcEngine();
        }

        Platform.OS == "ios" && setTimeout(() => {
            if (!RoomInfoCache.is1V1Calling) {
                this.popSelf();
            }
        }, 500)
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this._phoneStatus == RING) {
            Vibration.cancel();
        }

        ModelEvent.removeEvent(null, EVT_LOGIC_PHONE_CANCEL, this._cancelPhoneEvent)
        ModelEvent.removeEvent(null, EVT_LOGIC_PHONE_START, this._enterRoom)

        if (RoomInfoCache.isInRoom) {
            // NativeModules.Agora.enableSpeaker(RoomInfoCache.enableSpeaker);
            NativeModules.Agora.resumeRtcEngine();
        }
    }


    /**
     * 进入房间要停止svga的声音
     */
    _enterRoom = () => {
        if (RoomInfoCache.isInRoom) {
            // NativeModules.Agora.enableSpeaker(true);
            NativeModules.Agora.resumeRtcEngine();
        }
        this._bOnCall = true;
        this.forceUpdate();
    }

    /**
     * 处理停止PhoneView的逻辑
     * status 0:发起呼叫 1:主播接听 2:主播拒绝 3:用户取消呼叫 4:呼叫超时
//       5:一方退出陪聊 6:用户时长到(余额不足)退出陪聊 9:陪聊房内每分钟信息广播
     * @param {*} data 
     */
    _cancelPhoneEvent = data => {
        if (this._bPopSelf) {
            return
        }
        this._bPopSelf = true;


        this.popSelf();
        switch (data.status) {
            case 2:
                if (this._phoneStatus == CALL) {
                    ToastUtil.showCenter("主播拒绝")
                }
                break
            case 3:
                if (this._phoneStatus == RING) {
                    ToastUtil.showCenter("用户取消呼叫")
                }
                break
            case 4:
                ToastUtil.showCenter("呼叫超时")
                break
        }
    }

    _initData = () => {
        require('../../model/userinfo/UserInfoModel').default.getPersonPage(this._userId)
            .then(data => {
                this._userInfo = data;
                this.forceUpdate();
            })
    }

    _getStatusText = () => {
        switch (this._phoneStatus) {
            case CALL:
                return "连接中，请稍等…"
            case RING:
                return "申请与你语音聊天…"
        }

    }

    onResume(prevView) {
        //判定是否上一个界面是否是1v1聊天室,如果是就关闭自己
        if (require('../../router/level3_router').isChatRoomView(prevView)) {
            this.popSelf();
        }
    }

    /**
     * 取消或挂电话
     */
    _cancelPhone = () => {
        if (this._phoneStatus == RING) {
            require("../../router/level2_router").showNormInfoDialog("非勿扰模式下挂断电话将影响您在首页的推荐位置哦～", "挂断", this._stopPhone)
            return
        }
        this._stopPhone();
    }

    _stopPhone = async () => {
        if (this._bPopSelf) {
            return
        }
        this._bPopSelf = true;
        let res = await AnnouncerModel.cancelCall(this._phoneStatus == RING ? UserInfoCache.userId : this._userId);
        if (res) {

            this.popSelf();
        }
    }

    /**
     * 接电话
     */
    _startPhone = async () => {
        if (await AnnouncerModel.pickUpCall()) {
            // require("../../model/room/RoomModel").getRoomDataAndShowView(this._data.roomId)
            this._bOnCall = true;
            Vibration.cancel();
            this.forceUpdate();
        }
    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    // backgroundColor: 'blue',
                }}>

                <ImageBackground
                    source={!this._userInfo ? null : { uri: Config.getHeadUrl(this._userInfo.userId, this._userInfo.logoTime, this._userInfo.thirdIconurl) }}
                    style={{
                        flex: 1,
                        width: DesignConvert.swidth,
                        alignItems: "center",
                    }}>
                    <Image
                        source={phone_modal()}
                        style={{
                            position: 'absolute',
                            height: DesignConvert.sheight,
                            width: DesignConvert.swidth,
                        }}
                    />
                    {/* <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        // colors={['rgba(255, 136, 238, 0.8)', 'rgba(248, 88, 104, 0.8)']}
                        colors={['red', 'red']}
                        style={{
                            flex: 1,
                            width: DesignConvert.swidth,
                            // height: DesignConvert.getH(100000),
                            height: DesignConvert.sheight,
                            // backgroundColor: 'blue',
                            alignItems: "center",
                        }} /> */}

                    {/* 用户信息 */}
                    <View
                        style={{
                            marginTop: DesignConvert.getH(48) + DesignConvert.statusBarHeight,
                            alignItems: "center",
                        }}>
                        {this._userInfo ? (
                            <Image
                                source={{ uri: Config.getHeadUrl(this._userInfo.userId, this._userInfo.logoTime, this._userInfo.thirdIconurl) }}
                                style={{
                                    width: DesignConvert.getW(84),
                                    height: DesignConvert.getH(84),
                                    borderRadius: DesignConvert.getW(84),
                                }}></Image>
                        ) : null}

                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(18),
                                marginTop: DesignConvert.getH(14),
                            }}>{!this._userInfo ? "" : decodeURI(this._userInfo.nickName)}</Text>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}>

                            <View
                                style={{
                                    width: DesignConvert.getW(60),
                                    height: DesignConvert.getH(21),
                                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                                    borderRadius: DesignConvert.getW(12),
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: DesignConvert.getW(12),
                                    marginTop: DesignConvert.getH(6),
                                }}>

                                {this._userInfo ? (
                                    <SexAgeWidget
                                        sex={this._userInfo.sex}
                                        style={{
                                            marginRight: DesignConvert.getW(6),
                                        }}
                                    />
                                ) : null}

                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: DesignConvert.getF(12),
                                    }}>{!this._userInfo ? "18岁" : `${this._userInfo.age}岁`}</Text>
                            </View>

                            <Image
                                resizeMode="contain"
                                source={require("../../hardcode/skin_imgs/main").mine_rich_lv(this._userInfo ? this._userInfo.contributeLv : 1)}
                                style={{
                                    width: DesignConvert.getW(60),
                                    height: DesignConvert.getH(21),
                                }}></Image>
                        </View>

                    </View>

                    {!this._bOnCall ? (
                        <RNSvgaPlayer
                            source={status_svga()}
                            style={{
                                width: DesignConvert.getW(100),
                                height: DesignConvert.getH(80),
                                marginTop: DesignConvert.getH(98),
                            }}
                        />
                    ) : (
                            <Image
                                source={phone_status()}
                                style={{
                                    width: DesignConvert.getW(100),
                                    height: DesignConvert.getH(80),
                                    marginTop: DesignConvert.getH(98),
                                }}
                            />
                        )}


                    <Text
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(13),
                            marginTop: DesignConvert.getH(46),
                        }}>{this._getStatusText()}</Text>


                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: DesignConvert.getH(90),
                        }}>

                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>

                            <TouchableOpacity
                                onPress={this._cancelPhone}>
                                <Image
                                    source={phone_stop()}
                                    style={{
                                        width: DesignConvert.getW(130),
                                        height: DesignConvert.getH(50),
                                    }}></Image>
                            </TouchableOpacity>

                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(13),
                                    marginTop: DesignConvert.getH(15),
                                }}>{this._phoneStatus == CALL ? "取消" : "挂断"}</Text>
                        </View>

                        {this._phoneStatus == RING ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>

                                <TouchableOpacity
                                    onPress={this._startPhone}>
                                    <Image
                                        source={phone_start()}
                                        style={{
                                            width: DesignConvert.getW(130),
                                            height: DesignConvert.getH(50),
                                        }}></Image>
                                </TouchableOpacity>

                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: DesignConvert.getF(13),
                                        marginTop: DesignConvert.getH(15),
                                    }}>{"接听"}</Text>
                            </View>
                        ) : null}
                    </View>
                </ImageBackground>
            </View>
        )
    }
}