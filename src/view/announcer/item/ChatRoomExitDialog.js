/**
 * 陪聊退出dialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import Config from '../../../configs/Config';
import { THEME_COLOR } from '../../../styles/index';
import { ic_report, ic_close } from "../../../hardcode/skin_imgs/chatroom";
import { phone_minify, phone_exit } from "../../../hardcode/skin_imgs/announcer";
import RoomInfoCache from "../../../cache/RoomInfoCache";

export default class ChatRoomExitDialog extends BaseView {
    constructor(props) {
        super(props);

        this._userId = this._micInfo && this._micInfo.base ? this._micInfo.base.userId : "";
        //防连点
        this._bExitClick = false;
    }

    //TODO:最小化
    _onMinifyPress = () => {
        this.popSelf();
        this.props.params.callBack && this.props.params.callBack();
    }

    _onExitPress = () => {
        if (this._bExitClick) {
            return
        }
        this._bExitClick = true;
        this.popSelf();
        require('../../../model/room/RoomModel').default.leave();
        this.props.params.callBack && this.props.params.callBack();

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
                    onPress={this._onMinifyPress}>
                    <Image
                        source={phone_minify()}
                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getH(100),
                        }}></Image>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={this._onExitPress}
                    style={{ marginTop: DesignConvert.getH(124) }}>
                    <Image
                        source={phone_exit()}
                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getH(100),
                        }}></Image>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}
