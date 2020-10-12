
/**
 * 主界面 -> 首页 -> RoomCardView
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import RoomInfoCache from '../../../cache/RoomInfoCache';
import Config from '../../../configs/Config';

export default class RoomCardItem extends Component {
    constructor(props) {
        super(props);
        this._item = this.props.data;
    }

    _enterLiveRoom = (item) => {

        //在房间
        if (RoomInfoCache.isInRoom && item.roomId == RoomInfoCache.roomId) {
            require('../../../model/room/RoomModel').getRoomDataAndShowView(RoomInfoCache.roomId);
            return;
        }

        require('../../../model/room/RoomModel').default.enterLiveRoom(item.roomId, '')
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
        const avatar = { uri: require("../../../configs/Config").default.getHeadUrl(this._item.base.userId, this._item.base.logoTime, this._item.base.thirdIconurl) };

        return (
            <TouchableOpacity
                onPress={() => {
                    this._enterLiveRoom(this._item)
                }}
                activeOpacity={0.8}
                style={{
                    width: DesignConvert.getW(110),
                    height: DesignConvert.getH(160),
                    borderRadius: DesignConvert.getW(10),
                    marginLeft: DesignConvert.getW(15),
                    overflow: 'hidden'
                }}>

                <View
                    style={{
                        width: DesignConvert.getW(110),
                        height: DesignConvert.getH(105),
                        backgroundColor: "#FFFFFF",
                    }}>

                    <Image
                        source={{ uri: Config.getRoomCreateLogoUrl(this._item.logoTime, this._item.roomId, this._item.base.userId, this._item.base.logoTime, this._item.base.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(110),
                            height: DesignConvert.getH(105),
                        }}>
                    </Image>

                    {/* 房间锁 */}
                    {/* <View
                        style={{
                            // position: "absolute",
                            // right: DesignConvert.getH(5),
                            // top: DesignConvert.getW(5),
                        }}>
                        <Image
                            source={require('../../../hardcode/skin_imgs/main').lock()}
                            style={{
                                width: DesignConvert.getW(26),
                                height: DesignConvert.getH(26),
                                display: this._item.password ? "flex" : "none",
                            }}></Image>
                    </View> */}
                </View>

                <View
                    style={{
                        marginTop: DesignConvert.getH(5)
                        // position: "absolute",
                        // bottom: DesignConvert.getH(34),
                        // left: DesignConvert.getW(8),
                    }}>

                    <Text
                        numberOfLines={1}
                        style={{
                            width: DesignConvert.getW(110),
                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(11),
                        }}>{decodeURI(this._item.roomName)}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        // justifyContent: 'center',
                        marginTop: DesignConvert.getH(3),

                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(10),
                        }}
                    >{`ID:${this._item.roomId}`}</Text>
                    <Image
                        source={require("../../../hardcode/skin_imgs/main").live_status_white()}
                        style={{
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(9),
                            marginLeft: DesignConvert.getW(6),
                            resizeMode: 'contain',
                            tintColor: '#FF1B00'
                        }} />
                    <Text
                        style={{
                            color: "#FF009E",
                            fontSize: DesignConvert.getF(10),
                            marginLeft: DesignConvert.getW(4),
                        }}>{this._item.onlineNum}</Text>

                </View>
            </TouchableOpacity>
        )
    }
}