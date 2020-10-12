/**
 * 主界面 -> 榜单
 */
'use strict';

import React, { PureComponent, Component } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, RefreshControl, ImageBackground, StatusBar } from "react-native";
import { ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import ToastUtil from "../../base/ToastUtil";
import StatusBarView from "../../base/StatusBarView";
import HeadlinesPage from "./HeadlinesPage";
import MedalWidget from "../../userinfo/MedalWidget";
import RankCache, { getChangeRankPangeIndex } from "../../../cache/RankCache";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_RANK_PAGE_INDEX } from "../../../hardcode/HLogicEvent";
import BaseView from "../../base/BaseView";
import { rank_bg_icon, rank_bg_icon2, bg_name } from "../../../hardcode/skin_imgs/main";
import { back_white } from "../../../hardcode/skin_imgs/anchorincome";
import { ic_back_black } from "../../../hardcode/skin_imgs/common";
import { height } from "../../user_info_edit/UserInfoEditDetailView";

export function TopCharmRankTouchItem(props) {
    const { onPress, backgroundSource, headerSource, subTitle, title, titleStyle, index, richLv } = props
    let imgBorderSize = { width: DesignConvert.getW(94), height: DesignConvert.getH(118) }
    let imgSize = { width: DesignConvert.getW(88), height: DesignConvert.getH(88) }
    if (index != 0) {
        imgBorderSize.width = DesignConvert.getW(75)
        imgBorderSize.height = DesignConvert.getH(96)
        imgSize.width = DesignConvert.getW(70)
        imgSize.height = DesignConvert.getH(70)
    }


    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                // flexDirection: 'row',
                alignItems: "center",
                // justifyContent: 'center',
                borderRadius: DesignConvert.getW(62),
                ...props.style
            }}
        >

            <View
                style={{
                    width: imgBorderSize.width,
                    height: imgBorderSize.height,
                    marginTop: DesignConvert.getH(6),
                    marginLeft: DesignConvert.getW(6)
                }}
            >
                <Image
                    source={headerSource}
                    style={{
                        width: imgSize.width,
                        height: imgSize.height,
                        borderRadius: imgSize.width * 0.5,
                        // position: "absolute",
                        top: index == 0 ? DesignConvert.getH(19) : DesignConvert.getH(15),
                        // left: DesignConvert.getH(4),
                    }}></Image>

                <Image
                    source={backgroundSource}
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: imgBorderSize.width,
                        height: imgBorderSize.height,
                    }}
                    resizeMode={'contain'}
                />
            </View>
            <Text
                numberOfLines={1}
                style={{
                    maxWidth: DesignConvert.getW(65),
                    fontSize: DesignConvert.getF(12),
                    fontWeight: 'bold',
                    marginTop: DesignConvert.getH(5),
                    color: '#FFFFFF',
                    ...titleStyle
                }}
            >{title}</Text>

            <MedalWidget
                width={DesignConvert.getW(41)}
                height={DesignConvert.getH(19)}
                richLv={richLv}
                containerStyle={{
                    marginTop: DesignConvert.getH(3),
                }}
            />
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: DesignConvert.getH(20),
                    width: DesignConvert.getW(57),
                    marginTop: DesignConvert.getH(8),
                }}
            >

                <View
                    style={{
                        backgroundColor: '#FF366B',
                        borderRadius: DesignConvert.getW(11),
                        width: DesignConvert.getW(47),
                        height: DesignConvert.getH(17),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(10),
                            marginLeft: DesignConvert.getW(13),
                        }}
                    >{subTitle}</Text>
                </View>
                <Image
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                    }}
                    source={require("../../../hardcode/skin_imgs/yuanqi").rank_charmsource()}
                />
            </View>

        </TouchableOpacity>

    )
}

