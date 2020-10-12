/**
 * 消息List -> 会话 -> 声优悬浮窗
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, ImageBackground } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import { chat_announcer_bg } from "../../../hardcode/skin_imgs/chat";
import { ANNOUNCER_UNIT } from "../../../hardcode/HGLobal";
import AnnouncerModel, { isAnnouncer } from "../../../model/main/AnnouncerModel";
import LinearGradient from "react-native-linear-gradient";
import { LINEARGRADIENT_COLOR } from "../../../styles";


export default class _announcerItem extends PureComponent {
    constructor(props) {
        super(props);

        this._userId = this.props.userId;
        this._isAnnouncer = false;
    }

    async componentDidMount() {
        await this._initData();
    }

    _initData = async () => {
        //判断是否声优
        let res = await isAnnouncer(this._userId);
        if (res === undefined) {
            this.forceUpdate();
            return
        }
        this._isAnnouncer = res;
        if (this._isAnnouncer) {
            this._AnnouncerData = await require("../../../model/main/AnnouncerModel").default.getUserSkillInfo(this._userId)
        }
        this.forceUpdate();
    }

    _onPress = () => {
        AnnouncerModel.callAnchor(this._userId, this._AnnouncerData.price);
    }

    render() {
        if (!this._isAnnouncer) {
            return <View></View>
        }
        return (
            <ImageBackground
                source={chat_announcer_bg()}
                style={{
                    width: DesignConvert.getW(365),
                    height: DesignConvert.getH(79),
                    alignSelf: "center",
                }}>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(13),
                        position: "absolute",
                        left: DesignConvert.getW(20),
                        top: DesignConvert.getH(21),
                    }}>
                    {"立即和TA语音热聊吧～"}
                </Text>

                <Text
                    style={{
                        color: "#999999",
                        fontSize: DesignConvert.getF(11),
                        position: "absolute",
                        left: DesignConvert.getW(20),
                        top: DesignConvert.getH(43),
                    }}>
                    {`${this._AnnouncerData.price}${ANNOUNCER_UNIT}`}
                </Text>

                <TouchableOpacity
                    onPress={this._onPress}
                    style={{
                        position: "absolute",
                        right: DesignConvert.getW(20),
                        top: DesignConvert.getH(25),
                    }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={LINEARGRADIENT_COLOR}
                        style={{
                            width: DesignConvert.getW(69),
                            height: DesignConvert.getH(30),
                            borderRadius: DesignConvert.getW(17),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>

                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(13),
                            }}>
                            {"马上呼叫"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}