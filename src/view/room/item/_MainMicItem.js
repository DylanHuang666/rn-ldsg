'use strict';

import React, { PureComponent } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import Config from "../../../configs/Config";
import { EVT_UPDATE_ROOM_DATA, EVT_UPDATE_ROOM_MAIN_MIC } from "../../../hardcode/HGlobalEvent";
import { ic_silent } from "../../../hardcode/skin_imgs/room";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";
import _RecreationItem from "./recreation/_RecreationItem";
import _BeckoningItem from './_BeckoningItem';
import _WaveSoundItem from "./_WaveSoundItem";


export default class _MainMicItem extends PureComponent {

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onCacheUpdated);
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_DATA, this._onCacheUpdated);
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onCacheUpdated);
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_DATA, this._onCacheUpdated);
    }

    _onCacheUpdated = () => {
        this.forceUpdate();
    }

    _getHeadIcon() {
        //UserInfo
        const createUserInfo = RoomInfoCache.createUserInfo;

        if (!createUserInfo) {
            const roomOwnerInfo = RoomInfoCache.ownerUserInfo;
            if (!roomOwnerInfo) {
                return null;
            }

            return { uri: Config.getHeadUrl(roomOwnerInfo.userId, roomOwnerInfo.logoTime, roomOwnerInfo.thirdIconurl) };
        }

        return {
            uri: Config.getHeadUrl(
                createUserInfo.userId,
                createUserInfo.logoTime,
                createUserInfo.thirdIconurl
            )
        }
    }

    _renderLeave() {
        if (RoomInfoCache.roomData.createOnline) {
            return null
        }
        return (
            <Image
                source={require('../../../hardcode/skin_imgs/yuanqi').host_level()}
                style={{
                    position: "absolute",
                    top: DesignConvert.getH(42),
                    left: DesignConvert.getW(47),

                    width: DesignConvert.getW(18),
                    height: DesignConvert.getH(18),
                    resizeMode: 'contain',
                }}
            />
        )
    }

    _renderSilent() {
        if (RoomInfoCache.roomData.createOpenMic) {
            return null;
        }

        return (
            <Image
                style={{
                    position: 'absolute',
                    left: DesignConvert.getW(47),
                    top: DesignConvert.getH(-5),

                    width: DesignConvert.getW(18),
                    height: DesignConvert.getH(18),
                    resizeMode: 'contain',
                }}
                source={ic_silent()}
            />
        );
    }

    _imgLayout = () => {
        this._imgRef && this._imgRef.measure((parentX, parentY, width, height, screenX, screenY) => {
            require('../../../model/room/MicPostionModel').default.setMicPostionWithIndex(
                0,
                { screenX, screenY }
            )
        })
    }

    _onPress = () => {
        const left = 0;
        const top = DesignConvert.getH(10) + DesignConvert.statusBarHeight;
        require("../../../model/room/RoomSeatModel").pressMainSeat(left, top);
    }

    render() {
        if (!RoomInfoCache.roomData) {
            return null;
        }

        const userInfo = RoomInfoCache.mainMicUserInfo;
        const userId = userInfo && userInfo.userId;

        const headIcon = this._getHeadIcon();

        // const headFrameId = userInfo && userInfo.headFrameId

        // const userName = userInfo
        //     ? decodeURIComponent(userInfo.nickName)
        //     : '';
        // const bMale = userInfo && userInfo.sex == 1;
        // const beckoningNum = RoomInfoCache.roomData.createHeartValue;

        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(15),
                    left: DesignConvert.getW(20),

                    width: DesignConvert.getW(60),
                    height: DesignConvert.getH(60),
                }}
                onPress={this._onPress}
            >

                <_WaveSoundItem
                    userId={userId}
                />

                <Image
                    ref={ref => this._imgRef = ref}
                    style={{
                        position: 'absolute',

                        width: DesignConvert.getW(60),
                        height: DesignConvert.getH(60),
                        borderRadius: DesignConvert.getW(12),

                    }}
                    source={headIcon}
                    onLayout={this._imgLayout}
                />

                {this._renderSilent()}

                {this._renderLeave()}

                {/* <HeadFrameImage
                    id={headFrameId}
                    width={65}
                    height={65}
                /> */}

                <_RecreationItem
                    bMainMic={true}
                    userId={userId}
                />

            </TouchableOpacity>
        )
    }
}