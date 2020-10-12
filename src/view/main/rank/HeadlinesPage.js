
/**
 *  榜单 -> 头条
 */
'use strict';

import React, { PureComponent } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, ImageBackground } from "react-native";
import { ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import HGlobal, { COIN_NAME } from '../../../hardcode/HGLobal';
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_RANK_PAGE_INDEX } from "../../../hardcode/HLogicEvent";

export default class HeadlinesPage extends PureComponent {

    constructor(props) {
        super(props);

        this._list = [];

        this._isLoading = false;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_RANK_PAGE_INDEX, this._initData);
        this._initData();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_RANK_PAGE_INDEX, this._initData);
    }

    _onRefresh = () => {
        this._isLoading = true;
        this.forceUpdate();
        this._initData();
    }

    _getText(item) {
        let text = item.eggType == 1 ? HGlobal.EGG_A : item.eggType == 2 ? HGlobal.EGG_B : HGlobal.EGG_C;
        // switch (item.action) {
        //     case 10: text = text + "x10";
        //         break;
        //     case 100: text = text + "x100";
        //         break;
        //     default: text = text + "x1";
        // }
        return text;
    }

    _getUnitLength(item) {
        switch (item.action) {
            case 10:
                return "x10";
            case 100:
                return 'x100';
            default:
                return "x1";
        }
    }

    _getGiftUrl = (giftId, logoTime) => {
        let giftUrl = Config.getGiftUrl(giftId, logoTime)
        return giftUrl;
    }

    _initData = () => {
        require("../../../model/main/RankPageModel").default.getSmashList()
            .then(data => {
                this._list = data;
                // console.log("刷新头条", data)
                this._isLoading = false;
                this.forceUpdate();
            });
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

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    require("../../../router/level2_router").showUserInfoView(item.userId);
                }}
                style={{
                    borderRadius: DesignConvert.getW(34),
                    marginTop: DesignConvert.getH(18),
                    marginLeft: DesignConvert.getW(15),
                }}
            >
                <ImageBackground
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(68),
                        alignItems: "center",
                        flexDirection: "row",
                    }}
                    source={require("../../../hardcode/skin_imgs/yuanqi").rank_topsection_bg()}
                >
                    <TouchableOpacity
                        onPress={() => {
                            require("../../../router/level2_router").showUserInfoView(item.userId);
                        }}>

                        <Image
                            source={{ uri: require("../../../configs/Config").default.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                            style={{
                                width: DesignConvert.getW(44),
                                height: DesignConvert.getH(44),
                                marginLeft: DesignConvert.getW(15),
                                borderRadius: DesignConvert.getW(44*0.5),
                            }}></Image>

                    </TouchableOpacity>

                    <View
                        style={{
                            flex: 1,
                            marginLeft: DesignConvert.getW(12),
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: DesignConvert.getF(12),
                                    fontWeight: "bold",
                                    marginRight: DesignConvert.getW(6),
                                    maxWidth: DesignConvert.getW(180),
                                }}
                            >{decodeURI(item.nickName)}</Text>

                            {/* {this.renderSex(item.base.sex)}

                            <Image
                                source={require('../../../hardcode/skin_imgs/main').mine_rich_lv(item.base.contributeLv)}
                                style={{
                                    width: DesignConvert.getW(32),
                                    height: DesignConvert.getH(13),
                                    marginLeft: DesignConvert.getW(6),
                                }}
                            /> */}

                            {/* <Text
                            style={{
                                height: DesignConvert.getH(18),
                                color: "#999999",
                                fontSize: DesignConvert.getF(10),
                                backgroundColor: "#F2F2F2",
                                borderRadius: DesignConvert.getW(9),
                                paddingLeft: DesignConvert.getW(5.3),
                                paddingRight: DesignConvert.getW(5.3),
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >{item.timeStr}</Text> */}
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                                marginTop: DesignConvert.getW(9.3),
                            }}
                        >
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: DesignConvert.getF(12),
                                }}

                            >
                               在
                            </Text>

                            <Text
                                style={{
                                    color: "#EAA900",
                                    fontSize: DesignConvert.getF(12),
                                }}
                            >{`${HGlobal.EGG_ACTION}${this._getText(item)}`}</Text>

                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: DesignConvert.getF(12),
                                }}
                            > 获得 </Text>

                            <Text
                                style={{
                                    color: "#EAA900",
                                    fontSize: DesignConvert.getF(12),
                                }}
                            >{`${item.gift.name}(${item.gift.price}金币) ${this._getUnitLength(item)}`}</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: DesignConvert.getW(15),
                        }}
                    >
                        <Image
                            resizeMode="contain"
                            source={{ uri: this._getGiftUrl(item.gift.giftId, item.gift.logoTime) }}
                            style={{
                                width: DesignConvert.getW(44),
                                height: DesignConvert.getH(44),
                            }}></Image>
                    </View>
                </ImageBackground>

            </TouchableOpacity>
        )
    }

    _renderEmptyView = () => {
        return (
            <View style={{
                height: DesignConvert.getH(30),
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <Text style={{
                    color: '#999999',
                    fontSize: DesignConvert.getH(14),
                    marginTop: DesignConvert.getH(5),
                    marginBottom: DesignConvert.getH(15),
                }}
                ></Text>
            </View>
        )
    }

    render() {
        return (
            <FlatList
                        style={{
                            flex: 1,
                            width: DesignConvert.swidth,
                            marginBottom: DesignConvert.addIpxBottomHeight() + DesignConvert.getH(48),
                        }}
                data={this._list}
                renderItem={this._renderItem}
                refreshing={this._isLoading}
                onRefresh={this._onRefresh}
                ListFooterComponent={this._renderEmptyView}
                showsVerticalScrollIndicator={false}
                initialNumToRender={9}
            />
        );
    }
}
