/*
 * @Author: 
 * @Date: 2020-09-10 15:46:27
 * @LastEditors: your name
 * @LastEditTime: 2020-09-10 16:25:39
 * @Description: file content
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import { ic_silent } from "../../../hardcode/skin_imgs/room";


export default class _SilentItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    // backgroundColor: '#00000026',
                    // borderRadius: DesignConvert.getW(50),
                    // justifyContent: "center",
                    // alignItems: "center",
                    position: 'absolute',
                    // bottom: 0,
                    top: 0,
                    right: 0,
                }}>
                <Image
                    style={{
                        width: DesignConvert.getW(21),
                        height: DesignConvert.getH(21),
                    }}
                    source={require('../../../hardcode/skin_imgs/ccc').ttq_room_forbid_mic()}
                />
            </View>
        )
    }
}