'use strict';

import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Config from '../../configs/Config';
import DesignConvert from "../../utils/DesignConvert";
import StringUtil from '../../utils/StringUtil';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';
import BackTitleView from "../base/BackTitleView";
import BaseView from "../base/BaseView";
import { THEME_COLOR } from "../../styles";

export default class BindMyPhoneView extends BaseView {
    constructor(props) {
        super(props);

        //如果 0 没绑定手机号则直接绑定，绑定了得先 1 校验后再 2 绑定
        this._type = !require("../../cache/UserInfoCache").default.phoneNumber ? 0 : 1;

        this._phoneNum = this._type == 0 ? "" : require("../../cache/UserInfoCache").default.phoneNumber;
        this._code = "";
        this._bChecked = true;
        this._isCertifycation = false
        this._submitCodeEnable = false
        this._submitEnable = false;

        this._countDown = 60;
        this._codeTimer;

        this._oldCode = "";
    }

    _onChangePhoneNum = (s) => {
        this._phoneNum = s;
        if (StringUtil.isMobile(this._phoneNum)) {
            this._submitEnable = true;
        } else {
            this._submitEnable = false;
        }
        this.forceUpdate();
    }

    _onChangeCode = (s) => {
        this._code = s;
        // this._checkSubmitEnable();
        if (this._code.length === 6) {
            this._submitCodeEnable = true;
        } else {
            this._submitCodeEnable = false;
        }
        this.forceUpdate();
    }

    _onBackPhone = () => {
        this._isCertifycation = false;
        this._code = '',
        this._countDown = 60;
        this._submitCodeEnable = false;
        clearTimeout(this._codeTimer)
        this.forceUpdate();
    }

    _onSubmitPress = () => {
        require("../../model/setting/BindPhoneModel").default.bindMobile(this._phoneNum, this._code)
            .then(data => {
                if (data) {
                    require("../../cache/UserInfoCache").default.setPhoneNumber(this._phoneNum);
                    require("../base/ToastUtil").default.showCenter("绑定成功");
                    this.popSelf();
                }
            })
    }
    _onGetCodePress = () => {
        if (!StringUtil.isMobile(this._phoneNum)) {
            require("../base/ToastUtil").default.showCenter("手机号码不正确");
            return
        }
        //校验原手机2  绑定新手机(没绑)8
        require("../../model/setting/BindPhoneModel").default.sendGetMsgCode(this._phoneNum, 8)
            .then(data => {
                if (data) {
                    this._isCertifycation = true;
                    this.forceUpdate()
                    this._codeTimer = setInterval(() => {
                        this._countDown--;
                        if (this._countDown < 1) {
                            this._countDown = 60;
                            clearInterval(this._codeTimer);
                        }
                        this.forceUpdate();
                    }, 1000);
                }
            })

    }

    _renderGetCode() {
        if (this._countDown == 60) {
            if (!StringUtil.isMobile(this._phoneNum)) {
                return (
                    <View
                        style={{
                            width: DesignConvert.getW(85),
                            height: DesignConvert.getH(48),
                            backgroundColor: "rgba(242,242,242, 0.1)",
                            borderRadius: DesignConvert.getW(5),
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: DesignConvert.getH(20),
                            marginBottom: DesignConvert.getH(40)
                        }}>
                        <Text
                            style={{
                                color: "#D5D5D5",
                                fontSize: DesignConvert.getF(13),
                                textAlign: "center",
                            }}
                        >获取验证码</Text>
                    </View>
                )
            }
            return (
                <TouchableOpacity
                    onPress={this._onGetCodePress}
                    style={{
                        width: DesignConvert.getW(85),
                        height: DesignConvert.getH(22),
                        backgroundColor: "rgba(242,242,242, 0.1)",
                        borderRadius: DesignConvert.getW(5),
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(20),
                        marginBottom: DesignConvert.getH(40)
                    }}>
                    <Text
                        style={{
                            color: THEME_COLOR,
                            fontSize: DesignConvert.getF(13),
                            textAlign: "center",
                        }}
                    >获取验证码</Text>
                </TouchableOpacity>
            )
        } else {
            return (

                <View
                    style={{
                        width: DesignConvert.getW(85),
                        height: DesignConvert.getH(22),
                        backgroundColor: "rgba(242,242,242, 0.1)",
                        borderRadius: DesignConvert.getW(5),
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(20),
                        marginBottom: DesignConvert.getH(40)
                    }}>
                    <Text
                        style={{
                            color: "#1D1D1D",
                            fontSize: DesignConvert.getF(13),
                            textAlign: "center",
                        }}
                    >{this._countDown + "s后重新获取验证码"}</Text>
                </View>
            )
        }
    }

    _renderVerificate = () => {
        if (!this._isCertifycation) return null
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: 'white'
                }}
            >
                <Text
                    style={{
                        color: '#585858',
                        fontSize: DesignConvert.getF(13),
                        marginTop: DesignConvert.getH(51)
                    }}
                >
                    输入六位验证码
                </Text>
                <View
                    style={{
                        alignItems: 'center',
                        marginTop: DesignConvert.getH(20)
                    }}
                >
                    <View
                        style={{
                            width: DesignConvert.getW(294),
                            position: 'absolute',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}
                    >
                        {[0, 1, 2, 3, 4, 5].map(item => {
                            return (
                                <View
                                    style={{
                                        width: DesignConvert.getW(40),
                                        height: DesignConvert.getW(40),
                                        borderRadius: DesignConvert.getW(5),
                                        backgroundColor: '#FCFCFC'
                                    }}
                                />
                            )
                        })}
                    </View>
                    <TextInput

                        style={{
                            letterSpacing: DesignConvert.getW(41),
                            width: DesignConvert.getW(315),
                            // backgroundColor: 'red',
                            fontSize: DesignConvert.getF(16),
                            color: '#1D1D1D'
                        }}
                        value={this._code}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        returnKeyType='next'
                        onChangeText={this._onChangeCode}
                        maxLength={6}
                        selectionColor={THEME_COLOR}
                        autoFocus
                        selectionColor={'white'}
                    ></TextInput>

                </View>
                {this._renderGetCode()}
                <SubmitButton
                    enable={this._submitCodeEnable}
                    btnText={"完成"}
                    onPress={this._onSubmitPress}></SubmitButton>
            </View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                }}
            >
                <BackTitleView
                    onBack={this._isCertifycation ? this._onBackPhone : this.popSelf}
                    titleText={'绑定手机号'}
                    titleTextStyle={{
                        color: '#1D1D1DFF'
                    }} />
                <View
                    style={{
                        display: this._isCertifycation ? 'none' : 'flex',
                        marginTop: DesignConvert.getH(51),
                        alignItems: 'center'
                    }}
                >
                    <TextInput
                        style={{
                            width: DesignConvert.getW(270),
                            height: DesignConvert.getH(44),
                            borderRadius: DesignConvert.getW(10),
                            color: "#1A1A1A",
                            fontSize: DesignConvert.getF(14),
                            backgroundColor: '#FCFCFC',

                        }}
                        value={this._phoneNum}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        placeholder="请输入需要绑定的手机号"
                        placeholderTextColor="#D2D2D2"
                        returnKeyType='next'
                        onChangeText={this._onChangePhoneNum}
                        maxLength={11}
                        selectionColor={THEME_COLOR}
                    ></TextInput>
                    <SubmitButton
                        enable={this._submitEnable}
                        btnText={'下一步'}
                        onPress={this._onGetCodePress}></SubmitButton>
                </View>
                {this._renderVerificate()}
            </View>
        )
    }
}