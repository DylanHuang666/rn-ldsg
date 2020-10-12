/**
 * 直播间 -> 头部
 */

'use strict';

import React, { PureComponent } from 'react';
import { View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import RoomInfoCache from '../../../cache/RoomInfoCache';
import { LINEARGRADIENT_COLOR } from '../../../styles';
import DesignConvert from '../../../utils/DesignConvert';
import _FocusButtonItem from './_FocusButtonItem';
import _IDItem from './_IDItem';
import _NoticeWidget from './_NoticeWidget';
import _OnlineItem from './_OnlineItem';
import _RoomCloseItem from './_RoomCloseItem';
import _RoomNameItem from './_RoomNameItem';


export default class _RoomTopItem_lianlian extends PureComponent {

    render() {
        const roomData = RoomInfoCache.roomData;

        return (
            <LinearGradient
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(76) + DesignConvert.statusBarHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: "absolute",
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={LINEARGRADIENT_COLOR}>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: DesignConvert.getH(42),
                        left: DesignConvert.getW(15),
                    }}
                >

                    <_RoomNameItem
                        bLock={roomData.needPassword}
                        name={roomData.roomName}
                    />

                </View>

                <View
                    style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        bottom: DesignConvert.getH(10),
                    }}
                >
                    <_IDItem
                        id={RoomInfoCache.viewRoomId}
                    />

                    <_OnlineItem
                        onlineNum={roomData.onlineNum}
                    />

                    <_NoticeWidget />
                </View>



                <_FocusButtonItem />

                <_RoomCloseItem
                    onPress={this.props.fnOnClose}
                />
            </LinearGradient>
        );
    }
}