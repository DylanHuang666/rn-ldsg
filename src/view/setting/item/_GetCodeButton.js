/**
 * 获取验证码
 */

'use strict';

import React, { PureComponent } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from "react-native";
import DesignConvert from '../../../utils/DesignConvert';
import { LINEARGRADIENT_COLOR, THEME_COLOR } from '../../../styles';


export default class _GetCodeButton extends PureComponent {
    constructor(props) {
        super(props);

        this._countDown = 60;
    }

    _onPress = () => {
        this.props.onPress && this.props.onPress();
        this._codeTimer = setInterval(() => {
            this._countDown--;
            if (this._countDown < 1) {
                this._countDown = 60;
                clearInterval(this._codeTimer);
            }
            this.forceUpdate();
        }, 1000);
    }

    componentWillUnmount() {
        this._codeTimer && clearInterval(this._codeTimer);
    }

    //重置获取验证码按钮
    reset = () => {
        clearInterval(this._codeTimer);
        this._countDown = 60;
    }

    render() {
        if (!this.props.enable) {
            return (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#FF524533', '#CD003133']}

                    style={{
                        width: DesignConvert.getW(80),
                        height: DesignConvert.getH(23),
                        borderRadius: DesignConvert.getW(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "row",
                        ...this.props.containerStyle
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(11),
                        }}>

                        {"发送验证码"}
                    </Text>
                </LinearGradient>
            );
        }

        if (this._countDown != 60) {
            return (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#FF524533', '#CD003133']}

                    style={{
                        width: DesignConvert.getW(80),
                        height: DesignConvert.getH(23),
                        borderRadius: DesignConvert.getW(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "row",
                        ...this.props.containerStyle
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(9),
                        }}>

                        {`${this._countDown}s后重发验证码`}
                    </Text>
                </LinearGradient>
            );
        }

        return (
            <TouchableOpacity
                onPress={this._onPress}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#FF5245', '#CD0031']}

                    style={{
                        width: DesignConvert.getW(80),
                        height: DesignConvert.getH(23),
                        borderRadius: DesignConvert.getW(6),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "row",
                        ...this.props.containerStyle
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(11),
                        }}>

                        {"发送验证码"}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

export class LoginButton extends PureComponent {

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        if (this.props.enable) {
            return (
                <TouchableOpacity
                    style={{
                        marginTop: DesignConvert.getHeight(20),
                    }}
                    onPress={this._onPress}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={LINEARGRADIENT_COLOR}
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(44),
                            borderRadius: DesignConvert.getW(30),
                            // flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(16),
                            }}
                        >登录</Text>
                    </LinearGradient>
                </TouchableOpacity>

            );
        }

        return (
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 1 }}
                colors={['#f0f0f0', '#f0f0f0']}
                style={{
                    marginTop: DesignConvert.getHeight(40),
                    width: DesignConvert.getW(240),
                    height: DesignConvert.getH(44),
                    borderRadius: DesignConvert.getW(30),
                    borderRadius: DesignConvert.getW(100),
                    // flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        color: '#999999',
                        fontSize: DesignConvert.getF(16),
                    }}
                >登 录</Text>
            </LinearGradient>
        )
    }
}