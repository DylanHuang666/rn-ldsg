/**
 * 1V1语音房 用户卡片
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import LinearGradient from "react-native-linear-gradient";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_USER_INFO, EVT_LOGIC_PHONE_UPDATE, EVT_UPDATE_WALLET } from "../../../hardcode/HLogicEvent";
import { ic_add, ic_mic_slient } from "../../../hardcode/skin_imgs/chatroom";
import Config from "../../../configs/Config";
import UserInfoModel from "../../../model/userinfo/UserInfoModel";
import UserInfoCache from "../../../cache/UserInfoCache";
import { phone_status } from "../../../hardcode/skin_imgs/announcer";
import { duration2Time } from "../../../utils/CDTick";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import StringUtil from "../../../utils/StringUtil";
import { COIN_NAME } from "../../../hardcode/HGLobal";
import { THEME_COLOR } from "../../../styles";
import BagModel from "../../../model/BagModel";
import { EVT_UPDATE_ROOM_OTHER_MIC } from "../../../hardcode/HGlobalEvent";



class _UserItem extends PureComponent {


    _onAttentionPress = async () => {
        let res = require("../../../model/userinfo/UserInfoModel").default.addLover(this.props.userId, true);

        if (res) {
            require("../../../model/chat/ChatModel").sendRoomPublicScreenText("我已关注了你");
            this.props.callBack && this.props.callBack();
        }
    }

    _imgLayout = () => {
        this._imgRef && this._imgRef.measure((parentX, parentY, width, height, screenX, screenY) => {
            require('../../../model/room/MicPostionModel').default.setMicPostionWithIndex(
                RoomInfoCache.roomData && RoomInfoCache.roomData.createId && RoomInfoCache.roomData.createId == this.props.userId ? 1 : 2,
                { screenX, screenY }
            )
            if (RoomInfoCache.roomData && RoomInfoCache.roomData.createId && RoomInfoCache.roomData.createId == this.props.userId) {
                require('../../../model/room/MicPostionModel').default.setMicPostionWithIndex(
                    0,
                    { screenX, screenY }
                )
            }
        })
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <View
                    style={{
                        width: DesignConvert.getW(65),
                        height: DesignConvert.getH(65),
                        borderRadius: DesignConvert.getW(65),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                    }}>
                    <Image
                        ref={ref => this._imgRef = ref}
                        source={this.props.img}
                        onLayout={this._imgLayout}
                        style={{
                            width: DesignConvert.getW(63),
                            height: DesignConvert.getH(63),
                            borderRadius: DesignConvert.getW(63),
                        }}></Image>

                    {this.props.bSlient ? (
                        (<Image
                            style={{
                                width: DesignConvert.getW(15),
                                height: DesignConvert.getH(15),
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                            }}
                            source={ic_mic_slient()}
                        />)
                    ) : null}
                </View>

                {!this.props.isAttend ? (
                    <TouchableOpacity
                        onPress={this._onAttentionPress}>

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={["#F85868", "#FF88EE"]}
                            style={{
                                width: DesignConvert.getW(46),
                                height: DesignConvert.getH(16),
                                borderRadius: DesignConvert.getW(10),
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: DesignConvert.getH(-9),
                            }}>

                            <Image
                                source={ic_add()}
                                style={{
                                    width: DesignConvert.getW(10),
                                    height: DesignConvert.getH(10),
                                    marginRight: DesignConvert.getW(3),
                                }}></Image>

                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(10),
                                }}>关注</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : null}

                <Text
                    numberOfLines={1}
                    style={{
                        maxWidth: DesignConvert.getW(65),
                        color: "white",
                        fontSize: DesignConvert.getF(13),
                        marginTop: DesignConvert.getH(9),
                    }}>{this.props.title}</Text>
            </View>
        )
    }
}


export default class ChatRoomUserCard extends PureComponent {
    constructor(props) {
        super(props);

        this._micInfo = require("../../../model/announcer/ChatRoomModel").getPeerMicInfo();
        this._userId = RoomInfoCache.callingUserId;

        this._updateBeginTick();

        this._income = RoomInfoCache.roomData && RoomInfoCache.roomData.chatRoomData && RoomInfoCache.roomData.chatRoomData.anchorMoney ? RoomInfoCache.roomData.chatRoomData.anchorMoney : 0;


    }



    _onCacheUpdate = () => {
        this._micInfo = require("../../../model/announcer/ChatRoomModel").getPeerMicInfo();
        this.forceUpdate()
    }


    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_PHONE_UPDATE, this._updateData)
        ModelEvent.addEvent(null, EVT_UPDATE_WALLET, this._updateWllet)
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_OTHER_MIC, this._onCacheUpdate)

        this._startTimer();
        this._initData();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_PHONE_UPDATE, this._updateData)
        ModelEvent.removeEvent(null, EVT_UPDATE_WALLET, this._updateWllet)
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_OTHER_MIC, this._onCacheUpdate)

        this._stopTimer();
    }

    _startTimer() {
        if (this._Timer) return;

        this._Timer = setInterval(this._updateTime, 1000);
    }

    _stopTimer() {
        if (this._Timer) {
            clearInterval(this._Timer);
            this._Timer = null;
        }
    }

    _updateBeginTick(data) {
        this._beginTick = 0;

        if (data && data.chatTime) {
            this._beginTick = Date.now() - data.chatTime * 1000;
            return
        }
        if (!RoomInfoCache.roomData) return;
        if (!RoomInfoCache.roomData.chatRoomData) return;

        this._beginTick = Date.now() - RoomInfoCache.roomData.chatRoomData.chatTime * 1000;
    }

    /**
     * //陪聊广播
//status 0:发起呼叫 1:主播接听 2:主播拒绝 3:用户取消呼叫 4:呼叫超时
//       5:一方退出陪聊 6:用户时长到(余额不足)退出陪聊 9:陪聊房内每分钟信息广播
message SkillChatBroadcast {
	required int32 status = 1;//状态	
	optional string callerId = 2;//呼叫人Id
	optional string anchorId = 3;//主播Id
	optional UserResult.UserBase caller = 4;//呼叫人信息
	optional UserResult.UserBase anchor = 5;//主播信息	
	optional string roomId = 6;//陪聊房Id
	optional int32 chatTime = 7;//陪聊时长(秒)
	optional int32 totalMoney = 8;//主播分成前收入(分)
	optional int32 anchorMoney = 9;//主播分成后收入(分)
	optional int32 ltMinute = 10;//呼叫人余额不足x分钟
}
     * @param {*} data 
     */
    _updateData = async data => {

        this._updateBeginTick(data);
        if (RoomInfoCache.isCall) {
            let data = await BagModel.getWallet();
            this._accountMoney = data.goldShell;
        } else {
            this._income = data.anchorMoney;
        }

        this.forceUpdate();

        this._startTimer();
    }

    _updateWllet = async () => {
        let data = await BagModel.getWallet();
        this._accountMoney = data.goldShell;
        this.forceUpdate();
    }

    _updateTime = () => {
        // ??????????????????  为何要缓存，干嘛？？？？？
        // if (RoomInfoCache.roomData && RoomInfoCache.roomData.chatRoomData) {
        //     RoomInfoCache.roomData.chatRoomData.chatTime = Math.ceil((Date.now() - this._beginTick) / 1000);
        // }
        this.forceUpdate();
    }


    /**
     * 去充值
     */
    _toRecharge = () => {
        require("../../../router/level2_router").showMyWalletView();
    }

    _initData = async () => {
        if (RoomInfoCache.isCall) {
            let data = await BagModel.getWallet();
            this._accountMoney = data.goldShell;

        }
        let data2 = await require('../../../model/userinfo/UserInfoModel').default.getPersonPage(this._userId);
        this._userInfo = data2;

        let data3 = await require('../../../model/userinfo/UserInfoModel').default.getPersonPage(UserInfoCache.userId)
        this._myInfo = data3;
        this._Head = { uri: Config.getHeadUrl(this._myInfo.userId, this._myInfo.logoTime, this._myInfo.thirdIconurl) };
        this.forceUpdate();
    }

    render() {
        let time = duration2Time(Math.ceil((Date.now() - this._beginTick) / 1000));
        let income = RoomInfoCache.isCall ? this._accountMoney : StringUtil.formatMoney(Math.floor(this._income) / 100);


        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    alignSelf: "center",
                    marginTop: DesignConvert.getH(14),
                }}>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={["#54015F", "#2E0034"]}
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(158),
                        borderRadius: DesignConvert.getW(10),
                        flexDirection: "row",
                    }}>

                    <_UserItem
                        img={!this._userInfo ? null : { uri: Config.getHeadUrl(this._userInfo.userId, this._userInfo.logoTime, this._userInfo.thirdIconurl) }}
                        title={!this._userInfo ? "" : decodeURI(this._userInfo.nickName)}
                        isAttend={!this._userInfo ? true : UserInfoModel.isAddLover(this._userInfo.friendStatus)}
                        userId={this._userId}
                        callBack={this._initData}
                        bSlient={!(this._micInfo && this._micInfo.openMic && !this._micInfo.forbidMic)} />


                    <View
                        style={{
                            flex: 1,
                            height: DesignConvert.getH(158),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Image
                            source={phone_status()}
                            style={{
                                width: DesignConvert.getW(52),
                                height: DesignConvert.getH(36),

                            }}></Image>

                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(24),
                                marginTop: DesignConvert.getH(16),
                            }}>{time}</Text>


                        <View
                            style={{
                                width: DesignConvert.getW(345),
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                top: DesignConvert.getH(110),
                                alignSelf: "center"
                            }}>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(12),
                                    marginTop: DesignConvert.getH(16),
                                }}>{RoomInfoCache.isCall ? `当前余额：${income}${COIN_NAME}` : `本次通话预估收益：${income}元`}</Text>

                            {RoomInfoCache.isCall ? (
                                <TouchableOpacity
                                    onPress={this._toRecharge}>
                                    <Text
                                        style={{
                                            color: THEME_COLOR,
                                            fontSize: DesignConvert.getF(12),
                                            marginLeft: DesignConvert.getH(3),
                                        }}>{"充值 >"}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>

                    <_UserItem
                        img={this._Head ? this._Head : null}
                        title={"我"}
                        userId={UserInfoCache.userId}
                        isAttend
                        bSlient={!require("../../../model/room/RoomModel").isOpeMic()}
                    />


                </LinearGradient>

            </View>
        )
    }
}