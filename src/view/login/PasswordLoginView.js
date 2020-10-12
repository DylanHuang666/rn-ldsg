
/**
 * 账号密码登录页面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput, KeyboardAvoidingView } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';
import CheckBoxView from '../base/CheckBoxView';
import { LINEARGRADIENT_COLOR } from '../../styles';
import { LoginButton } from './LoginView'

export default class PasswordLoginView extends BaseView {
    constructor(props) {
        super(props);

        this._phoneNum = "";
        this._password = "";
        this._bChecked = true;

        this._bAgree = true;

        this._submitEnable = false;

        this._secureTextEntry = true;

    }

    _onBackPress = () => {
        this.popSelf();
    }

    _checkSubmitEnable = () => {
        if (this._phoneNum != "" && this._password != "" && this._bChecked && this._bAgree) {
            this._submitEnable = true;
        } else {
            this._submitEnable = false;
        }
    }

    _onUserProtocolPress = () => {
        alert("TODO:H5");
    }


    _onChangePhoneNum = (s) => {
        this._phoneNum = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangePassword = (s) => {
        this._password = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }


    _onEyePress = () => {
        this._secureTextEntry = !this._secureTextEntry;
        this.forceUpdate();
    }

    _onGuestLogin = async () => {
        require('../../model/LoginModel').default.newDeviceLogin();
    }

    _onWechat = () => {
        require('../../model/LoginModel').default.wechatLogin();
    }

    _onAgreePress = () => {
        this._bChecked = !this._bChecked;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onSubmitPress = () => {
        require("../../model/LoginModel").default.loginByPsw(this._phoneNum, this._password);
    }

    _onLoginView = () => {
        require('../../router/level1_router').showPasswordLoginView()
    }

    _onAgree = () => {
        this._bAgree = !this._bAgree;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _renderAccountPsw() {
        return (
            <TouchableOpacity
                style={{

                }}
                onPress={this._onLoginView}
            >
                {/* <Image
                    style={{
                        marginTop: DesignConvert.getH(23),
                        width: DesignConvert.getW(34),
                        height: DesignConvert.getH(34),
                    }}
                    source={require('../../hardcode/skin_imgs/login').user()}
                /> */}
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(15),
                    }}
                >立即注册</Text>
            </TouchableOpacity>
        );
    }


    _renderGuestLogin() {

        if (!this._bAgree) {
            return null;
        }

        return (
            <TouchableOpacity
                style={{
                }}
                onPress={this._onGuestLogin}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(12),
                    }}
                >游客登录</Text>

            </TouchableOpacity>

        )
    }

    _renderWechat() {
        // return null;
        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: DesignConvert.getHeight(95),
                    width: DesignConvert.getW(50),
                    height: DesignConvert.getH(80),

                    // flexDirection: 'column',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
                onPress={this._onWechat}
            >
                <Image
                    style={{
                        marginTop: DesignConvert.getH(23),
                        width: DesignConvert.getW(34),
                        height: DesignConvert.getH(34),
                    }}
                    source={require('../../hardcode/skin_imgs/login').wx()}
                />
                <Text
                    style={{
                        marginTop: DesignConvert.getH(8),
                        color: '#F5F2FF',
                        fontSize: DesignConvert.getF(10),
                    }}
                >微信登录</Text>

                {/* {this._renderLastLogin(false)} */}
            </TouchableOpacity>
        );
    }

    _renderAgree() {
        const CheckBoxView = require('../base/CheckBoxView').default;

        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: DesignConvert.getHeight(47),
                    left: DesignConvert.getW(97),

                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <CheckBoxView
                    bChecked={this._bAgree}
                    onPress={this._onAgree}
                />

                <Text
                    style={{
                        marginLeft: DesignConvert.getW(8),
                        color: 'white',
                        fontSize: DesignConvert.getF(11),
                    }}
                >我已阅读并同意</Text>

                <TouchableOpacity
                    onPress={this._onOpenAgree}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(11),
                        }}
                    >《用户许可协议》</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
            >

                {/* <BackTitleView
                    titleText={"账号密码登录"}
                    onBack={this._onBackPress}
                /> */}

                <ImageBackground
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        alignItems: 'center'
                    }}
                    source={require('../../hardcode/skin_imgs/login').bg()}
                    resizeMode='cover'>
                    {/* <Image
                        style={{
                            width: DesignConvert.getW(212),
                            height: DesignConvert.getH(50),
                            resizeMode: 'contain',
                            marginTop: DesignConvert.getH(100),
                        }}
                        source={require('../../hardcode/skin_imgs/login').login_icon()}
                    >

                    </Image> */}
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(20),
                            marginTop: DesignConvert.getH(69),
                            alignSelf: 'flex-start',
                            marginStart: DesignConvert.getW(25),
                        }}
                    >欢迎来到律动时光</Text>
                    <KeyboardAvoidingView
                        behavior="position"
                    >
                        <View
                            style={{
                                width: DesignConvert.getW(321),
                                height: DesignConvert.getH(50),
                                backgroundColor: '#FFFFFF66',
                                borderRadius: DesignConvert.getW(10),
                                justifyContent: 'center',
                                marginTop: DesignConvert.getH(60),
                            }}
                        >

                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: DesignConvert.getW(21),
                                    color: 'white',
                                    fontSize: DesignConvert.getF(15),
                                }}
                                value={this._phoneNum}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                placeholder="请输入账号"
                                placeholderTextColor="#FFFFFF"
                                returnKeyType='next'
                                onChangeText={this._onChangePhoneNum}
                                maxLength={11}
                            />
                        </View>

                        <View
                            style={{
                                marginTop: DesignConvert.getHeight(20),
                                width: DesignConvert.getW(321),
                                height: DesignConvert.getH(50),
                                backgroundColor: '#FFFFFF66',
                                borderRadius: DesignConvert.getW(10),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: DesignConvert.getW(21),
                                    color: 'white',
                                    fontSize: DesignConvert.getF(15),
                                }}
                                secureTextEntry
                                value={this._password}
                                keyboardType="default"
                                underlineColorAndroid="transparent"
                                placeholder="请输入密码"
                                placeholderTextColor="#FFFFFF"
                                returnKeyType="done"
                                onChangeText={this._onChangePassword}
                                secureTextEntry={this._secureTextEntry}

                            />
                            <TouchableOpacity
                                style={{
                                    marginRight: DesignConvert.getW(20),
                                }}
                                onPress={this._onEyePress}>
                                <Image
                                    style={{
                                        width: DesignConvert.getW(18),
                                        height: DesignConvert.getH(14),
                                        resizeMode: 'contain',
                                        tintColor: 'white'
                                    }}
                                    source={this._secureTextEntry ? require('../../hardcode/skin_imgs/login').close_eye() : require('../../hardcode/skin_imgs/login').open_eye()}
                                />
                            </TouchableOpacity>

                        </View>
                    </KeyboardAvoidingView>
                    <LoginButton
                        onPress={this._onSubmitPress}
                        enable={this._submitEnable}
                        txt="登录"

                    />
                    <View
                        style={{
                            width: DesignConvert.getW(116),
                            height: DesignConvert.getH(60),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                            // justifyContent: 'space-between'
                        }}
                    >

                        {this._renderAccountPsw()}
                        {/* <View
                            style={{
                                display: !this._bAgree ? 'none' : 'flex',
                                width: DesignConvert.getW(1),
                                height: DesignConvert.getH(10),
                                backgroundColor: 'rgba(255, 255, 255, 0.5)'
                            }}
                        /> */}
                        {/* {this._renderGuestLogin()} */}
                    </View>
                    {/* {this._renderWechat()} */}

                    {/* {this._renderAgree()} */}

                </ImageBackground>
            </View>
        )
    }
}

export const [LOGIN_PRE, LOGIN_BY_CODE, LOGIN_BY_PASSWORD] = ["LOGIN_PRE", "LOGIN_BY_CODE", "LOGIN_BY_PASSWORD"]


