'use strict';

import React, { PureComponent } from "react";
import { FlatList, View, Text } from "react-native";
import { EVT_UPDATE_ROOM_PUBLIC_SCREEN } from "../../../hardcode/HGlobalEvent";
import ModelEvent from "../../../utils/ModelEvent";
import DesignConvert from "../../../utils/DesignConvert";
import _ChatMessageItem from "./chat/_ChatMessageItem";
import { getInfos, getUpdateTimes, TYPE_IM_PHOTO, TYPE_IM_TEXT, TYPE_GIFT } from "../../../cache/RoomPublicScreenCache";
import _ChatGiftItem from "./chat/_ChatGiftItem";


export default class ChatRoomChatHistoryList extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, this._onUpdateEvent);
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, this._onUpdateEvent);
    }

    _onUpdateEvent = () => {
        this.forceUpdate();
    }

    _onDelayScollEnd = () => {

        setTimeout(() => {
            if (!this._refList) {
                return;
            }
            const data = getInfos();
            if (!data || data.length <= 0) {
                return;
            }

            this._refList.scrollToEnd({ animated: false });
        }, 500)
    }

    _renderItem = ({ item }) => {
        // console.log('看一看', item)
        switch (item.type) {
            case TYPE_IM_TEXT:
                return (
                    <_ChatMessageItem
                        data={item.data}
                        type={TYPE_IM_TEXT}
                    />
                )

            case TYPE_IM_PHOTO:
                return (
                    <_ChatMessageItem
                        data={item.data}
                        type={TYPE_IM_PHOTO}
                    />
                )
            case TYPE_GIFT:
                return (
                    <_ChatGiftItem
                        data={item.vo}
                        type={TYPE_IM_PHOTO}
                    />
                )
            default:
                return null;
        }

    };

    render() {
        const data = getInfos();
        const extraData = getUpdateTimes();
        this._onDelayScollEnd();

        return (
            <FlatList
                ref={ref => this._refList = ref}
                renderItem={this._renderItem}
                data={data}
                showsVerticalScrollIndicator={false}
                style={{
                    width: DesignConvert.swidth,
                    flex: 1,
                }}
                extraData={extraData}
            ></FlatList>
        )
    }
}