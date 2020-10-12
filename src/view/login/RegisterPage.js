/**
 * 登录界面
 */

'use strict';

import React, { PureComponent } from 'react';
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import DesignConvert from '../../utils/DesignConvert';
import { open_eye, close_eye, account_del, l_check, l_uncheck } from '../../hardcode/skin_imgs/login';
import {TitleBar} from '../anchorincome/ConvertView';

export default class RegisterPage extends BaseView {

    constructor(props) {
        super(props);

        this._phoneNum = '';
        this._verifyDefault = '输入验证码';
        this._verifyText = '输入验证码';
        this._code = '';
        this._bAgree = true;
        this._verifyCode = '';

        this._secureState = true;
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        clearInterval(this._verifyTimer)
    }

    _onGetCode = () => {
        require('../../model/LoginModel').default.getSmsByPhoneLogin(this._phoneNum);
    }

    _onChangePhone = (s) => {
        this._phoneNum = s;
        this.forceUpdate();
    }

    _onChangeCode = (s) => {
        this._code = s;
        this.forceUpdate();
    }

    _onLogin = () => {
        if (!this._bAgree) {
            require("../../view/base/ToastUtil").default.showCenter('请勾选协议');
            return;
        }

        if (!this._phoneNum || !this._code || !this._verifyCode) return;
        // TODO
        // require('../../model/LoginModel').default.loginByMobile(this._phoneNum, this._code);
    }

    _onAgree = () => {
        this._bAgree = !this._bAgree;
        this.forceUpdate();
    }

    _onOpenAgree = () => {
        //todo
        alert('todo: 打开用户协议界面');
    }

    _renderAgree() {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(24),
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={this._onAgree}
                >
                    <Image 
                        source={this._bAgree ? l_check() : l_uncheck()}
                        style={{
                            width: DesignConvert.getW(12),
                            height: DesignConvert.getH(12)
                        }}
                    />
                </TouchableOpacity>

                <Text
                    style={{
                        marginLeft: DesignConvert.getW(6),
                        color: '#666666',
                        fontSize: DesignConvert.getF(12),
                    }}
                >登录即代表同意</Text>

                <TouchableOpacity
                    onPress={this._onOpenAgree}
                >
                    <Text
                        style={{
                            color: '#A055FF',
                            fontSize: DesignConvert.getF(12),
                        }}
                    >《用户许可协议》</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderEye = () => {
        return (
            <TouchableOpacity
                style={{
                    // 增加点击面积
                    width: DesignConvert.getW(30),
                    height: DesignConvert.getH(15),
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
                onPress={()=>{
                    this._secureState = !this._secureState;
                    this.forceUpdate();
                }}
            >
                {this._secureState ? 
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

    // 跳转注册页
    _openRegisteredView = () => {
        require("../../router/level1_router").showPasswordLoginView();
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _doSendVerifyCode = () => {
        if (this._verifyText != this._verifyDefault) return;
        clearInterval(this._verifyTimer);

        this._verifyText = 10;
        this.forceUpdate();

        // TODO 发送验证码接口

        this._verifyTimer = setInterval(() => {
            this._verifyText--;
            if (this._verifyText <= 0) {
                this._verifyText = this._verifyDefault;
                clearInterval(this._verifyTimer);
            }
            this.forceUpdate();
        }, 1000)
    }

    _onChangeVerifyCode = (text) => {
        this._verifyCode = text;
        this.forceUpdate();
    }

    render() {
        const StatusBarView = require("../base/StatusBarView").default;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                }}
            >

                <StatusBarView />

                <TitleBar
                    onPress={this._onBackPress}
                    title="注册"/>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: DesignConvert.getW(291),
                    height: DesignConvert.getH(44),
                    marginTop: DesignConvert.getH(110),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <TextInput
                        placeholder={'手机号'}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#BCBDC0'}
                        maxLength={11}
                        keyboardType='number-pad'
                        returnKeyType='next'
                        onChangeText={this._onChangePhone}
                        value={this._phoneNum}
                        style={{
                            flex: 1,
                            color: '#232129',
                            fontSize: DesignConvert.getF(15),
                            padding: 0,
                        }}
                    />
                    {this._phoneNum ?
                        <TouchableOpacity
                            onPress={()=>{
                                this._phoneNum = '';
                                this.forceUpdate();
                            }}
                        >
                            <Image 
                                source={account_del()}
                                style={{
                                    width: DesignConvert.getW(16),
                                    height: DesignConvert.getH(16),
                                }}
                            />
                        </TouchableOpacity>
                        : null
                    }
                </View>
                <View 
                    style={{
                        backgroundColor: '#BCBDC0', 
                        height: DesignConvert.getH(0.5),
                        width: DesignConvert.getW(291),
                    }}
                />

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: DesignConvert.getW(291),
                    height: DesignConvert.getH(44),
                    marginTop: DesignConvert.getH(17),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <TextInput
                        placeholder={'验证码'}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#BCBDC0'}
                        maxLength={11}
                        keyboardType='number-pad'
                        returnKeyType='next'
                        onChangeText={this._onChangeVerifyCode}
                        value={this._verifyCode}
                        style={{
                            flex: 1,
                            color: '#232129',
                            fontSize: DesignConvert.getF(15),
                            padding: 0,
                        }}
                    />
                    <TouchableOpacity
                        onPress={this._doSendVerifyCode}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(12),
                                color: '#A055FF',
                            }}
                        >
                            {this._verifyText}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View 
                    style={{
                        backgroundColor: '#BCBDC0', 
                        height: DesignConvert.getH(0.5),
                        width: DesignConvert.getW(291),
                    }}
                />

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: DesignConvert.getW(291),
                    height: DesignConvert.getH(44),
                    marginTop: DesignConvert.getH(17),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <TextInput
                        placeholder={'密码 (8-16个数字与字母字符)'}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#BCBDC0'}
                        onChangeText={this._onChangeCode}
                        secureTextEntry={this._secureState}
                        style={{
                            flex: 1,
                            color: '#232129',
                            fontSize: DesignConvert.getF(15),
                            padding: 0,
                        }}
                    />
                    {this.renderEye()}
                </View>
                <View 
                    style={{
                        backgroundColor: '#BCBDC0', 
                        height: DesignConvert.getH(0.5),
                        width: DesignConvert.getW(291),
                    }}
                />

                <TouchableOpacity
                    style={{
                        marginTop: DesignConvert.getH(54),
                    }}
                    onPress={this._onLogin}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#7479FF', '#B785FF']}
                        style={{
                            width: DesignConvert.getW(291),
                            height: DesignConvert.getH(44),
                            borderRadius: DesignConvert.getW(8),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(16),
                            }}
                        >
                            {'登录'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {this._renderAgree()}

            </View>
        )
    }
}