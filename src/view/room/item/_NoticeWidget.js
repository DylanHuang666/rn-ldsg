'use strict';
import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_ROOM_NOTIC } from "../../../hardcode/HLogicEvent";
import UserInfoCache from "../../../cache/UserInfoCache";


export default class _NoticeWidget extends PureComponent {

    constructor(props) {
        super(props)

        // this._notice = '公告：' + RoomInfoCache.roomData.notic || '公告：暂无';
    }

    componentDidMount() {
        // ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_ROOM_NOTIC, this._onRefreshNotice)
    }

    componentWillUnmount() {
        // ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_ROOM_NOTIC, this._onRefreshNotice)
    }

    //更新房间公告
    _onRefreshNotice = (data) => {
        this._notice = '公告：' + RoomInfoCache.roomData.notic || '公告：暂无';
        this.forceUpdate()
    }

    _onNotice = () => {
        if (!RoomInfoCache.roomData) return;

        if (UserInfoCache.userId == RoomInfoCache.roomData.createId || RoomInfoCache.roomData.jobId <= 3) {
            require("../../../router/level3_router").showRoomEditNoticeView();
        } else {
            require("../../../router/level3_router").showRoomNoticeView();
        }
    }

    render() {
        const ic_notice = require("../../../hardcode/skin_imgs/room").ic_notice;

        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: DesignConvert.getW(15),
                    top: DesignConvert.statusBarHeight + DesignConvert.getH(380),

                    // justifyContent: "center",
                    alignItems: "center",
                }}
                onPress={this._onNotice}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(24),
                        height: DesignConvert.getH(24),
                    }}
                    source={ic_notice()}
                />

                <Text
                    style={{
                        marginTop: DesignConvert.getH(5),

                        color: 'white',
                        fontSize: DesignConvert.getF(10),
                    }}
                >房间公告</Text>
            </TouchableOpacity>
        )
    }


    // render() {
    //     return (
    //         <TouchableOpacity
    //             style={{
    //                 height: DesignConvert.getH(22),
    //                 width: DesignConvert.getW(39),
    //                 borderRadius: DesignConvert.getW(11),
    //                 borderWidth: DesignConvert.getW(1),
    //                 borderColor: "white",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 marginLeft: DesignConvert.getW(5),
    //             }}
    //             onPress={this._onNotice}
    //         >
    //             <Text
    //                 style={{
    //                     color: '#ffffffcc',
    //                     fontSize: DesignConvert.getF(10),
    //                 }}
    //             >公告</Text>
    //         </TouchableOpacity >

    //     )
    // }
}