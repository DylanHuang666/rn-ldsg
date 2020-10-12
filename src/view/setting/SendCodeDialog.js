
/**
 * 更改密码 -> 发送验证码弹窗
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
import { LINEARGRADIENT_COLOR, THEME_COLOR } from "../../styles";
import _GetCodeButton from "./item/_GetCodeButton";
import _BindPhoneItem from "./item/_BindPhoneItem";


export default class SetPhoneDialog extends BaseView {
    constructor(props) {
        super(props);

        //如果 0 没绑定手机号则直接绑定，绑定了得先 1 校验后再 2 绑定
        this._type = !UserInfoCache.phoneNumber ? 0 : 1;

        this._phoneNum = this._type == 0 ? "" : UserInfoCache.phoneNumber;
        this._code = "";
        this._bChecked = true;

        this._submitEnable = false;


        this._getCodeBtnRef = null;
        this._oldCode = "";

        this._isChangePwd = this.props.params._isChangePwd;
    }



    _checkSubmitEnable = () => {
        if (this._phoneNum != "" && this._code != "" && this._bChecked) {
            this._submitEnable = true;
        } else {
            this._submitEnable = false;
        }
    }


    _onChangeCode = (s) => {
        this._code = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onGetCodePress = () => {
        if (!StringUtil.isMobile(this._phoneNum)) {
            require("../base/ToastUtil").default.showCenter("手机号码不正确");
            return
        }
        //校验原手机2  绑定新手机(没绑)8
        require("../../model/setting/BindPhoneModel").default.sendGetMsgCode(this._phoneNum, this._type == 1 ? 2 : 8)
            .then(data => {
                if (data) {

                }
                this.forceUpdate()
            })

    }


    _lastStep = () => {

        this.popSelf();
        require("../../router/level3_router").showSetPasswordDialog(() => {

            this._phoneNum = this._type == 0 ? "" : UserInfoCache.phoneNumber;

            this.forceUpdate();
        },
            this._title = this._isChangePwd ? "设置登录密码" : "设置支付密码",
            this._type = this._isChangePwd ? 2 : 0,
            this._code
        );


    }

    _getPhoneNumFormat = () => {
        if (!this._phoneNum) return '';

        return this._phoneNum.substr(0, 3) + '****' + this._phoneNum.substr(7, 11)
    }

    render() {
        const _title = this.props.params._title;
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',

                    backgroundColor: 'rgba(0,0,0,0.1)',
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
                            lineHeight: DesignConvert.getH(24),
                        }}
                    >
                        {_title}
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

                    <Text
                        style={{
                            alignSelf: 'center',

                            width: DesignConvert.getW(185),
                            height: DesignConvert.getH(25),
                            marginTop: DesignConvert.getH(30),

                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(18),


                        }}

                    >手机号：{this._getPhoneNumFormat()}</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),
                            marginTop: DesignConvert.getH(44),

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
                            value={this._code}
                            keyboardType="numeric"
                            underlineColorAndroid="transparent"
                            placeholder="输入验证码"
                            placeholderTextColor="#999999"
                            returnKeyType='next'
                            onChangeText={this._onChangeCode}
                            maxLength={6}
                            selectionColor={THEME_COLOR}
                        ></TextInput>

                        <_GetCodeButton
                            ref={ref => {
                                this._getCodeBtnRef = ref;
                            }}
                            enable={StringUtil.isMobile(this._phoneNum)}
                            onPress={this._onGetCodePress}
                            containerStyle={{
                                marginRight: DesignConvert.getW(5),
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={this._lastStep}
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

                                {"下一步"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
    }
}
