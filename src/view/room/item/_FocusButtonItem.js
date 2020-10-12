'use strict'

import React, { PureComponent } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import { EVT_UPDATE_ROOM_MAIN_MIC } from "../../../hardcode/HGlobalEvent";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";


export default class _FocusButtonItem extends PureComponent {

    constructor(props) {
        super(props);

        this._friendStatus = 0//好友状态
        this._isShow = false
    }


    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onCacheUpdated);
        this._getData();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onCacheUpdated);
    }

    _onCacheUpdated = () => {
        const createUserInfo = RoomInfoCache.createUserInfo;
        if (!createUserInfo) return;
        if (createUserInfo.friendStatus == this._friendStatus) return;

        this._friendStatus = createUserInfo.friendStatus;

        this._getData();
    }

    _getData() {
        const roomData = RoomInfoCache.roomData;
        if (!roomData) {
            return;
        }

        require('../../../model/room/RoomModel').default.isAttentionBtn(roomData.roomId, roomData.createId, this._friendStatus)
            .then(data => {
                if (this._isShow == data) return;

                this._isShow = data
                this.forceUpdate()
            })
    }

    _onPress = () => {
        const roomData = RoomInfoCache.roomData;
        if (!roomData) {
            return;
        }

        require('../../../model/userinfo/UserInfoModel').default.addLover(roomData.createId, true)
            .then(data => {
                if (data) {
                    //关注成功
                    this._isShow = false
                    this.forceUpdate()
                    require("../../../model/chat/ChatModel").sendFollow()
                }
            })
    }

    render() {
        if (!this._isShow) {
            return null;
        }

        // const ic_focus = require("../../../hardcode/skin_imgs/room").ic_focus;

        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(33),
                    left: DesignConvert.getW(206),
                }}
                onPress={this._onPress}
            >

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#FF5245', '#CD0031']}
                    style={{
                        width: DesignConvert.getW(48),
                        height: DesignConvert.getH(24),
                        borderRadius: DesignConvert.getW(16),

                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >

                    <Image
                        style={{
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(9),
                        }}
                        source={require("../../../hardcode/skin_imgs/yuanqi").room_focus_icon()}
                    />
                    <Text
                        style={{
                            marginLeft: DesignConvert.getW(3),

                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: DesignConvert.getF(11),
                        }}
                    >关注</Text>
                </LinearGradient>

            </TouchableOpacity >
        )
    }
}