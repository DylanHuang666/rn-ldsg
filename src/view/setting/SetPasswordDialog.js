
/**
 * 更改密码 -> 发送验证码弹窗 -> 修改密码弹窗
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';
import CheckBoxView from '../base/CheckBoxView';
import StringUtil from '../../utils/StringUtil';
import UserInfoCache from "../../cache/UserInfoCache";
import ToastUtil from "../base/ToastUtil";
import { LINEARGRADIENT_COLOR, THEME_COLOR } from "../../styles";
import _GetCodeButton from "./item/_GetCodeButton";
import _BindPhoneItem from "./item/_BindPhoneItem";


export default class SetPhoneDialog extends BaseView {
    constructor(props) {
        super(props);

        //1.登录密码 2.修改登录密码 0.修改支付密码
        this._type = this.props.params._type;

        this._phoneNum = UserInfoCache.phoneNumber;
        this._code = this.props.params._code ? this.props.params._code : "";
        this._passWord = "";
        this._passWordAgain = "";

        this._bChecked = true;

        this._submitEnable = false;

        this._oldCode = "";

        //是否显示手机号（单纯显示手机号码）
        this._bShowPhone = this._type == 1;
    }


    _checkSubmitEnable = () => {
        if (this._phoneNum != "" && this._code != "" && this._bChecked) {
            this._submitEnable = true;
        } else {
            this._submitEnable = false;
        }
    }

    _onChangePassWord = (s) => {
        this._passWord = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangePassWordAgain = (s) => {
        this._passWordAgain = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onSubmitPress = () => {
        if (this._passWord.length < 6 || this._passWord.length > 16) {
            this._type != 0 ? ToastUtil.showCenter('请设置6~16位新密码') : ToastUtil.showCenter('请设置6位新支付密码')
            return
        }
        if (this._passWordAgain.length < 6 || this._passWordAgain.length > 16) {
            this._type != 0 ? ToastUtil.showCenter('请设置6~16位新密码') : ToastUtil.showCenter('请设置6位新支付密码')
            return
        }
        if (this._passWord != this._passWordAgain) {
            ToastUtil.showCenter("密码不一致");
            return
        }
        if (this._type == 1) {
            require("../../model/setting/UpdatePasswordModel").default.fitstUpdatePasswor(this._passWord)
                .then(data => {
                    if (data) {
                        ToastUtil.showCenter("设置成功");
                        this.popSelf();
                    }
                })
        } else if (this._type == 2) {
            require("../../model/setting/UpdatePasswordModel").default.updatePasswor(this._passWord, this._code)
                .then(data => {
                    if (data) {
                        ToastUtil.showCenter("设置成功");
                        this.popSelf();
                    }
                })
        } else {
            require("../../model/setting/UpdatePasswordModel").default.setPayPassword(this._passWord, this._code)
                .then(data => {
                    if (data) {
                        ToastUtil.showCenter("设置成功");
                        UserInfoCache.setPayPasswordTrue();
                        this.popSelf();
                    }
                })
        }

    }
    _getPhoneNumFormat = () => {
        if (!this._phoneNum) return '';

        return this._phoneNum.substr(0, 3) + '****' + this._phoneNum.substr(7, 11)
    }

    render() {
        const title = this.props.params._title;
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',

                    backgroundColor: 'rgba(0,0,0,0.1)'
                }}
            >

                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        position: 'absolute',

                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                    }}
                />

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#B86929', '#913713']}

                    style={{
                        alignItems: 'center',

                        width: DesignConvert.getW(300),
                        height: DesignConvert.getH(295),

                        borderRadius: DesignConvert.getW(10),

                    }}
                >
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(15),

                            fontSize: DesignConvert.getF(17),
                            color: '#FFFFFF',
                            fontWeight: 'bold',

                        }}
                    >
                        {title}
                    </Text>

                    <TouchableOpacity
                        onPress={this.popSelf}
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(18),
                            right: DesignConvert.getW(15),
                        }}
                    >
                        <Image
                            source={require("../../hardcode/skin_imgs/lvdong").set_dialog_close()}
                            style={{
                                width: DesignConvert.getW(18),
                                height: DesignConvert.getH(18),
                            }}
                        />
                    </TouchableOpacity>

                    <TextInput
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),
                            padding: 0,
                            paddingLeft: DesignConvert.getW(10),
                            marginTop: DesignConvert.getH(40),

                            fontSize: DesignConvert.getF(14),
                            color: "#333333",

                            backgroundColor: '#FFFFFF',
                            borderRadius: DesignConvert.getW(10),

                        }}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        placeholder={'请输入您的密码'}
                        placeholderTextColor="#999999"
                        value={this._passWord}
                        returnKeyType='next'
                        onChangeText={this._onChangePassWord}
                        maxLength={this._type != 0 ? 16 : 6}
                        selectionColor={THEME_COLOR}
                    ></TextInput>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),

                            marginTop: DesignConvert.getH(25),

                            borderRadius: DesignConvert.getW(10),
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,

                                padding: 0,
                                paddingLeft: DesignConvert.getW(10),

                                color: "#333333",
                                fontSize: DesignConvert.getF(14),

                            }}
                            value={this._passWordAgain}
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            placeholder="请再次确认您的密码"
                            placeholderTextColor="#999999"
                            returnKeyType='next'
                            onChangeText={this._onChangePassWordAgain}
                            maxLength={this._type != 0 ? 16 : 6}
                            selectionColor={THEME_COLOR}
                        ></TextInput>
                    </View>

                    <TouchableOpacity
                        onPress={this._onSubmitPress}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={['#FF5245', '#CD0031']}

                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',

                                width: DesignConvert.getW(160),
                                height: DesignConvert.getH(44),
                                marginTop: DesignConvert.getH(50),

                                borderRadius: DesignConvert.getW(22),

                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: DesignConvert.getF(15),
                                }}>

                                {"确定提交"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )


    }
}
