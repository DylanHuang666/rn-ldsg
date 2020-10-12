/*
 * @Author: 
 * @Date: 2020-10-07 11:16:43
 * @LastEditors: your name
 * @LastEditTime: 2020-10-08 16:22:36
 * @Description: file content
 */
/**
 * 时间选择按钮
 */

'use strict';

import React, { PureComponent } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { THEME_COLOR } from '../../../styles';
import DesignConvert from '../../../utils/DesignConvert';

export default class TimeChooseButton extends PureComponent {

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {

        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    // height: DesignConvert.getH(68),
                    // justifyContent: "center",
                    // alignItems: "center",
                }}
                onPress={this._onPress}
            >
                <View
                    style={{
                        marginTop: DesignConvert.getH(10),
                        marginBottom: DesignConvert.getH(10),
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>

                    <Text
                        style={{
                            color: 'rgba(213, 213, 213, 1)',
                            fontSize: DesignConvert.getF(12),
                            fontWeight: "normal",
                            alignSelf: "center",
                            marginRight: DesignConvert.getW(5),
                        }}
                    >{this.props.btnText}</Text>

                    <Image
                        source={require('../../../hardcode/skin_imgs/anchorincome').date()}
                        style={{
                            width: DesignConvert.getW(18),
                            height: DesignConvert.getW(17),
                            display: !this.props.bHideArrowDown ? "flex" : "none",
                            tintColor: this.props.bWhite ? "#FFDEE4" : null
                        }} />
                </View>

                {/* <Text
                    style={{
                        color: this.props.bWhite ? "white" : THEME_COLOR,
                        fontSize: DesignConvert.getF(15),
                        fontWeight: "normal",
                        alignSelf: "center",
                        marginTop: DesignConvert.getW(5),
                    }}
                >{this.props.btnText}</Text> */}
            </TouchableOpacity>
        );
    }
}