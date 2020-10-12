/**
 * 直播间 -> 头部房间icon
 */

'use strict';

import React, { PureComponent } from 'react';
import { View } from "react-native";
import Animated from 'react-native-reanimated';
import RoomInfoCache from '../../../cache/RoomInfoCache';
import { EVT_UPDATE_ROOM_MAIN_MIC } from '../../../hardcode/HGlobalEvent';
import { EVT_LOGIC_LEAVE_ROOM, EVT_LOGIC_SELF_BY_KICK } from '../../../hardcode/HLogicEvent';
import DesignConvert from '../../../utils/DesignConvert';

class _playRoomImage extends React.PureComponent {

    constructor(props) {
        super(props);

        this.spinValue = new Animated.Value(0)
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onRefresh)
        ModelEvent.addEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
        ModelEvent.addEvent(null, EVT_LOGIC_SELF_BY_KICK, this._onKick)
        this._spin()
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onRefresh)
        ModelEvent.removeEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
        ModelEvent.removeEvent(null, EVT_LOGIC_SELF_BY_KICK, this._onKick)
    }

    _onKick = () => {
        //弹出弹框提示用户被踢出房间
        ToastUtil.showCenter('抱歉，您已被踢出房间')
        require('../../../model/room/RoomModel').default.leave();
    }

    _onRefresh = () => {
        this.forceUpdate()
    }

    _spin = () => {
        this.spinValue.setValue(0)
        Animated.timing(this.spinValue, {
            toValue: 360, // 最终值 为1，这里表示最大旋转 360度
            duration: 4000,
            easing: Easing.linear,
            isInteraction: false,
            useNativeDriver: true
        }).start(() => this._spin())
    }

    render() {
        if (!RoomInfoCache.roomData) {
            return null
        }

        const spin = this.spinValue.interpolate({
            inputRange: [0, 360],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        });

        return (
            <Animated.Image

                style={{
                    borderRadius: DesignConvert.getW(24),
                    marginLeft: DesignConvert.getW(5),
                    width: DesignConvert.getW(30),
                    height: DesignConvert.getH(30),
                    transform: [{ rotate: spin }]
                }}
                source={{ uri: RoomInfoCache.roomLogoUrl }}
            />
        )
    }
}


export default class _RoomTopIconItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(6) + DesignConvert.statusBarHeight,
                    left: DesignConvert.getW(15),
                    justifyContent: "center",
                }}>

                <_playRoomImage />
            </View>
        );
    }
}