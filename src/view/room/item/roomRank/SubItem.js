/**
 * 房间-> 榜单item
 */
'use strict';
import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, RefreshControl, ImageBackground, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DesignConvert from "../../../../utils/DesignConvert";

export function TouchableOpacityAndImg(props) {

    const { onPress, source, containerSty, imgSty, } = props

    return (
        <TouchableOpacity
            onPress={onPress}
            style={containerSty}
        >
            <Image
                source={source}
                style={imgSty}
            />
        </TouchableOpacity>
    )
}

export function TextTouchSelect(props) {

    const { txt, type, selecType, onPress, color } = props

    const isSelect = type === selecType

    const selectBgColor = isSelect ? '#ffffff' : '#2C325F00'
    const fontColor = isSelect ? color : '#FFFFFF'

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={{
                width: DesignConvert.getW(59),
                height: DesignConvert.getH(28),

                borderRadius: DesignConvert.getW(30),

                backgroundColor: selectBgColor,

                justifyContent: 'center',
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    color: fontColor,
                    fontSize: DesignConvert.getF(12),
                    lineHeight: DesignConvert.getH(21),
                }}
            >{txt}</Text>


        </TouchableOpacity>

    )

}

export function TouchSelectTab(props) {

    const { txt, type, selecType, onPress } = props

    const isSelect = type === selecType

    const selectColor = isSelect ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                alignItems: 'center',

            }}
        >
            <Text
                style={{
                    color: selectColor,
                    fontSize: DesignConvert.getF(17),

                    lineHeight: DesignConvert.getH(24)
                }}
            >{txt}</Text>

            {/* {isSelect &&
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#21D3FF', '#697BFF']}
                    style={{
                        marginTop: DesignConvert.getH(1),

                        width: DesignConvert.getW(21),
                        height: DesignConvert.getH(3),

                        borderRadius: DesignConvert.getW(5)
                    }}
                />

            } */}
        </TouchableOpacity>
    )

}