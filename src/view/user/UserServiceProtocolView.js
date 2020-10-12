/**
 * 用户服务协议和隐私保护政策提示
 */

'use strict';

import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, BackHandler } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DesignConvert from "../../utils/DesignConvert";
import BaseView from "../base/BaseView";


export default class UserServiceProtocolView extends BaseView {


    _onUserPress = () => {
        require('../../model/user/UserServiceProtocolModel').showUserServiceWebView();
    }

    _onPrivacyPress = () => {
        require('../../model/user/UserServiceProtocolModel').showPrivacyWebView();
    }

    _onAgree = () => {
        this.popSelf();
        require('../../model/user/UserServiceProtocolModel').saveHasShownUserService();
    }

    _onExit = () => {
        BackHandler.exitApp();
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,

                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <View
                    style={{
                        width: DesignConvert.getW(275),
                        // height: DesignConvert.getH(380),

                        backgroundColor: 'white',
                        borderRadius: DesignConvert.getW(10),

                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(18),
                            color: '#333333',

                            fontWeight: 'bold',
                            fontSize: DesignConvert.getF(15),
                        }}
                    >用户服务协议和隐私保护政策提示</Text>

                    <ScrollView
                        style={{
                            marginTop: DesignConvert.getH(16),

                            width: DesignConvert.getW(238),
                            height: DesignConvert.getH(238),
                        }}
                    >
                        <Text
                            style={{
                                color: '#666666',
                                fontSize: DesignConvert.getF(13),

                                lineHeight: DesignConvert.getH(19),
                            }}
                        >
                            {'欢迎来到栗子 !\n'
                                + '1.为了更好提供浏览、发布内容、购买专辑和会员、用户注册等相关服务，我们会根据您使用服务的具体功能需要，收集必要的用户信息;\n'
                                + '2.未经您的授权，我们不会与第三方共享或对外提供您的信息;\n'
                                + '请您阅读完整版栗子'}

                            <Text
                                style={{
                                    color: '#E75F59',
                                    fontSize: DesignConvert.getF(13),

                                    lineHeight: DesignConvert.getH(19),
                                }}
                                onPress={this._onUserPress}
                            >《用户服务协议》</Text>

                            {'和'}

                            <Text
                                style={{
                                    color: '#E75F59',
                                    fontSize: DesignConvert.getF(13),

                                    lineHeight: DesignConvert.getH(19),
                                }}
                                onPress={this._onPrivacyPress}
                            >《隐私协议》</Text>

                            {'\n点击"同意"即表示您已阅读并同意全部条款。'}

                        </Text>

                    </ScrollView>

                    <TouchableOpacity
                        style={{
                            marginTop: DesignConvert.getH(16),
                        }}
                        onPress={this._onAgree}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#E75F59', '#DF4D6F']}
                            style={{
                                width: DesignConvert.getW(210),
                                height: DesignConvert.getH(37),

                                borderRadius: DesignConvert.getW(23),

                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(13),
                                    color: 'white',
                                }}
                            >同意</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text
                        style={{
                            marginVertical: DesignConvert.getH(11),

                            color: '#999999',
                            fontSize: DesignConvert.getF(12),
                        }}
                        onPress={this._onExit}
                    >不同意并退出APP</Text>

                </View>

            </View>
        )
    }
}