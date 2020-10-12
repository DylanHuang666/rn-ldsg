'use strict';

import React, { PureComponent } from "react";
import { Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";

export default class _RoomCloseItem extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(35),
                    right: DesignConvert.getW(20),
                }}
                onPress={this.props.onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(21),
                        height: DesignConvert.getH(21),
                        resizeMode: 'contain'
                    }}
                    source={require('../../../hardcode/skin_imgs/yuanqi').room_close_icon()}
                />
            </TouchableOpacity>
        );
    }
}