/**
 * 房间 -> 房间头部
 */
'use strict';

import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import { EVT_UPDATE_ROOM_DATA, EVT_UPDATE_ROOM_MAIN_MIC } from "../../../hardcode/HGlobalEvent";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";
import _BeckoningItem from "./_BeckoningItem";
import _FocusButtonItem from "./_FocusButtonItem";
import _IDItem from "./_IDItem";
import _MainMicItem from "./_MainMicItem";
import _OnlineItem from "./_OnlineItem";
import _RoomCloseItem from "./_RoomCloseItem";
import _RoomRankItem from "./_RoomRankItem";



export default class _RoomTopItem extends PureComponent {

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

    _renderName() {
        const userInfo = RoomInfoCache.mainMicUserInfo;
        const userName = userInfo
            ? decodeURIComponent(userInfo.nickName)
            : '';

        return (
            <Text
                numberOfLines={1}
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(16),
                    left: DesignConvert.getW(95),

                    color: 'white',
                    fontSize: DesignConvert.getF(12),
                    fontWeight: 'bold',
                }}
            >{userName}</Text>
        );
    }

    _renderBeckoningItem() {
        const userInfo = RoomInfoCache.mainMicUserInfo;
        // const userId = userInfo && userInfo.userId;

        // const headIcon = this._getHeadIcon();

        // const headFrameId = userInfo && userInfo.headFrameId

        // const userName = userInfo
        //     ? decodeURIComponent(userInfo.nickName)
        //     : '';
        const bMale = userInfo && userInfo.sex == 1;
        const beckoningNum = RoomInfoCache.roomData.createHeartValue;

        return (
            <_BeckoningItem
                bMale={bMale}
                num={beckoningNum}
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(55),
                    left: DesignConvert.getW(95),
                }}
            />
        )
    }

    render() {
        if (!RoomInfoCache.roomData) {
            return null;
        }

        return (
            <View
                style={{
                    position: 'absolute',
                    top: DesignConvert.statusBarHeight,

                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(145),

                    borderRadius: DesignConvert.getW(26),

                    backgroundColor: '#78787899',
                }}
            >

                <_MainMicItem
                />

                {this._renderName()}

                <_IDItem
                    id={RoomInfoCache.viewRoomId}
                />

                {this._renderBeckoningItem()}

                <_FocusButtonItem
                />

                <_RoomCloseItem
                    onPress={this.props.fnOnClose}
                />

                <_RoomRankItem
                />

                <_OnlineItem
                    onlineNum={RoomInfoCache.roomData.onlineNum}
                />

            </View>
        )
    }
}