export function TopRichRankTouchItem(props) {
    const { onPress, backgroundSource, headerSource, title, subTitle, titleStyle, index, richLv } = props
    let imgBorderSize = { width: DesignConvert.getW(88), height: DesignConvert.getH(99) }
    let imgSize = { width: DesignConvert.getW(88), height: DesignConvert.getH(88) }
    if (index != 0) {
        imgBorderSize.width = DesignConvert.getW(70)
        imgBorderSize.height = DesignConvert.getH(82)
        imgSize.width = DesignConvert.getW(70)
        imgSize.height = DesignConvert.getH(70)
    }


    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                // flexDirection: 'row',
                alignItems: "center",
                // justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: DesignConvert.getW(62),
                ...props.style
            }}
        >

            <View
                style={{
                    width: imgBorderSize.width,
                    height: imgBorderSize.height,
                    marginTop: DesignConvert.getH(6),
                    marginLeft: DesignConvert.getW(6)
                }}
            >
                <Image
                    source={headerSource}
                    style={{
                        width: imgSize.width,
                        height: imgSize.height,
                        borderRadius: imgSize.width * 0.5,
                        // position: "absolute",
                        // top: DesignConvert.getH(12),
                        // left: DesignConvert.getH(4),
                    }}></Image>

                <Image
                    source={backgroundSource}
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: imgBorderSize.width,
                        height: imgBorderSize.height,
                    }}
                    resizeMode={'contain'}
                />
            </View>
            <Text
                numberOfLines={1}
                style={{
                    maxWidth: DesignConvert.getW(65),
                    fontSize: DesignConvert.getF(12),
                    fontWeight: 'bold',
                    marginTop: DesignConvert.getH(5),
                    ...titleStyle
                }}
            >{title}</Text>

            <MedalWidget
                width={DesignConvert.getW(41)}
                height={DesignConvert.getH(19)}
                richLv={richLv}
                containerStyle={{
                    marginTop: DesignConvert.getH(3),
                }}
            />
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: DesignConvert.getH(20),
                    width: DesignConvert.getW(57),
                    marginTop: DesignConvert.getH(8),
                }}
            >

                <View
                    style={{
                        backgroundColor: '#EAA900',
                        borderRadius: DesignConvert.getW(11),
                        width: DesignConvert.getW(47),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(10),
                            marginLeft: DesignConvert.getW(13),
                        }}
                    >{subTitle}</Text>
                </View>
                <Image
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                    }}
                    source={require("../../../hardcode/skin_imgs/yuanqi").rank_ranksource()}
                />
            </View>

        </TouchableOpacity>

    )
}

export function CharmRankItem(props) {
    const { onPress, item, sty } = props
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                marginTop: DesignConvert.getH(20),
                width: DesignConvert.swidth,
                height: DesignConvert.getH(75),

                flexDirection: "row",
                alignItems: "center",
                ...sty

            }}
        >
            <Text
                style={{
                    fontSize: DesignConvert.getF(12),
                    fontWeight: "bold",

                    borderRadius: DesignConvert.getW(3),

                    marginLeft: DesignConvert.getW(15),

                    textAlign: 'center',
                    textAlignVertical: 'center',
                }}>{item.rank}</Text>

            <Image
                source={{ uri: require("../../../configs/Config").default.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                style={{
                    width: DesignConvert.getW(60),
                    height: DesignConvert.getH(60),
                    borderRadius: DesignConvert.getW(40),

                    borderWidth: DesignConvert.getW(1),
                    borderColor: '#ffffff',

                    marginLeft: DesignConvert.getW(12),
                }}></Image>
            <View
                style={{
                    marginLeft: DesignConvert.getW(10),
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color: '#FFFFFF',

                        marginBottom: DesignConvert.getH(5),

                        maxWidth: DesignConvert.getW(165),

                        fontSize: DesignConvert.getF(14),
                        fontWeight: "bold",
                    }}>{decodeURI(item.nickName)}</Text>
                <MedalWidget
                    richLv={item.contributeLv}
                    width={DesignConvert.getW(45)}
                    height={DesignConvert.getH(18)}
                />
            </View>
            <View
                style={{
                    marginRight: DesignConvert.getW(15),
                    position: 'absolute',
                    right: 0,

                    justifyContent: 'center',
                    flexDirection: 'row',
                    height: DesignConvert.getH(20),
                    width: DesignConvert.getW(57),

                }}
            >

                <View
                    style={{
                        backgroundColor: '#FF366B',
                        borderRadius: DesignConvert.getW(11),
                        width: DesignConvert.getW(47),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(10),
                            marginLeft: DesignConvert.getW(13),
                        }}
                    >{`${item.rankScore}`}</Text>
                </View>
                <Image
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                    }}
                    source={require("../../../hardcode/skin_imgs/yuanqi").rank_charmsource()}
                />
            </View>

        </TouchableOpacity>
    )
}

