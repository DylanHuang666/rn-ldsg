
/**
 * 房间 -> 在线
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Modal, PanResponder, Animated } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import BaseView from "../base/BaseView";
import { TitleBar } from "../anchorincome/ConvertView"
import RoomInfoCache from '../../cache/RoomInfoCache';
import BackTitleView from "../base/BackTitleView";
import { nickName } from "../user_info_edit/UserInfoEditDetailView";

export default class RoomBlackListView extends BaseView {

    constructor(props) {
        super(props);

        this._alertVisibility = false;

        this._list = [];

        this._roomId = RoomInfoCache.roomId;

        this._extraData = 0;
    }

    componentDidMount() {
        super.componentDidMount();

        this._initData()
    }

    _loadMore = () => {
        if (this._loadMoreEnable) {
            this._initData();
        }
    }

    _initData() {
        //获取玩家基本信息
        // message UserBase {
        //     required string userId = 1;//用户ID
        //     optional string nickName = 2;//用户昵称
        //     optional int32 logoTime = 3;//修改logo的时间 0为没修改过
        //     optional string thirdIconurl = 4;//第三方头像
        //     optional string headFrameId = 5;// 头像框
        //     optional int32 sex = 6; // 姓别 0 未知 1:男 2:女
        //     optional int32 age = 7; //年龄
        //     optional int32 vipLv = 8; //VIP等级
        //     optional string slogan = 9;//
        //     optional int32 contributeLv = 10;// 土豪等级
        //     optional string position = 11;//地标
        //     optional string channelId = 12;//用户渠道id
        //     optional int32 friendStatus = 13;// 好友状态
        // }
        require("../../model/room/BlackListModel").default.getRoomBlackList(this._roomId, this._list.length)
            .then(data => {
                this._loadMoreEnable = data.length != 0;
                if (data.length == 0) {
                    return;
                }

                this._list = this._list.concat(data);
                this._extraData++;
                this.forceUpdate();
            })
    }

    _alertRemove = (userId, nickName) => {
        this._removeUserId = userId;
        this._removeNickName = nickName;
        this._alertVisibility = !this._alertVisibility;
        this.forceUpdate();
    }

    _leave = () => {
        this.popSelf()
    }

    _renderItem = ({ item }) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(70),
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        require("../../router/level2_router").showUserInfoView(item.userId);
                    }}
                >
                    <Image
                        source={{ uri: require("../../configs/Config").default.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(50),
                            marginLeft: DesignConvert.getW(15),
                            borderRadius: DesignConvert.getW(25),
                        }}></Image>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        marginLeft: DesignConvert.getW(12),
                        height: DesignConvert.getH(50),
                        justifyContent: 'space-around',
                    }}
                >
                    <Text
                        style={{
                            color: "#333333",
                            fontSize: DesignConvert.getF(13),
                        }}
                    >{decodeURI(item.nickName)}</Text>

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(11),
                            color: '#B8B8B8'
                        }}
                    >
                        {`ID:${item.userId}`}
                    </Text>

                    {/* <Image
                            source={item.base.sex == 2 ? require("../../hardcode/skin_imgs/common").sex_female() : require("../../hardcode/skin_imgs/common").sex_male()}
                            style={{
                                width: DesignConvert.getW(15),
                                height: DesignConvert.getH(15),
                            }}
                        ></Image> */}
                    {/* <Text
                        style={{
                            color: "#808080",
                            fontSize: DesignConvert.getF(12),
                        }}
                    >{decodeURI(item.base.slogan)}</Text> */}

                </View>


                <TouchableOpacity
                    onPress={this._alertRemove.bind(this, item.userId, item.nickName)}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: DesignConvert.getW(54.5),
                        height: DesignConvert.getH(24),
                        marginRight: DesignConvert.getW(15),
                        borderColor: '#FF95A4',
                        borderWidth: DesignConvert.getW(1),
                        borderRadius: DesignConvert.getW(20),
                    }}
                >
                    <Text
                        style={{
                            fontSize: DesignConvert.getW(13),
                            color: '#FF95A4',
                        }}
                    >

                        {`移除`}
                    </Text>

                </TouchableOpacity>
            </View>
        )
    }

    _remove = () => {
        if (!this._removeUserId) return;

        require("../../model/room/BlackListModel").default._onRemoveBlackList(
            this._removeUserId,
            (bool) => {
                if (bool) {
                    for (let i = 0; i < this._list.length; i++) {
                        if (this._list[i].userId === this._removeUserId) {
                            this._list.splice(i, 1);
                            break;
                        }
                    }
                    this._extraData++;
                    this.forceUpdate();
                }
                this._alertRemove();
            }
        )
    }

    _keyExtractor = (item, index) => item.userId;

    render() {
        const StatusBarView = require("../base/StatusBarView").default;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                }}
            >

                <BackTitleView
                    titleText={'黑名单'}
                    onBack={this._leave}
                />


                <FlatList
                    data={this._list}
                    renderItem={this._renderItem}
                    extraData={this._extraData}
                    // onEndReached={this._loadMore}
                    // onEndReachedThreshold={0.2}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                />

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this._alertVisibility}
                    onRequestClose={this._alertRemove}>
                    <View
                        style={{
                            flex: 1,
                            width: DesignConvert.swidth,
                            height: DesignConvert.sheight,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                width: DesignConvert.getW(270),
                                borderRadius: DesignConvert.getW(10),
                                backgroundColor: '#FFFFFF',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    marginTop: DesignConvert.getH(15),
                                    fontSize: DesignConvert.getF(16),
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '900',
                                }}
                            >
                                {'提示'}
                            </Text>

                            <Text
                                style={{
                                    marginTop: DesignConvert.getH(14),
                                    marginBottom: DesignConvert.getH(24.5),
                                    marginStart: DesignConvert.getW(20),
                                    marginEnd: DesignConvert.getW(20),
                                    textAlign: 'center',
                                }}
                            >
                                {`是否将${decodeURIComponent(this._removeNickName)}移除黑名单列表?`}
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: DesignConvert.getW(270),
                                    height: DesignConvert.getH(44),
                                }}
                            >

                                <View
                                    style={{
                                        width: DesignConvert.getW(270),
                                        height: DesignConvert.getH(0.5),
                                        backgroundColor: '#F0F0F0',
                                        position: 'absolute',
                                        top: 0,
                                    }}
                                />

                                <TouchableOpacity
                                    onPress={this._alertRemove}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: DesignConvert.getF(15),
                                            color: '#333333',
                                        }}
                                    >
                                        {'取消'}
                                    </Text>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        width: DesignConvert.getW(0.5),
                                        height: DesignConvert.getH(44),
                                        backgroundColor: '#F0F0F0',
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={this._remove}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: DesignConvert.getF(15),
                                            color: '#FF95A4',
                                        }}
                                    >
                                        {'确定'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        )
    }
}