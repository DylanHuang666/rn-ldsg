/**
 * 我的收益
 */

'use strict';

import React, { PureComponent } from "react";
import BaseView from "../base/BaseView";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import ShouYiRecordList, { flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord } from "./ShouYiRecordList"
import { TitleBar } from "../anchorincome/ConvertView"
import { mine_tixian, mine_liushui, mine_zhibojianliushui, mine_duihuan, mine_shouyi_right, mine_shouyi_bottom, mine_peiliaoliushui } from '../../hardcode/skin_imgs/mine';
import { ThemeProvider } from "@react-navigation/native";
// import {flowRecord, liveFlowRecord, withdrawRecord } from "./RecordView";

class ItemTouch extends PureComponent {


    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={this.props.onPress}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',

                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(44),

                        backgroundColor: 'rgba(255, 255, 255, 0.16)',
                        borderTopLeftRadius: DesignConvert.getW(10),
                        borderTopRightRadius: DesignConvert.getW(10),
                        ... this.props.containerStyle,

                    }}
                >
                    <Image
                        source={this.props.source}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(20),
                            marginLeft: DesignConvert.getW(10),
                        }}
                    />
                    <Text
                        style={{

                            marginLeft: DesignConvert.getW(10),

                            fontSize: DesignConvert.getF(15),
                            color: '#FFFFFF',

                        }}
                    >
                        {this.props.title}
                    </Text>
                    <Image
                        source={this.props.rightSource ? this.props.rightSource : mine_shouyi_right()}
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(10),

                            width: DesignConvert.getW(18),
                            height: DesignConvert.getH(18),

                            resizeMode: 'contain',

                        }}
                    />
                </TouchableOpacity>
                {
                    this.props.statu ?
                        <ShouYiRecordList viewType={this.props.viewType} />
                        :
                        null
                }
            </View>
        )
    }
}

//收益页
export default class AnchorIncomeBill extends PureComponent {

    constructor(props) {
        super(props);

        this._showRecord = true;
        //显示提现记录
        this._showWithdrawalsRecord = false;
        //显示兑换记录
        this._showExchangeRecord = false;
        //显示礼物明细
        this._showFlowRecord = false;
        //显示直播间流水
        this._showLiveFlowRecord = false;

    }

    _onBackPress = () => {
        this.popSelf();
    }


    /**
     * 四个记录
     */
    _flowRecord = () => {

        // require("../../router/level3_router").showRecordView(require("./RecordView").flowRecord);
        this._showFlowRecord = !this._showFlowRecord;
        this._showRecord = !this._showRecord;

        this.forceUpdate();

    }

    _withdrawalsRecord = () => {
        // require("../../router/level3_router").showRecordView(require("./RecordView").withdrawRecord);
        this._showWithdrawalsRecord = !this._showWithdrawalsRecord;
        this._showRecord = !this._showRecord;
        this.forceUpdate();
    }

    _exchangeRecord = () => {
        // require("../../router/level3_router").showRecordView(require("./RecordView").exchangeRecord);
        this._showExchangeRecord = !this._showExchangeRecord;
        this._showRecord = !this._showRecord;
        this.forceUpdate();
    }

    _liveFlowRecord = () => {
        // require("../../router/level3_router").showRecordView(require("./RecordView").liveFlowRecord);
        this._showLiveFlowRecord = !this._showLiveFlowRecord;
        this._showRecord = !this._showRecord;
        this.forceUpdate();
    }

    // _chatFlowRecord = () => {
    //     require("../../router/level3_router").showRecordView(require("./RecordView").phoneLive);
    // }

