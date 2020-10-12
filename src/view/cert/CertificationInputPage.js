
/**
 * 实名认证页面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import StringUtil from '../../utils/StringUtil';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';

export default class CertificationInputPage extends PureComponent {
    constructor(props) {
        super(props);

        this._realName = "";
        this._IDCard = "";

        this._submitEnable = false;
    }

    _checkSubmitEnable = () => {
        this._submitEnable = this._realName && this._IDCard && StringUtil.isIDCardNO(this._IDCard);
    }

    _onChangeRealName = (s) => {
        this._realName = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeIDCard = (s) => {
        this._IDCard = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onSubmitPress = () => {
        this.props.getRealNameIDCard(this._realName, this._IDCard);
    }

    render() {
        return (
            <View
                style={[{
                    flex: 1,
                    alignItems: "center",
                    marginTop: DesignConvert.getH(20),
                }, this.props.style]}>

                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(53),
                        borderRadius: DesignConvert.getW(10),
                        borderWidth: DesignConvert.getW(1),
                        borderColor: "#F0F0F0",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(20),
                        paddingHorizontal: DesignConvert.getW(15),
                    }}>

                    <Text
                        style={{
                            flex: 1,
                            color: "#999999",
                            fontSize: DesignConvert.getF(15),
                        }}>
                        {"姓名:"}
                    </Text>

                    <TextInput
                        style={{
                            flex: 3,
                            color: "#999999",
                            fontSize: DesignConvert.getF(15),
                        }}
                        value={this._realName}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        placeholder="身份证名字"
                        placeholderTextColor="#CCCCCC"
                        returnKeyType='next'
                        onChangeText={this._onChangeRealName}
                    ></TextInput>

                </View>

                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(53),
                        borderRadius: DesignConvert.getW(10),
                        borderWidth: DesignConvert.getW(1),
                        borderColor: "#F0F0F0",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(20),
                        paddingHorizontal: DesignConvert.getW(15),
                    }}
                >

                    <Text
                        style={{
                            flex: 1,
                            color: "#999999",
                            fontSize: DesignConvert.getF(15),
                        }}>
                        {"身份证:"}
                    </Text>

                    <TextInput
                        style={{
                            flex: 3,
                            color: "#999999",
                            fontSize: DesignConvert.getF(15),
                        }}
                        value={this._IDCard}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        placeholder="身份证号码"
                        placeholderTextColor="#CCCCCC"
                        returnKeyType="done"
                        onChangeText={this._onChangeIDCard}
                    ></TextInput>

                </View>

                <SubmitButton
                    style={{
                        marginTop: DesignConvert.getH(250)
                    }}
                    enable={this._submitEnable}
                    btnText="下一步"
                    onPress={this._onSubmitPress}></SubmitButton>
            </View>
        )
    }
}