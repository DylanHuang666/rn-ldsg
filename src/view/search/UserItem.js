/*
 * @Author: 
 * @Date: 2020-09-10 15:46:27
 * @LastEditors: your name
 * @LastEditTime: 2020-09-12 18:19:23
 * @Description: file content
 */

/**
 * 首页 -> 搜索
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../utils/DesignConvert';
import Config from '../../configs/Config';
import { THEME_COLOR } from '../../styles';
import MedalWidget from '../userinfo/MedalWidget';


export default class UserItem extends PureComponent {
    constructor(props) {
        super(props);
        this._item = this.props.data;

        this._charmLv = this._item.base.charmLv;
        this._richLv = this._item.base.contributeLv;

    }

    _onUserItemPress = () => {
        require("../../router/level2_router").showUserInfoView(this._item.base.userId);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._onUserItemPress}
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(65),
                    paddingHorizontal: DesignConvert.getW(15),
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                <Image
                    source={{ uri: Config.getHeadUrl(this._item.base.userId, this._item.base.logoTime, this._item.base.thirdIconurl) }}
                    style={{
                        width: DesignConvert.getW(50),
                        height: DesignConvert.getH(50),
                        borderColor: THEME_COLOR,
                        borderRadius: DesignConvert.getW(50),
                        borderWidth: DesignConvert.getW(1),
                        padding: DesignConvert.getW(1),
                        marginRight: DesignConvert.getW(12),
                    }}></Image>

                {/* {this._item.roomStatus > 0 ?
                    (<View
                        style={{
                            position: "absolute",
                            left: 0,
                            top: DesignConvert.getH(40),
                        }}>
                        <Image
                            source={require("../../hardcode/skin_imgs/search").ic_status_live()}
                            style={{
                                width: DesignConvert.getW(13),
                                height: DesignConvert.getH(13),
                            }}></Image>
                    </View>) : null} */}

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        height: DesignConvert.getH(65),
                    }}>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>

                        <Text
                            numberOfLines={1}
                            style={{
                                color: "#1D1D1D",
                                fontSize: DesignConvert.getF(13),
                                marginRight: DesignConvert.getW(5),
                            }}>{decodeURI(this._item.base.nickName)}</Text>

                        <MedalWidget
                            // richLv={this._richLv}
                            // charmLv={this._charmLv}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: DesignConvert.getH(10),
                        }}>

                        <View
                            style={{
                                width: DesignConvert.getW(5),
                                height: DesignConvert.getH(5),
                                borderRadius: DesignConvert.getW(5),
                                backgroundColor: '#4CF267',
                                marginRight: DesignConvert.getW(3),
                            }} />

                        <Text
                            style={{
                                color: "#B8B8B8",
                                fontSize: DesignConvert.getF(11),
                            }}>{`用户ID:${this._item.base.userId}`}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
}