    render() {

        const StatusBarView = require("../base/StatusBarView").default;

        return (

            <View
                style={{
                    width: DesignConvert.getW(345),
                    marginTop: DesignConvert.getH(25),
                }}
            >
                {
                    this._showRecord ?
                        <View>
                            <ItemTouch
                                onPress={this._withdrawalsRecord}
                                title="提现记录"
                                source={mine_tixian()}
                                containerStyle={{
                                    borderBottomRightRadius: DesignConvert.getW(10),
                                    borderBottomLeftRadius: DesignConvert.getW(10),
                                }} />
                            <ItemTouch
                                onPress={this._exchangeRecord}
                                title="兑换记录"
                                source={mine_duihuan()}
                                containerStyle={{
                                    marginTop: DesignConvert.getH(15),
                                    borderBottomRightRadius: DesignConvert.getW(10),
                                    borderBottomLeftRadius: DesignConvert.getW(10),
                                }}
                            />
                            <ItemTouch
                                onPress={this._flowRecord}
                                title="礼物明细"
                                source={mine_liushui()}
                                containerStyle={{
                                    marginTop: DesignConvert.getH(15),
                                    borderBottomRightRadius: DesignConvert.getW(10),
                                    borderBottomLeftRadius: DesignConvert.getW(10),
                                }}
                            />
                            <ItemTouch
                                onPress={this._liveFlowRecord}
                                title="直播间流水"
                                source={mine_zhibojianliushui()}
                                containerStyle={{
                                    marginTop: DesignConvert.getH(15),
                                    borderBottomRightRadius: DesignConvert.getW(10),
                                    borderBottomLeftRadius: DesignConvert.getW(10),
                                }}
                            />
                        </View>
                        :
                        null
                }

                {
                    this._showWithdrawalsRecord ?

                        <ItemTouch
                            onPress={this._withdrawalsRecord}
                            title="提现记录"
                            source={mine_tixian()}
                            rightSource={mine_shouyi_bottom()}
                            statu={true}
                            viewType={withdrawRecord}
                        />
                        :
                        null

                }
                {
                    this._showExchangeRecord ?
                        <ItemTouch
                            onPress={this._exchangeRecord}
                            title="兑换记录"
                            source={mine_duihuan()}
                            marginTop={DesignConvert.getH(15)}
                            rightSource={mine_shouyi_bottom()}
                            statu={true}
                            viewType={exchangeRecord}
                        />
                        :
                        null
                }

                {
                    this._showFlowRecord ?
                        <ItemTouch
                            onPress={this._flowRecord}
                            title="礼物明细"
                            source={mine_liushui()}
                            marginTop={DesignConvert.getH(15)}
                            rightSource={mine_shouyi_bottom()}
                            statu={true}
                            viewType={flowRecord}
                        />
                        :
                        null
                }
                {
                    this._showLiveFlowRecord ?
                        <ItemTouch
                            onPress={this._liveFlowRecord}
                            title="直播间流水"
                            source={mine_zhibojianliushui()}
                            marginTop={DesignConvert.getH(15)}
                            rightSource={mine_shouyi_bottom()}
                            statu={true}
                            viewType={liveFlowRecord}
                        />
                        :
                        null
                }






                {/* <TouchableOpacity
                    onPress={this._chatFlowRecord}
                    style={{
                       flexDirection: 'row',
                        alignItems: 'center',
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(44),
                        backgroundColor:'rgba(255, 255, 255, 0.16)',
                        borderRadius:DesignConvert.getW(10),
                         marginTop: DesignConvert.getH(15),
                    }}
                >
                    <Image
                        source={mine_peiliaoliushui()}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(20),
                            marginLeft: DesignConvert.getW(24),
                        }}
                    />
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(15),
                            color: '#FFF',
                            marginLeft: DesignConvert.getW(12),
                        }}
                    >
                        {'陪聊流水'}
                    </Text>
                    <Image
                        source={mine_shouyi_right()}
                        style={{
                            position: 'absolute',
                             right: DesignConvert.getW(10),
                            width: DesignConvert.getW(18),
                            height: DesignConvert.getH(18),
                            resizeMode: 'contain',
                          
                        }}
                    />
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(13),
                            color: '#9C9C9C',
                            position: 'absolute',
                            right: DesignConvert.getW(33)
                        }}
                    >
                        {'今日'}{require("../../utils/StringUtil").default.formatMoney(this.props.dayChatRec)}{'元'}
                    </Text>
                </TouchableOpacity> */}

            </View>
        )
    }
}