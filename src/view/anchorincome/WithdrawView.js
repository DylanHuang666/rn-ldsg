
/**
 * 提现页
 */

'use strict';

import React, { PureComponent } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { styles } from './ConvertView';
import { SubmitButton } from './VerifyPayPasswordView';
import UserInfoCache from "../../cache/UserInfoCache";
import ToastUtil from "../base/ToastUtil";

export default class WithdrawView extends BaseView {
    constructor(props) {
        super(props);

        this._realName = "";
        this._aliPayAccount = "";
        this._money = "";
        this._payPassword = "";

        this._totalMoney = this.props.params.accountMoney;
        this._maxCatchValue = this.props.params.maxCatchValue;

        this._submitEnable = false;
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _checkSubmitEnable = () => {
        if (this._realName != "" && this._aliPayAccount != "" && this._money != "" && this._payPassword != "") {
            this._submitEnable = true;
        } else {
            this._submitEnable = false;
        }
    }

    _onChangeRealName = (s) => {
        this._realName = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeAliPayAccount = (s) => {
        this._aliPayAccount = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _set2Totalmoney = () => {
        if (this._totalMoney > this._maxCatchValue) {
            this._money = this._maxCatchValue + "";
        } else {
            this._money = this._totalMoney + "";
        }
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeMoney = (s = "") => {
        let number = s.replace(/([0-9]+\.[0-9]{2})[0-9]*/, "$1");
        this._money = !isNaN(number) && Number(number) < this._totalMoney ? number : this._totalMoney > this._maxCatchValue ? this._maxCatchValue + "" : this._totalMoney + "";
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangePayPassword = (s) => {
        this._payPassword = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onForgetPasswordPress = () => {
        if (!UserInfoCache.phoneNumber) {
            ToastUtil.showCenter("请先绑定手机")
            return
        }
        require("../../router/level3_router").showUpdatePasswordView(require("../setting/UpdatePasswordView").updatePayPassword);
    }

    _onSubmitPress = () => {
        require('../../model/anchorincome/WithdrawModel').default.applyExpense(this._realName, this._aliPayAccount, this._payPassword, Number(this._money) * 100)
            .then(data => {
                if (data) {
                    require("../base/ToastUtil").default.showCenter("提现申请已提交，正在审核中");
                    this.popSelf();
                }
            })
    }

    _onAgreeProtocol = () => {

    }

    render() {

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}>

                <BackTitleView
                    titleText={"提现"}
                    onBack={this._onBackPress}
                />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(20),
                        backgroundColor: "#E4E3E7",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: DesignConvert.getW(10),
                    }}
                >
                    <Image
                        source={require("../../hardcode/skin_imgs/anchorincome").icon_report2()}
                        style={{
                            width: DesignConvert.getW(10),
                            height: DesignConvert.getW(10),
                            marginRight: DesignConvert.getW(10),
                        }}></Image>

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(10),
                            color: "#999999",
                        }}
                    >请输入与实名认证相符的姓名及支付宝账号，否则将导致提现失败</Text>
                </View>

                <View
                    style={[styles.normalLayout, { marginTop: DesignConvert.getH(10) }]}
                >
                    <Text
                        style={[styles.normalText]}
                    >真实姓名</Text>

                    <TextInput
                        style={{
                            flex: 1,
                            marginLeft: DesignConvert.getW(15)
                        }}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        placeholder="填写真实姓名"
                        placeholderTextColor="#999999"
                        returnKeyType="next"
                        onChangeText={this._onChangeRealName}
                        value={this._realName}
                    ></TextInput>

                   
                </View>

                <View style={[styles.grayline, {
                    width: DesignConvert.swidth - DesignConvert.getW(30),
                    marginLeft: DesignConvert.getW(20),
                    marginRight: DesignConvert.getW(20),
                }]} />

                <View
                    style={[styles.normalLayout, { marginTop: DesignConvert.getH(10) }]}
                >
                    <Text
                        style={[styles.normalText, { flex: 1 }]}
                    >银行卡账号</Text>

                    <View
                        style={{
                            flex: 2,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <TextInput
                            keyboardType="numeric"
                            underlineColorAndroid="transparent"
                            placeholder="输入银行卡账号"
                            placeholderTextColor="#999999"
                            returnKeyType="next"
                            onChangeText={this._onChangeAliPayAccount}
                            value={this._aliPayAccount}
                        ></TextInput>
                    </View>

                    <View
                        style={{
                            flex: 1
                        }}>
                    </View>
                </View>

                <View style={[styles.grayline, {
                    width: DesignConvert.swidth - DesignConvert.getW(30),
                    marginLeft: DesignConvert.getW(20),
                    marginRight: DesignConvert.getW(20),
                }]} />

                <View
                    style={[styles.normalLayout, { marginTop: DesignConvert.getH(10) }]}
                >
                    <Text
                        style={[styles.normalText, { flex: 1 }]}
                    >提现金额</Text>

                    <View
                        style={{
                            flex: 2,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <TextInput
                            keyboardType="numeric"
                            underlineColorAndroid="transparent"
                            placeholder="请输入金额"
                            placeholderTextColor="#999999"
                            returnKeyType="done"
                            onChangeText={this._onChangeMoney}
                            value={this._money}
                        ></TextInput>
                    </View>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            flexDirection: "row-reverse",
                        }}
                        onPress={this._set2Totalmoney}
                    >
                        <Text
                            style={{
                                color: "#A055FF",
                                fontSize: DesignConvert.getF(16),
                            }}
                        >全部</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={[styles.normalLayout, { marginTop: DesignConvert.getH(10) }]}
                >
                    <Text
                        style={[styles.normalText, { flex: 1 }]}
                    >支付密码</Text>

                    <View
                        style={{
                            flex: 2,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <TextInput
                            secureTextEntry={true}
                            keyboardType="numeric"
                            maxLength={6}
                            underlineColorAndroid="transparent"
                            placeholder="请输您的支付密码"
                            placeholderTextColor="#999999"
                            returnKeyType="done"
                            onChangeText={this._onChangePayPassword}
                            value={this._payPassword}
                        ></TextInput>
                    </View>

                    <View
                        style={{
                            flex: 1
                        }}>
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
                    enable={this._submitEnable}
                    btnText="确定"
                    onPress={this._onSubmitPress}></SubmitButton>

                <View
                    style={{
                        marginTop: DesignConvert.getH(30),
                        flexDirection: "row",
                        justifyContent: "center",
                    }}>
                    <Text
                        style={{
                            marginLeft: DesignConvert.getW(8),
                            color: "#1A1A1A",
                            fontSize: DesignConvert.getF(11),
                        }}
                    >我已阅读并同意</Text>

                    <TouchableOpacity
                        onPress={this._onAgreeProtocol}
                    >
                        <Text
                            style={{
                                color: "#1A1A1A",
                                fontSize: DesignConvert.getF(11),
                            }}
                        >《云账户提现协议》</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}