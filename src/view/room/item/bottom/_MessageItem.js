'use strict';

import React, { PureComponent } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import { ic_message } from "../../../../hardcode/skin_imgs/room";
import { TX_IM_NEW_MSG, } from '../../../../hardcode/HNativeEvent';
import { EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, } from '../../../../hardcode/HLogicEvent';
import ModelEvent from '../../../../utils/ModelEvent';

export default class _MessageItem extends PureComponent {
    constructor(props) {
        super(props);
        this._bHasNews = false;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._getUnReadNum);//刷新已读
        ModelEvent.addEvent(null, TX_IM_NEW_MSG, this._getUnReadNum);//新消息
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._getUnReadNum);//刷新已读
        ModelEvent.removeEvent(null, TX_IM_NEW_MSG, this._getUnReadNum);//新消息
    }

    _getUnReadNum = () => {
        require("../../../../model/chat/ChatModel").getUnReadNum()
            .then(data => {
                this._bHasNews = data != 0;
                // console.log("MainView", "未读数", this._unReadNum)
                this.forceUpdate();
            });
    }

    _onPress = () => {
        require('../../../../router/level3_router').showRoomConversationView()
    }

    _renderNew() {

        if (!this._bHasNews) {
            return null;
        }

        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,

                    backgroundColor: '#FE6270',
                    width: DesignConvert.getW(8),
                    height: DesignConvert.getH(8),
                    borderRadius: DesignConvert.getW(8),
                }}
            />
        );
    }

    render() {

        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(8),
                }}
                onPress={this._onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(32),
                        height: DesignConvert.getH(32),
                        resizeMode: 'contain',
                    }}
                    source={ic_message()}
                />

                {this._renderNew()}
            </TouchableOpacity>
        )
    }
}