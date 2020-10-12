'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import RoomInfoCache from "../../../../cache/RoomInfoCache";
import ModelEvent from "../../../../utils/ModelEvent";
import { EVT_UPDATE_ROOM_DATA } from "../../../../hardcode/HGlobalEvent";
import { ic_micque_bg } from "../../../../hardcode/skin_imgs/room";


/**
 * 打开排麦界面
 */
export default class _MicQueueItem extends PureComponent {

    constructor(props) {
        super(props)

        this._show = false//是否排麦权限

        require('../../../../model/room/RoomModel').default.getRoomConfigData()
            .then(data => {
                this._show = data
                this.forceUpdate()
            })
    }

    componentDidMount() {
        //监听房间数据变化，因为排麦数据是在房间数据里的
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_DATA, this._onRefresh)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_DATA, this._onRefresh)
    }


    _onPress = () => {
        require('../../../../router/level3_router').showMicQueView()
    }

    _onRefresh = () => {
        this.forceUpdate()
    }

    render() {

        if (!this._show) {
            return null
        }

        //todo
        const num = RoomInfoCache.MicQues.length;

        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(8),
                }}
                onPress={this._onPress}
            >
                <View
                    style={{
                        width: DesignConvert.getW(32),
                        height: DesignConvert.getH(32),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        style={{
                            position: 'absolute',
                            width: DesignConvert.getW(32),
                            height: DesignConvert.getH(32),
                            resizeMode: 'contain',
                        }}
                        source={ic_micque_bg()}
                    />


                    <Text
                        style={{
                            fontSize: DesignConvert.getF(13),
                            color: 'white',
                        }}
                    >{num}</Text>

                </View>
            </TouchableOpacity>
        );
    }
}