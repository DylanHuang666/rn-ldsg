/**
 * 我的 -> 钱包+收益
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import { View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Platform } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import BackTitleView from '../base/BackTitleView';
import { MyWalletItem } from "./MyWalletAndBnenfitItem";
import { MyBenfitItem } from "./MyBenfitItem";
import { flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord, giftGoldRecord, rechargeRecord, receivedGoldRecord, phoneLive } from '../anchorincome/RecordView';

function GoBtn(props) {

    const { bgc, txt, onPress } = props


    return (
        <TouchableOpacity
            onPress={onPress}
            style={{

                width: DesignConvert.getW(342),
                height: DesignConvert.getH(47),
                borderRadius: DesignConvert.getW(10),

                backgroundColor: bgc,
                borderWidth: DesignConvert.getW(1.5),
                borderColor: '#5F1271',

                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: DesignConvert.getW(15),

                alignSelf: 'center'

            }}
        >
            <Text
                style={{
                    color: '#101010',
                    fontSize: DesignConvert.getF(14)
                }}
            >{txt}</Text>
            <Image
                source={require('../../hardcode/skin_imgs/mine').mine_arrow_right()}
                style={{
                    width: DesignConvert.getW(8),
                    height: DesignConvert.getH(14)
                }}
            />
        </TouchableOpacity>
    )

}


export default class MyWalletAndBenefitView extends BaseView {

    _onBenefitFlow = () => {
        require('../../router/level2_router').showNormalTabRecordView(rechargeRecord)
    }
    _chargeFlow = () => {
        require('../../router/level2_router').showOtherflowRecordView(rechargeRecord)

    }
    render() {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <BackTitleView
                    titleText="我的钱包"
                    onBack={this.popSelf}
                />
                <Text
                    style={{
                        marginTop: DesignConvert.getH(20),
                        marginBottom: DesignConvert.getH(10),
                        marginLeft: DesignConvert.getW(20),

                        color: '#101010',
                        fontSize: DesignConvert.getF(17),

                        fontWeight: 'bold',


                    }}
                >我的余额</Text>

                <MyWalletItem />

                <Text
                    style={{
                        marginTop: DesignConvert.getH(20),
                        marginBottom: DesignConvert.getH(10),
                        marginLeft: DesignConvert.getW(20),

                        color: '#101010',
                        fontSize: DesignConvert.getF(17),

                        fontWeight: 'bold',


                    }}
                >我的收益</Text>
                <MyBenfitItem />
                <Text
                    style={{
                        marginTop: DesignConvert.getH(20),
                        marginBottom: DesignConvert.getH(10),
                        marginLeft: DesignConvert.getW(20),

                        color: '#101010',
                        fontSize: DesignConvert.getF(17),

                        fontWeight: 'bold',


                    }}
                >我的账单</Text>
                <GoBtn
                    onPress={this._chargeFlow}
                    txt="充值明细"
                    bgc="#FFF0FA"
                />
                <View
                    style={{
                        height: DesignConvert.getH(20)
                    }}
                />
                <GoBtn
                    onPress={this._onBenefitFlow}
                    txt="收益明细"
                    bgc="#F9E2FF"
                />
            </View>
        )
    }

}
