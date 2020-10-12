'use strict';

import React, { PureComponent } from "react";
import { TouchableOpacity, Image } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import RoomInfoCache from "../../../../cache/RoomInfoCache";
import { ic_movie_close, ic_movie_open } from "../../../../hardcode/skin_imgs/room_more";
import ModelEvent from "../../../../utils/ModelEvent";
import { EVT_LOGIC_REFRESH_ROOM_MORE } from "../../../../hardcode/HLogicEvent";
import ToastUtil from "../../../base/ToastUtil";

export default class _EffectItem extends PureComponent {


    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)
    }

    _refresh = () => {
        this.forceUpdate();
    }

    _onPress = () => {
        RoomInfoCache.setSelfAnimation(!RoomInfoCache.isSelfAnimation)
        RoomInfoCache.isSelfAnimation ? ToastUtil.showCenter('礼物特效已开启') : ToastUtil.showCenter('礼物特效已关闭')
        this.forceUpdate()
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(8),
                }}
                onPress={this._onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(32),
                        height: DesignConvert.getH(32),
                    }}
                    source={RoomInfoCache.isSelfAnimation ? ic_movie_open() : ic_movie_close()}
                />
            </TouchableOpacity>
        );
    }
}