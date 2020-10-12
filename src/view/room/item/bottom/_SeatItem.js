'use strict';

import React, { PureComponent } from "react";
import { TouchableOpacity, Image } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import { ic_on_seat } from "../../../../hardcode/skin_imgs/room";
import RoomInfoCache from "../../../../cache/RoomInfoCache";
import UserInfoCache from "../../../../cache/UserInfoCache";

export default class _SeatItem extends PureComponent {

    constructor(props) {
        super(props)

        this._show = false//是否排麦权限

        require('../../../../model/room/RoomModel').default.getRoomConfigData()
            .then(data => {
                this._show = data
                this.forceUpdate()
            })
    }


    _onPress = () => {
        //1.查询自己是否在麦上
        let actionIndex = -1
        RoomInfoCache.roomData.infos.forEach((element, index) => {
            if (element.base && element.base.userId == UserInfoCache.userId) {
                actionIndex = index
            }
        });

        let vo
        RoomInfoCache.MicQues.forEach(element => {
            if (element && element.userId == UserInfoCache.userId) {
                vo = element
            }
        })

        //判断自己是否有权限或者在排麦列表中
        if (RoomInfoCache.haveRoomPermiss || vo) {
            //打开排麦面板
            require('../../../../router/level3_router').showMicQueView()
        } else {
            //上麦
            require('../../../../model/room/MicQueModel').default.joinMicQue()
        }
    }

    render() {
        if (!this._show) {
            return null
        }

        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(8),
                }}
                onPress={this._onPress}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(32),
                        height: DesignConvert.getH(32),
                    }}
                    source={ic_on_seat()}
                />
            </TouchableOpacity>
        );
    }
}