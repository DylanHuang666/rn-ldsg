/**
 * 验证支付密码
 */

'use strict';

import React, { PureComponent } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, Keyboard } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { styles } from './ConvertView';
import { COIN_NAME, } from '../../hardcode/HGLobal';
import UserInfoCache from "../../cache/UserInfoCache";

/**
 * 确认按钮
 */
export class SubmitButton extends PureComponent {

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        if (!this.props.enable) {
            return (
                <LinearGradient
                    opacity={0.5}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#CB5CFF', '#FF4D91']}
                    style={[{
                        marginTop: DesignConvert.getH(40),
                        width: this.props.width ? this.props.width : DesignConvert.getW(325),
                        height: DesignConvert.getH(45),
                        borderRadius: DesignConvert.getW(6),
                        alignSelf: "center",
                    }, this.props.style]}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(14),
                                fontWeight: "normal",
                            }}
                        >{this.props.btnText}</Text>
                    </View>
                </LinearGradient>
            );
        }

        return (
            <TouchableOpacity
                style={[{
                    marginTop: DesignConvert.getH(40),
                }, this.props.style]}
                onPress={this.props.onPress}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#CB5CFF', '#FF4D91']}

                    style={{
                        width: this.props.width ? this.props.width : DesignConvert.getW(325),
                        height: DesignConvert.getH(45),
                        borderRadius: DesignConvert.getW(6),
                        alignSelf: "center",
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(14),
                                fontWeight: "normal",
                            }}
                        >{this.props.btnText}</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

export default class VerifyPayPasswordView extends BaseView {
    constructor(props) {
        super(props);

        this._password = "";
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _onForgetPasswordPress = () => {
        if (!UserInfoCache.phoneNumber) {
            ToastUtil.showCenter("请先绑定手机")
            return
        }
        require("../../router/level3_router").showUpdatePasswordView(require("../setting/UpdatePasswordView").updatePayPassword);
    }

    _onChangePassword = (s) => {
        this._password = s;
        this.forceUpdate();
    }

    _onSubmitPress = () => {
        if (this._password == "") {
            require("../base/ToastUtil").default.showCenter("请输入密码");
            return
        }
        Keyboard.dismiss();

        // console.log("价钱", this.props.params.exchargePrice);
        // console.log("targetId", this.props.params.targetId);
        require("../../model/anchorincome/VerifyPayPasswordModel").default.exchangeGoldShell(this.props.params.rechargeId, this.props.params.targetId, this.props.params.exchargePrice * 100, this._password)
            .then(data => {
                if (data) {
                    require("../base/ToastUtil").default.showCenter("兑换成功");
                    this.popSelf();
                }
            })
    }

    render() {

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
            >

                <BackTitleView
                    titleText={`兑换${COIN_NAME}`}
                    onBack={this._onBackPress}
                />

                <View style={styles.grayline} />

                <View
                    style={[styles.normalLayout, { marginTop: DesignConvert.getH(30) }]}
                >
                    <Text
                        style={[styles.normalText, { marginRight: DesignConvert.getW(20) }]}
                    >密码</Text>

                    <View
                        style={{
                            flex: 2,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                            }}
                            secureTextEntry={true}
                            keyboardType="default"
                            maxLength={6}
                            autoFocus={true}
                            underlineColorAndroid="transparent"
                            placeholder="请输您的支付密码"
                            placeholderTextColor="#999999"
                            returnKeyType="done"
                            onChangeText={this._onChangePassword}
                            value={this._password}
                        ></TextInput>
                    </View>
                </View>

                <View style={[styles.grayline, {
                    width: DesignConvert.swidth - DesignConvert.getW(30),
                    marginLeft: DesignConvert.getW(20),
                    marginRight: DesignConvert.getW(20),
                }]} />

                <TouchableOpacity
                    style={{
                        flexDirection: "row-reverse",
                    }}
                    onPress={this._onForgetPasswordPress}
                >
                    <Text
                        style={{
                            color: "#A055FF",
                            fontSize: DesignConvert.getF(10),
                            marginTop: DesignConvert.getH(10),
                            marginRight: DesignConvert.getW(20),
                        }}
                    >忘记密码？</Text>
                </TouchableOpacity>

                <SubmitButton
                    enable={this._password != ""}
                    btnText="确定"
                    onPress={this._onSubmitPress}></SubmitButton>
            </View>
        )
    }
}