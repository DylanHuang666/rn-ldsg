'use strict';

import React, { PureComponent } from "react";
import { View, ImageBackground, Image, TouchableOpacity } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import { ic_rank_cham, ic_rank_more, ic_rank_1, ic_rank_2, ic_rank_3, ic_rank_next } from "../../../hardcode/skin_imgs/room";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import Config from "../../../configs/Config";

export default class _RoomRankItem extends PureComponent {

    constructor(props) {
        super(props)

        this._bLoading = false
    }

    componentDidMount() {
        this._initData()
        this._timer = setInterval(() => {
            this._initData()
        }, 3000);
    }

    componentWillUnmount() {
        this._timer && clearInterval(this._timer);
    }

    _initData = async () => {
        if (this._bLoading) {
            return
        }
        this._bLoading = true
        let res = await require("../../../model/room/RoomManagerModel").default.getRoomRankList(RoomInfoCache.roomId, 26, 0, 3)

        this._list = res.list
        this._bLoading = false
        this.forceUpdate();
    }

    _onOpenRank = () => {
        require("../../../router/level3_router").showRoomRankPage(RoomInfoCache.roomId, this._toTop);
    }

    _renderItem(fnBgIcon, userInfo) {
        return (
            <View
                style={{
                    width: DesignConvert.getW(29),
                    height: DesignConvert.getH(40),
                    marginRight: DesignConvert.getW(5),
                }}
            >

                <Image
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(11),

                        width: DesignConvert.getW(29),
                        height: DesignConvert.getH(29),

                        borderRadius: DesignConvert.getW(5),

                        // resizeMode: 'stretch',
                    }}
                    source={{ uri: userInfo ? Config.getHeadUrl(userInfo.userId, userInfo.logoTime, userInfo.thirdIconurl) : null }}
                />

                <Image
                    style={{
                        position: 'absolute',
                        width: DesignConvert.getW(29),
                        height: DesignConvert.getH(40),

                        // resizeMode: 'stretch',
                    }}
                    source={fnBgIcon()}
                />
            </View>
        )

        // return (
        //     <ImageBackground
        //         style={{
        //             width: DesignConvert.getW(29),
        //             height: DesignConvert.getH(40),
        //             marginEnd: DesignConvert.getW(5),
        //         }}
        //         source={fnBgIcon()}
        //     >

        //         <Image
        //             style={{
        //                 width: DesignConvert.getW(29),
        //                 height: DesignConvert.getH(29),
        //                 marginTop: DesignConvert.getH(11),
        //             }}
        //             source={{ uri: userInfo ? Config.getHeadUrl(userInfo.userId, userInfo.logoTime, userInfo.thirdIconurl) : null }}
        //         />
        //     </ImageBackground>
        // )
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: DesignConvert.getH(15),
                    left: DesignConvert.getW(20),

                    height: DesignConvert.getH(34),
                    flexDirection: 'row',
                    // alignItems: 'center',
                }}
                onPress={this._onOpenRank}
            >

                {this._renderItem(ic_rank_1, this._list && this._list.length > 0 ? this._list[0] : null)}
                {this._renderItem(ic_rank_2, this._list && this._list.length > 1 ? this._list[1] : null)}
                {this._renderItem(ic_rank_3, this._list && this._list.length > 2 ? this._list[2] : null)}

                <Image
                    source={ic_rank_next()}
                    style={{
                        marginTop: DesignConvert.getH(20),

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
    //             style={{
    //                 position: 'absolute',
    //                 bottom: DesignConvert.getH(15),
    //                 left: DesignConvert.getW(20),
    //             }}
    //             onPress={this._onOpenRank}
    //         >

    //             <Image 
    //                 source={require('../../../hardcode/skin_imgs/yuanqi').room_contribute_icon()}
    //                 style={{
    //                     width: DesignConvert.getW(42),
    //                     height: DesignConvert.getH(44),
    //                     resizeMode: 'contain',
    //                 }}
    //             />

    //         </TouchableOpacity>
    //     )
    // }
}