/*
 * @Author: 
 * @Date: 2020-09-10 15:46:27
 * @LastEditors: your name
 * @LastEditTime: 2020-09-10 16:11:59
 * @Description: file content
 */
'use strict';

import React, { PureComponent } from "react";
import { Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import { ic_close, ic_room_more } from "../../../hardcode/skin_imgs/room";

export default class _RoomCloseItem extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: DesignConvert.getW(15),
                    width: DesignConvert.getW(16),
                    height: DesignConvert.getH(16),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={this.props.onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(21),
                        height: DesignConvert.getH(21),
                        resizeMode:'contain',
                    }}
                    source={ic_room_more()}
                />
            </TouchableOpacity>
        );
    }
}