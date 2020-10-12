/**
 * 密码输入眼睛
 */

'use strict';

import React, { PureComponent } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard } from "react-native";
import DesignConvert from '../../../utils/DesignConvert';
import { LINEARGRADIENT_COLOR, THEME_COLOR } from '../../../styles';
import { close_eye, open_eye } from '../../../hardcode/skin_imgs/login';

export default class _eyeItem extends PureComponent {
    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    // 增加点击面积
                    width: DesignConvert.getW(30),
                    height: DesignConvert.getH(15),
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
                onPress={this._onPress}>
                    
                {this.props.secureState ? 
                    <Image 
                        source={close_eye()}
                        style={{
                            width: DesignConvert.getW(18),
                            height: DesignConvert.getH(7),
                        }}
                    />
                    :
                    <Image 
                        source={open_eye()}
                        style={{
                            width: DesignConvert.getW(18),
                            height: DesignConvert.getH(12),
                        }}
                    />
                }
            </TouchableOpacity>
        )
    }
}