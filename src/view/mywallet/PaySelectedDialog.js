/**
 * PaySelectedDialog
 * 支付选择界面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { income_diaog } from "../../hardcode/skin_imgs/anchorincome";
import { ic_alipay, ic_pay_wechat, ic_pay_bank } from "../../hardcode/skin_imgs/mywallet";

export default class PaySelectedDialog extends BaseView {
    constructor(props) {
        super(props);

        this._payType = 0;
        this._payMoney = this.props.params.payMoney;
    }

    _onAliPayPress = () => {
        this._payType = 1;
        this.props.params.selectedPayTypeCallBack && this.props.params.selectedPayTypeCallBack(this._payType);
        this.popSelf();
    }

    _onWetChatPress = () => {
        this._payType = 2;
        this.props.params.selectedPayTypeCallBack && this.props.params.selectedPayTypeCallBack(this._payType);
        this.popSelf();
    }

    _onBankPress = () => {
        this._payType = 3;
        this.props.params.selectedPayTypeCallBack && this.props.params.selectedPayTypeCallBack(this._payType);
        this.popSelf();
    }

    _initData = () => {
        require("../../model/mine/MyWalletModel").default.getPayType()
            .then(data => {
                [this._alipay, this._wechat, this._union] = data;
                if (this._alipay) {
                    this._payType = 1;
                } else if (this._wechat) {
                    this._payType = 2;
                } else if (this._union) {
                    this._payType = 3;
                }
                this.forceUpdate();
            })
    }

    componentDidMount() {
        super.componentDidMount();
        this._initData();
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.popSelf}
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
            >
                <View
                    style={{
                        width: DesignConvert.getW(346),
                        backgroundColor: "white",
                        borderRadius: DesignConvert.getW(8),
                        position: "absolute",
                        bottom: DesignConvert.getH(20) + DesignConvert.addIpxBottomHeight(),
                        left: DesignConvert.getW(15),
                    }}>

                    <View
                        style={{
                            width: DesignConvert.getW(346),
                            height: DesignConvert.getH(50),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(12),
                                color: '#8E8E8E',
                                fontWeight: "normal",
                            }}>{`请选择支付方式，需支付${this._payMoney}元`}</Text>

                        <View
                            style={{
                                backgroundColor: "#F1F1F1",
                                height: DesignConvert.getH(1),
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                            }}></View>
                    </View>

                    {this._wechat ? (
                        <TouchableOpacity
                            onPress={this._onWetChatPress}
                            style={{
                                width: DesignConvert.getW(346),
                                height: DesignConvert.getH(50),
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                            }}>
                            <Image
                                source={ic_pay_wechat()}
                                style={{
                                    width: DesignConvert.getW(20),
                                    height: DesignConvert.getH(20),
                                    marginRight: DesignConvert.getW(10),
                                }}></Image>

                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(14),
                                    color: '#212121',
                                    fontWeight: "normal",
                                }}>微信支付</Text>

                            <View
                                style={{
                                    backgroundColor: "#F1F1F1",
                                    width: DesignConvert.getW(250),
                                    height: DesignConvert.getH(1),
                                    position: "absolute",
                                    bottom: 0,
                                    left: DesignConvert.getW(48),
                                }}></View>
                        </TouchableOpacity>
                    ) : null}

                    {this._alipay ? (
                        <TouchableOpacity
                            onPress={this._onAliPayPress}
                            style={{
                                width: DesignConvert.getW(346),
                                height: DesignConvert.getH(50),
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                            }}>
                            <Image
                                source={ic_alipay()}
                                style={{
                                    width: DesignConvert.getW(20),
                                    height: DesignConvert.getH(20),
                                    marginRight: DesignConvert.getW(10),
                                }}></Image>

                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(14),
                                    color: '#212121',
                                    fontWeight: "normal",
                                }}>支付宝支付</Text>

                            <View
                                style={{
                                    backgroundColor: "#F1F1F1",
                                    width: DesignConvert.getW(250),
                                    height: DesignConvert.getH(1),
                                    position: "absolute",
                                    bottom: 0,
                                    left: DesignConvert.getW(48),
                                }}></View>
                        </TouchableOpacity>
                    ) : null}

                    {this._union ? (
                        <TouchableOpacity
                            onPress={this._onBankPress}
                            style={{
                                width: DesignConvert.getW(346),
                                height: DesignConvert.getH(50),
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                            }}>
                            <Image
                                source={ic_pay_bank()}
                                style={{
                                    width: DesignConvert.getW(20),
                                    height: DesignConvert.getH(20),
                                    marginRight: DesignConvert.getW(10),
                                }}></Image>

                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(14),
                                    color: '#212121',
                                    fontWeight: "normal",
                                }}>银联支付</Text>

                            <View
                                style={{
                                    backgroundColor: "#F1F1F1",
                                    width: DesignConvert.getW(250),
                                    height: DesignConvert.getH(1),
                                    position: "absolute",
                                    bottom: 0,
                                    left: DesignConvert.getW(48),
                                }}></View>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </TouchableOpacity>
        )
    }
}
