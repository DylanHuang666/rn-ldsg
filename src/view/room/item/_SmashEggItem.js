'use strict';

import React, { PureComponent } from "react";
import { Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";

export default class _SmashEggItem extends PureComponent {

    constructor(props) {
        super(props);
        // this._data;
    }

    componentDidMount() {
        require("../../../model/room/RoomModel").default.getEggGameSwitch(this.props.roomId, this.props.type)
            .then(data => {
                if (!data) return;

                this._data = data;
                this.forceUpdate();
            });
    }

    _onPress = () => {
        require("../../../router/level3_router").openActivityWebView(this._data.landh5url);
    }

    render() {
        if (!this._data) {
            return null;
        }

        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: DesignConvert.getH(140) + DesignConvert.addIpxBottomHeight(),
                    right: DesignConvert.getW(15),
                }}
                onPress={this._onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(56),
                        height: DesignConvert.getH(56),
                    }}
                    source={{ uri: this._data.gameIcon }}
                />
            </TouchableOpacity>

        );
    }
}