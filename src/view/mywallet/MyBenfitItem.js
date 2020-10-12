'use strict';

import React, { PureComponent, Component } from "react";
import DesignConvert from "../../utils/DesignConvert";
import { View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Platform } from "react-native";
import StringUtil from "../../utils/StringUtil";
import { Btn } from './MyWalletAndBnenfitItem'

export class MyBenfitItem extends PureComponent {
    constructor(props) {
        super(props);

        this._weekEarning = 0;
        this._accountMoney = 0;
        this._balanceMoney = 0;

        this._minCatchValue = 100;
        this._maxCatchValue = 10000;



    }

    componentDidMount() {
        this._initData()
    }

    _initData = () => {
        require('../../model/anchorincome/AnchorIncomeModel').default.getIncomeData()
            .then(data => {
                this._weekEarning = Math.floor(data.weekLiveEarn) / 100;
                this._accountMoney = Math.floor(data.balance) / 100;
                this._dayLiveRecv = Math.floor(data.dayLiveRecv) / 100;
                this._dayLiveEarn = Math.floor(data.dayLiveEarn) / 100;
                this._totalLiveEarn = Math.floor(data.totalLiveEarn) / 100;
                this._balanceMoney = Math.floor(data.balance) / 100;
                this.forceUpdate();

            });
        require('../../model/anchorincome/AnchorIncomeModel').default.getPublicConfigTableData()
            .then(data => {
                if (!data) {
                    return;
                }

                this._minCatchValue = data.minCatch;
                this._maxCatchValue = data.maxCatch;
                this.forceUpdate();
            });

        
    }

    _exchangePress = () => {
        require('../../model/anchorincome/AnchorIncomeModel').default.onClickExchange()
    }

    _withdrawPress = () => {
        require('../../model/anchorincome/AnchorIncomeModel').default.toWithdraw(this._accountMoney, this._minCatchValue, this._maxCatchValue);
    }
    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,

                    alignItems: 'center'
                }}
            >
                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(120),


                    }}
                >
                    <Image
                        source={require('../../hardcode/skin_imgs/mine').mine_benefit_bg()}
                        style={{
                            position: 'absolute',

                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(120),
                        }}
                    />
                    <Image
                        source={require('../../hardcode/skin_imgs/mine').mine_diamond()}
                        style={{
                            position: 'absolute',
                            left: DesignConvert.getW(40),
                            top: DesignConvert.getH(30.5),

                            width: DesignConvert.getW(60),
                            height: DesignConvert.getH(60)
                        }}
                    />
                    <Text
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(145),
                            top: DesignConvert.getH(21),

                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14)
                        }}
                    >我的总收益：</Text>
                    <Text
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(145),
                            top: DesignConvert.getH(46),

                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14)
                        }}
                    >可提现收益：</Text>
                    <Text
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(20),
                            top: DesignConvert.getH(21),

                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14)
                        }}
                    >{StringUtil.formatMoney(this._accountMoney)}</Text>
                    <Text
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(20),
                            top: DesignConvert.getH(46),

                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14)
                        }}
                    >{StringUtil.formatMoney(this._balanceMoney)}</Text>

                    <Btn
                        onPress={this._withdrawPress}
                        position={{
                            top: DesignConvert.getH(74),
                            right: DesignConvert.getW(82)
                        }}
                        txt="提现"
                        fontColor="#FFA1D5"
                    />
                    <Btn
                        onPress={this._exchangePress}
                        position={{
                            top: DesignConvert.getH(74),
                            right: DesignConvert.getW(20)
                        }}
                        txt="兑换"
                        fontColor="#FF9B92"
                    />
                </View>

            </View>
        )
    }

}