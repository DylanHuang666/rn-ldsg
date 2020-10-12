/**
 * 回购
 */

'use strict';

import React, { PureComponent } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import { COIN_NAME, } from '../../hardcode/HGLobal';
import { LINEARGRADIENT_COLOR, THEME_COLOR } from "../../styles";
import StringUtil from "../../utils/StringUtil";

class VerificationButton extends PureComponent {

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        if (!this.props.enable) {
            return (
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#FF5245', '#CD0031']}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",

                        width: DesignConvert.getW(42),
                        height: DesignConvert.getH(21),

                        opacity: 0.5,
                        borderRadius: DesignConvert.getW(10),

                    }}>
                    <Text
                        style={{
                            textAlign: "center",

                            color: "white",
                            fontSize: DesignConvert.getF(10),

                        }}>校验</Text>
                </LinearGradient>
            );
        }

        return (
            <TouchableOpacity
                onPress={this._onPress}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FF5245', '#CD0031']}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",

                        width: DesignConvert.getW(42),
                        height: DesignConvert.getH(21),

                        borderRadius: DesignConvert.getW(10),

                    }}>
                    <Text
                        style={{

                            textAlign: "center",

                            color: "white",
                            fontSize: DesignConvert.getF(10),

                        }}>校验</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

//兑换金币
class ExchangeButton extends PureComponent {

