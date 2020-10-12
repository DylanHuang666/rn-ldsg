'use strict';

import React, { PureComponent } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import RoomInfoCache from '../../../cache/RoomInfoCache';
import { EVT_LOGIC_UPDATE_ROOM_ONLINE } from "../../../hardcode/HLogicEvent";
import { ic_rank_next } from "../../../hardcode/skin_imgs/room";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";

export default class _OnlineItem extends PureComponent {

    constructor(props) {
        super(props);

        this._onlineNum = this.props.onlineNum

    }

    componentDidMount() {
        //更新房间人数
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_ROOM_ONLINE, this._onRefreshOnline)
    }


    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_ROOM_ONLINE, this._onRefreshOnline)
    }


    _onRefreshOnline = (data) => {
        this._onlineNum = data
        this.forceUpdate()
    }


    //用户进入房间通知
    // message EnterRoomBroadcast {
    // 	required string roomId = 1;//房间ID
    // 	required int32 mainType = 2;//房间类型
    // 	required UserResult.UserBase base = 3;//用户基本信息
    // 	optional int32 onlineNum = 4;//在线成员数	
    // 	required int32 index = 5;//位置
    // 	optional string carId = 6;//坐驾ID
    // 	optional int32 charmLv = 7;//魅力等级
    // 	optional int32 contributeLv = 8;// 财富等级	
    // 	optional bool openMirror = 9;//是否开启镜像
    // 	optional int32 identity = 10;// 1-普通用户，2-vip，3-富豪
    // 	optional int32 source = 11;//来源 1：寻友 
    // 	optional int64 loginTime = 12;//登陆房间时间
    // 	optional bool showCar = 13;// 是否播放座驾动画
    // 	optional int32 jobId = 14;//职位
    // 	optional bool isGuardian = 15;// 是否是守护团成员，true是，false不是
    // 	optional int32 guardianLv = 17;// 用户在守护团的等级
    // 	optional int32 cardType = 18;//用户贵宾卡类型	
    // }

    _showRoomOnlineView = () => {
        require("../../../router/level3_router").showOnlineMemberPage(RoomInfoCache.roomId);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._showRoomOnlineView}
                style={{
                    position: 'absolute',
                    right: DesignConvert.getW(20),
                    bottom: DesignConvert.getH(23),

                    flexDirection: 'row',
                    justifyContent: "center",
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(12),
                    }}
                >在线的人</Text>

                <Image
                    source={ic_rank_next()}
                    style={{
                        marginLeft: DesignConvert.getW(3),

                        width: DesignConvert.getW(6),
                        height: DesignConvert.getH(9),
                    }}
                />
            </TouchableOpacity>
        );
    }

    // render() {
    //     return (
    //         <TouchableOpacity
    //             onPress={this._showRoomOnlineView}
    //             style={{
    //                 flexDirection: 'row',
    //                 justifyContent: "center",
    //                 alignItems: 'center',
    //                 marginLeft: DesignConvert.getW(6),
    //                 height: DesignConvert.getH(22),
    //                 paddingHorizontal: DesignConvert.getW(9),
    //                 borderRadius: DesignConvert.getW(10),
    //                 borderWidth: DesignConvert.getW(1),
    //                 borderColor: "white",
    //             }}
    //         >
    //             {/* <View
    //                 style={{
    //                     width: DesignConvert.getW(6),
    //                     height: DesignConvert.getH(6),

    //                     backgroundColor: '#01C853',
    //                     borderRadius: DesignConvert.getW(6),
    //                 }}
    //             /> */}

    //             <Text
    //                 style={{
    //                     color: '#FFFFFFCC',
    //                     fontSize: DesignConvert.getF(10),
    //                 }}
    //             >{`在线:${this._onlineNum} >`}</Text>
    //         </TouchableOpacity>
    //     );
    // }
}