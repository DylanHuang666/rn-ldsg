'use strict';

import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import _BeckoningItem from './_BeckoningItem';
import { AGORA_ON_AUDIO_VOLUMN_INDICATION } from "../../../hardcode/HNativeEvent";
import { addEventListener, removeEventListener } from "../../../model/agora/AgoraModel";
import RNSvgaPlayer from 'react-native-svga-player'
import { wave_sound } from "../../../hardcode/skin_imgs/room";

//todo
//声音波形
export default class _WaveSoundItem extends PureComponent {

    constructor(props) {
        super(props);
        this._bRunning = false;
    }

    componentDidMount() {
        addEventListener(AGORA_ON_AUDIO_VOLUMN_INDICATION, this._onAudioVolumeIndication);
    }

    componentWillUnmount() {
        removeEventListener(AGORA_ON_AUDIO_VOLUMN_INDICATION, this._onAudioVolumeIndication);
    }

    _onAudioVolumeIndication = (map) => {
        if (map[this.props.userId]) {
            if (this._bRunning) {
                return;
            }

            this._bRunning = true;
            this.forceUpdate();

            setTimeout(() => {
                this._bRunning = false;
                this.forceUpdate();
            }, 1000)
        }
    }

    render() {
        if (!this._bRunning) {
            return null;
        }


        return (
            <Image
                source={wave_sound()}
                style={{
                    position: 'absolute',
                    width: this.props.width,
                    height: this.props.height,
                }}
            />
            // <RNSvgaPlayer
            //     source={wave_sound()}
            //     style={{
            //         position: 'absolute',
            //         width: this.props.width,
            //         height: this.props.height,
            //     }}
            // />
            // <View
            //     style={{
            //         position: 'absolute',
            //         top: -DesignConvert.getH(2.5),
            //         left: -DesignConvert.getW(2.5),
            //         width: this.props.width,
            //         height: this.props.height,
            //         borderColor: 'red',
            //         borderWidth: DesignConvert.getW(1),
            //         borderRadius: DesignConvert.getW(40),
            //     }}
            // >
            // </View>
        );
    }
}
