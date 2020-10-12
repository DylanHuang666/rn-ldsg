/**
 * 钻石转赠dialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { COIN_NAME } from '../../hardcode/HGLobal';
import { income_menu } from "../../hardcode/skin_imgs/anchorincome";
import DesignConvert from "../../utils/DesignConvert";
import { giftGoldRecord } from "../anchorincome/RecordView";
import BackTitleView from "../base/BackTitleView";
import BaseView from "../base/BaseView";
import ToastUtil from "../base/ToastUtil";

/**
 * 校验按钮
 */
class VerificationButton extends PureComponent {

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        if (!this.props.enable) {
            return (
                <Text
                    style={{
                        color: "#CFCFCF",
                        fontSize: DesignConvert.getF(13),
                        textAlign: "center",
                    }}
                >{this.props.text ? this.props.text : " 效验"}</Text>
            );
        }

        return (
            <TouchableOpacity
                onPress={this._onPress}
            >
                <Text
                    style={{
                        color: "#F35E4C",
                        fontSize: DesignConvert.getF(13),
                        textAlign: "center",
                    }}
                >{this.props.text ? this.props.text : " 效验"}</Text>
            </TouchableOpacity>
        )
    }
}

/**
 * 编辑的Item
 */
class EditItem extends PureComponent {

    render() {
        return (
            <View
                style={[{
                    width: DesignConvert.swidth - DesignConvert.getW(30),
                    height: DesignConvert.getH(55),
                    borderRadius: DesignConvert.getW(5),
                    marginHorizontal: DesignConvert.getW(15),
                    marginVertical: DesignConvert.getW(6),
                    paddingHorizontal: DesignConvert.getW(15),
                    backgroundColor: "white",
                    alignItems: "center",
                    flexDirection: "row",
                }, this.props.style]}>

                <Text
                    style={{
                        color: "#212121",
                        fontSize: DesignConvert.getF(15),
                        width: DesignConvert.getW(90),
                    }}>{this.props.title}</Text>

                <TextInput
                    style={{
                        width: DesignConvert.getW(180),
                        height: DesignConvert.getH(40),
                        color: this.props.data == "输入id有误" ? "red" : "#212121",
                    }}
                    value={this.props.data}
                    keyboardType={this.props.numerInput ? "numeric" : "default"}
                    underlineColorAndroid="transparent"
                    placeholder={this.props.placeholder}
                    placeholderTextColor="#CFCFCF"
                    selectionColor="#C94CF8"
                    returnKeyType='next'
                    onChangeText={this.props.onChangeData}
                ></TextInput>

                <View
                    style={{
                        flex: 1,
                    }}></View>



                {this.props.rightPress ? (
                    <VerificationButton
                        onPress={this.props.rightPress}
                        enable={this.props.rightPressEnable} />
                ) : (
                        <Text
                            style={{
                                color: "#212121",
                                fontSize: DesignConvert.getF(13),
                            }}>{this.props.rightText}</Text>
                    )}
            </View>
        )
    }
}


/**
 * 密码的Item
 */
class PasswordEditItem extends PureComponent {
    constructor(props) {
        super(props);

        this._datas = [];
        for (let i = 0; i < this.props.maxInput; i++) {
            this._datas[i] = i;
        }
    }

    _onChangeData = (s) => {
        // console.log("密码", s);
        if (s.length == this.props.maxInput) {
            Keyboard.dismiss();
        }
        this.props.onChangeData && this.props.onChangeData(s);
    }


    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth - DesignConvert.getW(30),
                    height: DesignConvert.getH(55),
                    borderRadius: DesignConvert.getW(5),
                    marginHorizontal: DesignConvert.getW(15),
                    marginVertical: DesignConvert.getW(6),
                    paddingHorizontal: DesignConvert.getW(15),
                    backgroundColor: "white",
                    alignItems: "center",
                    flexDirection: "row",
                }}>

                <Text
                    style={{
                        color: "#212121",
                        fontSize: DesignConvert.getF(15),
                        width: DesignConvert.getW(90),
                    }}>{this.props.title}</Text>

                {this._datas.map((item, i) => {
                    return (
                        <View
                            key={i}
                            style={{
                                width: DesignConvert.getW(35),
                                height: DesignConvert.getH(35),
                                backgroundColor: "#F9F9F9",
                                borderWidth: DesignConvert.getW(1),
                                borderColor: "#CFCFCF",
                                borderRadius: DesignConvert.getW(5),
                                justifyContent: "center",
                                alignItems: "center",
                                marginHorizontal: DesignConvert.getH(1.5),
                            }}>

                            <View
                                style={{
                                    position: "absolute",
                                    top: DesignConvert.getW(7),
                                    left: DesignConvert.getH(7),
                                }}>
                                <View
                                    style={{
                                        backgroundColor: "#212121",
                                        width: DesignConvert.getW(21),
                                        height: DesignConvert.getH(21),
                                        borderRadius: DesignConvert.getW(21),
                                        display: this.props.data.length > i ? "flex" : "none",

                                    }}></View>
                            </View>
                        </View>

                    )
                })}

                <TextInput
                    ref={ref => {
                        this._inputRef = ref;
                    }}
                    style={{
                        color: "rgba(0, 0, 0, 0)",
                        textAlign: "left",
                        width: DesignConvert.getW(this.props.maxInput * 38),
                        height: DesignConvert.getH(55),
                        position: "absolute",
                        right: DesignConvert.getW(15),
                        letterSpacing: DesignConvert.getH(35),
                    }}
                    // secureTextEntry
                    value={this.props.data}
                    keyboardType={this.props.numerInput ? "numeric" : "default"}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#CFCFCF"
                    returnKeyType='next'
                    maxLength={this.props.maxInput}
                    selectionColor="#C94CF8"
                    onChangeText={this._onChangeData}
                    // onFocus={this._onFocus}
                ></TextInput>


            </View>
        )
    }
}


