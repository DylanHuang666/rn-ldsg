
/**
 *  房间 -> 消息列表
 */
'use strict';

import React, { PureComponent } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, Modal, } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import StatusBarView from "../base/StatusBarView";
import BaseView from "../base/BaseView";
import IMList from "../main/message/IMList";

export default class RoomConversationView extends BaseView {

    //给会话Item的回调方法
    _onItemPress = (id, nickName, isGroup) => {
        require('../../router/level3_router').showRoomChatView(id, nickName, isGroup);
    }

    // componentDidMount() {

    // }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}>

                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        height: DesignConvert.getH(272),
                        backgroundColor: "rgba(0, 0, 0, 0)",
                    }}></TouchableOpacity>

                <View
                    style={{
                        width: DesignConvert.getW(345),
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        borderRadius: DesignConvert.getW(10),
                        justifyContent: "center",
                        alignItems: "center",

                        alignSelf: 'center',

                        marginBottom:DesignConvert.getH(15)+DesignConvert.addIpxBottomHeight()
                    }}>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(10),
                            marginBottom: DesignConvert.getH(5),
                            color: "#333333",
                            fontSize: DesignConvert.getF(16),
                            alignItems: 'center',
                            fontWeight: '800',
                        }}>消息列表</Text>

                    <IMList
                        onItemPress={this._onItemPress} />
                </View>
            </View>
        )
    }
}