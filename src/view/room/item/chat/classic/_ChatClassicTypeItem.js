'use strict';

import React, { PureComponent } from "react";
import { Text, TouchableOpacity } from "react-native";
import DesignConvert from "../../../../../utils/DesignConvert";
import LinearGradient from "react-native-linear-gradient";
import { THEME_COLOR } from "../../../../../styles";


export default class _ChatClassicTypeItem extends PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.classicType);
    }

    render() {
        const classicType = this.props.classicType;
        const selected = this.props.selected;
        const classicName = this.props.classicName;
        const bottom = this.props.bottom;

        if (selected == classicType) {
            return (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FFFFFF00', '#FFFFFF00']}
                    style={{
                        // position: 'absolute',
                        // right: 0,
                        // bottom: bottom,

                        width: DesignConvert.getW(44),
                        height: DesignConvert.getH(24),

                        borderTopLeftRadius: DesignConvert.getW(12),
                        borderBottomLeftRadius: DesignConvert.getW(12),

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: THEME_COLOR,
                            fontSize: DesignConvert.getF(11),
                        }}
                    >{classicName}</Text>
                </LinearGradient>
            )
        }

        return (
            <TouchableOpacity
                style={{
                    // position: 'absolute',
                    // right: 0,
                    // bottom: bottom,
                }}
                onPress={this._onPress}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FFFFFF00', '#FFFFFF00']}
                    style={{
                        width: DesignConvert.getW(44),
                        height: DesignConvert.getH(24),

                        borderTopLeftRadius: DesignConvert.getW(12),
                        borderBottomLeftRadius: DesignConvert.getW(12),

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(11),
                        }}
                    >{classicName}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}
