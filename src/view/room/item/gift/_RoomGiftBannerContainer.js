/**
 * 送礼跑道容器
 */

'use strict';

import React, { PureComponent } from "react";
import ModelEvent from "../../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_GIFT_BANNER } from "../../../../hardcode/HLogicEvent";
import { View } from "react-native";
import _RoomGiftBannerItem from "./_RoomGiftBannerItem";

export default class _RoomGiftBannerContainer extends PureComponent {
    constructor(props) {
        super(props);

        this._listData = null;
        this._timer = null;

        this._keyIndex = 0;
        this._showingItems = null;
        this._showingItemMap = null;

        this._prevPlayTick = 0;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_GIFT_BANNER, this._onData);
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_GIFT_BANNER, this._onData);
        this._stopCheckShow();
        this._listData = null;
        this._showingItems = null;
        this._showingItemMap = null;
    }

    _onData = (list) => {
        if (!this._listData) {
            this._listData = [];
        }

        for (let vo of list) {
            this._listData.push(vo);
        }

        this._startCheckShow();

        if (!this._showingItems) {
            this.forceUpdate();
        }
    }

    _startCheckShow() {
        if (!this._listData) return;

        if (this._timer) return;

        this._timer = setInterval(() => {
            this.forceUpdate();
        }, 10 * 1000);
    }

    _stopCheckShow() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    _onPlayEnd = (key) => {
        if (!this._showingItemMap) return;
        if (!this._showingItems) return;

        const item = this._showingItemMap[key];
        if (!item) return;
        delete this._showingItemMap[key];

        const i = this._showingItems.indexOf(item);
        if (i < 0) return;
        this._showingItems.splice(i, 1);

        if (this._showingItems.length == 0) {
            this._showingItems = null;
        }

        this.forceUpdate();
    }

    _doShow() {
        if (!this._listData) {
            this._stopCheckShow();
            return this._showingItems;
        }

        if (this._listData.length == 0) {
            this._listData = null;
            this._stopCheckShow();
            return this._showingItems;
        }

        const now = Date.now();
        if (now - this._prevPlayTick < 9 * 1000) {
            return this._showingItems;
        }
        this._prevPlayTick = now;

        const vo = this._listData.shift();
        if (!this._showingItems) {
            this._showingItems = [];
        }
        if (!this._showingItemMap) {
            this._showingItemMap = {};
        }

        const key = ++this._keyIndex;
        const item = (
            <_RoomGiftBannerItem
                key={key}
                keyIndex={key}
                item={vo}
                onEnd={this._onPlayEnd}
            />
        );

        this._showingItemMap[key] = item;
        this._showingItems.push(
            item
        )

        return this._showingItems;
    }

    render() {
        const items = this._doShow();
        if (!items) {
            return null;
        }
        return (
            <View
                style={{
                    position: 'absolute',
                }}
            >
                {items}
            </View>
        );
    }
}