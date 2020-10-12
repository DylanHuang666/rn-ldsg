/**
 * 房间 -> 排行榜
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView, Modal, DevSettings } from "react-native";
import { ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import ToastUtil from "../../base/ToastUtil";
import BaseView from "../../base/BaseView";
import { THEME_COLOR } from "../../../styles";
import MedalWidget from "../../userinfo/MedalWidget";
import { RankItemPage } from "../../main/rank/RankPage";
const [charm, rich] = [1, 4];
class RoomRankItemPage extends PureComponent {

    constructor(prop) {
        super(prop);

        this._selectTab = 1;

        this._roomId = this.props.roomId;
        this._data = { list: [] };
        this._myInfo = {};


        //    * 魅力榜  日榜：21 周榜：22 月榜：23
        // * 土豪榜  日榜：24 周榜：25 月榜：26
        // console.log("榜单", this.props.type);
    }

    _initData() {
        require("../../../model/room/RoomManagerModel").default.getRoomRankList(this._roomId, this.props.type + this._selectTab)
            .then(data => {
                this._data = data;
                // console.log("this._data", this._data);
                this.forceUpdate();
            });

        require("../../../model/main/MinePageModel").default.getPersonPageAndLevel()
            .then(data => {
                // console.log("个人信息", data);
                this._myInfo = data;
                this.forceUpdate();
            })
    }

    _onItemPress = (userId) => {
        this.props.popSelf()
        require("../../../router/level2_router").showUserInfoView(userId);
    }

    componentDidMount() {
        this._initData();
    }

    _renderTabLayout() {

        const colors = this.props.type === rich ? ["#8A50FC", "#F293FF"] : ['#FB53A7', '#FFB0B0']
        const unSelTextColor = this.props.type === rich ? '#8A50FC' : '#FB53A7';

        return (
            <View
                style={{
                    width: DesignConvert.getW(315),
                    height: DesignConvert.getH(39),
                    backgroundColor: "#FFFFFF",
                    borderRadius: DesignConvert.getW(20),
                    borderColor: '#FFFFFF4C',
                    borderWidth: DesignConvert.getW(3),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    marginTop: DesignConvert.getH(43),
                    paddingHorizontal: DesignConvert.getW(4),
                }}
            >

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 0;
                        this._initData();
                        this.forceUpdate();
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={this._selectTab == 0 ? colors : ['transparent', 'transparent']}

                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getH(25),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: DesignConvert.getW(12),
                        }}
                    >
                        <Text
                            style={{
                                color: this._selectTab == 0 ? "#FFFFFF" : unSelTextColor,
                                fontSize: DesignConvert.getF(13),
                            }}
                        >日榜</Text>
                    </LinearGradient>

                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 1;
                        this._initData();
                        this.forceUpdate();
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={this._selectTab == 1 ? colors : ['transparent', 'transparent']}

                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getH(25),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: DesignConvert.getW(12),
                        }}
                    >
                        <Text
                            style={{
                                color: this._selectTab == 1 ? "#FFFFFF" : unSelTextColor,
                                fontSize: DesignConvert.getF(13),
                            }}
                        >周榜</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 2;
                        this._initData();
                        this.forceUpdate();
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={this._selectTab == 2 ? colors : ['transparent', 'transparent']}

                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getH(25),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: DesignConvert.getW(12),
                        }}
                    >
                        <Text
                            style={{
                                color: this._selectTab == 2 ? "#FFFFFF" : unSelTextColor,
                                fontSize: DesignConvert.getF(13),
                            }}
                        >月榜</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        )
    }

    _renderEmptyView = () => {
        return (
            <View></View>
        )
    }

    _keyExtractor = (item, index) => item.userId;

    _renderItemView = ({ item }) => {
        if (item.rank < 4) {
            return null
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.popSelf()
                    require("../../../router/level2_router").showUserInfoView(item.userId, true);
                }}
                style={{
                    height: DesignConvert.getH(70),
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: 'center',
                    width: DesignConvert.getW(345),
                    borderBottomColor: '#40365C',
                    borderBottomWidth: DesignConvert.getH(1),
                }}
            >

                <Text
                    style={{
                        fontSize: DesignConvert.getF(14),
                        marginLeft: DesignConvert.getW(8.5),
                        color: '#FFFFFF',
                    }}>{item.rank}</Text>

                {/* <Image
                    source={item.rank == 1 ? require("../../../hardcode/skin_imgs/room").first() :
                        item.rank == 2 ? require("../../../hardcode/skin_imgs/room").second() :
                            require("../../../hardcode/skin_imgs/room").third()}
                    style={{
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(22),
                        marginLeft: DesignConvert.getW(15),
                        marginRight: DesignConvert.getW(11),
                        display: item.rank > 3 ? "none" : "flex",
                    }}></Image> */}

                <Image
                    source={{ uri: Config.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                    style={{
                        width: DesignConvert.getW(39),
                        height: DesignConvert.getH(39),
                        borderRadius: DesignConvert.getW(20),
                        marginLeft: DesignConvert.getW(15),
                    }}></Image>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        marginLeft: DesignConvert.getW(8),
                    }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: DesignConvert.getF(12),
                            lineHeight: DesignConvert.getH(16.5),
                            color: '#FFFFFF',
                            marginBottom: DesignConvert.getH(3),
                        }}>{decodeURI(item.nickName)}</Text>

                    <MedalWidget
                        richLv={this.props.type == rich ? item.contributeLv : -1}
                        charmLv={this.props.type == rich ? -1 : item.charmLv}
                        width={DesignConvert.getW(37)}
                        height={DesignConvert.getH(15)}
                        noMargin
                    />

                </View>

                <Image
                    source={this.props.type === rich ? require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_fh_icon()
                        : require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_xd_icon()}
                    style={{
                        width: DesignConvert.getW(14),
                        height: DesignConvert.getH(14),
                    }}
                />
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(11),
                        marginLeft: DesignConvert.getW(2),
                    }}>
                    {item.rankScore}
                </Text>

            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                }}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={this.props.type == rich ? ['#723DEA', '#B868FF'] : ['#FB53A7', '#FFB0B0']}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(240),
                        borderTopLeftRadius: DesignConvert.getW(15),
                        borderTopRightRadius: DesignConvert.getW(15),
                        alignItems: 'center',
                    }}
                >

                    <Image
                        source={
                            this.props.type == rich ?
                                require('../../../hardcode/skin_imgs/ccc').ttq_fh_zhuzi() :
                                require('../../../hardcode/skin_imgs/ccc').ttq_xd_zhuzi()
                        }
                        style={{
                            position: 'absolute',
                            width: DesignConvert.getW(308),
                            height: DesignConvert.getH(137),
                            bottom: 0,
                            left: DesignConvert.getW(33.5),
                        }}
                    />

                    {this._renderTabLayout()}

                    <TouchableOpacity
                        onPress={() => {
                            if (this._data.list[1]) {
                                this._onItemPress(this._data.list[1].userId)
                            }
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: DesignConvert.getW(33.5),
                            width: DesignConvert.getW(87),
                            height: DesignConvert.getH(136),
                            alignItems: "center",
                        }}>

                        <View>
                            <Image
                                source={{
                                    uri: this._data.list[1] ?
                                        require("../../../configs/Config").default.getHeadUrl(this._data.list[1].userId, this._data.list[1].logoTime, this._data.list[1].thirdIconurl)
                                        : null
                                    // : require("../../../hardcode/skin_imgs/registered").ic_default_header()
                                }}
                                style={{
                                    width: DesignConvert.getW(54),
                                    height: DesignConvert.getH(54),
                                    borderRadius: DesignConvert.getW(14),
                                    position: "absolute",
                                    bottom: DesignConvert.getH(2),
                                    left: DesignConvert.getH(2),
                                }}></Image>

                            <Image
                                source={require("../../../hardcode/skin_imgs/ccc").ttq_r_rank_two()}
                                style={{
                                    width: DesignConvert.getW(58),
                                    height: DesignConvert.getH(66),
                                }}></Image>
                        </View>

                        <Text
                            numberOfLines={1}
                            style={{
                                maxWidth: DesignConvert.getW(87),
                                color: "#FFFFFF88",
                                fontSize: DesignConvert.getF(12),
                                lineHeight: DesignConvert.getH(16.5),
                                textAlign: "center",
                                marginTop: DesignConvert.getH(9),
                                marginBottom: DesignConvert.getH(2.5),
                            }}
                        >{!this._data.list[1] ? "虚位以待" : decodeURI(this._data.list[1].nickName)}</Text>

                        {!this._data.list[1] ? null :
                            <MedalWidget
                                richLv={this.props.type == rich ? this._data.list[1].contributeLv : -1}
                                charmLv={this.props.type == rich ? -1 : this._data.list[1].charmLv}
                                width={DesignConvert.getW(37)}
                                height={DesignConvert.getH(15)}
                                noMargin
                            />
                        }

                        {!this._data.list[1] ? null :
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: DesignConvert.getH(4),
                                }}
                            >
                                <Image
                                    source={this.props.type === rich ? require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_fh_icon()
                                        : require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_xd_icon()}
                                    style={{
                                        width: DesignConvert.getW(14),
                                        height: DesignConvert.getH(14),
                                    }}
                                />
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: DesignConvert.getF(11),
                                        marginLeft: DesignConvert.getW(2),
                                    }}
                                >{this._data.list[1].rankScore}</Text>
                            </View>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (this._data.list[0]) {
                                this._onItemPress(this._data.list[0].userId)
                            }
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: DesignConvert.getW(144),
                            width: DesignConvert.getW(87),
                            height: DesignConvert.getH(150),
                            alignItems: "center",
                        }}
                    >

                        <View>
                            <Image
                                source={{
                                    uri: this._data.list[0] ?
                                        require("../../../configs/Config").default.getHeadUrl(this._data.list[0].userId, this._data.list[0].logoTime, this._data.list[0].thirdIconurl)
                                        : null
                                    // : require("../../../hardcode/skin_imgs/registered").ic_default_header()
                                }}
                                style={{
                                    width: DesignConvert.getW(54),
                                    height: DesignConvert.getH(54),
                                    borderRadius: DesignConvert.getW(14),
                                    position: "absolute",
                                    bottom: DesignConvert.getH(2),
                                    left: DesignConvert.getH(2),
                                }}
                            />

                            <Image
                                source={require("../../../hardcode/skin_imgs/ccc").ttq_r_rank_one()}
                                style={{
                                    width: DesignConvert.getW(58),
                                    height: DesignConvert.getH(66),
                                }} />
                        </View>

                        <Text
                            numberOfLines={1}
                            style={{
                                maxWidth: DesignConvert.getW(87),
                                color: "#FFFFFF88",
                                fontSize: DesignConvert.getF(12),
                                lineHeight: DesignConvert.getH(16.5),
                                textAlign: "center",
                                marginTop: DesignConvert.getH(9),
                                marginBottom: DesignConvert.getH(2.5),
                            }}
                        >{!this._data.list[0] ? "虚位以待" : decodeURI(this._data.list[0].nickName)}</Text>

                        {!this._data.list[0] ? null :
                            <MedalWidget
                                richLv={this.props.type == rich ? this._data.list[0].contributeLv : -1}
                                charmLv={this.props.type == rich ? -1 : this._data.list[0].charmLv}
                                width={DesignConvert.getW(37)}
                                height={DesignConvert.getH(15)}
                                noMargin
                            />
                        }
                        {!this._data.list[0] ? null :
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: DesignConvert.getH(4),
                                }}
                            >
                                <Image
                                    source={this.props.type === rich ? require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_fh_icon()
                                        : require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_xd_icon()}
                                    style={{
                                        width: DesignConvert.getW(14),
                                        height: DesignConvert.getH(14),
                                    }}
                                />
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: DesignConvert.getF(11),
                                        marginLeft: DesignConvert.getW(2),
                                    }}
                                >{this._data.list[0].rankScore}</Text>
                            </View>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (this._data.list[2]) {
                                this._onItemPress(this._data.list[2].userId)
                            }
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: DesignConvert.getW(33),
                            width: DesignConvert.getW(87),
                            height: DesignConvert.getH(136),
                            alignItems: "center",
                        }}>

                        <View>
                            <Image
                                source={{
                                    uri: this._data.list[2] ?
                                        require("../../../configs/Config").default.getHeadUrl(this._data.list[2].userId, this._data.list[2].logoTime, this._data.list[2].thirdIconurl)
                                        : null
                                    // : require("../../../hardcode/skin_imgs/registered").ic_default_header()
                                }}
                                style={{
                                    width: DesignConvert.getW(54),
                                    height: DesignConvert.getH(54),
                                    borderRadius: DesignConvert.getW(14),
                                    position: "absolute",
                                    bottom: DesignConvert.getH(2),
                                    left: DesignConvert.getH(2),
                                }}></Image>

                            <Image
                                source={require("../../../hardcode/skin_imgs/ccc").ttq_r_rank_three()}
                                style={{
                                    width: DesignConvert.getW(58),
                                    height: DesignConvert.getH(66),
                                }}></Image>
                        </View>

                        <Text
                            numberOfLines={1}
                            style={{
                                maxWidth: DesignConvert.getW(87),
                                color: "#FFFFFF88",
                                fontSize: DesignConvert.getF(12),
                                lineHeight: DesignConvert.getH(16.5),
                                textAlign: "center",
                                marginTop: DesignConvert.getH(9),
                                marginBottom: DesignConvert.getH(2.5),
                            }}
                        >{!this._data.list[2] ? "虚位以待" : decodeURI(this._data.list[2].nickName)}</Text>

                        {!this._data.list[2] ? null :
                            <MedalWidget
                                richLv={this.props.type == rich ? this._data.list[2].contributeLv : -1}
                                charmLv={this.props.type == rich ? -1 : this._data.list[2].charmLv}
                                width={DesignConvert.getW(37)}
                                height={DesignConvert.getH(15)}
                                noMargin
                            />
                        }

                        {!this._data.list[2] ? null :
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: DesignConvert.getH(4),
                                }}
                            >
                                <Image
                                    source={this.props.type === rich ? require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_fh_icon()
                                        : require('../../../hardcode/skin_imgs/ccc').ttq_r_rank_xd_icon()}
                                    style={{
                                        width: DesignConvert.getW(14),
                                        height: DesignConvert.getH(14),
                                    }}
                                />
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: DesignConvert.getF(11),
                                        marginLeft: DesignConvert.getW(2),
                                    }}
                                >{this._data.list[2].rankScore}</Text>
                            </View>
                        }
                    </TouchableOpacity>

                </LinearGradient>

                <FlatList
                    style={{
                        width: DesignConvert.swidth,
                        flex: 1,
                        backgroundColor: '#2A2045',
                    }}
                    data={this._data.list}
                    renderItem={this._renderItemView}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={this._renderEmptyView}
                />

                {/* <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['rgba(255, 255, 255, 0)', 'rgba(179, 179, 179, 0.5)']}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(20),
                        position: "absolute",
                        bottom: DesignConvert.getH(56),
                    }}
                ></LinearGradient>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(56),
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={{ uri: Config.getHeadUrl(this._myInfo.userId, this._myInfo.logoTime, this._myInfo.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(36),
                            height: DesignConvert.getH(36),
                            borderRadius: DesignConvert.getW(36),
                            marginLeft: DesignConvert.getW(25),
                            marginRight: DesignConvert.getW(20),
                        }}></Image>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(12),
                                    marginRight: DesignConvert.getW(8.33),
                                }}
                            >{decodeURI(this._myInfo.nickName)}</Text>

                            <Image
                                source={
                                    this.props.type == rich ?
                                        require("../../../hardcode/skin_imgs/main").mine_rich_lv(this._myInfo.contributeLv) :
                                        require("../../../hardcode/skin_imgs/main").mine_charm_lv(this._myInfo.charmLv)
                                }
                                style={{
                                    width: DesignConvert.getW(37),
                                    height: DesignConvert.getH(15),
                                }}></Image>
                        </View>

                        <Text
                            style={{
                                width: DesignConvert.getW(64),
                                color: "white",
                                fontSize: DesignConvert.getF(12),
                                marginTop: DesignConvert.getW(6),
                                backgroundColor: this.props.type == rich ? "#FEA328" : "#C753D0",
                                textAlign: "center",
                                borderRadius: DesignConvert.getW(10),
                            }}
                        >{this.props.type == rich ? "土豪值 " + this._data.myScore : "魅力值 " + this._data.myScore}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={this.props.toSB}
                        style={{
                            width: DesignConvert.getW(70),
                            height: DesignConvert.getH(24),
                            backgroundColor: "#F63D6E",
                            borderRadius: DesignConvert.getW(12),
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: DesignConvert.getW(20),
                            display: this.props.type == rich ? "flex" : "none",

                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                textAlign: "center",
                            }}
                        >去上榜</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }
}
class TouchSelectTabs extends PureComponent {
    render() {

        const fontSelectColor = this.props.type === 0 ? '#121212' : '#121212'

        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.getW(50),
                    height: DesignConvert.getH(28),
                    alignItems: 'center',
                }}
                // activeOpacity={0.9}
                onPress={this.props.onPress}
            >
                <Text
                    style={{
                        color: this.props.selectTab == this.props.type ? fontSelectColor : "rgba(18, 18, 18, 0.4)",
                        fontSize: this.props.selectTab == this.props.type ? DesignConvert.getF(14) : DesignConvert.getF(14),
                        fontWeight: this.props.selectTab == this.props.type ? "bold" : "bold",
                    }}
                >{this.props.title}</Text>

                {this.props.selectTab == this.props.type ?
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[THEME_COLOR, THEME_COLOR]}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(4),
                            borderRadius: DesignConvert.getW(3),
                        }}
                    />
                    : null
                }
            </TouchableOpacity>
        )
    }
}
export default class RoomRankPage extends BaseView {

    constructor(props) {
        super(props);

        this._tabLayoutOffset = 0;
        this._selectTab = 0;
        this._dialogVisable = true;
    }

    showDia = () => {
        this._dialogVisable = true;
        this.forceUpdate();
    }

    dismissDia = () => {
        this._dialogVisable = false;
        this.forceUpdate();
        this.popSelf();
    }

    _onPageSelected = e => {
        this._selectTab = e.position;
        // this._tabLayoutOffset = e.offset;
        this.forceUpdate();
    }

    _getViewPager = ref => {
        this._viewPager = ref;
    }

    _toSB = () => {
        this.popSelf();
        if (this.props.params.toTop != undefined) {
            this.props.params.toTop();
        }
    }

    _renderTabLayout() {
        return (
            <View
                style={{
                    position: 'absolute',
                    left: DesignConvert.getW(15),
                    top: DesignConvert.getH(12),

                    width: DesignConvert.getW(110),

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'space-between',
                }}
            >
                <TouchSelectTabs
                    onPress={() => {
                        this._selectTab = 0;
                        this.forceUpdate();
                        this._viewPager.setPage(0);
                    }}
                    type={0}
                    title="贡献榜"
                    selectTab={this._selectTab}
                />

                <TouchSelectTabs
                    onPress={() => {
                        this._selectTab = 1;
                        this.forceUpdate();
                        this._viewPager.setPage(1);
                    }}
                    type={1}
                    title="魅力榜"
                    selectTab={this._selectTab}
                />

                {/* <View
                    style={{
                        width: DesignConvert.getW(15),
                        height: DesignConvert.getH(4),
                        borderRadius: DesignConvert.getW(2),
                        position: "absolute",
                        backgroundColor: "#F63B6D",
                        bottom: 0,
                        left: DesignConvert.getW(this._selectTab == 0 ? 90 : 270),
                    }}
                ></View> */}
            </View>
        )
    }

    render() {
        const linear = this._selectTab === 0 ? ["#FFC746", "#EEAA3C"] : ["#F58DFF", "#CF61F7"]

        return (

            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.2)",
                }}
            >

                <TouchableOpacity
                    onPress={this.dismissDia}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(210),
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        borderRadius: DesignConvert.getW(10),

                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={linear}
                        style={{
                            position: 'absolute',
                            width: DesignConvert.swidth,
                            height: DesignConvert.sheight,
                            borderRadius: DesignConvert.getW(10),
                        }}
                    />
                    <ViewPager
                        initialPage={this._selectTab}
                        style={{
                            flex: 1,
                        }}
                        onPageSelected={this._onPageSelected}
                        scrollEnabled={false}
                        ref={this._getViewPager}
                    >

                        <View
                            style={{
                                flex: 1,
                            }}
                        >

                            <RankItemPage
                                roomId={this.props.params.roomId}
                                popSelf={this.popSelf}
                                type={rich}

                            />

                            {/* <RoomRankItemPage
                                toSB={this._toSB}
                                roomId={this.props.params.roomId}
                                type={rich}
                                popSelf={this.popSelf} /> */}
                        </View>

                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <RankItemPage
                                roomId={this.props.params.roomId}
                                popSelf={this.popSelf}
                                type={charm}

                            />
                            {/* <RoomRankItemPage
                                toSB={this._toSB}
                                roomId={this.props.params.roomId}
                                type={charm}
                                popSelf={this.popSelf} /> */}
                        </View>
                    </ViewPager>

                    {this._renderTabLayout()}

                </View>

            </View>
        );
    }

}