    render() {
        const DesignConvert = require('../../utils/DesignConvert').default;

        return (
            <TouchableOpacity
                style={{
                    marginTop: DesignConvert.getH(0)
                }}
                onPress={this.props.onPress}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#FF5245', '#CD0031']}

                    style={{

                        width: DesignConvert.getW(52),
                        height: DesignConvert.getH(21),

                        borderRadius: DesignConvert.getW(10.5),
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
                                fontSize: DesignConvert.getF(10),
                                fontWeight: "normal",
                            }}
                        >{this.props.btnText}</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

//TitleBar
export class TitleBar extends PureComponent {

    render() {
        const DesignConvert = require('../../utils/DesignConvert').default;

        return (
            <View
                style={{

                    flexDirection: "row",

                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(45),

                    backgroundColor: "white",

                }}
            >
                <View
                    style={{

                        flex: 1,
                        justifyContent: "center",
                    }}
                >
                    <TouchableOpacity
                        onPress={this.props.onPress}
                        style={{
                            minWidth: DesignConvert.getW(60),
                        }}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(12),
                                height: DesignConvert.getW(21),
                                marginLeft: DesignConvert.getW(20),

                                tintColor: "#1A1818",
                            }}
                            source={require("../../hardcode/skin_imgs/common").ic_back_white()} />
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        flex: 4,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#1A1A1A",
                            fontSize: DesignConvert.getF(19),
                            fontWeight: "bold",
                        }}
                    >{this.props.title}</Text>
                </View>

                <View
                    style={{

                        flex: 1,
                        justifyContent: "center",
                        alignItems: "flex-end",

                        marginRight: DesignConvert.getW(20),
                    }}>

                    <TouchableOpacity
                        onPress={this.props.onRightPress}
                    >
                        <Text
                            style={[
                                {
                                    color: "#1A1A1A",
                                    fontSize: DesignConvert.getF(15),
                                },
                                this.props.rightStyle
                            ]}
                        >{!this.props.rightText ? "" : this.props.rightText}</Text>

                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default class ConVertView extends BaseView {
    constructor(props) {
        super(props);

        this._ID = require("../../cache/UserInfoCache").default.userId;
        this._nickName = "";
        this._money = "";
        this._password = "";
        this._totalMoney = 0;

        this._recharge = [];
        this._isVerify = false;
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _onChangeID = (s) => {
        this._ID = s;
        this._isVerify = false;
        this.forceUpdate();
    }

    _onChangeNickName = (s) => {
        this._nickName = s;
        this.forceUpdate();
    }


    _onChangePassword = (s) => {
        this._password = s;
        this.forceUpdate();
    }
    _set2Totalmoney = () => {
        this._money = this._totalMoney + "";
        this.forceUpdate();
    }

    _onChangeMoney = (s = "") => {
        let number = s.replace(/([0-9]+\.[0-9]{2})[0-9]*/, "$1");
        this._money = !isNaN(number) && Number(number) < this._totalMoney ? number : this._totalMoney + "";
        this.forceUpdate();
    }

    _onRepurchasePress = (rechargeId, money, password) => {
        if (this._totalMoney == 0) {
            require("../base/ToastUtil").default.showCenter("收益不足");
            return
        }
        if (!this._isVerify) {
            require("../base/ToastUtil").default.showCenter("充值id未校验，请检验!");
            return
        }

        if (!rechargeId && money == "") {
            require("../base/ToastUtil").default.showCenter("请输入回购金额");
            return
        }
        if (Number(money) * 100 == 0) {
            require("../base/ToastUtil").default.showCenter("回购金额不正确");
            return
        }
        // require("../../router/level3_router").showVerifyPayPasswordView(rechargeId, Number(money), this._ID);
        require("../../model/anchorincome/VerifyPayPasswordModel").default.exchangeGoldShell(rechargeId, this._ID, Number(money) * 100, password)
            .then(data => {
                if (data) {
                    require("../base/ToastUtil").default.showCenter("兑换成功");
                    this.popSelf();
                }
            })
    };

    _onVerificationPress = () => {
        require('../../model/anchorincome/ConvertModel').default.getUserInfoList(this._ID)
            .then(data => {
                this._nickName = decodeURI(data.nickName);
                this._ID = data.userId;
                this._isVerify = true;
                this.forceUpdate();
            })
            .catch(err => {
                this._nickName = "输入id有误";
                this.forceUpdate();
            })
    }

    onResume() {
        this._initData();
    }

    _initData = () => {
        require('../../model/anchorincome/ConvertModel').default.getRechargeTableData()
            .then(data => {
                this._recharge = data;
                this.forceUpdate();
            });

        //获取可兑换收益
        require('../../model/anchorincome/ConvertModel').default.getIncomeData()
            .then(data => {
                this._totalMoney = Math.floor(data.balance) / 100;
                this.forceUpdate();
            });

        require('../../model/anchorincome/ConvertModel').default.getUserInfoList(this._ID)
            .then(data => {
                this._nickName = decodeURI(data.nickName);
                this._ID = data.userId;
                this._isVerify = true;
                this.forceUpdate();
            })
            .catch(err => {
                this._nickName = "输入id有误";
                this.forceUpdate();
            })
    }

    componentDidMount() {
        super.componentDidMount();
        this._initData();
    }

    _renderLine = () => {
        return (
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,

                    width: DesignConvert.getW(180),
                    height: DesignConvert.getH(1),

                    backgroundColor: "rgba(255,255,255,0.4)",
                }}></View>
        )
    }

    _renderItem = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: "column",

                    width: DesignConvert.getW(315),
                    height: DesignConvert.getH(50),

                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        source={require('../../hardcode/skin_imgs/mywallet').ic_diamond()}
                        style={{

                            width: DesignConvert.getW(18),
                            height: DesignConvert.getW(18),

                            marginRight: DesignConvert.getW(5),
                        }} />
                    <Text
                        style={{
                            flex: 1,

                            fontSize: DesignConvert.getF(13),
                            color: "#1D1D1D",
                        }}
                    >{item.desc}</Text>

                    <ExchangeButton
                        btnText={"¥ " + item.price + "元"}
                        onPress={() => {
                            this._onRepurchasePress(item.id, item.price);
                        }} />
                </View>

                {this._renderLine()}
            </View>
        )
    }

    render() {

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
                        height: DesignConvert.getH(375),

                        borderRadius: DesignConvert.getW(10),


                        // justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{

                            marginTop: DesignConvert.getH(19.5),

                            fontSize: DesignConvert.getF(17),
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            lineHeight: DesignConvert.getH(24),

                        }}
                    >
                        {'兑换'}
                    </Text>

                    <TouchableOpacity
                        onPress={this.popSelf}
                        style={{

                            position: 'absolute',
                            top: DesignConvert.getH(16.5),
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

                    {/* ID及验证 */}
                    <View
                        style={{

                            flexDirection: "row",
                            alignItems: "center",

                            width: DesignConvert.getW(248.5),
                            height: DesignConvert.getH(24.5),
                            marginTop: DesignConvert.getH(30),

                        }}
                    >
                        <Text
                            style={{

                                width: DesignConvert.getW(72),

                                color: "#FFF",
                                fontSize: DesignConvert.getF(13),
                                lineHeight: DesignConvert.getH(18.5),
                                fontWeight: "normal",
                            }}
                        >兑换ID</Text>

                        <TextInput
                            style={{
                                flex: 1,
                                height: DesignConvert.getH(18.5),
                                padding: 0,

                                fontSize: DesignConvert.getF(13),
                                lineHeight: DesignConvert.getW(18.5),

                                color: "rgba(255,255,255,0.34)",

                            }}
                            value={this._ID}
                            keyboardType="numeric"
                            underlineColorAndroid="transparent"
                            placeholder="请输入您的ID"
                            placeholderTextColor="rgba(255,255,255,0.34)"
                            returnKeyType='next'
                            onChangeText={this._onChangeID}
                            selectionColor={THEME_COLOR}
                        ></TextInput>
                        {this._renderLine()}
                    </View>


                    <View
                        style={{

                            flexDirection: "row",
                            alignItems: "center",

                            width: DesignConvert.getW(248.5),
                            height: DesignConvert.getH(26),

                            marginTop: DesignConvert.getH(20)
                        }}
                    >
                        <Text
                            style={{
                                width: DesignConvert.getW(72),

                                color: "#FFF",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }}
                        >昵称验证</Text>

                        <TextInput
                            style={{
                                flex: 1,

                                height: DesignConvert.getH(21),
                                padding: 0,

                                color: this._nickName == "输入id有误" ? "red" : "rgba(255,255,255,0.34)",

                            }}
                            value={this._nickName}
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            placeholder="请输入昵称"
                            placeholderTextColor="rgba(255,255,255,0.34)"
                            returnKeyType='next'
                            onChangeText={this._onChangeNickName}
                            selectionColor={THEME_COLOR}
                        ></TextInput>
                        <VerificationButton
                            onPress={this._onVerificationPress}
                            enable={this._ID != ""} />
                        {this._renderLine()}
                    </View>


                    {/* 兑换金币 */}

                    <View
                        style={{

                            flexDirection: "row",
                            alignItems: "center",

                            width: DesignConvert.getW(248.5),
                            height: DesignConvert.getH(27),
                            marginTop: DesignConvert.getH(20)
                        }}
                    >
                        <Text
                            style={{

                                width: DesignConvert.getW(72),

                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }}
                        >兑换金额</Text>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            {/* <Text
                            style={{
                                marginRight: DesignConvert.getW(5),
                                color: "#1D1D1D",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }}
                        >¥</Text> */}

                            <TextInput
                                style={{
                                    flex: 1,
                                    color: "rgba(255,255,255,0.34)",
                                    padding: 0
                                }}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.34)"
                                returnKeyType="done"
                                onChangeText={this._onChangeMoney}
                                value={this._money}
                                selectionColor={THEME_COLOR}
                            ></TextInput>
                        </View>

                        <ExchangeButton
                            btnText="全部兑换"
                            onPress={this._set2Totalmoney} />

                        {this._renderLine()}
                    </View>
                    <View
                        style={{
                            width: DesignConvert.getW(248.5),
                            height: DesignConvert.getH(14),

                        }}
                    >
                        <Text
                            style={{
                                position: "absolute",
                                right: 0,

                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(10),
                                fontWeight: "normal",
                                lineHeight: DesignConvert.getH(14),

                            }}
                        >可兑换金额:{StringUtil.formatMoney(this._totalMoney)}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",

                            width: DesignConvert.getW(248.5),
                            height: DesignConvert.getH(24.5),
                            marginTop: DesignConvert.getH(6.5),

                        }}
                    >
                        <Text
                            style={{
                                width: DesignConvert.getW(72),

                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }}
                        >{`兑换${COIN_NAME}数`}</Text>

                        <Text
                            style={{

                                flex: 1,

                                color: "rgba(255,255,255,0.34)",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",

                            }}
                        >{this._money == "" ? "0" : Number(this._money) * 10}</Text>

                        {/* <ExchangeButton
                        btnText="回购"
                        onPress={() => {
                            this._onRepurchasePress('', this._money);
                        }} /> */}
                        {this._renderLine()}
                    </View>

                    <View
                        style={{

                            flexDirection: "row",
                            alignItems: "center",

                            width: DesignConvert.getW(248.5),
                            height: DesignConvert.getH(24.5),
                            marginTop: DesignConvert.getH(20)
                        }}
                    >
                        <Text
                            style={{

                                width: DesignConvert.getW(72),

                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }}
                        >支付密码</Text>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            {/* <Text
                            style={{
                                marginRight: DesignConvert.getW(5),
                                color: "#1D1D1D",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }}
                        >¥</Text> */}

                            <TextInput
                                style={{

                                    flex: 1,
                                    padding: 0,

                                    color: "#FFFFFF",

                                }}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                placeholder="请输入支付密码"
                                placeholderTextColor="rgba(255,255,255,0.34)"
                                returnKeyType="done"
                                value={this._password}
                                onChangeText={this._onChangePassword}
                                selectionColor={THEME_COLOR}
                                secureTextEntry={true}
                            ></TextInput>
                        </View>
                        {this._renderLine()}
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this._onRepurchasePress('', this._money, this._password);
                        }}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={['#FF5245', '#CD0031']}

                            style={{

                                justifyContent: 'center',
                                alignItems: 'center',

                                width: DesignConvert.getW(160),
                                height: DesignConvert.getH(44),
                                marginTop: DesignConvert.getH(35),

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


                    {/* <Text
                    style={{
                        width: DesignConvert.swidth,
                        paddingHorizontal: DesignConvert.getW(20),
                        color: "#B8B8B8",
                        fontSize: DesignConvert.getF(11),
                        marginTop: DesignConvert.getH(10),
                    }}>{`注:账户余额可提现，也可兑换${COIN_NAME}，兑换比例1元=10${COIN_NAME}`}</Text> */}

                    {/* 
                <FlatList
                    data={this._recharge}
                    showsVerticalScrollIndicator={false}
                    style={{
                        width: DesignConvert.getW(345),
                        backgroundColor: "white",
                        borderRadius: DesignConvert.getW(10),
                        marginTop: DesignConvert.getH(15),
                        paddingHorizontal: DesignConvert.getW(15),
                    }}
                    renderItem={this._renderItem}
                /> */}
                </LinearGradient>
            </View>
        )
    }
}

export const styles = StyleSheet.create({
    normalText: {
        color: "#333333",
        fontSize: DesignConvert.getF(16),
        fontWeight: "normal",
    },

    grayline: {
        width: DesignConvert.swidth,
        height: DesignConvert.getBorderWidth(1),
        backgroundColor: "#E4E3E7",
    },

    normalLayout: {
        width: DesignConvert.swidth,
        height: DesignConvert.getH(41),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: DesignConvert.getW(20),
        paddingRight: DesignConvert.getW(20),
    },

    grayButtonText: {
        color: "#1A1A1A",
        fontSize: DesignConvert.getF(13),
        fontWeight: "normal",
        alignSelf: "center",
    },

    grayButton: {
        height: DesignConvert.getH(26),
        borderRadius: DesignConvert.getW(13),
        backgroundColor: "#E4E3E7",
        paddingLeft: DesignConvert.getW(15),
        paddingRight: DesignConvert.getW(15),
    },

    container: {
        flex: 1,
        justifyContent: 'center'
    },
});