
/**
 * 主界面 -> 首页 -> RoomCardView
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, } from 'react-native';
import DesignConvert from '../../../../utils/DesignConvert';
import RoomInfoCache from '../../../../cache/RoomInfoCache';
import LinearGradient from 'react-native-linear-gradient';
import Config from '../../../../configs/Config';
import { LINEARGRADIENT_COLOR } from '../../../../styles';

export default class _RoomCardItem extends Component {
    constructor(props) {
        super(props);
        this._item = this.props.data;
    }

    _enterLiveRoom = (item) => {

        //在房间
        if (RoomInfoCache.isInRoom && item.roomId == RoomInfoCache.roomId) {
            require('../../../../model/room/RoomModel').getRoomDataAndShowView(RoomInfoCache.roomId);
            return;
        }

        require('../../../../model/room/RoomModel').default.enterLiveRoom(item.roomId, '')
    }

    shouldComponentUpdate(nextProps, nextState) {
        this._item = nextProps.data;
        // console.log("房间", this._item, decodeURI(this._item.roomName), this._item.onlineNum)
        this.forceUpdate();
        return true;
    }

    _getRoomType = (roomType) => {
        // console.log("房间专态", this.props.getRoomType, roomType, this.props.getRoomType(roomType))
        if (this.props.getRoomType) {
            return this.props.getRoomType(roomType);
        }
        return "其它";
    }

    render() {
        const item = this._item;

        return (

            <TouchableOpacity
                onPress={() => {
                    this._enterLiveRoom(item)
                }}
                activeOpacity={0.8}
                style={{
                    alignSelf: 'center',
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(95),
                    borderRadius: DesignConvert.getW(10),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: '#8F8F8FCC',
                    marginBottom: DesignConvert.getH(15),

                    flexDirection: "row",
                    alignItems: "center",
                }}
            >

                <Image
                    source={{ uri: Config.getRoomCreateLogoUrl(item.logoTime, item.roomId, item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                    style={{
                        width: DesignConvert.getW(78),
                        height: DesignConvert.getH(78),
                        borderRadius: DesignConvert.getW(10),
                        marginLeft: DesignConvert.getW(10),
                    }}>
                </Image>

                <View
                    style={{
                        marginLeft: DesignConvert.getW(15),
                    }}
                >

                    <Text
                        numberOfLines={1}
                        style={{
                            maxWidth: DesignConvert.getW(220),
                            color: '#151515',
                            fontSize: DesignConvert.getF(14),
                            lineHeight: DesignConvert.getH(20),
                        }}>{decodeURI(item.roomName)}</Text>

                    <Text
                        numberOfLines={1}
                        style={{
                            maxWidth: DesignConvert.getW(220),
                            color: "#7C7C7C",
                            fontSize: DesignConvert.getF(12),
                            lineHeight: DesignConvert.getH(16.5),
                            marginTop: DesignConvert.getH(5),
                        }}>{decodeURI(item.base.nickName) || "昵称加载中"}</Text>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: DesignConvert.getH(10),
                        }}>
                        <Image
                            source={require("../../../../hardcode/skin_imgs/yuanqi").in_live()}
                            style={{
                                width: DesignConvert.getW(12),
                                height: DesignConvert.getH(12),
                                resizeMode: 'contain',
                            }} 
                        />

                        <Text
                            style={{
                                color: "#7C7C7C",
                                fontSize: DesignConvert.getF(10),
                                marginLeft: DesignConvert.getW(5),
                            }}>{item.onlineNum + '人'}</Text>
                    </View>
                </View>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={item.base.sex == 1 ? ['#CAEFFF', '#576DFF'] : ['#FFCACA', '#FF57C9']}
                    style={{
                        position: 'absolute',
                        bottom: DesignConvert.getH(15),
                        right: DesignConvert.getW(15),
                        width: DesignConvert.getW(43),
                        height: DesignConvert.getH(21),
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: DesignConvert.getW(10),
                    }}>
                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(11),
                        }}>
                        {/* {this._getRoomType(item.roomType)} */}
                        {item.base.sex == 1 ? '男神' : '女神'}
                    </Text>
                </LinearGradient>

                {/* <View
                    style={{
                        position: "absolute",
                        top: DesignConvert.getH(20),
                        left: DesignConvert.getW(25),
                    }}>
                    <Image
                        source={require('../../../../hardcode/skin_imgs/main.js').lock()}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(20),
                            display: item.password ? "flex" : "none",
                        }}></Image>
                </View> */}

            </TouchableOpacity>
        )
    }
}