'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import { ic_rank_cup } from "../../../hardcode/skin_imgs/room";
import RoomInfoCache from '../../../cache/RoomInfoCache';

export default class _RankListItem extends PureComponent {


    _onOpenRank = () => {
        require("../../../router/level3_router").showRoomRankPage(RoomInfoCache.roomId, this._toTop);
    }

    _toTop = () => {
        require("../../../router/level3_router").showRoomGiftPanelView();
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(85),
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    backgroundColor: '#000000',
                    borderTopLeftRadius: DesignConvert.getW(16),
                    borderBottomLeftRadius: DesignConvert.getW(16),
                    width: DesignConvert.getW(61),
                    height: DesignConvert.getH(21),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onPress={this._onOpenRank}
            >

                <Image
                    style={{
                        width: DesignConvert.getW(12.5),
                        height: DesignConvert.getH(11),
                    }}

                    source={ic_rank_cup()}
                />

                <Text
                    style={{
                        color: "white",
                        fontSize: DesignConvert.getF(12),
                        textAlign: "center",
                        marginRight: DesignConvert.getW(8),
                    }}>排行榜</Text>
                {/* <ImageBackground
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: DesignConvert.getW(74),

                        width: DesignConvert.getW(24),
                        height: DesignConvert.getH(24),
                    }}
                    source={rank_first_bg()}
                >

                </ImageBackground>

                <ImageBackground
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(4),
                        right: DesignConvert.getW(49),

                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                    }}
                    source={rank_other_bg()}
                >

                </ImageBackground>

                <ImageBackground
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(4),
                        right: DesignConvert.getW(25),

                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                    }}
                    source={rank_other_bg()}
                >

                </ImageBackground> */}


            </TouchableOpacity>
        )
    }
}