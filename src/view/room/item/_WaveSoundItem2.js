'use strict';

import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import _BeckoningItem from './_BeckoningItem';
import { AGORA_ON_AUDIO_VOLUMN_INDICATION } from "../../../hardcode/HNativeEvent";
import { addEventListener, removeEventListener } from "../../../model/agora/AgoraModel";
import { halo } from "../../../hardcode/skin_imgs/room";


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
            }, 2000)
        }
    }

    render() {
        if (!this._bRunning) {
            return null;
        }


        return (
            <Image
                style={{
                    position: 'absolute',
                    width: this.props.width,
                    height: this.props.height,
                    borderRadius: DesignConvert.getW(50),
                }}
                // source={this.props.sex == 2 ? ic_girl_cover() : ic_boy_cover()}
                source={halo()}
            />
        );
    }
}
