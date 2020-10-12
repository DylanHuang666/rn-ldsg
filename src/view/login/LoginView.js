/**
 * 登录界面
 */

'use strict';

import React, { PureComponent } from 'react';
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from "react-native";
import DesignConvert from '../../utils/DesignConvert';

import {
    LOGIN_PRE,
    LOGIN_BY_CODE,
    LOGIN_BY_PASSWORD,
} from './PasswordLoginView';
import { height } from '../user_info_edit/UserInfoEditDetailView';

class GetCodeButton extends PureComponent {
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

    render() {
        if (!this.props.enable) {
            return (
                <TouchableOpacity
                    style={{
                        // flex: 1,
                        // paddingRight: DesignConvert.getW(20),
                        // alignItems: 'flex-end',

                        backgroundColor: '#FF5245',
                        borderRadius: DesignConvert.getW(8),
                        height: DesignConvert.getH(30),
                        marginRight: DesignConvert.getW(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        // marginRight: DesignConvert.getW(33),
                    }}
                    onPress={this._onPress}
                >
                    <Text
                        style={{
                            color: '#F0F0F0',
                            fontSize: DesignConvert.getF(13),
                            marginHorizontal: DesignConvert.getW(6)
                        }}
                    >获取验证码</Text>
                </TouchableOpacity>
            );
        }

        if (this._countDown != 60) {
            return (
                <View
                    style={{
                        backgroundColor: '#FF5245',
                        borderRadius: DesignConvert.getW(8),
                        height: DesignConvert.getH(30),
                        marginRight: DesignConvert.getW(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#F0F0F0',
                            fontSize: DesignConvert.getF(13),
                            marginHorizontal: DesignConvert.getW(6)
                        }}
                    >重新获取({this._countDown}s)</Text>
                </View>

            );
        }

        return (
            <TouchableOpacity
                style={{
                    // flex: 1,
                    // paddingRight: DesignConvert.getW(20),
                    // alignItems: 'flex-end',

                    backgroundColor: '#FF5245',
                    borderRadius: DesignConvert.getW(8),
                    height: DesignConvert.getH(30),
                    marginRight: DesignConvert.getW(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                    // marginRight: DesignConvert.getW(33),
                }}
                onPress={this._onPress}
            >
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(13),
                        marginHorizontal: DesignConvert.getW(6)
                    }}
                >获取验证码</Text>
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
                        marginTop: DesignConvert.getH(40),
                    }}
                    onPress={this._onPress}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={["#FFFFFF", "#FFFFFF"]}
                        style={{
                            width: DesignConvert.getW(321),
                            height: DesignConvert.getH(50),
                            backgroundColor: '#FFFFFF',
                            borderRadius: DesignConvert.getW(10),
                            // flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: '#000000',
                                fontSize: DesignConvert.getF(18),
                            }}
                        >{this.props.txt}</Text>
                    </LinearGradient>
                </TouchableOpacity>

            );
        }

        return (
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 1 }}
                colors={['#FFFFFF', '#FFFFFF']}
                style={{
                    marginTop: DesignConvert.getH(40),
                    width: DesignConvert.getW(321),
                    height: DesignConvert.getH(50),
                    backgroundColor: '#FFFFFF',
                    borderRadius: DesignConvert.getW(10),
                    // flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        color: '#000000',
                        fontSize: DesignConvert.getF(18),
                    }}
                >{this.props.txt}</Text>
            </LinearGradient>
        )
    }
}


export default class LoginView extends BaseView {

    constructor(props) {
        super(props);

        this._phoneNum = '';
        this._code = '';
        this._bAgree = true;
        this._switchPage = LOGIN_PRE;

        this._num = 60;
    }

    componentWillUnmount() {
        super.componentWillUnmount()

        if (this._numTimer) {
            clearInterval(this._numTimer);
        }
    }

    componentDidMount() {
        super.componentDidMount();

        require('../../model/PermissionModel').checkAppBasePermission();
    }

    componentDidMount() {
        super.componentDidMount();

        require('../../model/PermissionModel').checkAppBasePermission();
    }

    _onGetCode = () => {
        require('../../model/LoginModel').default.getSmsByPhoneLogin(this._phoneNum, bool => {
            if (bool) {
                this._startCount();
                this._switchPage = LOGIN_BY_CODE;
                this.forceUpdate();
            }
        });
    }

