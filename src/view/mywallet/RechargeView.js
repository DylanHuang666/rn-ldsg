/**
 * 我的 -> 钱包 -> 充值
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Platform } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import { EVT_UPDATE_WALLET } from "../../hardcode/HLogicEvent";
import ModelEvent from "../../utils/ModelEvent";
import StringUtil from "../../utils/StringUtil";
import BackTitleView from "../base/BackTitleView";
import { SelectedChargeList, WalletSubmitButton } from "./MyWalletView";
import { ic_alipay } from "../../hardcode/skin_imgs/mywallet";


export default class RechargeView extends BaseView {

    constructor(props) {
        super(props);

        this._accountMoney = 123456;

        this._payType = true
    }

    componentDidMount() {
        super.componentDidMount();
        ModelEvent.addEvent(null, EVT_UPDATE_WALLET, this._update);
        this._initData();
    }

    _Pay = (payType) => {
        require("../../model/pay/PayModel").default.toPay(payType, this.selectedRecharge);
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_WALLET, this._update);
        super.componentWillUnmount();
    }

    _initData = () => {
        require("../../model/BagModel").default.getWallet()
            .then(data => {
                this._accountMoney = StringUtil.formatMoney(data.goldShell)
                this.forceUpdate();
            })

    }

    _onSubmitPress = () => {
        // require("../../router/level3_router").showPaySelectedDialog(StringUtil.formatMoney(this.selectedRecharge.price), 1);
        require("../../model/pay/PayModel").default.toPay(1, this.selectedRecharge);
    }

    onResume() {
        this._initData();
    }

    _selectedItem = (item) => {
        this.selectedRecharge = item;
        this.forceUpdate();
    }

    _onAliPayPress = () => {
        this._payType = !this._payType;
        this.forceUpdate()
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#ffffff'
                }}
            >
                <BackTitleView
                    titleText="充值"
                    onBack={this.popSelf}
                />
                <Text
                    style={{
                        alignSelf: 'center',
                        marginTop: DesignConvert.getH(10),

                        color: '#121212',

                        fontSize: DesignConvert.getF(17),
                        fontWeight: 'bold'
                    }}
                >钻石</Text>
                <View
                    style={{
                        alignSelf: 'center',
                        marginTop: DesignConvert.getH(10),

                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        source={require('../../hardcode/skin_imgs/record').record_coin()}
                        style={{
                            width: DesignConvert.getW(24),
                            height: DesignConvert.getH(24),
                            marginRight: DesignConvert.getW(5),
                        }} />
                    <Text
                        style={{
                            alignSelf: 'center',

                            color: '#121212',

                            fontSize: DesignConvert.getF(17),
                            fontWeight: 'bold'
                        }}
                    >{this._accountMoney}</Text>
                </View>
                <Text
                    style={{
                        marginTop: DesignConvert.getH(20),
                        marginLeft: DesignConvert.getW(15),

                        color: '#949494',
                        fontSize: DesignConvert.getF(14),

                    }}
                >钻石充值</Text>
                <SelectedChargeList
                    selectedItem={this._selectedItem}
                />
                <TouchableOpacity
                    onPress={this._onAliPayPress}
                    style={{
                        width: DesignConvert.getW(335),
                        height: DesignConvert.getH(50),

                        alignSelf: 'center',

                        alignItems: "center",
                        flexDirection: "row",

                    }}>
                    <Image
                        source={ic_alipay()}
                        style={{
                            width: DesignConvert.getW(24),
                            height: DesignConvert.getH(24),

                            marginLeft: DesignConvert.getW(10)
                        }}></Image>

                    <Text
                        style={{
                            marginLeft: DesignConvert.getW(10),

                            fontSize: DesignConvert.getF(14),
                            color: '#121212',
                        }}>支付宝</Text>
                    {this._payType && <Image
                        source={require('../../hardcode/skin_imgs/mywallet').pay_select_ic()}
                        style={{
                            position: 'absolute',
                            right: 0,

                            width: DesignConvert.getW(22),
                            height: DesignConvert.getH(22),

                            resizeMode: 'contain'
                        }}
                    />}
                </TouchableOpacity>
                <WalletSubmitButton
                    enable={this._payType}
                    btnText={this.selectedRecharge && this.selectedRecharge.price ? `支付${StringUtil.formatMoney(this.selectedRecharge.price)}元` : "确认充值"}
                    onPress={this._onSubmitPress}
                    style={{
                        marginTop: DesignConvert.getH(20),
                        marginBottom: DesignConvert.getH(20) + DesignConvert.addIpxBottomHeight(),
                    }}></WalletSubmitButton>
            </View >
        )
    }

}