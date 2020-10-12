/**
 * 开播设置 -> 房间背景选择
 */
'use strict';

import React, { PureComponent } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import { arrow_right } from '../../../hardcode/skin_imgs/common';

export default class RoomBgItem extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                style={{
                    marginTop: DesignConvert.getH(30),
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: DesignConvert.getH(44),
                }}
                onPress={this.props.onChangeBg}
            >

                <Text
                    style={{
                        marginLeft: DesignConvert.getW(15),
                        color: '#B8B8B8',
                        fontSize: DesignConvert.getF(13),
                    }}
                >房间背景</Text>

                <View
                    style={{
                        flex: 1,
                    }}
                />
                <Image
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(35),

                        width: DesignConvert.getW(40),
                        height: DesignConvert.getH(40),

                        borderRadius: DesignConvert.getW(5),

                        // justifyContent: 'center',
                        // alignItems: 'center',
                    }}
                    source={this.props.roomBg}
                />

                <Image
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(15),
                        right: DesignConvert.getW(15),

                        width: DesignConvert.getW(7),
                        height: DesignConvert.getH(13),
                    }}
                    source={arrow_right()}
                />
            </TouchableOpacity>
        )
    }
}