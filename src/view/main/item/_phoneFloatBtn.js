/**
 * 主界面
 */
'use strict';

import React, { PureComponent } from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import RoomInfoCache, { isChatRoom } from "../../../cache/RoomInfoCache";
import Config from "../../../configs/Config";
import { EVT_LOGIC_ENTER_ROOM, EVT_LOGIC_LEAVE_ROOM, EVT_LOGIC_PHONE_UPDATE } from "../../../hardcode/HLogicEvent";
import { ic_phone } from "../../../hardcode/skin_imgs/main";
import { ic_default_header } from "../../../hardcode/skin_imgs/registered";
import { duration2Time } from "../../../utils/CDTick";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";

export default class _phoneFloatBtn extends PureComponent {
    constructor(props) {
        super(props);

        this._bShow = false;
        this._beginTick = 0;

        this._headUri = ic_default_header();
    }

    _onPress = () => {
        require('../../../model/room/RoomModel').beforeOpenLive();
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_ENTER_ROOM, this._onRefresh)
        ModelEvent.addEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
        ModelEvent.addEvent(null, EVT_LOGIC_PHONE_UPDATE, this._updateData)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_ENTER_ROOM, this._onRefresh)
        ModelEvent.removeEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
        ModelEvent.removeEvent(null, EVT_LOGIC_PHONE_UPDATE, this._updateData)


        this._stopTimer();
    }

    _stopTimer() {
        if (this._Timer) {
            clearInterval(this._Timer);
            this._Timer = null;
        }
    }

    _startTimer() {
        if (this._Timer) return;

        this._Timer = setInterval(this._updateTime, 1000);
    }

    _onRefresh = () => {
        if (!RoomInfoCache.isInRoom) {
            this._bShow = false;

            this._stopTimer();

        } else if (isChatRoom(RoomInfoCache.roomId)) {
            this._bShow = true;

            this._startTimer();
            this._micInfo = require("../../../model/announcer/ChatRoomModel").getPeerMicInfo();
            this._userId = this._micInfo && this._micInfo.base ? this._micInfo.base.userId : RoomInfoCache.roomData.roomOwnerId;
            this._initData();
        } else {
            this._bShow = false;
            this._stopTimer();
        }
        this.forceUpdate()
    }

    _initData = async () => {
        let data = await require('../../../model/userinfo/UserInfoModel').default.getPersonPage(this._userId);

        if (data) {
            this._userInfo = data;

            this._headUri = { uri: Config.getHeadUrl(this._userInfo.userId, this._userInfo.logoTime, this._userInfo.thirdIconurl) };
            this.forceUpdate();
        }

        await require('../../../model/room/RoomModel').default.getRoomData();

        if (RoomInfoCache.roomData && RoomInfoCache.roomData.chatRoomData) {
            this._beginTick = Date.now() - RoomInfoCache.roomData.chatRoomData.chatTime * 1000;
        }
    }


    _updateData = data => {
        this._beginTick = Date.now() - data.chatTime * 1000;

        this._startTimer();

        this.forceUpdate();
    }

    _updateTime = () => {
        this.forceUpdate();
    }


    render() {
        if (!this._bShow) {
            return null;
        }

        let time = duration2Time(Math.ceil((Date.now() - this._beginTick) / 1000));
        return (
            <View
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: DesignConvert.getH(259) + DesignConvert.addIpxBottomHeight(),

                    width: DesignConvert.getW(79),
                    height: DesignConvert.getH(81),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: "white",
                    borderTopLeftRadius: DesignConvert.getW(20),
                    borderBottomLeftRadius: DesignConvert.getW(20),
                    backgroundColor: "#FFFFFFB3",
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <TouchableOpacity
                    onPress={this._onPress}>
                    <Image
                        source={this._headUri}
                        style={{
                            width: DesignConvert.getW(62),
                            height: DesignConvert.getH(62),
                            borderRadius: DesignConvert.getW(13),
                        }}></Image>

                    <View
                        style={{
                            position: "absolute",
                            width: DesignConvert.getW(62),
                            height: DesignConvert.getH(62),
                            borderRadius: DesignConvert.getW(13),
                            backgroundColor: "#00000099",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Image
                            source={ic_phone()}
                            style={{
                                width: DesignConvert.getW(21),
                                height: DesignConvert.getH(21),
                            }}></Image>

                        <Text
                            style={{
                                color: "#27D058",
                                fontSize: DesignConvert.getF(11),
                                fontWeight: "bold",
                                marginTop: DesignConvert.getH(9),
                            }}>
                            {time}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}