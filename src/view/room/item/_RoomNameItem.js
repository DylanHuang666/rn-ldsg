'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_REFRESH_ROOM_MORE } from "../../../hardcode/HLogicEvent";


export default class _RoomNameItem extends PureComponent {

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)

    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)
    }

    _refresh = () => [
        this.forceUpdate()
    ]

    render() {

        if (RoomInfoCache.isNeedPassword) {

            const room_lock = require('../../../hardcode/skin_imgs/room').room_lock;

            return (
                <View
                    style={{
                        flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        style={{
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(11),
                        }}
                        source={room_lock()}
                    />

                    <Text
                        numberOfLines={1}
                        style={{
                            marginLeft: DesignConvert.getW(4),
                            maxWidth: DesignConvert.getW(220),
                            color: '#F8F8F8',
                            fontSize: DesignConvert.getF(17),
                            lineHeight: DesignConvert.getH(24),
                            fontWeight: "bold",
                        }}
                    >{decodeURIComponent(this.props.name)}</Text>
                </View>
            )
        }
        return (
            <View
                style={{
                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>

                <Text
                    numberOfLines={1}
                    style={{
                        color: '#F8F8F8',
                        fontSize: DesignConvert.getF(17),
                        lineHeight: DesignConvert.getH(24),
                        maxWidth: DesignConvert.getW(220),
                        fontWeight: "bold",
                    }}
                >{decodeURIComponent(this.props.name)}</Text>
            </View>

        )
    }
}