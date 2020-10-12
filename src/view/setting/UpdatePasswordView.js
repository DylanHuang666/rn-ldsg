
/**
 * 设置密码页面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { TitleBar } from '../anchorincome/ConvertView';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';
import ToastUtil from "../base/ToastUtil";
import UserInfoCache from "../../cache/UserInfoCache";
import { LINEARGRADIENT_COLOR, THEME_COLOR } from "../../styles";
import StringUtil from "../../utils/StringUtil";
import _GetCodeButton from "./item/_GetCodeButton";
import _eyeItem from "./item/_eyeItem";
import _PasswordEditItem from "./item/_PasswordEditItem";

const [updatePassword, updatePayPassword] = [233, 666];
export { updatePassword, updatePayPassword };
class UpdatePasswordItem extends PureComponent {

    constructor(props) {
        super(props);

        this._phoneNum = UserInfoCache.phoneNumber;

    }
    _getPhoneNumFormat = () => {
        if (!this._phoneNum) return '';

        return this._phoneNum.substr(0, 3) + '****' + this._phoneNum.substr(7, 11)
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",

                    backgroundColor: '#FFFFFF',
                }}>

                <BackTitleView
                    titleText={this.props.titleText}
                    onBack={this.props.popSelf}
                    bgColor={["#260713", "#3B0D1E"]}
                    titleTextStyle={{
                        color: "white",
                    }}
                    backImgStyle={{
                        tintColor: "white",
                    }} />
                <Image
                    source={require('../../hardcode/skin_imgs/lvdong').set_phone_icon()}
                    style={{
                        width: DesignConvert.getW(110),
                        height: DesignConvert.getH(102),
                        marginTop: DesignConvert.getH(50),
                    }}
                />

                <Text
                    style={{
                        marginTop: DesignConvert.getH(10),

                        fontSize: DesignConvert.getF(18),
                        color: '#000000',
                        fontWeight: 'bold',

                    }}
                >
                    {this._getPhoneNumFormat()}
                </Text>

                <TouchableOpacity
                    onPress={this.props.onPress}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={['#FF5245', '#CD0031']}

                        style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',

                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(44),
                            marginTop: DesignConvert.getH(50),

                            borderRadius: DesignConvert.getW(10),
                        }}
                    >
                        <Text
                            style={{
                                marginLeft: DesignConvert.getW(15),

                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(14),

                            }}
                        >{this.props.buttonTitle}</Text>

                        <Image
                            source={require('../../hardcode/skin_imgs/lvdong').set_arrow_right()}
                            style={{
                                width: DesignConvert.getW(18),
                                height: DesignConvert.getH(18),
                                marginRight: DesignConvert.getW(10),
                            }}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

        )
    }
}
export default class UpdatePasswordView extends BaseView {
    constructor(props) {
        super(props);

        this._phoneNum = UserInfoCache.phoneNumber;
        this._trueSetpassword = UserInfoCache.setpassword; //是否设置密码

        this._trueSetPayPassword = UserInfoCache.setPayPassword;//是否设置支付密码


        this._isChangePwd = this.props.params.viewType == updatePassword;


    }


    _firstSetPassword = () => {
        require("../../router/level3_router").showSetPasswordDialog(() => {

            this._phoneNum = this._type == 0 ? "" : UserInfoCache.phoneNumber;

            this.forceUpdate();
        },
            this._title = "设置登录密码",
            this._type = 1);
    }

    _upDateSetPassword = () => {
        require("../../router/level3_router").showSendCodeDialog(() => {

            this._phoneNum = this._type == 0 ? "" : UserInfoCache.phoneNumber;

            this.forceUpdate();
        },
            this._title = this._isChangePwd ? "重置登录密码" : "设置支付密码",
            this._type = this._isChangePwd ? 2 : 0,
            this._isChangePwd = this._isChangePwd
        );

    }

    render() {

        // if (this._step == 1) {
        //     return this._renderStepOne()
        // } else {
        //     if (!this._isChangePwd && this._step == 2) {
        //         return this._renderPayStepTwo();
        //     }
        //     if (!this._isChangePwd && this._step == 3) {
        //         return this._renderPayStepThree();
        //     }
        //     return this._renderStepTwo()
        // }
        if (!this._trueSetpassword && this._isChangePwd) {
            return (
                <UpdatePasswordItem
                    titleText="设置登录密码"
                    popSelf={this.popSelf}
                    onPress={this._firstSetPassword}
                    buttonTitle="设置登录密码"
                />
            )
        } else {
            if (!this._isChangePwd) {
                return (
                    <UpdatePasswordItem
                        titleText="设置支付密码"
                        popSelf={this.popSelf}
                        onPress={this._upDateSetPassword}
                        buttonTitle="设置支付密码"
                    />
                )
            }
            return (
                <UpdatePasswordItem
                    titleText="设置登录密码"
                    popSelf={this.popSelf}
                    onPress={this._upDateSetPassword}
                    buttonTitle="修改登录密码"
                />
            )
        }

    }
}
