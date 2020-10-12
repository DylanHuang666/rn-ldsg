/**
 * 开播设置 -> 开播按钮
 */
'use strict';

import React, { PureComponent } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../../utils/DesignConvert';

export default class RoomStartButtonItem extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    left: DesignConvert.getW(83),
                    bottom: DesignConvert.getH(145) + DesignConvert.addIpxBottomHeight(),
                }}
                onPress={this.props.onStart}
            >

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FF5245', '#CD0031']}
                    style={{
                        width: DesignConvert.getW(210),
                        height: DesignConvert.getH(50),
                        borderRadius: DesignConvert.getW(25),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: DesignConvert.getF(14),
                        }}
                    >开始直播</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}