export function RichRankItem(props) {
    const { onPress, item, sty } = props
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                marginTop: DesignConvert.getH(20),
                width: DesignConvert.swidth,
                height: DesignConvert.getH(75),

                flexDirection: "row",
                alignItems: "center",
                ...sty
            }}
        >
            <Text
                style={{
                    fontSize: DesignConvert.getF(12),
                    fontWeight: "bold",

                    borderRadius: DesignConvert.getW(3),

                    marginLeft: DesignConvert.getW(15),

                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: 'rgba(255,255,255,0.8)',
                }}>0{item.rank}</Text>

            <Image
                source={{ uri: require("../../../configs/Config").default.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                style={{
                    width: DesignConvert.getW(60),
                    height: DesignConvert.getH(60),
                    borderRadius: DesignConvert.getW(40),

                    borderWidth: DesignConvert.getW(1),
                    borderColor: '#ffffff',

                    marginLeft: DesignConvert.getW(12),

                }}></Image>
            <View
                style={{
                    marginLeft: DesignConvert.getW(10),
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color: '#FFFFFF',

                        marginBottom: DesignConvert.getH(5),

                        maxWidth: DesignConvert.getW(165),

                        fontSize: DesignConvert.getF(14),
                        fontWeight: "bold",
                    }}>{decodeURI(item.nickName)}</Text>
                <MedalWidget
                    richLv={item.contributeLv}
                    width={DesignConvert.getW(45)}
                    height={DesignConvert.getH(18)}
                />
            </View>
            <View
                style={{
                    marginRight: DesignConvert.getW(15),
                    position: 'absolute',
                    right: 0,

                    justifyContent: 'center',
                    flexDirection: 'row',
                    height: DesignConvert.getH(20),
                    width: DesignConvert.getW(57),

                }}
            >

                <View
                    style={{
                        backgroundColor: '#EAA900',
                        borderRadius: DesignConvert.getW(11),
                        width: DesignConvert.getW(47),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(10),
                            marginLeft: DesignConvert.getW(13),
                        }}
                    >{`${item.rankScore}`}</Text>
                </View>
                <Image
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                    }}
                    source={require("../../../hardcode/skin_imgs/yuanqi").rank_ranksource()}
                />
            </View>

        </TouchableOpacity>
    )
}

const [charm, rich] = [1, 4];
class RankItemPage extends PureComponent {

    constructor(prop) {
        super(prop);

        this._selectTab = 1;

        this._data = [];
        this._rank = [];

        //    * 魅力榜  日榜：1 周榜：2 月榜：3
        //    * 土豪榜  日榜：4 周榜：5 月榜：6
        //    * 人气榜  日榜：11 周榜：12 月榜：13
        // console.log("榜单", this.props.type);
        // this._userId = "1001071";
        this._userId = require("../../../cache/UserInfoCache").default.userId;

        this._start = 1;
        this._end = 30;
        this._isRefreshing = false;
    }

    _onRefresh = () => {
        this._initData();
    }

    _initData() {
        require("../../../model/main/RankPageModel").default.getRankList(this._userId, this.props.type + this._selectTab, this._start, this._end)
            .then(data => {
                this._rank = data;
                if (this._rank.length > 3) {
                    this._data = this._rank.slice(3);
                } else {
                    this._data = [];
                }
                this._isRefreshing = false;
                this.forceUpdate();
            })
            .catch(e => {
                this._rank = [];
                this._data = [];
                this.forceUpdate();
                throw (e);
            });
    }

    componentDidMount() {
        this._initData();
    }

    _onItemPress = (userId) => {
        require("../../../router/level2_router").showUserInfoView(userId);
    }

    _renderTabLayout() {
        const selectColor = this.props.type == rich ? '#EAA900' : '#FF366B'
        return (
            <View
                style={{
                    width: DesignConvert.getW(180),
                    height: DesignConvert.getH(29),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'space-between',
                    marginTop: DesignConvert.getH(10),
                    borderRadius: DesignConvert.getW(16),
                    backgroundColor: 'rgba(255, 255, 255, 0.32)'
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 0;
                        this._initData();
                        this.forceUpdate();
                    }}
                    style={{
                        width: DesignConvert.getW(59),
                        height: DesignConvert.getH(26),
                        borderRadius: DesignConvert.getW(16),
                        backgroundColor: this._selectTab == 0 ? '#FFFFFF' : 'transparent',
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: this._selectTab == 0 ? selectColor : '#FFFFFF',
                            fontSize: this._selectTab == 0 ? DesignConvert.getF(15) : DesignConvert.getF(14),
                            lineHeight: DesignConvert.getH(21),
                        }}
                    >日榜</Text>

                    {this._selectTab == 0 ?
                        <View
                            style={{
                                width: DesignConvert.getW(20),
                                height: DesignConvert.getH(4),
                                borderRadius: DesignConvert.getW(3.5),
                                backgroundColor: '#FFFFFF',
                            }}
                        />
                        : null}
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 1;
                        this._initData();
                        this.forceUpdate();
                    }}
                    style={{
                        width: DesignConvert.getW(59),
                        height: DesignConvert.getH(26),
                        backgroundColor: this._selectTab == 1 ? '#FFFFFF' : 'transparent',
                        alignItems: "center",
                        borderRadius: DesignConvert.getW(16),
                    }}
                >
                    <Text
                        style={{
                            color: this._selectTab == 1 ? selectColor : '#FFFFFF',
                            fontSize: this._selectTab == 1 ? DesignConvert.getF(15) : DesignConvert.getF(14),
                            lineHeight: DesignConvert.getH(21),
                        }}
                    >周榜</Text>

