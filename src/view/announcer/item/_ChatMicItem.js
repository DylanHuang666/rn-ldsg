'use strict';

import React, { PureComponent } from "react";
import { Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import { ic_mic_open, ic_mic_close } from "../../../hardcode/skin_imgs/chatroom";
import { ERoomActionType } from "../../../hardcode/ERoom";
import UserInfoCache from "../../../cache/UserInfoCache";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_SELF_MIC_CHANGE } from "../../../hardcode/HLogicEvent";
import ToastUtil from "../../base/ToastUtil";


export default class _ChatMicItem extends PureComponent {

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_SELF_MIC_CHANGE, this._selfMicChange)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_SELF_MIC_CHANGE, this._selfMicChange)
    }

    _selfMicChange = () => {
        this.forceUpdate()
    }

    _onPress = async () => {
        const permissStatus = await require('../../../model/PermissionModel').checkAudioRoomPermission()
        if (permissStatus == 'denied' || permissStatus == 'blocked') {
            //麦克风没打开，默认闭麦状态
            ToastUtil.showCenter('麦克风权限未打开')
            return
        }
        const RoomModel = require("../../../model/room/RoomModel");
        const bOpen = RoomModel.isOpeMic();
        if (!RoomModel.enableMic(!bOpen)) {
            return;
        }
        require('../../../model/room/RoomModel').default.action(RoomModel.isOpeMic() ? ERoomActionType.MIC_OPEN : ERoomActionType.MIC_CLOSE, UserInfoCache.userId, 0, '')
        this.forceUpdate();

    }

    render() {
        const bOpen = require("../../../model/room/RoomModel").isOpeMic();

        return (
            <TouchableOpacity
                style={{
                    ...this.props.style
                }}
                onPress={this._onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(27),
                        height: DesignConvert.getH(27),
                    }}
                    source={bOpen ? ic_mic_open() : ic_mic_close()}
                />
            </TouchableOpacity>
        );
    }
}