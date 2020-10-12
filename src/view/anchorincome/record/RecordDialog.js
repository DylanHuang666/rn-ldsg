/**
 * InfoDialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import Config from '../../../configs/Config';
import { income_diaog } from "../../../hardcode/skin_imgs/anchorincome";
import { flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord, giftGoldRecord, rechargeRecord } from '../RecordView';

export default class RecordDialog extends BaseView {
    constructor(props) {
        super(props);
    }

    /**
     * 四个记录
     */
    _flowRecord = () => {
        this.popSelf();
        require("../../../router/level3_router").showRecordView(flowRecord);
    }
    _withdrawalsRecord = () => {
        this.popSelf();
        require("../../../router/level3_router").showRecordView(withdrawRecord);
    }
    _exchangeRecord = () => {
        this.popSelf();
        require("../../../router/level3_router").showRecordView(exchangeRecord);
    }
    _liveFlowRecord = () => {
        this.popSelf();
        require("../../../router/level3_router").showRecordView(liveFlowRecord);
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
                <ImageBackground
                    source={income_diaog()}
                    style={{
                        width: DesignConvert.getW(129),
                        height: DesignConvert.getH(150),
                        position: "absolute",
                        top: DesignConvert.getH(212),
                        right: DesignConvert.getW(36),
                    }}>
                    <TouchableOpacity
                        onPress={this._flowRecord}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(13),
                                color: '#212121',
                                fontWeight: "normal",
                            }}>流水记录</Text>
                        <View
                            style={{
                                width: DesignConvert.getW(91),
                                height: DesignConvert.getH(1),
                                backgroundColor: '#F1F1F1',
                                position: "absolute",
                                bottom: 0,
                                left: DesignConvert.getW(15),
                            }}></View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._withdrawalsRecord}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(13),
                                color: '#212121',
                                fontWeight: "normal",
                            }}>提现记录</Text>
                        <View
                            style={{
                                width: DesignConvert.getW(91),
                                height: DesignConvert.getH(1),
                                backgroundColor: '#F1F1F1',
                                position: "absolute",
                                bottom: 0,
                                left: DesignConvert.getW(15),
                            }}></View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._exchangeRecord}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(13),
                                color: '#212121',
                                fontWeight: "normal",
                            }}>兑换记录</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}
