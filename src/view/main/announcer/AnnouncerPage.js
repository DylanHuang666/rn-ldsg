/**
 * 主界面 -> 1v1陪聊
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView, ActivityIndicator, Slider } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../../utils/DesignConvert';
import Config from '../../../configs/Config';
import BackTitleView from '../../base/BackTitleView';
import { LINEARGRADIENT_COLOR } from "../../../styles";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_ROOM_REFRESH_ROOM, EVT_LOGIC_VOICE_FRIEND_BANNER } from "../../../hardcode/HLogicEvent";
import HomePageModel from "../../../model/main/HomePageModel";
import { BannerSwiper } from "../home/HomePage";
import AnnouncerModel, { isAnnouncer } from "../../../model/main/AnnouncerModel";
import AnnouncerItem from "./AnnouncerItem";
import AnnouncerCertificationModel from "../../../model/announcer/AnnouncerCertificationModel";
import ToastUtil from "../../base/ToastUtil";

class _NoDisturbModeItem extends PureComponent {
    constructor(props) {
        super(props);

        this._bnoDisturbMode = false;
        this._isAnnouncer = false;
    }

    async componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_ROOM_REFRESH_ROOM, this._initData);
        await this._initData();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_ROOM_REFRESH_ROOM, this._initData);
    }

    _initData = async () => {
        //判断是否声优
        let res = await isAnnouncer();
        if (res === undefined) {
            this.forceUpdate();
            return
        }
        this._isAnnouncer = res;
        let data = await AnnouncerModel.getUserSkillInfo();
        if (data && data.noDisturbMode) {
            this._bnoDisturbMode = true;
        } else {
            this._bnoDisturbMode = false;
        }
        this.forceUpdate();
    }

    //开启关闭勿扰模式
    onPress = async () => {
        let res = await AnnouncerModel.switchNoDisturbMode();
        if (res) {
            ToastUtil.showCenter(this._bnoDisturbMode ? "关闭勿扰模式成功" : "开启勿扰模式成功")
            await this._initData();
        }

    }

    render() {
        if (!this._isAnnouncer) {
            return <View></View>
        }
        return (
            <TouchableOpacity
                onPress={this.onPress}
                style={{
                    height: DesignConvert.getH(44),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <View
                    style={{
                        width: DesignConvert.getW(33),
                        height: DesignConvert.getH(13),
                        borderRadius: DesignConvert.getW(9),
                        justifyContent: "center",
                        alignItems: this._bnoDisturbMode ? "flex-start" : "flex-end",
                        backgroundColor: this._bnoDisturbMode ? "#7858F8" : "#FFFFFF80",
                        marginRight: DesignConvert.getW(6),
                    }}>

                    <View
                        style={{
                            width: DesignConvert.getW(17),
                            height: DesignConvert.getH(17),
                            borderRadius: DesignConvert.getW(17),
                            backgroundColor: "#FFFFFF",
                        }}></View>
                </View>

                <Text
                    style={{
                        color: "white",
                        fontSize: DesignConvert.getW(13),
                    }}>
                    {"勿扰模式"}
                </Text>
            </TouchableOpacity>
        )
    }
}


export default class AnnouncerPage extends PureComponent {
    constructor(props) {
        super(props);

        this._bannerList = [];
        this._announcerList = [];
        this._isRefreshing = false;
        this._index = 0;
        this._loadMoreEnable = false;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_VOICE_FRIEND_BANNER, this._onRefresh);
        ModelEvent.addEvent(null, EVT_LOGIC_ROOM_REFRESH_ROOM, this._onRefresh);
        this._onRefresh();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_VOICE_FRIEND_BANNER, this._onRefresh);
        ModelEvent.removeEvent(null, EVT_LOGIC_ROOM_REFRESH_ROOM, this._onRefresh);
    }

    _onRefresh = () => {
        this._index = 0;
        HomePageModel.getSquareBannerList()
            .then(data => {
                this._bannerList = data;
                this.forceUpdate();
            });

        AnnouncerModel.getUserSkillList(this._index)
            .then(data => {
                if (data.length > 0) {
                    this._loadMoreEnable = true;
                } else {
                    this._loadMoreEnable = false;
                }
                this._announcerList = data;
                this._isRefreshing = false;
                this._index = this._announcerList.length;
                this.forceUpdate();
            });

    }

    _onLoadMore = () => {
        if (this._loadMoreEnable) {
            AnnouncerModel.getUserSkillList(this._index)
                .then(data => {
                    if (data.length > 0) {
                        this._loadMoreEnable = true;
                        this._announcerList = this._announcerList.concat(data);

                    } else {
                        this._loadMoreEnable = false;
                    }

                    this._index = this._announcerList.length;
                    this.forceUpdate();
                });
        }

    }

    _renderTitleBar = () => (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={LINEARGRADIENT_COLOR}
            style={{
                justifyContent: "flex-end",
                height: DesignConvert.getH(44) + DesignConvert.statusBarHeight,
            }}>

            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: DesignConvert.getW(15),
                }}>

                <Text
                    style={{
                        flex: 1,
                        color: "white",
                        fontSize: DesignConvert.getF(17),
                    }}>
                    {"1v1热聊"}
                </Text>

                <_NoDisturbModeItem />
            </View>
        </LinearGradient>
    )

    _renderHeaderView = () => (
        <BannerSwiper
            width={DesignConvert.getW(345)}
            height={DesignConvert.getH(110)}
            isShowWhiteBg={false}
            bannerList={this._bannerList} />
    )

    _renderFooterView = () => (
        <View
            style={{
                width: DesignConvert.swidth,
                height: DesignConvert.getH(100),
            }}></View>
    )

    _renderItem = ({ item }) => (
        <AnnouncerItem
            videoPause={item.videoPause}
            item={item}
        />
    )

    /**
     * (info: {
            viewableItems: array,
            changed: array,
        }) => void
     */
    _onViewableItemsChanged = (info) => {
        info.changed.forEach(element => {
            element.videoPause = !element.isViewable;
        });
        info.viewableItems.forEach(element => {
            this._announcerList[element.index].videoPause = !element.isViewable;
        });
        this.forceUpdate()
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}>

                {this._renderTitleBar()}


                <FlatList
                    data={this._announcerList}
                    refreshing={this._isRefreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this._onLoadMore}
                    onEndReachedThreshold={0.2}
                    renderItem={this._renderItem}
                    ListHeaderComponent={this._renderHeaderView}
                    ListFooterComponent={this._renderFooterView}
                    numColumns={2}
                    initialNumToRender={4}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                    }}
                    style={{
                        paddingHorizontal: DesignConvert.getW(10),
                    }}
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                />

            </View>
        )
    }
}