/**
 * 我的 -> 钱包
 */

'use strict';

import React, { PureComponent, Component } from "react";
import DesignConvert from "../../utils/DesignConvert";
import { View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Platform } from "react-native";
import StringUtil from "../../utils/StringUtil";

export function Btn(props) {

    const { onPress, position, txt, fontColor } = props


    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: DesignConvert.getW(45),
                height: DesignConvert.getH(21),
                borderRadius: DesignConvert.getW(22),

                borderWidth: DesignConvert.getW(1),
                borderColor: '#5F1271',
                backgroundColor: '#FFFFFF',

                alignItems: 'center',
                justifyContent: 'center',

                position: 'absolute',
                ...position
            }}
        >
            <Text
                style={{
                    color: fontColor,
                    fontSize: DesignConvert.getF(12)
                }}
            >{txt}</Text>
        </TouchableOpacity>
    )


}

export class MyWalletItem extends PureComponent {
    constructor(props) {
        super(props);

        this._accountMoney = 123456;
        this._giftEnable = false;

        this._hadSendGoldPermiss = false;

    }

    componentDidMount() {
        this._initData()
    }

    _initData = () => {
        require("../../model/mine/MyWalletModel").default.getMoneyGivingList()
            .then(data => {
                if (this._giftEnable == data) {
                    return;
                }
                this._giftEnable = data;
                this.forceUpdate();
            })

        require("../../model/BagModel").default.getWallet()
            .then(data => {
                this._accountMoney = StringUtil.formatMoney(data.goldShell, 0);
                this.forceUpdate();
            })

    }

    _onGiftPress = () => {
        require('../../model/mine/MyWalletModel').default.onWalletSendGoldShell()
    }

    _onRecharge = () => {
        require('../../router/level2_router').showRechargeView()
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
                        source={require('../../hardcode/skin_imgs/mine').mine_wallet_bg()}
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
                            left: DesignConvert.getW(121),
                            top: DesignConvert.getH(30.5),

                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14)
                        }}
                    >钻石</Text>
                    <Text
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(20),
                            top: DesignConvert.getH(34),


                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),

                            fontWeight: 'bold'
                        }}
                    >{this._accountMoney}</Text>
                    {this._giftEnable && <Btn
                        onPress={this._onGiftPress}
                        position={{
                            top: DesignConvert.getH(64),
                            right: DesignConvert.getW(82)
                        }}
                        txt="转赠"
                        fontColor="#5F1271"
                    />}
                    <Btn
                        onPress={this._onRecharge}
                        position={{
                            top: DesignConvert.getH(64),
                            right: DesignConvert.getW(20)
                        }}
                        txt="充值"
                        fontColor="#C948FF"
                    />
                </View>

            </View>
        )
    }

}

