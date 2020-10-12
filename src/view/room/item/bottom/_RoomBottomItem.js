'use strict';

import React, { PureComponent } from "react";
import { View } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import _RoomHostBottomList from "./_RoomHostBottomList";
import _RoomAudienceBottomList from "./_RoomAudienceBottomList";
import RoomInfoCache from "../../../../cache/RoomInfoCache";
import _RoomOtherSeatBottomList from "./_RoomOtherSeatBottomList";
import _GiftItem from "./_GiftItem";
import _MessageItem from "./_MessageItem";
import _SpeakerItem from "./_SpeakerItem";
import _SeatItem from './_SeatItem';
import _EffectItem from './_EffectItem';
import _MicItem from "./_MicItem";
import _MicQueueItem from './_MicQueueItem';
import _HostMoreItem from './_HostMoreItem';
import _RoomTalkItem from './_RoomTalkItem';
import _RoomTypingItem from './_RoomTypingItem';
import ModelEvent from "../../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE, EVT_LOGIC_ROOM_JOB_CHANGE, EVT_LOGIC_REFRESH_ROOM_MORE } from '../../../../hardcode/HLogicEvent';
import _BigEmojiItem from "./_BigEmojiItem";


// 主播
// 功能箱、排麦、喇叭、麦克风、私信、礼物 √


// 观众 & 有权限
// 功能箱、排麦、喇叭、私信、礼物  √


// 观众 & 无权限
// 礼物动画、上麦、喇叭、私信、礼物 √


// 麦上用户 & 有权限
// 功能箱、排麦、喇叭、麦克风、私信、礼物  √


// 麦上用户 & 无权限
// 礼物动画、大表情、喇叭、麦克风、私信、礼物  √

// 功能箱：_HostMoreItem
// 礼物动画开关：_EffectItem
// 大表情：_BigEmojiItem
// 排麦：_MicQueueItem
// 喇叭：_SpeakerItem
// 麦克风：_MicItem
// 私信：_MessageItem
// 礼物：_GiftItem

export default class _RoomBottomItem extends PureComponent {

    constructor(props) {
        super(props);

        this._isInputState = false;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE, this._changeInputState);
        ModelEvent.addEvent(null, EVT_LOGIC_ROOM_JOB_CHANGE, this._refresh)

    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE, this._changeInputState);
        ModelEvent.removeEvent(null, EVT_LOGIC_ROOM_JOB_CHANGE, this._refresh)

    }

    _changeInputState = (bool) => {
        this._isInputState = bool;
        this.forceUpdate();
    }

    _refresh = () => {
        this.forceUpdate();
    }

    render() {
        const roomData = RoomInfoCache.roomData;
        if (!roomData) {
            return null;
        }

        if (this._isInputState) {
            return <_RoomTypingItem />
        }

        const RoomModel = require("../../../../model/room/RoomModel");

        this._componentKey = 0;

        // 三个共有的
        let views = [
            <_GiftItem key={this._componentKey++} />,
        ];

        //在主麦位
        if (RoomModel.isSelfOnMainSeat()) {
            views.push(
                <_HostMoreItem key={this._componentKey++} />,
                <_MicQueueItem key={this._componentKey++} />,
                <_MicItem key={this._componentKey++} />,
                <_MessageItem key={this._componentKey++} />,
            )
        }
        //在普通麦位
        else if (RoomModel.isSelfOnOtherSeat()) {
            if (RoomInfoCache.haveRoomPermiss) {
                //麦上用户 & 有权限
                views.push(
                    <_HostMoreItem key={this._componentKey++} />,
                    <_BigEmojiItem key={this._componentKey++} />,
                    <_MicQueueItem key={this._componentKey++} />,
                    <_MicItem key={this._componentKey++} />,
                    <_MessageItem key={this._componentKey++} />,
                )
            } else {
                //麦上用户 & 无权限
                views.push(
                    <_BigEmojiItem key={this._componentKey++} />,
                    <_EffectItem key={this._componentKey++} />,
                    <_MicItem key={this._componentKey++} />,
                    <_MessageItem key={this._componentKey++} />,
                )
            }
        }
        //观众
        else {
            if (RoomInfoCache.haveRoomPermiss) {
                //观众 & 有权限
                views.push(
                    <_MicQueueItem key={this._componentKey++} />,
                    <_MessageItem key={this._componentKey++} />,
                )
            } else {
                //观众 & 无权限
                views.push(
                    <_SeatItem key={this._componentKey++} />,
                    <_MessageItem key={this._componentKey++} />,
                    <_EffectItem key={this._componentKey++} />
                )
            }
        }

        // 最后在加入聊天组件
        views.push(
            <_SpeakerItem key={this._componentKey++} />,
            <View
                style={{
                    flex: 1,
                }}
            />,
            <_RoomTalkItem key={this._componentKey++} />
        )

        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: DesignConvert.getH(10) + DesignConvert.addIpxBottomHeight(),
                    flexDirection: 'row-reverse',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                {views}
            </View>
        )
    }
}