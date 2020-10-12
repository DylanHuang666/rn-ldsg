
/**
 *  榜单 -> 头条 -> Item
 */
'use strict';

import React, { PureComponent } from "react";
import { View, FlatList, Text, Image, TouchableOpacity, } from "react-native";
import { ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../../utils/DesignConvert";
import Config from "../../../../configs/Config";
import ModelEvent from "../../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_RANK_PAGE_INDEX } from "../../../../hardcode/HLogicEvent";
import HGlobal, { COIN_NAME } from "../../../../hardcode/HGLobal";
import RoomInfoCache from "../../../../cache/RoomInfoCache";
import {
    ic_headline,
    double_arrow_right,
    ic_hot,
} from "../../../../hardcode/skin_imgs/headline";
import { THEME_COLORS } from "../../../../styles";
import SexAgeWidget from "../../../userinfo/SexAgeWidget";
import { ic_zadan_logo } from "../../../../hardcode/skin_imgs/main";

export default class HeadlinesItem extends PureComponent {

    _getGiftUrl = (giftId, logoTime) => {
        let giftUrl = Config.getGiftUrl(giftId, logoTime)
        return giftUrl;
    }

    _getText(item) {
        let text = item.eggType == 1 ? HGlobal.EGG_A : item.eggType == 2 ? HGlobal.EGG_B : HGlobal.EGG_C;
        switch (item.action) {
            case 10: text = text + "x10";
                break;
            case 100: text = text + "x100";
                break;
            default: text = text + "x1";
        }
        return text;
    }

    renderSex = (sex) => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(13),
                    height: DesignConvert.getH(13),
                    borderRadius: DesignConvert.getW(7),
                    backgroundColor: sex == 2 ? '#FF3EB0' : '#68C3FF',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Image
                    source={sex == 2 ? require('../../../../hardcode/skin_imgs/mine').icon_woman() : require('../../../../hardcode/skin_imgs/mine').icon_man()}
                    style={{
                        width: DesignConvert.getW(8),
                        height: DesignConvert.getH(8),
                    }}
                />
            </View>
        )
    }

    _enterLiveRoom = () => {
        let roomId = this.props.item.roomId;
        //在房间
        if (RoomInfoCache.isInRoom && roomId == RoomInfoCache.roomId) {
            require('../../../../model/room/RoomModel').getRoomDataAndShowView(RoomInfoCache.roomId);

            return;
        }

        // if (RoomInfoCache.isInRoom && roomId != RoomInfoCache.roomId) {
        //     require("../../../../router/level2_router").showNormTitleInfoDialog("是否离开房间，并跳转到该房间", "确认", this._enterLiveRoomInRoom, "提示");
        //     return;
        // }

        require('../../../../model/room/RoomModel').default.enterLiveRoom(roomId, '')
    }

    render() {
        const item = this.props.item;


        return (
            <TouchableOpacity
                // onPress={() => {
                //     require("../../../../router/level2_router").showUserInfoView(item.userId);
                // }}
                onPress={this._enterLiveRoom}
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(118),

                    alignSelf: "center",

                    alignItems: "center",
                    flexDirection: "row",
                    paddingBottom: DesignConvert.getH(38),

                    marginBottom: DesignConvert.getH(20),
                }}
            >
                <Image
                    source={require('../../../../hardcode/skin_imgs/headline').headline_item_bg()}
                    style={{
                        position: 'absolute',

                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(118)
                    }}
                />
                <Image
                    source={ic_zadan_logo()}
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(10),
                        top: DesignConvert.getH(15),

                        width: DesignConvert.getW(40),
                        height: DesignConvert.getH(40),
                    }} />
                <TouchableOpacity
                    onPress={() => {
                        require("../../../../router/level2_router").showUserInfoView(item.userId);
                    }}
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(15),
                        left: DesignConvert.getW(55)
                    }}
                >
                    <Image
                        source={{ uri: Config.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(48),
                            height: DesignConvert.getH(48),
                            borderRadius: DesignConvert.getW(44),

                            borderWidth: DesignConvert.getW(2),
                            borderColor: '#5F1271'
                        }}></Image>

                    {/* <SexAgeWidget
                                sex={item.sex}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    bottom: 0,
                                }}
                            /> */}
                </TouchableOpacity>

                <View
                    style={{

                        position: 'absolute',
                        left: DesignConvert.getW(115),
                        top: DesignConvert.getH(23),

                        width: DesignConvert.getW(150),

                        flexDirection: "row",
                        justifyContent: 'flex-start'
                    }}>




                    {/* <Text
                        numberOfLines={1}
                        style={{
                            color: "#5B5B5B",
                            fontSize: DesignConvert.getF(12),
                            maxWidth: DesignConvert.getW(60),
                        }}
                    ></Text> */}
                    <Text
                        style={{
                            color: "#5B5B5B",
                            fontSize: DesignConvert.getF(14),
                        }}

                    >
                        {/* {`在${HGlobal.EGG_ACTION}${this._getText(item)}获得`} */}
                        {decodeURI(item.nickName)} {`在${HGlobal.EGG_ACTION_NAME}中 获得 `}{item.gift.name}{`(${item.gift.price}${COIN_NAME})x`}{item.gift.amount}
                    </Text>

                </View>
                <Image
                    source={{ uri: this._getGiftUrl(item.gift.giftId, item.gift.logoTime) }}
                    style={{

                        position: 'absolute',
                        top: DesignConvert.getH(15),
                        right: DesignConvert.getW(10),

                        width: DesignConvert.getW(48),
                        height: DesignConvert.getH(48),
                        borderRadius: DesignConvert.getW(44),

                        borderWidth: DesignConvert.getW(2),
                        borderColor: '#5F1271'
                    }} />
                {/* {item.isLive ?
                        <View
                            style={{
                                width: DesignConvert.getW(47),
                                height: DesignConvert.getH(16),
                                borderRadius: DesignConvert.getW(10),
                                backgroundColor: '#00D8C9',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                bottom: 0,
                                left: DesignConvert.getW(4),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(9),
                                    color: '#FFFFFF',
                                }}
                            >
                                {'在房间'}
                            </Text>
                        </View>
                        : null
                    } */}


                {/* <View
                        style={{
                            width: DesignConvert.getW(140),
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    > */}

                {/* <View
                            style={{
                                width: DesignConvert.getW(140),
                                height: DesignConvert.getH(44),
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Image
                                source={double_arrow_right()}
                                style={{
                                    width: DesignConvert.getW(11),
                                    height: DesignConvert.getH(11),
                                }}></Image>

                            <Image
                                source={ic_zadan_logo()}
                                style={{
                                    width: DesignConvert.getW(44),
                                    height: DesignConvert.getH(44),
                                    resizeMode: 'contain',
                                }}></Image>

                            <Image
                                source={double_arrow_right()}
                                style={{
                                    width: DesignConvert.getW(11),
                                    height: DesignConvert.getH(11),
                                }}></Image>
                        </View> */}
                {/* <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color: "#1A1A1A",
                                fontSize: DesignConvert.getF(15),
                                fontWeight: "bold",
                                marginRight: DesignConvert.getW(6),
                                maxWidth: DesignConvert.getW(170),
                            }}
                        >{decodeURI(item.nickName)}</Text>

                        {this.renderSex(item.base.sex)}

                        <Image
                            source={require('../../../../hardcode/skin_imgs/main').mine_rich_lv(item.base.contributeLv)}
                            style={{
                                width: DesignConvert.getW(32),
                                height: DesignConvert.getH(13),
                                marginLeft: DesignConvert.getW(6),
                            }}
                        />

                        <Text
                            style={{
                                color: "#999999",
                                fontSize: DesignConvert.getF(10),
                            }}
                        >{item.timeStr}</Text>
                    </View> */}


                {/* </View> */}

                {/* <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    > */}


                {/* <View
                        style={{
                            marginTop: DesignConvert.getH(4),
                            flexDirection: 'row'
                        }}
                    >
                        <Image
                            source={require('../../../../hardcode/skin_imgs/main').ic_rank_exp()}
                            style={{
                                width: DesignConvert.getW(12),
                                height: DesignConvert.getH(12),
                                resizeMode: 'contain'
                            }}
                        />
                        <Text
                            style={{
                                marginLeft: DesignConvert.getW(2),
                                color: "#FFBE26",
                                fontSize: DesignConvert.getF(10),
                            }}
                        >{`${item.gift.price}`}</Text>
                    </View> */}
                {/* </View> */}

            </TouchableOpacity>
        )
    }
}