    _startCount = () => {
        if (this._numTimer) {
            clearInterval(this._numTimer);
        }
        this._num = 60;
        this._numTimer = setInterval(() => {
            this._num--;
            if (this._num <= 0) {
                clearInterval(this._numTimer);
            }
            this.forceUpdate();
        }, 1000)
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
        if (this._switchPage == LOGIN_BY_CODE) {
            return require('../../model/LoginModel').default.loginByMobile(this._phoneNum, this._code);
        }
        require("../../model/LoginModel").default.loginByPsw(this._phoneNum, this._code);
    }

    _onGuestLogin = async () => {
        require('../../model/LoginModel').default.newDeviceLogin();
    }

    _onWechat = () => {
        require('../../model/LoginModel').default.wechatLogin();
    }

    _onQQ = () => {
        //todo
        alert('todo: 登录QQ');
    }

    _onAccountCode = () => {
        //require("../../router/level1_router").showPasswordLoginView(LOGIN_BY_CODE);
        this._switchPage = LOGIN_PRE;
        this._phoneNum = '';
        this._code = '';
        this.forceUpdate();
    }

    _onAccountPsw = () => {
        //require("../../router/level1_router").showPasswordLoginView(LOGIN_BY_PASSWORD);
        this._switchPage = LOGIN_BY_PASSWORD;
        this._phoneNum = '';
        this._code = '';
        this.forceUpdate();
    }

    _onAgree = () => {
        this._bAgree = !this._bAgree;
        this.forceUpdate();
    }

    _onOpenAgree = () => {
        //TODO:
        // alert('todo: 打开用户协议界面');
    }

    _renderGuestLogin() {

        if (!this._bAgree) {
            return null;
        }

        return (
            <TouchableOpacity
                style={{
                    marginLeft: DesignConvert.getW(149),
                    marginTop: DesignConvert.getHeight(21),
                }}
                onPress={this._onGuestLogin}
            >
                <Text
                    style={{
                        color: 'red',
                        fontSize: DesignConvert.getF(13),
                    }}
                >游客账号登录</Text>

            </TouchableOpacity>

        )
    }