                    {this._selectTab == 1 ?
                        <View
                            style={{
                                width: DesignConvert.getW(20),
                                height: DesignConvert.getH(4),
                                borderRadius: DesignConvert.getW(3.5),
                                backgroundColor: '#FFFFFF',
                            }}
                        />
                        : null}
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 2;
                        this._initData();
                        this.forceUpdate();
                    }}
                    style={{
                        width: DesignConvert.getW(59),
                        height: DesignConvert.getH(26),
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: this._selectTab == 2 ? '#FFFFFF' : 'transparent',
                        borderRadius: DesignConvert.getW(16),
                    }}
                >
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: this._selectTab == 2 ? selectColor : '#FFFFFF',
                                fontSize: DesignConvert.getF(12),
                            }}
                        >月榜</Text>
                    </View>
                </TouchableOpacity>
            </View >
        )
    }

    _renderItem = ({ item }) => {
        return (
            <View>
                {this.props.type == rich ?
                    <RichRankItem
                        onPress={() => {
                            this._onItemPress(item.userId);
                        }}
                        item={item}
                    /> : <CharmRankItem
                        onPress={() => {
                            this._onItemPress(item.userId);
                        }}
                        item={item}
                    />}
            </View>
        )
    }

    renderSex = (sex) => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(13),
                    height: DesignConvert.getH(13),
                    borderRadius: DesignConvert.getW(7),
                    backgroundColor: sex == 2 ? '#FF3EB0' : '#68C3FF',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Image
                    source={sex == 2 ? require('../../../hardcode/skin_imgs/mine').icon_woman() : require('../../../hardcode/skin_imgs/mine').icon_man()}
                    style={{
                        width: DesignConvert.getW(8),
                        height: DesignConvert.getH(8),
                    }}
                />
            </View>
        )
    }

    _renderRichTop = () => {
        return (
            <View>
                <TopRichRankTouchItem
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getH(134),
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
                    backgroundSource={require("../../../hardcode/skin_imgs/yuanqi").top1_border()}
                    headerSource={{
                        uri: this._rank.length < 1 ?
                            require("../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../configs/Config").default.getHeadUrl(this._rank[0].userId, this._rank[0].logoTime, this._rank[0].thirdIconurl)
                    }}
                    index={0}
                    richLv={this._rank.length < 1 ? 1 : this._rank[0].contributeLv}
                />
                <TopRichRankTouchItem
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(32),
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
                    backgroundSource={require("../../../hardcode/skin_imgs/yuanqi").top2_border()}
                    headerSource={{
                        uri: this._rank.length < 2 ?
                            require("../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../configs/Config").default.getHeadUrl(this._rank[1].userId, this._rank[1].logoTime, this._rank[1].thirdIconurl)
                    }}
                    index={1}
                    richLv={this._rank.length < 2 ? 1 : this._rank[1].contributeLv}
                />
                <TopRichRankTouchItem
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getH(33),
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
                    backgroundSource={require("../../../hardcode/skin_imgs/yuanqi").top3_border()}
                    headerSource={{
                        uri: this._rank.length < 3 ?
                            require("../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../configs/Config").default.getHeadUrl(this._rank[2].userId, this._rank[2].logoTime, this._rank[2].thirdIconurl)
                    }}
                    index={2}
                    richLv={this._rank.length < 3 ? 1 : this._rank[2].contributeLv}
                />
            </View>
        )
    }

    _renderCharmTop = () => {
        return (
            <View>
                <TopCharmRankTouchItem
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getH(134),
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
                    backgroundSource={require("../../../hardcode/skin_imgs/yuanqi").rank_charmtop1_bg()}
                    headerSource={{
                        uri: this._rank.length < 1 ?
                            require("../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../configs/Config").default.getHeadUrl(this._rank[0].userId, this._rank[0].logoTime, this._rank[0].thirdIconurl)
                    }}
                    index={0}
                    richLv={this._rank.length < 1 ? 1 : this._rank[0].contributeLv}
                />
                <TopCharmRankTouchItem
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(32),
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
                    backgroundSource={require("../../../hardcode/skin_imgs/yuanqi").rank_charmtop2_bg()}
                    headerSource={{
                        uri: this._rank.length < 2 ?
                            require("../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../configs/Config").default.getHeadUrl(this._rank[1].userId, this._rank[1].logoTime, this._rank[1].thirdIconurl)
                    }}
                    index={1}
                    richLv={this._rank.length < 2 ? 1 : this._rank[1].contributeLv}
                />
                <TopCharmRankTouchItem
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getH(33),
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
                    backgroundSource={require("../../../hardcode/skin_imgs/yuanqi").rank_charmtop3_bg()}
                    headerSource={{
                        uri: this._rank.length < 3 ?
                            require("../../../hardcode/skin_imgs/registered").ic_default_header() :
                            require("../../../configs/Config").default.getHeadUrl(this._rank[2].userId, this._rank[2].logoTime, this._rank[2].thirdIconurl)
                    }}
                    index={2}
                    richLv={this._rank.length < 3 ? 1 : this._rank[2].contributeLv}
                />
            </View>
        )
    }

    _renderRichRankTitle = () => {
        return (
            <View>
                <ImageBackground
                    //source={require('../../../hardcode/skin_imgs/main').rank_source()}
                    style={{
                        width: DesignConvert.getW(267),
                        height: DesignConvert.getH(139),
                        // marginTop: DesignConvert.getH(27),
                        // marginLeft: DesignConvert.getW(59),
                        position: 'absolute',
                        top: DesignConvert.getH(150),
                        left: DesignConvert.getW(59),
                        // alignSelf:'center'
                    }}
                >
                    <Text
                        style={{
                            width: DesignConvert.getW(54),
                            position: 'absolute',
                            left: DesignConvert.getW(14),
                            top: DesignConvert.getH(34),

                            fontSize: DesignConvert.getF(18),
                            fontWeight: 'bold',
                            color: '#00FEFF'
                        }}
                    >
                        {`${this._rank.length < 2 ? "0" : this._rank[1].rankScore}`}
                    </Text>
                    <Text
                        style={{
                            width: DesignConvert.getW(54),
                            position: 'absolute',
                            left: DesignConvert.getW(102),
                            top: DesignConvert.getH(27),

                            fontSize: DesignConvert.getF(18),
                            fontWeight: 'bold',
                            color: '#FFED15'
                        }}
                    >
                        {`${this._rank.length < 1 ? "0" : this._rank[0].rankScore}`}
                    </Text>

                    <Text
                        style={{
                            width: DesignConvert.getW(54),
                            position: 'absolute',
                            left: DesignConvert.getW(189),
                            top: DesignConvert.getH(39),

                            fontSize: DesignConvert.getF(18),
                            fontWeight: 'bold',
                            color: '#FE2C58'
                        }}
                    >
                        {`${this._rank.length < 3 ? "0" : this._rank[2].rankScore}`}
                    </Text>

                </ImageBackground>
            </View>
        )
    }

    _renderCharmRankTitle = () => {
        return (
            <View>
                <ImageBackground
                    //source={require('../../../hardcode/skin_imgs/main').rank_charm_source()}
                    style={{
                        width: DesignConvert.getW(336),
                        height: DesignConvert.getH(145),
                        position: 'absolute',
                        top: DesignConvert.getH(110),
                        left: DesignConvert.getW(20),
                        // alignSelf:'center'
                    }}
                >

                </ImageBackground>
            </View>
        )
    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >

                {this._renderTabLayout()}

                <View
                    style={{
                        height: DesignConvert.getH(270)
                    }}
                >
                    {/* {this.props.type == rich ? this._renderRichRankTitle() : this._renderCharmRankTitle()} */}
                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(194)
                        }}
                    >
                        {this.props.type == rich ? this._renderRichTop() : this._renderCharmTop()}
                    </View>

                </View>

                {this._data.length > 0 ?
                    <FlatList
                        style={{
                            flex: 1,
                            width: DesignConvert.swidth,
                            // marginBottom: DesignConvert.addIpxBottomHeight(),
                            backgroundColor: 'rgba(0, 0, 0, 0.59)',
                            borderTopLeftRadius: DesignConvert.getW(40),
                            borderTopRightRadius: DesignConvert.getW(40)
                        }}
                        data={this._data}
                        renderItem={this._renderItem}
                    />
                    : null
                }
                <View
                    style={{
                        height: DesignConvert.addIpxBottomHeight() + DesignConvert.getH(48)
                    }}
                />
            </View>
        )
    }
}

