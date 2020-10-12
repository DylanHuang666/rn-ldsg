/**
 * TODO:通话记录
 */

'use strict';

import React from 'react';
import { FlatList, ImageBackground, Text, View, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { item_bg } from "../../hardcode/skin_imgs/announcer";
import { LINEARGRADIENT_COLOR } from '../../styles';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from '../base/BaseView';
import { isAnnouncer } from '../../model/main/AnnouncerModel';
import Config from '../../configs/Config';
import UserInfoCache from '../../cache/UserInfoCache';
import { duration2Time } from '../../utils/CDTick';
import PhoneRecordItem from './item/PhoneRecordItem';

export default class PhoneRecordView extends BaseView {
    constructor(props) {
        super(props);

        this._list = [];
        this._lastId = "";
        this._row = 10;

        this._isLoading = false;
        this.isAnnouncer = false;
    }

    _onRefresh = () => {
        this._lastId = "";
        this._initData();
    }

    _onLoadMore = () => {
        if (this._loadMoreEnable) {
            this._initData();
        }

    }

    async componentDidMount() {
        super.componentDidMount();
        await this._initData();
    }


    
    _initData = async () => {
        let res = await isAnnouncer();
        if (res === undefined) {
            return
        }
        this.isAnnouncer = res;

        let data = await require("../../model/announcer/PhoneRecordModel").default.getLiveChatList(this._lastId, this._row, this.isAnnouncer);

        if (this._lastId == "") {
            this._list = data;
            this._isLoading = false;
        } else {
            this._list = this._list.concat(data);
        }

        if (data.length == 0 || data.length < this._row) {
            this._loadMoreEnable = false;
        } else {
            this._loadMoreEnable = true;
        }

        this.forceUpdate();
    }

    _renderItem = ({ item }) => (
        <PhoneRecordItem
            item={item}
            bAnnouncer={this.isAnnouncer}
        />
    )

    _renderFooterView = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(30),
                }}></View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}>

                <BackTitleView
                    titleText={"通话记录"}
                    onBack={this.popSelf}
                    bgColor={LINEARGRADIENT_COLOR}
                    titleTextStyle={{
                        color: "white",
                    }}
                    backImgStyle={{
                        tintColor: "white",
                    }} />

                <FlatList
                    style={{
                        marginTop: DesignConvert.getH(15),
                    }}
                    data={this._list}
                    renderItem={this._renderItem}
                    refreshing={this._isLoading}
                    onRefresh={this._onRefresh}
                    onEndReached={this._onLoadMore}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={this._renderFooterView}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={9}
                />
            </View>
        )
    }
}