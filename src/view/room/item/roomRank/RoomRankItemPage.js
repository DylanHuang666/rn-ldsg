/**
 * 房间 -> 排行榜item列表项
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, Modal, ImageBackground, findNodeHandle, Platform } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../../utils/DesignConvert";
import Config from "../../../../configs/Config";
import { ic_rank_value, ic_rank_value2 } from "../../../../hardcode/skin_imgs/room";
import MedalWidget from "../../../userinfo/MedalWidget";
import { TextTouchSelect } from "./SubItem";
import { TopCharmRankTouchItem, TopRichRankTouchItem, CharmRankItem, RichRankItem } from "../../../main/rank/RankPage";

const [charm, rich] = [21, 24];
export default class RoomRankItemPage extends PureComponent {

    constructor(prop) {
        super(prop);

        this._selectTab = 1;

        this._roomId = this.props.roomId;
        this._data = { list: [] };
        this._myInfo = {};
        this._rank = [];

        //    * 魅力榜  日榜：21 周榜：22 月榜：23
        // * 土豪榜  日榜：24 周榜：25 月榜：26
        // console.log("榜单", this.props.type);
    }

    _initData() {
        require("../../../../model/room/RoomManagerModel").default.getRoomRankList(this._roomId, this.props.type + this._selectTab)
            .then(data => {
                this._rank = data.list;
                this._data = data;
                // console.log("this._data", this._data);
                this.forceUpdate();
            });

        require("../../../../model/main/MinePageModel").default.getPersonPageAndLevel()
            .then(data => {
                // console.log("个人信息", data);
                this._myInfo = data;
                this.forceUpdate();
            })
    }

    _onItemPress = (userId) => {
        this.props.popSelf()
        require("../../../../router/level2_router").showUserInfoView(userId);
    }

    componentDidMount() {
        this._initData();
    }

    _changeSelectTab = i => {
        this._selectTab = i
        this._initData();
        this.forceUpdate();
    }

    _renderTabLayout() {

        const selectColor = this.props.type == rich ? '#FFCD42' : '#B438FF';
        const fontColor = this.props.type == rich ? '#EAA900' : '#FF366B'
        return (
            <View
                style={{
                    alignSelf: 'flex-end',

                    width: DesignConvert.getW(180),
                    height: DesignConvert.getH(28),
                    borderRadius: DesignConvert.getW(50),

                    backgroundColor: 'rgba(255, 255, 255, 0.32)',

                    flexDirection: "row",
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',

                    marginTop: DesignConvert.getH(14),
                    marginEnd: DesignConvert.getW(10),
                }}
            >
                <TextTouchSelect
                    type={0}
                    selecType={this._selectTab}
                    txt="日榜"
                    onPress={this._changeSelectTab.bind(this, 0)}
                    color={fontColor}
                />
                <TextTouchSelect
                    type={1}
                    selecType={this._selectTab}
                    txt="周榜"
                    onPress={this._changeSelectTab.bind(this, 1)}
                    color={fontColor}
                />
                <TextTouchSelect
                    type={2}
                    selecType={this._selectTab}
                    txt="月榜"
                    onPress={this._changeSelectTab.bind(this, 2)}
                    color={fontColor}
                />
            </View >
        )
    }

    _renderEmptyView = () => {
        return (
            <View></View>
        )
    }

    _renderItemView = ({ item }) => {
        if (item.rank < 4) {
            return null
        }
        if (this.props.type === rich) return (
            <RichRankItem
                onPress={() => {
                    this._onItemPress(item.userId);
                }}
                sty={{
                    width:DesignConvert.getW(345)
                }}
                item={item} />
        )
        return (
            <CharmRankItem
                onPress={() => {
                    this._onItemPress(item.userId);
                }}
                sty={{
                    width:DesignConvert.getW(345)
                }}
                item={item}
            />
        )
    }

    _renderRichTop = () => {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(4),

                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(225),

                    borderTopLeftRadius: DesignConvert.getW(10),
                    borderTopRightRadius: DesignConvert.getW(10),
                    alignItems: 'center',


                }}
            >

                <TopRichRankTouchItem
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(33),

                        width: DesignConvert.getW(82),
                        height: DesignConvert.getH(173)
                    }}
                    onPress={() => {
                        if (this._rank.length > 1) {
                            this._onItemPress(this._rank[1].userId)
                        }
                    }}
                    title={this._rank.length < 2 ? "虚位以待" : decodeURI(this._rank[1].nickName)}
                    subTitle={`${this._rank.length < 2 ? "0" : this._rank[1].rankScore}`}
                    titleStyle={{
                        color: '#00FEFF'
                    }}
                    backgroundSource={require("../../../../hardcode/skin_imgs/yuanqi").top2_border()}
                    headerSource={{
                        uri: this._rank.length < 2 ?
                            require("../../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../../configs/Config").default.getHeadUrl(this._rank[1].userId, this._rank[1].logoTime, this._rank[1].thirdIconurl)
                    }}
                    index={1}
                    richLv={this._rank.length < 2 ? 1 : this._rank[1].contributeLv}
                />
                <TopRichRankTouchItem
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(15),

                        width: DesignConvert.getW(100),
                        height: DesignConvert.getH(190)
                    }}
                    onPress={() => {
                        if (this._rank.length > 0) {
                            this._onItemPress(this._rank[0].userId)
                        }
                    }}
                    title={this._rank.length < 1 ? "虚位以待" : decodeURI(this._rank[0].nickName)}
                    subTitle={`${this._rank.length < 1 ? "0" : this._rank[0].rankScore}`}
                    titleStyle={{
                        color: '#FFED15'
                    }}
                    backgroundSource={require("../../../../hardcode/skin_imgs/yuanqi").top1_border()}
                    headerSource={{
                        uri: this._rank.length < 1 ?
                            require("../../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../../configs/Config").default.getHeadUrl(this._rank[0].userId, this._rank[0].logoTime, this._rank[0].thirdIconurl)
                    }}
                    index={0}
                    richLv={this._rank.length < 1 ? 1 : this._rank[0].contributeLv}
                />
                <TopRichRankTouchItem
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getH(15),
                        top: DesignConvert.getH(33),

                        width: DesignConvert.getW(82),
                        height: DesignConvert.getH(173)

                    }}
                    onPress={() => {
                        if (this._rank.length > 2) {
                            this._onItemPress(this._rank[2].userId)
                        }
                    }}
                    title={this._rank.length < 3 ? "虚位以待" : decodeURI(this._rank[2].nickName)}
                    subTitle={`${this._rank.length < 3 ? "0" : this._rank[2].rankScore}`}
                    titleStyle={{
                        color: '#FE2C58'
                    }}
                    backgroundSource={require("../../../../hardcode/skin_imgs/yuanqi").top3_border()}
                    headerSource={{
                        uri: this._rank.length < 3 ?
                            require("../../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../../configs/Config").default.getHeadUrl(this._rank[2].userId, this._rank[2].logoTime, this._rank[2].thirdIconurl)
                    }}
                    index={2}
                    richLv={this._rank.length < 3 ? 1 : this._rank[2].contributeLv}
                />
            </View>
        )
    }

    _renderCharmTop = () => {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(4),

                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(225),

                    borderTopLeftRadius: DesignConvert.getW(10),
                    borderTopRightRadius: DesignConvert.getW(10),
                    alignItems: 'center',


                }}
            >

                <TopCharmRankTouchItem
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(33),

                        width: DesignConvert.getW(82),
                        height: DesignConvert.getH(173)
                    }}
                    onPress={() => {
                        if (this._rank.length > 1) {
                            this._onItemPress(this._rank[1].userId)
                        }
                    }}
                    subTitle={`${this._rank.length < 2 ? "0" : this._rank[1].rankScore}`}
                    title={this._rank.length < 2 ? "虚位以待" : decodeURI(this._rank[1].nickName)}
                    backgroundSource={require("../../../../hardcode/skin_imgs/yuanqi").rank_charmtop2_bg()}
                    headerSource={{
                        uri: this._rank.length < 2 ?
                            require("../../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../../configs/Config").default.getHeadUrl(this._rank[1].userId, this._rank[1].logoTime, this._rank[1].thirdIconurl)
                    }}
                    index={1}
                    richLv={this._rank.length < 2 ? 1 : this._rank[1].contributeLv}
                />
                <TopCharmRankTouchItem
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(15),

                        width: DesignConvert.getW(100),
                        height: DesignConvert.getH(190)
                    }}
                    onPress={() => {
                        if (this._rank.length > 0) {
                            this._onItemPress(this._rank[0].userId)
                        }
                    }}
                    title={this._rank.length < 2 ? "虚位以待" : decodeURI(this._rank[0].nickName)}
                    subTitle={`${this._rank.length < 1 ? "0" : this._rank[0].rankScore}`}
                    backgroundSource={require("../../../../hardcode/skin_imgs/yuanqi").rank_charmtop1_bg()}
                    headerSource={{
                        uri: this._rank.length < 1 ?
                            require("../../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../../configs/Config").default.getHeadUrl(this._rank[0].userId, this._rank[0].logoTime, this._rank[0].thirdIconurl)
                    }}
                    index={0}
                    richLv={this._rank.length < 1 ? 1 : this._rank[0].contributeLv}
                />
                <TopCharmRankTouchItem
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getH(15),
                        top: DesignConvert.getH(33),

                        width: DesignConvert.getW(82),
                        height: DesignConvert.getH(173)

                    }}
                    onPress={() => {
                        if (this._rank.length > 2) {
                            this._onItemPress(this._rank[2].userId)
                        }
                    }}
                    subTitle={`${this._rank.length < 3 ? "0" : this._rank[2].rankScore}`}
                    title={this._rank.length < 3 ? "虚位以待" : decodeURI(this._rank[2].nickName)}
                    backgroundSource={require("../../../../hardcode/skin_imgs/yuanqi").rank_charmtop3_bg()}
                    headerSource={{
                        uri: this._rank.length < 3 ?
                            require("../../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../../configs/Config").default.getHeadUrl(this._rank[2].userId, this._rank[2].logoTime, this._rank[2].thirdIconurl)
                    }}
                    index={2}
                    richLv={this._rank.length < 3 ? 1 : this._rank[2].contributeLv}
                />
            </View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                }}
            >
                {this._renderTabLayout()}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        flex: 1,

                    }}
                >

                    {this.props.type == rich ? this._renderRichTop() : this._renderCharmTop()}
                    {/* <Image
                        source={
                            this.props.type == rich ?
                                require('../../../../hardcode/skin_imgs/room').room_rich_top_bg() :
                                require('../../../../hardcode/skin_imgs/room').room_charm_top_bg()
                        }
                        style={{
                            position: 'absolute',
                            bottom: 0,

                            width: DesignConvert.getW(375),
                            height: DesignConvert.getH(225),
                            borderTopLeftRadius: DesignConvert.getW(10),
                            borderTopRightRadius: DesignConvert.getW(10),
                        }}
                    /> */}





                    <FlatList
                        style={{
                            width: DesignConvert.getW(345),
                            minHeight: DesignConvert.getH(200)
                        }}
                        scrollEnabled={false}
                        data={this._data.list}
                        renderItem={this._renderItemView}
                        ListEmptyComponent={this._renderEmptyView}
                    />
                </ScrollView>

            </View >
        )
    }
}