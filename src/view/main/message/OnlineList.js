/**
 * 主界面 -> 消息 ->在线的人
 */
'use strict';

import React, { PureComponent } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Config from "../../../configs/Config";
import DesignConvert from "../../../utils/DesignConvert";
import MedalWidget from "../../userinfo/MedalWidget";
import SexAgeWidget from "../../userinfo/SexAgeWidget";

export default class OnlineList extends PureComponent {
    constructor(props) {
        super(props);

        this._list = [];
        this._extraData = 0;

        this.loginTime = 0;
        this.onlineType = 1;
    }

    async componentDidMount() {
        await this._initData();
    }

    _initData = async () => {
        this.loginTime = 0;
        this.onlineType = 1;
        let list = await require('../../../model/message/OnlineModel').default.getOnlineUserInfoList(this.loginTime, this.onlineType);
        this._list = list;
        if (list.length > 0) {
            this._loadMoreEnable = true;
            this.loginTime = list[list.length - 1].loginTime;
            this.onlineType = list[list.length - 1].onlineType;
        } else {
            this._loadMoreEnable = false;
        }
        this._extraData++;
        this.forceUpdate();
    }

    _loadMore = async () => {
        if (this._loadMoreEnable) {
            let list = await require('../../../model/message/OnlineModel').default.getOnlineUserInfoList(this.loginTime, this.onlineType);
            this._list = this._list.concat(list);

            if (list.length > 0) {
                this._loadMoreEnable = true;
                this.loginTime = list[list.length - 1].loginTime;
                this.onlineType = list[list.length - 1].onlineType;
            } else {
                this._loadMoreEnable = false;
            }
            this.forceUpdate();
        }
    }

    _onHeadPress = (item) => {
        require('../../../router/level2_router').showUserInfoView(item.base.userId);
    };

    _onItemPress = (item) => {
        require("../../../router/level2_router").showChatView(item.base.userId, decodeURI(item.base.nickName), false);
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this._onItemPress(item);
                }}
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(65),
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this._onHeadPress(item);
                    }}
                >
                    <Image
                        source={{ uri: Config.getHeadUrl(item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(50),
                            marginLeft: DesignConvert.getW(15),
                            marginRight: DesignConvert.getW(12),
                            borderRadius: DesignConvert.getW(50),
                        }}></Image>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#333333',
                                fontSize: DesignConvert.getF(13),
                                marginRight: DesignConvert.getW(8),
                                maxWidth: DesignConvert.getW(150),
                            }}>{decodeURI(item.base.nickName)}</Text>


                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}>

                            {/* 性别岁数 和 等级 */}
                            <SexAgeWidget
                                sex={item.base.sex}
                                age={item.base.age} />

                            {/* <MedalWidget
                                width={DesignConvert.getW(34)}
                                height={DesignConvert.getH(14)}
                                richLv={item.base.contributeLv}
                                charmLv={item.base.charmLv}
                            /> */}
                        </View>

                    </View>

                    <Text
                        numberOfLines={1}
                        style={{
                            color: "#999999",
                            fontSize: DesignConvert.getF(12),
                            marginTop: DesignConvert.getW(6),
                            maxWidth: DesignConvert.getW(280),
                        }}>{item.slogan ? decodeURI(item.slogan) : "这个家伙很懒什么也没留下～"}</Text>
                </View>


                {/* <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(0.5),
                        backgroundColor: "#F6F6F6",
                    }}></View> */}
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this._list}
                renderItem={this._renderItem}
                extraData={this._extraData}
                refreshing={false}
                onRefresh={this._initData}
                onEndReached={this._loadMore}
                onEndReachedThreshold={0.2}
                style={{
                    flex: 1,
                    marginTop: DesignConvert.getH(5),
                }}
            />
        )
    }
}