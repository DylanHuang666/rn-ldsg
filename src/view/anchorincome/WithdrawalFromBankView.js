/**
 * 银行提现界面
 */

'use strict';

import React from "react";
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from "../base/BaseView";
import { SubmitButton } from "./VerifyPayPasswordView";



export default class WithdrawalFromBankView extends BaseView {

    constructor(props) {
        super(props);

        this._totalMoney = this.props.params.accountMoney;
        this._minCatchValue = this.props.params.minCatchValue;
        this._maxCatchValue = Math.min(this.props.params.maxCatchValue, this._totalMoney);

        this._realName = '';//真实姓名
        this._bankId = '';//银行卡号
        this._money = this._minCatchValue.toString();//提现金额
        this._payPassword = '';//支付密码

    }

    componentDidMount() {
        super.componentDidMount();
        require('../../model/anchorincome/WithdrawModel').getLocalSaveBankInfo()
            .then(data => {
                if (!data) return;

                this._realName = decodeURIComponent(data.accountName);
                this._bankId = data.account;
                this.forceUpdate();
            })
    }

    _onChangeRealName = (s) => {
        this._realName = s;
        // this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeBankId = (s) => {
        this._bankId = s;
        // this._checkSubmitEnable();
        this.forceUpdate();
    }

    _set2Totalmoney = () => {
        const prev = this._money;
        this._money = this._maxCatchValue + '';
        if (prev == this._money) {
            return;
        }
        // this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeMoney = (s = "") => {
        let number = s.replace(/([0-9]+\.[0-9]{2})[0-9]*/, "$1");
        this._money = isNaN(number)
            ? this._minCatchValue
            : Number(number) > this._maxCatchValue
                ? this._maxCatchValue
                : number;
        this._money += '';
        // this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangePayPassword = (s) => {
        this._payPassword = s;
        // this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onSubmitPress = () => {
        if (!this._realName) {
            require("../base/ToastUtil").default.showCenter('请输入真实姓名');
            return;
        }
        if (!this._bankId) {
            require("../base/ToastUtil").default.showCenter('请输入银行账号');
            return;
        }

        if (!this._money) {
            require("../base/ToastUtil").default.showCenter('请输入提现金额');
            return;
        }

        if (!this._payPassword) {
            require("../base/ToastUtil").default.showCenter('请输入支付密码');
            return;
        }

        require('../../model/anchorincome/WithdrawModel').bankWithdrawal(
            Number(this._money) * 100,
            this._bankId,
            encodeURIComponent(this._realName),
            this._payPassword
        ).then(data => {
            if (data) {
                require("../base/ToastUtil").default.showCenter("提现申请已提交，正在审核中");
                this.popSelf();
            }
        });
    }


    _renderLine() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth - DesignConvert.getW(30),
                    height: DesignConvert.getBorderWidth(1),
                    backgroundColor: "#E4E3E7",

                    marginLeft: DesignConvert.getW(20),
                    marginRight: DesignConvert.getW(20),
                }}
            />
        );
    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <BackTitleView
                    onBack={this.popSelf}
                />

                <View
                    style={{
                        marginTop: DesignConvert.getH(10),

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(41),

                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),

                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            flex: 1,

                            color: "#333333",
                            fontSize: DesignConvert.getF(16),
                        }}
                    >真实姓名</Text>

                    <View
                        style={{
                            flex: 2,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <TextInput
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            placeholder="填写真实姓名"
                            placeholderTextColor="#999999"
                            returnKeyType="next"
                            onChangeText={this._onChangeRealName}
                            value={this._realName}
                        />
                    </View>

                    <View
                        style={{
                            flex: 1
                        }}>
                    </View>
                </View>

                {this._renderLine()}

                <View
                    style={{
                        marginTop: DesignConvert.getH(10),

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(41),

                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),

                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            flex: 1,

                            color: "#333333",
                            fontSize: DesignConvert.getF(16),
                        }}
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
                            placeholder="输入银行卡号"
                            placeholderTextColor="#999999"
                            returnKeyType="next"
                            onChangeText={this._onChangeBankId}
                            value={this._bankId}
                        ></TextInput>
                    </View>

                    <View
                        style={{
                            flex: 1
                        }}>
                    </View>
                </View>

                {this._renderLine()}

                <View
                    style={{
                        marginTop: DesignConvert.getH(10),

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(41),

                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),

                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            flex: 1,

                            color: "#333333",
                            fontSize: DesignConvert.getF(16),
                        }}
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
                        />
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
                    style={{
                        marginTop: DesignConvert.getH(10),

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(41),

                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),

                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            flex: 1,

                            color: "#333333",
                            fontSize: DesignConvert.getF(16),
                        }}
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
                            keyboardType="default"
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

                {this._renderLine()}

                <SubmitButton
                    enable={true}
                    btnText="确定"
                    onPress={this._onSubmitPress}
                />
            </View>
        );
    }
}