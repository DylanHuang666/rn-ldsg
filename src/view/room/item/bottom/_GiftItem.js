'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import { ic_gift } from "../../../../hardcode/skin_imgs/room";


export default class _GiftItem extends PureComponent {

    _onPress = () => {
        require("../../../../router/level3_router").showRoomGiftPanelView();
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(15),
                }}
                onPress={this._onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(32),
                        height: DesignConvert.getH(32),
                    }}
                    source={ic_gift()}
                />
            </TouchableOpacity>
        )
    }
}