    _renderLastLogin(b) {
        if (!b) {
            return null;
        }

        return (
            <ImageBackground
                style={{
                    position: 'absolute',

                    width: DesignConvert.getW(56),
                    height: DesignConvert.getH(23),

                    // flexDirection: 'column',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
                source={require('../../hardcode/skin_imgs/login').question()}
            >
                <Text
                    style={{
                        marginTop: DesignConvert.getH(3),

                        color: 'black',
                        fontSize: DesignConvert.getF(10),
                    }}
                >上次登录</Text>
            </ImageBackground>
        );
    }

    _rednerFormInput(bIsMobile) {
        if (this._switchPage == LOGIN_PRE) {
            return (
                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(320),
                        alignItems: "center",
                    }}>

                    <TouchableOpacity
                        onPress={this._onAccountCode}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={["#FFFFFF4D", "#FFFFFF4D"]}
                            style={{
                                width: DesignConvert.getW(180),
                                height: DesignConvert.getH(44),
                                borderRadius: DesignConvert.getW(41),
                                marginTop: DesignConvert.getH(109),
                                justifyContent: "center",
                                flexDirection: 'row',
                                alignItems: "center",
                            }}>

                            <Image
                                style={{
                                    width: DesignConvert.getW(15),
                                    height: DesignConvert.getH(21),
                                    resizeMode: 'contain',
                                }}
                                source={icon_phone()}
                            />
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(13),
                                }}>快速登录</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._onAccountPsw}>
                        <View
                            style={{
                                width: DesignConvert.getW(180),
                                height: DesignConvert.getH(44),
                                backgroundColor: "#FFFFFF4D",
                                borderRadius: DesignConvert.getW(41),
                                marginTop: DesignConvert.getH(20),
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: 'row',
                            }}>
                            <Image
                                style={{
                                    width: DesignConvert.getW(15),
                                    height: DesignConvert.getH(21),
                                    resizeMode: 'contain',
                                }}
                                source={icon_lock()}
                            />
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(13),
                                }}>密码登录</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            )
        }
        if (this._switchPage == LOGIN_BY_CODE) {
            return (
                <View>
                    <View
                        style={{
                            marginTop: DesignConvert.getHeight(50),
                            width: DesignConvert.getW(280),
                            height: DesignConvert.getH(44),
                            backgroundColor: '#FAF9FF',
                            borderRadius: DesignConvert.getW(10),
                            flexDirection: 'row',
                            // justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                marginLeft: DesignConvert.getW(15),
                                color: '#AEAEAE',
                                fontSize: DesignConvert.getF(14),
                            }}
                        >+86</Text>
                        <Image
                            style={{
                                width: DesignConvert.getW(11),
                                height: DesignConvert.getH(6),
                                marginLeft: DesignConvert.getW(10),
                            }}
                            source={require('../../hardcode/skin_imgs/login').icon_letter()}
                        />
                        <View
                            style={{
                                marginLeft: DesignConvert.getW(16),
                                height: DesignConvert.getH(18),
                                width: DesignConvert.getW(1),
                                backgroundColor: '#6D6D6D',
                            }}
                        />

                        <TextInput
                            style={{
                                marginLeft: DesignConvert.getW(12),
                                fontSize: DesignConvert.getF(12),
                                width: DesignConvert.getW(265),
                            }}
                            maxLength={11}
                            keyboardType='numeric'
                            underlineColorAndroid="transparent"
                            placeholder="输入手机号"
                            placeholderTextColor="#D2D2D2"
                            returnKeyType='next'
                            onChangeText={this._onChangePhone}
                            selectionColor={'#D2D2D2'}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: DesignConvert.getHeight(20),
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                width: DesignConvert.getW(200),
                                height: DesignConvert.getH(44),
                                backgroundColor: '#FAF9FF',
                                borderRadius: DesignConvert.getW(10),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <TextInput
                                style={{
                                    marginLeft: DesignConvert.getW(15),
                                    width: DesignConvert.getW(265),
                                    fontSize: DesignConvert.getF(12),
                                }}
                                maxLength={6}
                                keyboardType='number-pad'
                                underlineColorAndroid="transparent"
                                placeholder="输入验证码"
                                placeholderTextColor="#D2D2D2"
                                returnKeyType='next'
                                onChangeText={this._onChangeCode}
                                selectionColor={'#D2D2D2'}
                            />
                        </View>
                        <GetCodeButton
                            onPress={this._onGetCode}
                            enable={bIsMobile}
                        />
                    </View>
                </View>
            )
        }

        // 使用账号密码登陆的时候
        return (
            <View>
                <View
                    style={{
                        marginTop: DesignConvert.getHeight(50),
                        width: DesignConvert.getW(280),
                        height: DesignConvert.getH(44),
                        backgroundColor: '#FAF9FF',
                        borderRadius: DesignConvert.getW(10),
                        flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >

                    <TextInput
                        style={{
                            marginLeft: DesignConvert.getW(12),
                            width: DesignConvert.getW(265),
                            color: '#D2D2D2',
                            fontSize: DesignConvert.getF(12),
                        }}
                        maxLength={11}
                        keyboardType='number-pad'
                        underlineColorAndroid="transparent"
                        placeholder="输入手机号或者ID"
                        placeholderTextColor="#D2D2D2"
                        returnKeyType='next'
                        onChangeText={this._onChangePhone}
                        selectionColor={'#D2D2D2'}
                    />
                </View>
                <View
                    style={{
                        marginTop: DesignConvert.getHeight(20),
                        width: DesignConvert.getW(280),
                        height: DesignConvert.getH(44),
                        backgroundColor: '#FAF9FF',
                        borderRadius: DesignConvert.getW(10),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <TextInput
                        style={{
                            marginLeft: DesignConvert.getW(15),
                            fontSize: DesignConvert.getF(12),
                            width: DesignConvert.getW(265),
                        }}
                        keyboardType={Platform.OS === "ios" ? "default" : 'number-pad'}
                        underlineColorAndroid="transparent"
                        placeholder="输入密码"
                        placeholderTextColor="#D2D2D2"
                        returnKeyType='next'
                        onChangeText={this._onChangeCode}
                        selectionColor={'D2D2D2'}
                    />
                </View>
            </View>
        )
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

    _rednerAgreeInfo() {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(30),
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}
            >
                <Text
                    style={{
                        color: '#666666',
                        fontSize: DesignConvert.getF(12)
                    }}
                    source={require('../../hardcode/skin_imgs/login').bg()}
                    resizeMode='contain'
                >
                    登录即同意
                    </Text>
                <TouchableOpacity
                    onPress={this._onOpenAgree}
                >
                    <Text
                        style={{
                            color: '#D2D2D2',
                            fontSize: DesignConvert.getF(12)
                        }}
                        textDecorationLine="underline"
                    >《用户协议》</Text>
                </TouchableOpacity>
                <Text
                    style={{
                        color: '#666666',
                        fontSize: DesignConvert.getF(12)
                    }}
                >和</Text>
                <TouchableOpacity
                    onPress={this._onOpenAgree}
                >
                    <Text
                        style={{
                            color: '#D2D2D2',
                            fontSize: DesignConvert.getF(12)
                        }}
                        textDecorationLine="underline"
                    >《隐私权政策》</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderPassLogin = () => {
        return (
            <View
                style={{
                    flex: 1,
                }}>
                <ImageBackground
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        alignItems: 'center'
                    }}
                    source={require('../../hardcode/skin_imgs/login').bg()}
                    resizeMode='cover'>
                    <Image
                        style={{
                            width: DesignConvert.getW(125),
                            height: DesignConvert.getH(120),
                            marginTop: DesignConvert.getH(84),
                            justifyContent: 'center',
                        }}
                        source={require('../../hardcode/skin_imgs/login').login_top()}
                    />
                    <View
                        style={{
                            marginTop: DesignConvert.getH(69),
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(20),
                            }}
                        >密码登录</Text>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#787878',
                                marginTop: DesignConvert.getH(8),
                                borderRadius: DesignConvert.getW(16),
                                height: DesignConvert.getH(29),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={this._onAccountCode}
                        >
                            <Text
                                style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: DesignConvert.getF(12),
                                    marginLeft: DesignConvert.getW(10),
                                }}
                            >
                                切换至验证码登录
                        </Text>
                            <Image
                                style={{
                                    width: DesignConvert.getW(12),
                                    height: DesignConvert.getH(12),
                                    marginLeft: DesignConvert.getW(5),
                                    marginRight: DesignConvert.getW(10)
                                }}
                                source={require('../../hardcode/skin_imgs/login').loging_chang()}
                            />
                        </TouchableOpacity>

                    </View>

                    <KeyboardAvoidingView
                        behavior="position"
                    >
                        <View
                            style={{
                                width: DesignConvert.getW(321),
                                height: DesignConvert.getH(50),
                                backgroundColor: '#FFFFFF66',
                                borderRadius: DesignConvert.getW(10),
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: DesignConvert.getH(60),
                            }}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(26),
                                    height: DesignConvert.getH(26),
                                    marginLeft: DesignConvert.getW(13),
                                }}
                                source={require('../../hardcode/skin_imgs/login').login_userid()}
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: DesignConvert.getW(10),
                                    color: 'white',
                                    fontSize: DesignConvert.getF(14),
                                }}
                                value={this._phoneNum}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                placeholder="请输入您的手机号"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                returnKeyType='next'
                                onChangeText={this._onChangePhone}
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
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(26),
                                    height: DesignConvert.getH(26),
                                    marginLeft: DesignConvert.getW(13),
                                }}
                                source={require('../../hardcode/skin_imgs/login').login_pwsafe()}
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    height: DesignConvert.getH(62),
                                    fontSize: DesignConvert.getF(14),
                                    color: '#FFFFFF',
                                }}
                                keyboardType="default"
                                underlineColorAndroid="transparent"
                                placeholder="请输入您的密码"
                                placeholderTextColor="#FFFFFF99"


                                returnKeyType='next'
                                onChangeText={this._onChangeCode}
                                // selectionColor={THEME_COLOR}
                                secureTextEntry={true}
                            />

                        </View>
                    </KeyboardAvoidingView>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={["#FF5245", "#CD0031"]}
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(50),
                            backgroundColor: '#FFFFFF',
                            borderRadius: DesignConvert.getW(10),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: DesignConvert.getH(30)
                        }}
                    >
                        <TouchableOpacity
                            onPress={this._onLogin}
                        >
                            <Text
                                style={{ color: 'white' }}
                            >
                                登录
                                </Text>
                        </TouchableOpacity>

                    </LinearGradient>

                </ImageBackground>


            </View>
        )
    }


    renderCodeLogin = (bIsMobile) => {
        return (
            <View
                style={{
                    flex: 1,
                }}>
                <ImageBackground
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        alignItems: 'center'
                    }}
                    source={require('../../hardcode/skin_imgs/login').bg()}
                    resizeMode='cover'>
                    <Image
                        style={{
                            width: DesignConvert.getW(125),
                            height: DesignConvert.getH(120),
                            marginTop: DesignConvert.getH(84),
                            justifyContent: 'center',
                        }}
                        source={require('../../hardcode/skin_imgs/login').login_top()}
                    />
                    <View
                        style={{
                            marginTop: DesignConvert.getH(69),
                            justifyContent:'center',
                            alignItems:'center'
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(20),
                            }}
                        >验证码登录</Text>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#787878',
                                marginTop: DesignConvert.getH(8),
                                borderRadius: DesignConvert.getW(16),
                                height: DesignConvert.getH(29),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={this._onAccountPsw}
                        >
                            <Text
                                style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: DesignConvert.getF(12),
                                    marginLeft: DesignConvert.getW(10),
                                }}
                            >
                                切换至密码登录
                      </Text>
                            <Image
                                style={{
                                    width: DesignConvert.getW(12),
                                    height: DesignConvert.getH(12),
                                    marginLeft: DesignConvert.getW(5),
                                    marginRight: DesignConvert.getW(10)
                                }}
                                source={require('../../hardcode/skin_imgs/login').loging_chang()}
                            />
                        </TouchableOpacity>

                    </View>

                    <KeyboardAvoidingView
                        behavior="position"
                    >
                        <View
                            style={{
                                width: DesignConvert.getW(321),
                                height: DesignConvert.getH(50),
                                backgroundColor: '#FFFFFF66',
                                borderRadius: DesignConvert.getW(10),
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: DesignConvert.getH(60),
                            }}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(26),
                                    height: DesignConvert.getH(26),
                                    marginLeft: DesignConvert.getW(13),
                                }}
                                source={require('../../hardcode/skin_imgs/login').login_phone()}
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: DesignConvert.getW(10),
                                    color: 'white',
                                    fontSize: DesignConvert.getF(15),
                                }}
                                value={this._phoneNum}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                placeholder="请输入您的手机号"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                returnKeyType='next'
                                onChangeText={this._onChangePhone}
                                maxLength={11}
                            />
                            {/* <TouchableOpacity
                              onPress={this._onGetCode}
                              style={{
                                  
                                  backgroundColor: '#FF5245',
                                  borderRadius: DesignConvert.getW(8),
                                  height: DesignConvert.getH(30),
                                  marginRight: DesignConvert.getW(10),
                                  justifyContent: 'center',
                                  alignItems: 'center',
                              }}
                          >
                              <Text
                                  style={{
                                      
                                      color: '#FFFFFF',
                                      fontSize: DesignConvert.getF(12),
                                      marginHorizontal: DesignConvert.getW(6)
                                  }}
                              >
                                  {this._switchPage == LOGIN_BY_CODE ? '获取验证码' : `${this._num}s后可重试`}
                                  获取验证码
                      </Text>
                          </TouchableOpacity> */}
                            <GetCodeButton
                                onPress={this._onGetCode}
                                enable={bIsMobile}
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
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(26),
                                    height: DesignConvert.getH(26),
                                    marginLeft: DesignConvert.getW(13),
                                }}
                                source={require('../../hardcode/skin_imgs/login').login_pwsafe()}
                            />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: DesignConvert.getW(10),
                                    color: 'white',
                                    fontSize: DesignConvert.getF(15),
                                }}
                                maxLength={6}
                                keyboardType='number-pad'
                                underlineColorAndroid="transparent"
                                placeholder="请输入您的验证码"
                                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                returnKeyType='next'
                                onChangeText={this._onChangeCode}
                            />

                        </View>
                    </KeyboardAvoidingView>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={["#FF5245", "#CD0031"]}
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(50),
                            backgroundColor: '#FFFFFF',
                            borderRadius: DesignConvert.getW(10),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: DesignConvert.getH(30)
                        }}
                    >
                        <TouchableOpacity
                            onPress={this._onLogin}
                        >
                            <Text
                                style={{ color: 'white' }}
                            >
                                登录
                              </Text>
                        </TouchableOpacity>

                    </LinearGradient>

                </ImageBackground>


            </View>
        )
    }


    render() {
        const bValidCode = this._switchPage == LOGIN_BY_CODE ? this._code.length == 6 : this._code.length >= 6 && this._code.length <= 16
        const bIsMobile = this._switchPage == LOGIN_BY_CODE ? StringUtil.isMobile(this._phoneNum) : this._phoneNum.length >= 6

        switch (this._switchPage) {
            case LOGIN_BY_CODE:
                return this.renderCodeLogin(bIsMobile);
            case LOGIN_BY_PASSWORD:
                return this.renderPassLogin();
            case LOGIN_PRE:
                return this.renderCodeLogin(bIsMobile);
        }

    }
}