/**
 *  聊天 -> 快捷回复
 */
'use strict';

import React, { PureComponent } from "react";
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import LinearGradient from "react-native-linear-gradient";
import { ic_addreply, ic_manager } from "../../hardcode/skin_imgs/chat";
import FastReplyModel from "../../model/chat/FastReplyModel";
import { message } from "../../hardcode/skin_imgs/main";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_UPDATE_FAST_REPLY } from "../../hardcode/HGlobalEvent";
import DataCardModel from "../../model/chat/DataCardModel";

export default class FastReplyView extends PureComponent {

    constructor(props) {
        super(props)

        this._initData()
    }

    _initData = () => {
        FastReplyModel.getShortcutMessageList()
            .then(data => {
                this._data = data
                this.forceUpdate()
            })
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UPDATE_FAST_REPLY, this._initData)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_FAST_REPLY, this._initData)
    }


    _openAdd = () => {
        require('../../router/level3_router').showEditReply(1)
    }


    _openManage = () => {
        require('../../router/level2_router').showFastReplayManage(true)
    }

    _sendFastReply = (message) => {
        DataCardModel.judgeShouldSendDataCard(this.props.id)
        
        require("../../model/chat/ChatModel").sendC2CMessage(this.props.id, [[1, message]])

    }

    _renderItem = (item) => {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.swidth,
                    marginBottom: DesignConvert.getH(10),
                    alignItems: 'center',
                }}
                onPress={() => {
                    this._sendFastReply(item.item.message)
                }}
            >

                <Text
                    style={{
                        color: '#333333',
                        width: DesignConvert.getW(345),
                        fontSize: DesignConvert.getF(13),
                        margin: DesignConvert.getW(15)
                    }}
                >
                    {item.item.message}
                </Text>

                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(1),
                        backgroundColor: '#F0F0F0',
                    }}
                />

            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(235),
                    backgroundColor: '#FFFFFF'
                }}
            >

                <View
                    style={{
                        flex: 1,
                    }}
                >

                    <FlatList
                        style={{
                            flex: 1,
                        }}
                        data={this._data}
                        renderItem={this._renderItem}
                    />

                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={['#00000000', '#EDEDEDFF']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(5),
                        }}
                    />
                </View>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(50),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={this._openAdd}
                    >

                        <Image
                            source={ic_addreply()}
                            style={{
                                width: DesignConvert.getW(20),
                                height: DesignConvert.getH(20),
                                resizeMode: 'contain',
                            }}
                        />

                        <Text
                            style={{
                                color: '#333333',
                                fontSize: DesignConvert.getF(14),
                                marginStart: DesignConvert.getW(9),
                            }}
                        >
                            {`新增`}
                        </Text>



                    </TouchableOpacity>

                    <View
                        style={{
                            width: DesignConvert.getW(1),
                            height: DesignConvert.getH(20),
                            backgroundColor: '#F0F0F0',
                        }}
                    />

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={this._openManage}
                    >
                        <Image
                            source={ic_manager()}
                            style={{
                                width: DesignConvert.getW(20),
                                height: DesignConvert.getH(20),
                                resizeMode: 'contain',
                            }}
                        />

                        <Text
                            style={{
                                color: '#333333',
                                fontSize: DesignConvert.getF(14),
                                marginStart: DesignConvert.getW(9),
                            }}
                        >
                            {`管理`}
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
}