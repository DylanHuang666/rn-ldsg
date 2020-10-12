'use strict';

import React, { PureComponent } from "react";
import { Image } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import { room_lock } from "../../hardcode/skin_imgs/room";
import RoomInfoCache from "../../cache/RoomInfoCache";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_REFRESH_ROOM_MORE } from "../../hardcode/HLogicEvent";

export default class _RoomLockItem extends PureComponent {

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._onRefresh)
    }

    componentWillUnmount() {
        ModelEvent.addEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._onRefresh)
    }

    _onRefresh = () => {
        this.forceUpdate()
    }

    render() {
        if (!RoomInfoCache.isNeedPassword) {
            return null
        }

        return (
            <Image
                style={{
                    width: DesignConvert.getW(15),
                    height: DesignConvert.getH(19),
                    resizeMode: 'contain',
                    marginEnd: DesignConvert.getW(15),
                }}
                source={room_lock()}
            />
        )
    }
}