/**
 * 1V1骗钱
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from '../base/BaseView';
import {
    ic_report,
    ic_menu,
    ic_close,
    ic_add,
    ic_emoji,
    ic_photo,
    ic_gift,
} from "../../hardcode/skin_imgs/chatroom";
import ChatRoomUserCard from "./item/ChatRoomUserCard";
import LinearGradient from "react-native-linear-gradient";
import KeyboardAvoidingViewExt from "../base/KeyboardAvoidingViewExt";
import ChatRoomInputView from "./item/ChatRoomInputView";
import ChatRoomChatHistoryList from "./item/ChatRoomChatHistoryList";
import RoomInfoCache from "../../cache/RoomInfoCache";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_PHONE_UPDATE, EVT_LOGIC_PHONE_STOP } from "../../hardcode/HLogicEvent";
import UserInfoCache from "../../cache/UserInfoCache";

class _AttendtionItem extends PureComponent {
    _onPress = () => {
        this.props.callBack && this.props.callBack();
    }

    _getAttendText = () => {
        let minute = "一";
        switch (this.props.ltMinute) {
            case 1:
                minute = "一";
                break
            case 2:
                minute = "二";
                break
            case 3:
                minute = "三";
                break
        }
        return this.props.isCall ? `您的余额不足${minute}分钟，请及时充值避免破坏您的兴致哦～` : "对方余额不足，温馨提醒对方续费哦～";
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(325),
                    paddingVertical: DesignConvert.getH(8),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={["#F85868", "#FF88EE"]}
                    style={{
                        paddingHorizontal: DesignConvert.getW(14),
                        paddingVertical: DesignConvert.getH(9),
                        borderRadius: DesignConvert.getW(8),
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                    <Text
                        style={{
                            maxWidth: DesignConvert.getW(260),
                            color: "white",
                            fontSize: DesignConvert.getF(13),
                        }}>{this._getAttendText()}</Text>
                </LinearGradient>

                <TouchableOpacity
                    onPress={this._onPress}
                    style={{
                        width: DesignConvert.getW(26),
                        height: DesignConvert.getH(26),
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}>
                    <Image
                        source={ic_close()}
                        style={{
                            width: DesignConvert.getW(14),
                            height: DesignConvert.getH(14),
                        }}></Image>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class ChatRoomView extends BaseView {
    constructor(props) {
        super(props);

        this._micInfo = require("../../model/announcer/ChatRoomModel").getPeerMicInfo();
        this._userId = this._micInfo && this._micInfo.base ? this._micInfo.base.userId : "";
        // console.log("------------------", "陪聊", RoomInfoCache.roomData)
        //对方是否余额不足
        this._ltMinute = RoomInfoCache.roomData && RoomInfoCache.roomData.chatRoomData && RoomInfoCache.roomData.chatRoomData.ltMinute ? RoomInfoCache.roomData.chatRoomData.ltMinute : 11;
        this._isNoMoney = this._ltMinute < 4;
    }

    //重写返回键
    onHardwareBackPress() {
        if (this.inputViewRef && this.inputViewRef._onEmptyPress()) {
            return
        }
        this.popSelf()
    }

    onResume(prevView) {
        //判定是否上一个界面是否是1v1聊天室,如果是就关闭自己
        if (require('../../router/level4_router').isChatEvaluationDialog(prevView)) {
            this.popSelf();
        }
    }

    componentDidMount() {
        super.componentDidMount()
        ModelEvent.addEvent(null, EVT_LOGIC_PHONE_UPDATE, this._updateData)
        ModelEvent.addEvent(null, EVT_LOGIC_PHONE_STOP, this._onKick)
        if (require("../../model/room/RoomModel").getUserSeatPosition(UserInfoCache.userId) == -1) {
            require("../../router/level2_router").showInfoDialog("您不在麦上哦，亲！请联系运营哦，给您造成不便请原谅哦~")
        }

        require("../../model/announcer/ChatRoomModel").startCheckChatRoomTimer()
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        ModelEvent.removeEvent(null, EVT_LOGIC_PHONE_UPDATE, this._updateData)
        ModelEvent.removeEvent(null, EVT_LOGIC_PHONE_STOP, this._onKick)
    }

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
     * @param {*} data 
     */
    _updateData = data => {
        if (data.ltMinute < 4) {
            this._isNoMoney = true;
            this._ltMinute = data.ltMinute;
        }
        this.forceUpdate();
    }

    _getInputView = ref => {
        this.inputViewRef = ref;
    }

    //举报
    _reportPress = () => {
        require("../../router/level3_router").showReportDialog(this._userId, 6);
    }

    _onMenuPress = () => {
        require("../../router/level4_router").showChatRoomExitDialog(this._onMinifyPress);
    }

    //TODO:最小化
    _onMinifyPress = () => {
        this.popSelf();
    }

    //广播过来退出直播间
    _onKick = data => {
        this.popSelf();
    }


    //隐藏没钱警告
    _hideAttendtionItem = () => {
        this._isNoMoney = false;
        this.forceUpdate();
    }

    _renderTitleBar = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    marginTop: DesignConvert.statusBarHeight,
                }}>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(44),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>

                    <TouchableOpacity
                        onPress={this._reportPress}
                        style={{
                            height: DesignConvert.getH(44),
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
                            }}></Image>

                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(13),
                            }}>举报</Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            flex: 1,
                        }}></View>

                    <TouchableOpacity
                        onPress={this._onMenuPress}
                        style={{
                            height: DesignConvert.getH(44),
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Image
                            source={ic_menu()}
                            style={{
                                width: DesignConvert.getW(20),
                                height: DesignConvert.getH(20),
                                marginRight: DesignConvert.getW(15),
                            }}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        return (
            <KeyboardAvoidingViewExt
                behavior="height"
                style={{
                    flex: 1,
                    backgroundColor: "#2E0034",
                }}>

                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                    }}>
                    {this._renderTitleBar()}


                    {/* 通话信息 */}
                    <ChatRoomUserCard />

                    {/* 没钱警告 */}
                    {this._isNoMoney ? (
                        <_AttendtionItem
                            ltMinute={this._ltMinute}
                            callBack={this._hideAttendtionItem}
                            isCall={RoomInfoCache.isCall} />
                    ) : null}

                    <ChatRoomChatHistoryList />

                    {/* 输入框 */}
                    <ChatRoomInputView
                        ref={this._getInputView} />
                </View>
            </KeyboardAvoidingViewExt>
        )
    }
}