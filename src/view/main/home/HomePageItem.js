/**
 * 主界面 -> 首页 -> Item
 */
'use strict';

import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, ScrollView, RefreshControl, StatusBar } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import LinearGradient from 'react-native-linear-gradient';


export function TouchImg(props) {

    const { imgStyle, containerStyle, source, onPress } = props

    return (
        <TouchableOpacity
            onPress={onPress}
            style={containerStyle}
        >

            <Image
                style={imgStyle}
                source={source}
            />


        </TouchableOpacity>
    )
}

export function TouchAndIcon(props) {
    const { source, onPress, styleContianer, imgStyle } = props

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                ...styleContianer
            }}
        >
            <Image
                source={source}
                style={{
                    width: DesignConvert.getW(24),
                    height: DesignConvert.getH(22),
                    ...imgStyle
                }}
            />
        </TouchableOpacity>
    )

}

export function SearchItem() {
    const _onSearch = () => {
        require("../../../router/level2_router").showSearchView();
        // require("../../../router/level2_router").showHeadlinesView();
    }

    return (
        <TouchableOpacity
            onPress={_onSearch}

            style={{
                width: DesignConvert.getW(240),
                height: DesignConvert.getH(32),
                borderRadius: DesignConvert.getW(30),

                backgroundColor: '#FFFFFF1A',

                flexDirection: 'row',
                alignItems: 'center',

                paddingLeft: DesignConvert.getW(10)
            }}
        >
            <Image
                source={require('../../../hardcode/skin_imgs/main').ic_search()}
                style={{
                    width: DesignConvert.getW(15),
                    height: DesignConvert.getH(15),

                    tintColor: '#666666FF'
                }}
            />
            <Text
                style={{
                    marginLeft: DesignConvert.getW(5),

                    fontSize: DesignConvert.getF(12),
                    color: '#666666FF'
                }}
            >搜索昵称，ID，房间名</Text>
        </TouchableOpacity>
    )
}
