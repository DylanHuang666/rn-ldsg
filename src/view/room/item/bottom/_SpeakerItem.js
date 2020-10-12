'use strict';

import React, { PureComponent } from "react";
import { Image, TouchableOpacity, NativeModules } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import { ic_speaker_close, ic_speaker_open } from "../../../../hardcode/skin_imgs/room";
import RoomInfoCache from "../../../../cache/RoomInfoCache";



export default class _SpeakerItem extends PureComponent {

    constructor(props) {
        super(props)
        NativeModules.Agora.enableSpeaker(RoomInfoCache.enableSpeaker);
    }

    _onPress = () => {
        if (!require("../../../../model/room/RoomModel").enableSpeaker(!RoomInfoCache.enableSpeaker)) {
            return;
        }
        this.forceUpdate();
    }

    render() {
        const bOpen = RoomInfoCache.enableSpeaker;

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
                    source={bOpen ? ic_speaker_open() : ic_speaker_close()}
                />
            </TouchableOpacity>
        );
    }
}