/**
 * 房间 -> 排行榜
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, Modal, ImageBackground, findNodeHandle, Platform } from "react-native";
import { ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../utils/DesignConvert";
import Config from "../../configs/Config";
import ToastUtil from "../base/ToastUtil";
import BaseView from "../base/BaseView";
import RoomModel from '../../model/room/RoomModel';
import { BlurView } from 'react-native-blur'
import { ic_rank_value, ic_rank_value2 } from "../../hardcode/skin_imgs/room";
import { THEME_COLOR } from "../../styles";
import MedalWidget from "../userinfo/MedalWidget";
import { TextTouchSelect, TouchSelectTab } from "./item/roomRank/SubItem";
import RoomRankItemPage from "./item/roomRank/RoomRankItemPage";

const [charm, rich] = [21, 24];

export default class RoomRankPage extends BaseView {

    constructor(props) {
        super(props);

        this._tabLayoutOffset = 0;
        this._selectTab = 0;
        this._dialogVisable = true;
    }

    showDia = () => {
        this._dialogVisable = true;
        this.forceUpdate();
    }

    dismissDia = () => {
        this._dialogVisable = false;
        this.forceUpdate();
        this.popSelf();
    }

    _onUpdateRankPageIndex = i => {
        if (i == this._selectTab) return;

        this._viewPager && this._viewPager.setPage(i);
        this._selectTab = i;
        this.forceUpdate();
    }

    _onPageSelected = e => {
        this._selectTab = e.position;
        // this._tabLayoutOffset = e.offset;
        this.forceUpdate();
    }

    _getViewPager = ref => {
        this._viewPager = ref;
    }

    _toSB = () => {
        this.popSelf();
        if (this.props.params.toTop != undefined) {
            this.props.params.toTop();
        }
    }

    _renderTabLayout() {
        return (
            <View
                style={{

                    position: 'absolute',
                    left: DesignConvert.getW(15),
                    top: DesignConvert.getH(15),

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'center',

                }}
            >
                <TouchSelectTab
                    txt="财富榜"
                    type={0}
                    selecType={this._selectTab}
                    onPress={this._onUpdateRankPageIndex.bind(this, 0)}
                />
                <View
                    style={{
                        width: DesignConvert.getW(18),
                        height: DesignConvert.getH(1)
                    }}
                />
                <TouchSelectTab
                    txt="魅力榜"
                    type={1}
                    selecType={this._selectTab}
                    onPress={this._onUpdateRankPageIndex.bind(this, 1)}
                />

            </View>
        )
    }

    render() {
        return (

            <View
                style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                }}
            >

                <TouchableOpacity
                    onPress={this.dismissDia}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(145) + DesignConvert.statusBarHeight,
                    }}
                />
                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(574),
                        borderRadius: DesignConvert.getW(8),

                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        alignSelf: 'center'
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            left: DesignConvert.getW(60),
                            top: DesignConvert.getH(-3),

                            width: DesignConvert.getW(8),
                            height: DesignConvert.getH(8),

                            backgroundColor: '#000000',

                            transform: [{ rotate: '45deg' }]

                        }}
                    />
                    <ViewPager
                        initialPage={this._selectTab}
                        style={{
                            flex: 1,
                        }}
                        onPageSelected={this._onPageSelected}
                        scrollEnabled={false}
                        ref={this._getViewPager}
                    >

                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <RoomRankItemPage
                                toSB={this._toSB}
                                roomId={this.props.params.roomId}
                                type={rich}
                                popSelf={this.popSelf} />
                        </View>

                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <RoomRankItemPage
                                toSB={this._toSB}
                                roomId={this.props.params.roomId}
                                type={charm}
                                popSelf={this.popSelf} />
                        </View>
                    </ViewPager>

                    {this._renderTabLayout()}

                </View>

            </View>
        );
    }

}