/**
 * 确认按钮
 */
class SubmitButton extends PureComponent {

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        if (!this.props.enable) {
            return (
                <View
                    style={{
                        width: DesignConvert.getW(170),
                        height: DesignConvert.getH(35),
                        borderRadius: DesignConvert.getW(5),
                        marginTop: DesignConvert.getH(50),
                        backgroundColor: '#DADADA',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#B0B0B0",
                            fontSize: DesignConvert.getF(13),
                            fontWeight: "normal",
                        }}
                    >{this.props.btnText}</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={{
                    marginTop: DesignConvert.getH(50),
                    alignSelf: "center",
                }}
                onPress={this.props.onPress}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#F35E4C', '#F35E4C']}

                    style={{
                        width: DesignConvert.getW(170),
                        height: DesignConvert.getH(35),
                        borderRadius: DesignConvert.getW(5),
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
                                color: "#FFDEB3",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }}
                        >{this.props.btnText}</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

export default class DiamondGiftView extends BaseView {
    constructor(props) {
        super(props);

        this._ID = this.props.params.userId;
        this._nickName = "";
        this._amount = "";
        this._payPassword = "";
        this._isVerify = false;
        this._maxAmount = 0;
        this._submitEnable = false;
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _checkSubmitEnable = () => {
        if (this._ID == "" || this._nickName == "" || this._amount == "" || this._payPassword == "" || this._payPassword.length != 6 || !this._isVerify) {
            this._submitEnable = false;
        } else {
            this._submitEnable = true;
        }
        this.forceUpdate();
    }

    _onChangeID = (s) => {
        this._ID = s;
        this._isVerify = false;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeNickName = (s) => {
        this._nickName = s;
        this._isVerify = false;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeAmount = (s) => {
        // console.log("验证数字", parseInt(s));
        if (!parseInt(s)) {
            // console.log("true", this._amount);
            this._amount = "";
        } else {
            this._amount = parseInt(s) + "";
        }
        this._amount = this._amount > this._maxAmount ? this._maxAmount + "" : this._amount;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangePayPassword = (s) => {
        this._payPassword = s;
        // console.log("密码", "收到的", this._payPassword);
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    componentDidMount() {
        super.componentDidMount()
        this._initData();
    }

    _initData() {
        require("../../model/BagModel").default.getWallet()
            .then(data => {
                this._maxAmount = data.goldShell;
                this.forceUpdate();
            })
    }

    _positivePress = () => {
        require("../../model/mine/MyWalletModel").default.sendGoldShell(this._ID, parseInt(this._amount), this._payPassword)
            .then(data => {
                if (data) {
                    setTimeout(() => {
                        ToastUtil.showCenter("转赠成功");
                    }, 200);
                    let luckryMoneyMsg = {
                        amount: parseInt(this._amount),
                        toUserId: this._ID,
                        toUserName: this._nickName,
                    }
                    require("../../model/chat/ChatModel").sendC2CMessage(this._ID, [[4, "luckryMoney#" + JSON.stringify(luckryMoneyMsg)]]);
                    this.popSelf();
                }
            })
    }

    _checkPress = () => {
        require('../../model/anchorincome/ConvertModel').default.getUserInfoList(this._ID)
            .then(data => {
                this._nickName = decodeURI(data.nickName);
                this._ID = data.userId;
                this._isVerify = true;
                this._checkSubmitEnable();
                this.forceUpdate();
            })
            .catch(err => {
                this._nickName = "输入id有误";
                this.forceUpdate();
            })
    }

    _onGiftRecordPress = () => {
        require("../../router/level3_router").showRecordView(giftGoldRecord);
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#EDEDED",
                }}>

                <View
                    style={{
                        backgroundColor: "#F35E4C",
                    }}>

                    <BackTitleView
                        titleText={'发红包'}
                        onBack={this.popSelf}
                        rightImg={income_menu()}
                        onRightPress={this._onGiftRecordPress}
                    />
                </View>

                <EditItem
                    numerInput
                    title="发给"
                    placeholder="收红包者ID号"
                    data={this._ID}
                    onChangeData={this._onChangeID}
                    style={{
                        marginTop: DesignConvert.getH(34),
                    }} />


                <EditItem
                    title="昵称验证"
                    placeholder="收红包者昵称"
                    data={this._nickName}
                    onChangeData={this._onChangeNickName}
                    rightPress={this._checkPress}
                    rightPressEnable={this._ID != ""} />


                <EditItem
                    title="数量"
                    placeholder="输入数量"
                    data={this._amount}
                    numerInput
                    onChangeData={this._onChangeAmount}
                    rightText={COIN_NAME} />

                <PasswordEditItem
                    title="支付密码"
                    onChangeData={this._onChangePayPassword}
                    maxInput={6}
                    numerInput
                    data={this._payPassword}
                />

                <SubmitButton
                    enable={this._submitEnable}
                    btnText="发送红包"
                    onPress={this._positivePress}></SubmitButton>
            </View>
        )
    }
}

export const styles = StyleSheet.create({
    line: {
        backgroundColor: "#DDDDDD",
        width: DesignConvert.getW(180),
        height: DesignConvert.getBorderWidth(1),
        position: "absolute",
        bottom: 0,
        left: DesignConvert.getW(97),
    },
})