export default class RankPage extends BaseView {

    constructor(props) {
        super(props);

        this._tabLayoutOffset = 0;
        this._selectTab = getChangeRankPangeIndex();
    }

    componentDidMount() {
        super.componentDidMount()

        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_RANK_PAGE_INDEX, this._onUpdateRankPageIndex);
    }

    componentWillUnmount() {
        super.componentWillUnmount()

        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_RANK_PAGE_INDEX, this._onUpdateRankPageIndex);
    }

    _currentRankBackGround = () => {
        if (this._selectTab == 0) {
            return require('../../../hardcode/skin_imgs/yuanqi').rank_richheader_bg()
        } else if (this._selectTab == 1) {
            return require('../../../hardcode/skin_imgs/yuanqi').rank_charmheader_bg()
        } else {
            return require('../../../hardcode/skin_imgs/yuanqi').rank_topheader_bg()
        }
    }

    _onUpdateRankPageIndex = i => {
        if (i == this._selectTab) return;

        this._viewPager && this._viewPager.setPage(i);
        this._selectTab = i;
        this.forceUpdate();
    }

    _renderTabLayout() {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(44),
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                {/* <TouchableOpacity
                    style={{
                        width: DesignConvert.getW(44),
                        height: DesignConvert.getH(44),
                        position: 'absolute',
                        left: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this.popSelf}
                >
                    <Image
                        style={{
                            width: DesignConvert.getW(14),
                            height: DesignConvert.getH(23),
                        }}
                        source={require('../../../hardcode/skin_imgs/yuanqi').arrow_left()}
                    />
                </TouchableOpacity> */}

                <View
                    style={{
                        width: DesignConvert.getW(200),
                        height: DesignConvert.getH(39),
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: DesignConvert.getW(5),
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(75),
                            height: DesignConvert.getH(29),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.9}
                        onPress={() => {
                            this._selectTab = 0;
                            this.forceUpdate();
                            this._viewPager.setPage(0);
                        }}
                    >
                        <Text
                            style={{
                                color: this._selectTab == 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                                fontSize: DesignConvert.getF(17),
                                fontWeight: this._selectTab == 0 ? 'bold' : 'normal'
                            }}
                        >财富榜</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(75),
                            height: DesignConvert.getH(29),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.9}
                        onPress={() => {
                            this._selectTab = 1;
                            this.forceUpdate();
                            this._viewPager.setPage(1);
                        }}
                    >
                        <Text
                            style={{
                                color: this._selectTab == 1 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                                fontSize: DesignConvert.getF(17),
                                fontWeight: this._selectTab == 1 ? 'bold' : 'normal'
                            }}
                        >魅力榜</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(75),
                            height: DesignConvert.getH(29),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.9}
                        onPress={() => {
                            this._selectTab = 2;
                            this.forceUpdate();
                            this._viewPager.setPage(2);
                        }}
                    >
                        <Text
                            style={{
                                color: this._selectTab == 2 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                                fontSize: DesignConvert.getF(17),
                                fontWeight: this._selectTab == 2 ? 'bold' : 'normal'
                            }}
                        >手气榜</Text>

                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    render() {
        const headerBg = this._currentRankBackGround()
        return (
            <ImageBackground
                style={{
                    flex: 1,
                }}
                source={headerBg}
            >

                {this._renderTabLayout()}

                <ViewPager
                    initialPage={this._selectTab}
                    style={{
                        flex: 1,
                        width: DesignConvert.swidth,
                    }}
                    onPageSelected={e => {
                        this._selectTab = e.position;
                        this.forceUpdate();
                    }}
                    ref={(ref) => {
                        this._viewPager = ref;
                    }}
                >

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <RankItemPage
                            type={rich}
                            hotUri={require('../../../hardcode/skin_imgs/main').gx_hot()}
                            valueColor={'#8B69FF'}
                        />
                    </View>

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <RankItemPage
                            type={charm}
                            hotUri={require('../../../hardcode/skin_imgs/main').meili_hot()}
                            valueColor={'#FD7687'}
                        />
                    </View>

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <HeadlinesPage />
                    </View>

                </ViewPager>
            </ImageBackground>
        );
    }

}