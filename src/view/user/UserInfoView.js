/**
 * 用户资料页
 */

import React, { PureComponent } from 'react';
import BaseView from "../base/BaseView";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import Config from '../../configs/Config';
import LinearGradient from 'react-native-linear-gradient';

export default class UserInfoView extends BaseView {

    render() {

        const StatusBarView = require("../base/StatusBarView").default;

        let name = "发发是只猫发发是只猫发发是只猫发发是只猫发发是只猫发发是只猫发发是只猫发发是只猫";
        if (name.length > 8) {
            name = name.substring(0, 8) + '...';
        }

        return (

            <View style={{ flex: 1 }} >

                <ScrollView
                    style={{
                        flex: 1,
                    }}>
                    <Image
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(375)
                        }}
                        source={{ uri: Config.getRNImageUrl('timg.jpg', 0, 375, 375) }} />

                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#8A6DE9', '#9A9AF7', '#D08FF9']}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'red',
                            borderTopLeftRadius: DesignConvert.getBorderWidth(50),
                            borderBottomLeftRadius: DesignConvert.getBorderWidth(50),
                            position: 'absolute',
                            top: DesignConvert.getH(259),
                            right: 0,
                            backgroundColor: 'red',
                            width: DesignConvert.getW(130),
                            height: DesignConvert.getH(28),
                        }} >

                        <Text
                            style={{
                                fontSize: DesignConvert.getF(10),
                                color: '#ffffff'
                            }}>
                            风筝与太阳
                        </Text>

                    </LinearGradient>

                    <View
                        style={{
                            flex: 1,
                            marginTop: DesignConvert.getH(105),
                            height: DesignConvert.sheight,
                            backgroundColor: 'red',
                        }}>


                    </View>

                    <View
                        style={{
                            paddingLeft: DesignConvert.getW(20),
                            pyarnddingRight: DesignConvert.getW(20),
                            height: DesignConvert.getH(160),
                            height: DesignConvert.getH(160),
                            position: 'absolute',
                            top: DesignConvert.getH(320),
                            width: DesignConvert.swidth,
                            backgroundColor: 'white',
                            borderTopLeftRadius: DesignConvert.getBorderWidth(50),
                            borderTopRightRadius: DesignConvert.getBorderWidth(50),

                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                position: 'absolute',
                                top: DesignConvert.getH(24),
                                left: DesignConvert.getW(20),
                                right: DesignConvert.getW(116),
                                justifyContent: 'flex-start'
                            }}>

                            <Text
                                style={{
                                    backgroundColor: 'red',
                                }} >
                                {name}
                            </Text>

                            <Text
                                style={{
                                    marginLeft: DesignConvert.getW(13)
                                }}
                            >
                                哈哈哈
                                </Text>

                            <Text
                                style={{
                                    marginLeft: DesignConvert.getW(13)
                                }}
                            >
                                哈哈哈
                                </Text>
                        </View>

                        <View
                            style={{
                                borderRadius: DesignConvert.getH(50),
                                right: 0,
                                position: 'absolute',
                                top: DesignConvert.getH(24),
                                right: DesignConvert.getW(20),
                                width: DesignConvert.getW(76),
                                height: DesignConvert.getW(76),
                                backgroundColor: 'yellow'
                            }}>

                        </View>




                    </View>



                </ScrollView>

                <View
                    style={{
                        position: 'absolute'
                    }}>

                    <StatusBarView />

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(50),
                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),
                    }}>

                        <Image
                            style={{
                                width: 12,
                                height: 21
                            }}
                            source={{ uri: Config.getRNImageUrl('ic_back_white.png', 0, 30, 30) }}>
                        </Image>


                        <Image
                            style={{
                                width: 20,
                                height: 20
                            }}
                            source={{ uri: Config.getRNImageUrl('ic_edit_white.png', 0, 30, 30) }}>
                        </Image>

                    </View>

                </View>

            </View >
        )
    }
}