/**
 * 主界面 -> 消息 ->好友
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, SectionList, Image, ScrollView, FlatList } from "react-native";
import { ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import ToastUtil from "../../base/ToastUtil";
import StatusBarView from "../../base/StatusBarView";

export default class FriendsList extends PureComponent {
    constructor(props) {
        super(props);

        // this._friendList = [{ title: "##", data: ["item1", "item2"] },
        //                     { title: "A", data: ["item3", "item4"] },
        //                     { title: "B", data: ["item5", "item6"] }];

        this._friendList = [];
        this.state = {
            isLoading: false,
        }
    }

    componentDidMount() {
        this._initData();
    }

    _initData() {
        require("../../../model/message/FriendsModel").default.getFriends(3)
            .then(data => {
                this._friendList = data;
                // console.log("好友", data);
                this.setState({
                    isLoading: false,
                })
                this.forceUpdate();
            })
    }

    _onRefresh = () => {
        this.setState({
            isLoading: true,
        })
        this._initData();
    }

    _renderSectionHeader = ({ section: { title } }) => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(29),
                    backgroundColor: "#F5F5F5",
                    paddingLeft: DesignConvert.getW(20),
                    alignItems: "flex-start",
                    justifyContent: "center",
                }}>
                <Text
                    style={{
                        color: "#000000",
                        fontSize: DesignConvert.getF(13),
                        textAlign: "justify",
                    }}>{title}</Text>
            </View>
        )
    }

    _renderEmptyView = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(520),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    source={require("../../../hardcode/skin_imgs/main").no_friend()}
                    style={{
                        width: DesignConvert.getW(130),
                        height: DesignConvert.getH(96),
                    }}></Image>
            </View>
        )
    }

    _renderFooterView = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(50),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text
                    style={{
                        color: "#808080",
                        fontSize: DesignConvert.getF(12),
                    }}>没有更多了哦~</Text>
            </View>
        )
    }

    _onItemPress = (item) => {
        require("../../../router/level2_router").showChatView(item.userId, decodeURI(item.nickName), false);
    }

    _onHeaderPress = (item) => {
        require("../../../router/level2_router").showUserInfoView((item.userId));
    }

    _renderItem = ({ item, index, section }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this._onItemPress(item);
                }}
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(62),
                    backgroundColor: "white",
                    flexDirection: "row",
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this._onHeaderPress(item);
                    }}
                    style={{
                        position: "absolute",
                        left: DesignConvert.getW(20),
                        top: DesignConvert.getH(12),
                    }}>
                    <Image
                        source={{ uri: Config.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(38),
                            height: DesignConvert.getH(38),
                            borderRadius: DesignConvert.getW(38),
                        }}></Image>
                </TouchableOpacity>

                <Text
                    style={{
                        color: "#1A1A1A",
                        fontSize: DesignConvert.getF(14),
                        position: "absolute",
                        left: DesignConvert.getW(68),
                        top: DesignConvert.getH(24),
                    }}>{decodeURI(item.nickName)}</Text>

                <Text
                    style={{
                        color: "#808080",
                        fontSize: DesignConvert.getF(10),
                        position: "absolute",
                        right: DesignConvert.getW(20),
                        top: DesignConvert.getH(14),
                    }}>{item.position}</Text>

                <View
                    style={{
                        position: "absolute",
                        right: DesignConvert.getW(20),
                        top: DesignConvert.getH(31),
                    }}>
                    <LinearGradient
                        colors={["#FF648E", "#FF8FAD"]}
                        style={{
                            width: DesignConvert.getW(44),
                            height: DesignConvert.getH(18),
                            borderRadius: DesignConvert.getW(9),
                            justifyContent: "center",
                            alignItems: "center",
                            display: !item.roomId ? "none" : "flex",
                        }}>
                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(10),
                            }}>房间中</Text>
                    </LinearGradient>
                </View>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getBorderWidth(1),
                        backgroundColor: "#F5F5F5",
                        position: "absolute",
                        bottom: 0,
                        left: DesignConvert.getW(68),
                    }}></View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            // <SectionList
            //     isLoading={this.state.isLoading}
            //     renderItem={this._renderItem}
            //     renderSectionHeader={this._renderSectionHeader}
            //     sections={this._friendList}
            //     keyExtractor={(item, index) => item + index}
            //     ListFooterComponent={this._renderFooterView}
            //     />
            <FlatList
                data={this._friendList}
                refreshing={this.state.isLoading}
                onRefresh={this._onRefresh}
                renderItem={this._renderItem}
                ListFooterComponent={this._renderFooterView}
                ListEmptyComponent={this._renderEmptyView} />
        )
    }
}