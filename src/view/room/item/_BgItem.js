/**
 * 直播间 -> 背景
 */
'use strict';

import React, { PureComponent } from "react";
import { Image } from "react-native";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import { EVT_LOGIC_UPDATE_ROOM_BG } from "../../../hardcode/HLogicEvent";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";

export default class _BgItem extends PureComponent {

    constructor(props) {
        super(props)

        const roomData = RoomInfoCache.roomData;
        this._id = roomData && roomData.bg;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_ROOM_BG, this._change)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_ROOM_BG, this._change)
    }

    _change = (data) => {
        this._id = data
        this.forceUpdate()
    }

    render() {
        if (!this._id) {
            return null;
        }

        const voiceRoomBackgroundUrl = require("../../../configs/ImageUrl").voiceRoomBackgroundUrl;

        return (

            <Image
                style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    // right:0,
                    // bottom:0,
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                }}
                resizeMode='cover'
                source={voiceRoomBackgroundUrl(this._id)}
                defaultSource={require("../../../hardcode/skin_imgs/room").bg_def()}
            />
        );
    }
}