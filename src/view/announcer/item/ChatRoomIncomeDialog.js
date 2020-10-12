/**
 * 陪聊价格dialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import Config from '../../../configs/Config';
import { THEME_COLOR } from '../../../styles/index';
import { ic_report } from "../../../hardcode/skin_imgs/chatroom";
import { ic_chacha, star_full, star_empty } from "../../../hardcode/skin_imgs/announcer";
import StringUtil from "../../../utils/StringUtil";
import moment from "moment"
import { duration2Time } from "../../../utils/CDTick";

export default class ChatRoomIncomeDialog extends BaseView {
    constructor(props) {
        super(props);
        /**
         * //陪聊广播
        //status 0:发起呼叫 1:主播接听 2:主播拒绝 3:用户取消呼叫 4:呼叫超时
        //       5:一方退出陪聊 6:用户时长到(余额不足)退出陪聊 9:陪聊房内每分钟信息广播
        message SkillChatBroadcast {
            required int32 status = 1;//状态	
            optional string callerId = 2;//呼叫人Id
            optional string anchorId = 3;//主播Id
            optional UserResult.UserBase caller = 4;//呼叫人信息
            optional UserResult.UserBase anchor = 5;//主播信息	
            optional string roomId = 6;//陪聊房Id
            optional int32 chatTime = 7;//陪聊时长(秒)
            optional int32 totalMoney = 8;//主播分成前收入(分)
            optional int32 anchorMoney = 9;//主播分成后收入(分)
            optional int32 ltMinute = 10;//呼叫人余额不足x分钟
        }
         */
        this._data = this.props.params.data || {anchorMoney: 5432, chatTime: 61};
    }

    //举报
    _reportPress = () => {
        require("../../../router/level3_router").showReportDialog(this._data.callerId, 6);
    }


    _renderTitleBar = () => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(270),
                    height: DesignConvert.getH(40),
                    flexDirection: "row",
                    alignItems: "center",
                }}>

                <TouchableOpacity
                    onPress={this._reportPress}
                    style={{
                        height: DesignConvert.getH(40),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        source={ic_report()}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(18),
                            marginLeft: DesignConvert.getW(15),
                            marginRight: DesignConvert.getW(6),
                            tintColor: "#333333",
                        }}></Image>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                    }}></View>

                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        height: DesignConvert.getH(44),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        resizeMode="contain"
                        source={ic_chacha()}
                        style={{
                            width: DesignConvert.getW(15),
                            height: DesignConvert.getH(15),
                            marginRight: DesignConvert.getW(15),
                            tintColor: "#333333",
                        }}></Image>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        return (
            <TouchableOpacity
                onPress={this.popSelf}
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        width: DesignConvert.getW(270),
                        height: DesignConvert.getH(150),
                        borderRadius: DesignConvert.getW(15),
                        backgroundColor: "white",
                        alignItems: "center",
                    }}
                >

                    {this._renderTitleBar()}

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(20),
                            color: "#333333",
                            fontWeight: "bold",
                        }}>通话结束</Text>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(6),
                            fontSize: DesignConvert.getF(16),
                            color: "#333333",
                            fontWeight: "bold",
                        }}>{`${duration2Time(this._data.chatTime)}`}</Text>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(15),
                            fontSize: DesignConvert.getF(13),
                            color: "#333333",
                        }}>{`预计收入：${StringUtil.formatMoney(Math.floor(this._data.anchorMoney) / 100)}元`}</Text>

                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}
