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


_RoomRecommendItem
export default class _RoomRecommendItem extends Component {


    _enterLiveRoom = (item) => {

        //在房间
        if (RoomInfoCache.isInRoom && item.roomId == RoomInfoCache.roomId) {
            require('../../../../model/room/RoomModel').getRoomDataAndShowView(RoomInfoCache.roomId);
            return;
        }

        require('../../../../model/room/RoomModel').default.enterLiveRoom(item.roomId, '')
    }


    _getRoomType = (roomType) => {
        // console.log("房间专态", this.props.getRoomType, roomType, this.props.getRoomType(roomType))
        if (this.props.getRoomType) {
            return this.props.getRoomType(roomType);
        }
        return "其它";
    }

    render() {
        const item = this.props.item;
        return (
            <TouchableOpacity
                onPress={() => {
                    this._enterLiveRoom(item)
                }}
                activeOpacity={0.8}
                style={{
                    width: DesignConvert.getW(195),
                    height: DesignConvert.getH(60),
                    marginHorizontal: DesignConvert.getW(15),
                    backgroundColor: 'rgba(120, 120, 120, 0.4)',
                    borderRadius: DesignConvert.getW(12),
                    flexDirection: 'row'
                }}>
                
                    
                <Image
                    style={{
                        width: DesignConvert.getW(60),
                        height: DesignConvert.getH(60),
                        borderRadius: DesignConvert.getW(12)
                    }}
                    source={{ uri: Config.getRoomCreateLogoUrl(item.logoTime, item.roomId, item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                />
                <View
                    style={{
                        marginLeft: DesignConvert.getW(8),
                        justifyContent: 'center',
                        // alignItems:'center'
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            maxWidth: DesignConvert.getW(95),
                            fontWeight: 'bold',
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(12),
                        }}>{decodeURI(item.roomName)}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: 10
                            }}
                        >{`ID:${item.roomId}`}</Text>
                        <Image
                            source={require("../../../../hardcode/skin_imgs/main").live_status_white()}
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
                            }}>{item.onlineNum}</Text>

                    </View>

                </View>
                <View
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(2),
                        left: DesignConvert.getW(3),
                        backgroundColor: '#9A61E8FF',
                        width: DesignConvert.getW(27),
                        height: DesignConvert.getH(15),
                        borderRadius: DesignConvert.getW(5),
                        alignItems: "center",
                        justifyContent: "center",

                    }}
                >
                    <Text
                        textAlign="center"
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(10),
                        }}>{this._getRoomType(item.roomType)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
