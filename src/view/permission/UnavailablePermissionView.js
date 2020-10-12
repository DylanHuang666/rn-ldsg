/**
 * 权限不可用的提示界面
 */
'use strict';

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { openSettings, PERMISSIONS } from 'react-native-permissions';
import DesignConvert from '../../utils/DesignConvert';
import BaseView from '../base/BaseView';

export default class UnavailablePermissionView extends BaseView {

    _onSetting = () => {
        openSettings();
    }

    render() {

        let title;
        let desc;
        if (
            PERMISSIONS.ANDROID.CAMERA == this.props.params.permission
            || PERMISSIONS.IOS.CAMERA == this.props.params.permission
        ) {
            title = '无法获取相册权限';
            desc = 'Mika Live需要获取相册权限，点击设置前往开启';
        } else {
            title = '无法获取麦克风权限';
            desc = 'Mika Live需要获取麦克风权限，点击设置前往开启';
        }

        return (
            <View
                style={{
                    flex: 1,

                    backgroundColor: '#00000080',

                    // flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: "center",
                }}>

                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        position: 'absolute',
                    }}
                />

                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: DesignConvert.getW(15),
                        paddingHorizontal: DesignConvert.getW(36),
                        paddingVertical: DesignConvert.getH(21),

                        // flexDirection: 'column',
                        // justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >

                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: '#121212',
                            fontSize: DesignConvert.getF(18),
                        }}
                    >{title}</Text>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(15),

                            width: DesignConvert.getW(214),

                            textAlign: 'center',

                            color: '#606060',
                            fontSize: DesignConvert.getF(15),
                        }}
                    >{desc}</Text>

                    <TouchableOpacity
                        style={{
                            marginTop: DesignConvert.getH(14),
                        }}
                        onPress={this._onSetting}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#FE00C5', '#A900FF']}
                            style={{
                                width: DesignConvert.getW(200),
                                height: DesignConvert.getH(36),
                                borderRadius: DesignConvert.getW(18),

                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: DesignConvert.getF(14),
                                }}
                            >{'SETTINGS'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{
                            marginTop: DesignConvert.getH(10),
                        }}
                        onPress={this.popSelf}
                    >
                        <View
                            style={{
                                width: DesignConvert.getW(200),
                                height: DesignConvert.getH(36),
                                borderRadius: DesignConvert.getW(18),

                                backgroundColor: '#EEEEEE',

                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: '#606060',
                                    fontSize: DesignConvert.getF(14),
                                }}
                            >{'CANCEL'}</Text>
                        </View>
                    </TouchableOpacity>


                </View>

            </View>
        );
    }
}