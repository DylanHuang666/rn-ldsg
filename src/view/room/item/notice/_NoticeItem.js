/**
 * 公告
 */

import React, { PureComponent } from "react";
import { Image, Text, TouchableOpacity, View, TextInput } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import ModelEvent from "../../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_ROOM_NOTIC } from "../../../../hardcode/HLogicEvent";
import RoomInfoCache from "../../../../cache/RoomInfoCache";
import UserInfoCache from "../../../../cache/UserInfoCache";
import { ic_edit_notice, ic_notice ,ic_close_white} from "../../../../hardcode/skin_imgs/room";

export default class _NoticeItem extends PureComponent {

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_ROOM_NOTIC, this._onRefreshNotice)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_ROOM_NOTIC, this._onRefreshNotice)
    }

    //更新房间公告
    _onRefreshNotice = (data) => {
        this.forceUpdate()
    }

    _onNotice = () => {
        if (!RoomInfoCache.roomData) return;

        // if (UserInfoCache.userId == RoomInfoCache.roomData.createId || RoomInfoCache.roomData.jobId <= 3) {
            // require("../../../../router/level3_router").showRoomEditNoticeView();
        // } else {
            require("../../../../router/level3_router").showRoomNoticeView();
        // }
    }

    _Tag() {
        return (
            <Image
                style={{
                    width: DesignConvert.getW(16),
                    height: DesignConvert.getH(16),
                }}
                source={ic_notice()}
            >

            </Image>
        )
    }

    render() {

        if (UserInfoCache.userId == RoomInfoCache.roomData.createId || RoomInfoCache.roomData.jobId <= 3) {
            if (RoomInfoCache.roomData.notic) {
                return (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            width: DesignConvert.getW(80),
                            height: DesignConvert.getH(28),
                            borderTopLeftRadius:DesignConvert.getW(20),
                            borderBottomLeftRadius:DesignConvert.getW(20),
                            borderWidth:DesignConvert.getW(1.5),
                            borderColor:'#121212',
                            backgroundColor: '#12121255',
                            top: DesignConvert.getH(64) + DesignConvert.statusBarHeight,
                            right:DesignConvert.getW(-1),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal:DesignConvert.getW(3),
                        }}
                        onPress={this._onNotice}
                    >


                        <this._Tag />

                        <Text
                            style={{
                                color: '#D5CEFF',
                                fontSize: DesignConvert.getF(11),
                                marginStart: DesignConvert.getW(5),
                            }}
                            numberOfLines={1}
                        >玩法介绍</Text>

                        {/* 
                        <Image
                            style={{
                                marginLeft: DesignConvert.getW(5),
                                width: DesignConvert.getW(13),
                                height: DesignConvert.getH(13),
                            }}
                            source={ic_edit_notice()}
                        /> */}
                    </TouchableOpacity>
                )
            } else {
                //没话题
                return (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            width: DesignConvert.getW(80),
                            height: DesignConvert.getH(28),
                            borderTopLeftRadius:DesignConvert.getW(20),
                            borderBottomLeftRadius:DesignConvert.getW(20),
                            borderWidth:DesignConvert.getW(1.5),
                            borderColor:'#121212',
                            backgroundColor: '#12121255',
                            top: DesignConvert.getH(64) + DesignConvert.statusBarHeight,
                            right:DesignConvert.getW(-1),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal:DesignConvert.getW(3),
                        }}
                        onPress={this._onNotice}
                    >

                        <this._Tag />

                        <Text
                            style={{
                                color: '#D5CEFF',
                                fontSize: DesignConvert.getF(11),
                                marginStart: DesignConvert.getW(5),
                            }}
                            numberOfLines={1}
                        >玩法介绍</Text>

                        {/* 
                        <Text
                            style={{
                                color: 'white',
                                fontSize: DesignConvert.getF(11),
                            }}
                        >暂无</Text>

                        <Image
                            style={{
                                marginLeft: DesignConvert.getW(5),
                                width: DesignConvert.getW(13),
                                height: DesignConvert.getH(13),
                            }}
                            source={ic_edit_notice()}
                        /> */}
                    </TouchableOpacity>
                )
            }
        }

        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                            width: DesignConvert.getW(80),
                            height: DesignConvert.getH(28),
                            borderTopLeftRadius:DesignConvert.getW(20),
                            borderBottomLeftRadius:DesignConvert.getW(20),
                            borderWidth:DesignConvert.getW(1.5),
                            borderColor:'#121212',
                            backgroundColor: '#12121255',
                            top: DesignConvert.getH(64) + DesignConvert.statusBarHeight,
                            right:DesignConvert.getW(-1),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal:DesignConvert.getW(3),
                }}
                onPress={this._onNotice}
            >

                <this._Tag />

                <Text
                    style={{
                        color: '#D5CEFF',
                                fontSize: DesignConvert.getF(11),
                                marginStart: DesignConvert.getW(5),
                    }}
                    numberOfLines={1}
                >玩法介绍</Text>


                {/* <Text
                    style={{
                        maxWidth: DesignConvert.getW(77),
                        color: 'white',
                        fontSize: DesignConvert.getF(11),
                    }}
                    numberOfLines={1}
                >{RoomInfoCache.roomData.notic ? RoomInfoCache.roomData.notic : '暂无'}</Text> */}
            </TouchableOpacity>

        );
    }
}