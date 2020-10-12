/**
 * 聊天 -> 设置
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, SectionList, Image, ScrollView, StyleSheet } from "react-native";
import {ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import ToastUtil from "../../base/ToastUtil";
import BaseView from "../../base/BaseView";
import StatusBarView from "../../base/StatusBarView";
import BackTitleView from "../../base/BackTitleView";
import { EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST, } from "../../../hardcode/HLogicEvent";
import ModelEvent from "../../../utils/ModelEvent";

export default class ChatSettingView extends BaseView {
    constructor(props) {
        super(props);

        this._isGroup = this.props.params.isGroup;
        this._userId = this.props.params.userId;
        // console.log("ChatSettingView", this._userId)
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _showCleanChatDialog = () => {
        require("../../../router/level2_router").showNormInfoDialog("是否清除聊天记录", "确定", this._cleanChat)
    }

    _cleanChat = () => {
        require("../../../model/chat/ChatModel").deleteConversation(this._isGroup, this._userId)
            .then(data => {
                if(data) {
                    this.popSelf();
                    ModelEvent.dispatchEntity(null, EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST, null);
                    ToastUtil.showCenter("清除成功");
                }
            })
    }

    _onReportPress = () => {
        require("../../../router/level3_router").showReportDialog(this._userId, 4);
    }

    render() {
        return(
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}>
                
                <BackTitleView
                    titleText="会话设置"
                    onBack={this._onBackPress}
                />

                <View   style={styles.line}></View>
                
                <TouchableOpacity
                    onPress={this._showCleanChatDialog}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(52),
                        justifyContent: "center",
                        paddingLeft: DesignConvert.getW(20),
                    }}>
                    <Text>清除聊天记录</Text>
                </TouchableOpacity>

                <View   style={styles.line}></View>

                <TouchableOpacity
                    onPress={this._onReportPress}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(52),
                        justifyContent: "center",
                        paddingLeft: DesignConvert.getW(20),
                    }}>
                    <Text>举报</Text>
                </TouchableOpacity>

                <View   style={styles.line}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    line: {
        width: DesignConvert.swidth,
        height: DesignConvert.getBorderWidth(1),
        backgroundColor: "#F5F5F5",
    },
})