
/**
 *  房间 -> 消息列表 -> 聊天页
 */
'use strict';

import React, { PureComponent } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, Modal, KeyboardAvoidingView, } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import StatusBarView from "../base/StatusBarView";
import BaseView from "../base/BaseView";
import IMList from "../main/message/IMList";
import { BaseChatView } from "../chat/ChatVIew";
import KeyboardAvoidingViewExt from "../base/KeyboardAvoidingViewExt";
import { ic_back_black, ic_back_white } from "../../hardcode/skin_imgs/common";
import ToastUtil from "../base/ToastUtil";

export default class RoomChatView extends BaseView {

    render() {
        return (
            <View
                style={{
                   flex:1,


                }}>

                <TouchableOpacity
                    onPress={() => {
                        this.popSelf()
                    }}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(272)
                    }}></TouchableOpacity>


                <KeyboardAvoidingViewExt
                    behavior="height"
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


                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(52.5),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                position: 'absolute',
                                color: "#ffffff",
                                fontSize: DesignConvert.getF(16),
                            }}>{this.props.params.nickName}</Text>


                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                height: DesignConvert.getH(52.5),
                                left: DesignConvert.getW(15),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={this.popSelf}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(21),
                                    height: DesignConvert.getH(21),
                                    resizeMode: 'contain',
                                    marginStart: DesignConvert.getW(15),
                                }}
                                source={ic_back_white()}
                            />
                        </TouchableOpacity>
                    </View>

                    
                    <BaseChatView
                        id={this.props.params.id}
                        isGroup={this.props.params.isGroup}
                        isShowOverlay />
                </KeyboardAvoidingViewExt>

            </View>
        )
    }
}