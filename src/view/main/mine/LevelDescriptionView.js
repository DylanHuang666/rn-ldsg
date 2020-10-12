/**
 * 我的 -> 等级
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView, ActivityIndicator, Slider } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../../utils/DesignConvert';
import Config from '../../../configs/Config';
import StatusBarView from "../../base/StatusBarView";
import BaseView from '../../base/BaseView';
import { ic_back_black } from "../../../hardcode/skin_imgs/common";
import ToastUtil from "../../base/ToastUtil";
import BackTitleView from "../../base/BackTitleView";
import { mine_rich_lv, mine_charm_lv } from "../../../hardcode/skin_imgs/main";
import { bg_rich_des, bg_charm_des, bg_top } from "../../../hardcode/skin_imgs/leveldescription";
import MedalWidget from "../../userinfo/MedalWidget";

/**
 * 
 */
class IconItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),
                    marginTop: DesignConvert.getH(20),
                    flexDirection: "row",
                    alignItems: "center",
                }}>

                {this.props.ImageUrl ? (
                    <Image
                        source={this.props.ImageUrl}
                        style={{
                            marginLeft: DesignConvert.getW(18),
                            width: DesignConvert.getW(44),
                            height: DesignConvert.getH(44),
                            marginRight: DesignConvert.getW(10),
                        }}></Image>
                ) : null}


                <View
                    style={{
                        flex: 1,
                    }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: "#333333",
                            fontSize: DesignConvert.getF(16),
                            fontWeight: "bold",
                            flex: 1,
                        }}>{this.props.Title}</Text>

                    <Text
                        numberOfLines={1}
                        style={{
                            color: "#999999",
                            fontSize: DesignConvert.getF(14),
                            flex: 1,
                            marginTop: DesignConvert.getH(2),
                        }}>{this.props.Content}</Text>
                </View>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={["#EF46FF", "#C728F1"]}
                    style={{
                        width: DesignConvert.getW(51),
                        height: DesignConvert.getH(20),
                        borderRadius: DesignConvert.getW(10),
                        marginRight: DesignConvert.getW(18),
                        justifyContent: "center",
                        alignItems: "center",
                        display: !this.props.statusText ? "none" : "flex",
                    }}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(10),
                        }}>{this.props.statusText}</Text>
                </LinearGradient>
            </View>
        )
    }
}

class UserItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._initData();
    }

    _initData = () => {
        require("../../../model/userinfo/UserInfoModel").default.getPersonPage(this.props.userId)
            .then(data => {
                if (!data) {
                    ToastUtil.showBottom("获取信息失败");
                }
                this._userInfo = data;
                this._faceUrl = Config.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl);
                this.forceUpdate();
            });
    }

    render() {
        return (
            <View
                style={{
                    height: DesignConvert.getH(58),
                    alignItems: 'center',
                    position: 'absolute',
                    top: DesignConvert.getH(26),
                    left: 0,
                    right: 0,
                }}>

                <Image
                    source={{ uri: this._faceUrl }}
                    style={{
                        width: DesignConvert.getW(60),
                        height: DesignConvert.getH(60),
                        borderRadius: DesignConvert.getW(30),
                    }}></Image>

                <View
                    style={{
                        marginTop: DesignConvert.getH(7),
                    }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: "rgba(29, 29, 29, 1)",
                            fontSize: DesignConvert.getF(15),
                            // width: DesignConvert.getW(180),

                        }}>{this._userInfo ? decodeURI(this._userInfo.nickName).length > 5 ? decodeURI(this._userInfo.nickName).slice(0, 5) + '...' : decodeURI(this._userInfo.nickName) : ""}</Text>
                </View>
            </View>
        )
    }

}

class LevelItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    flexDirection: "row",
                    paddingHorizontal: DesignConvert.getW(42),
                    paddingVertical: DesignConvert.getH(12),
                }}>
                <Text
                    style={{
                        color: "#212121",
                        fontSize: DesignConvert.getF(12),
                    }}>{this.props.leftText}</Text>

                <View
                    style={{
                        flex: 1,
                    }}></View>

                <Image
                    source={this.props.rich ? mine_rich_lv(this.props.level) : mine_charm_lv(this.props.level)}
                    style={{
                        width: DesignConvert.getW(42),
                        height: DesignConvert.getH(17),
                        marginRight: DesignConvert.getW(5),
                    }}></Image>
            </View>
        )
    }
}


const [rich, charm] = [233, 666]
class MyLevelDescriptionPage extends PureComponent {
    constructor(props) {
        super(props);

        this._type = this.props.type;
        this._level = this.props.level;

        this._nextLevel = 2;
        this._exp = 200;
        this._maxExp = 400;

        this._isMax = false;
        // 用户的当前经验值
        this._nextExp = 20;
        this._curLevelExp = 0;

        //距离下一级的value
        this._marginValue = 0
    }

    componentDidMount() {
        this._initData();
    }

    _initData = async () => {
        let data = await require("../../../model/main/MinePageModel").default.getPersonPage()

        this._nickName = decodeURI(data.nickName);
        this._faceUrl = Config.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl);

        let userLevel = await require("../../../model/mine/LevelDescriptionModel").default.getUserLevel();
        this._value = this._type == rich ? userLevel.contribute : userLevel.charm
        this._level = this._type == rich ? userLevel.contributeLv : userLevel.charmLv;

        if (this._type == rich) {
            require("../../../model/mine/LevelDescriptionModel").default.getRichLvData(this._level)
                .then(data => {
                    this._exp = userLevel.contribute - Number(data.curLevel.exp);
                    if (this._level >= 64) {
                        //最大等级
                        this._isMax = true;
                        this._level = 64;
                        this._nextLevel = 64;
                        this._marginValue = -1
                        // this._maxExp = Number(data.curLevel.exp);
                    } else {
                        this._maxExp = Number(data.nextLevel.exp) - Number(data.curLevel.exp);
                        // console.log(Number(data.nextLevel.exp), Number(data.curLevel.exp))
                        // console.log('等级之间的差值', this._maxExp)
                        this._nextLevel = Number(data.nextLevel.level);
                        this._nextExp = Number(data.nextLevel.exp);
                        this._marginValue = Number(data.nextLevel.exp) - Number(this._value)
                    }
                    this.forceUpdate();
                })
        } else {
            require("../../../model/mine/LevelDescriptionModel").default.getCharmLvData(this._level)
                .then(data => {
                    // console.log("getCharmLvData", data, this._level)

                    this._exp = userLevel.charm - Number(data.curLevel.exp);
                    this._curLevelExp = Number(data.curLevel.exp);
                    if (this._level >= 64) {
                        //最大等级
                        // console.log('getCharmLvData', this._nextLevel)
                        this._isMax = true;
                        this._level = 64;
                        this._nextLevel = 64;
                        this._marginValue = -1
                        // this._maxExp = this._exp;
                    } else {
                        this._maxExp = Number(data.nextLevel.exp) - Number(data.curLevel.exp);
                        this._nextLevel = Number(data.nextLevel.level);
                        this._nextExp = Number(data.nextLevel.exp);
                        this._marginValue = Number(data.nextLevel.exp) - Number(this._value)
                    }
                    this.forceUpdate();
                })
        }

        this.forceUpdate();
    }

    _renderLevelDesc = () => {
        
        return (
            <View
                style={{
                    backgroundColor: '#471025',
                    width: DesignConvert.swidth,
                    borderTopLeftRadius: DesignConvert.getW(12),
                    borderTopRightRadius: DesignConvert.getW(12),
                    marginTop: -DesignConvert.getH(12),
                    alignItems: 'center',
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: DesignConvert.getH(15),
                    }}
                >
                    <Image 
                        source={require('../../../hardcode/skin_imgs/lvdong').level_desc_left()}
                        style={{
                            width: DesignConvert.getW(48),
                            height: DesignConvert.getH(12),
                        }}
                    />

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(14),
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            marginHorizontal: DesignConvert.getW(8),
                        }}
                    >
                        {'等级说明'}
                    </Text>

                    <Image 
                        source={require('../../../hardcode/skin_imgs/lvdong').level_desc_right()}
                        style={{
                            width: DesignConvert.getW(48),
                            height: DesignConvert.getH(12),
                        }}
                    />
                </View>

                <Text
                    style={{
                        width: DesignConvert.getW(327),
                        fontSize: DesignConvert.getF(12),
                        lineHeight: DesignConvert.getH(16.5),
                        color: '#FFFFFF',
                        marginTop: DesignConvert.getW(15),
                    }}
                >
                    {'财富等级象征用户尊贵身份，可通过消费获得经验值，消费1金币=1经验值，累计足够的经验值后财富等级会自动升级。'}
                </Text>

                <Image
                    style={{
                        width: DesignConvert.getW(328),
                        height: DesignConvert.getH(232),
                        resizeMode: 'contain',
                        marginTop: DesignConvert.getH(15),
                    }}
                    source={this._type == rich ? require('../../../hardcode/skin_imgs/lvdong').level_rich_range()
                                     : require('../../../hardcode/skin_imgs/lvdong').level_charm_range()}
                />
            </View>
        )
    }

    render() {
        const topImgBg = this._type == rich ? 
            require('../../../hardcode/skin_imgs/lvdong').level_rich_bg
            : require('../../../hardcode/skin_imgs/lvdong').level_charm_bg

        const levelIcon = this._type == rich ? 
            require('../../../hardcode/skin_imgs/lvdong').level_rich_icon
            : require('../../../hardcode/skin_imgs/lvdong').level_charm_icon

        const desc = this._type == rich ? '财富' : '魅力'

        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    alignItems: "center",
                }}
                style={{
                    flex: 1,
                    width: DesignConvert.swidth,
                }}
            >
                <ImageBackground
                    source={topImgBg()}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(340),
                        alignItems: "center",
                    }}>
                    <Image
                        source={levelIcon()}
                        style={{
                            width: DesignConvert.getW(104),
                            height: DesignConvert.getH(120),
                            marginTop: DesignConvert.getH(59) + DesignConvert.statusBarHeight,
                        }}></Image>

                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),
                            marginTop: DesignConvert.getH(12),
                        }}
                    >{`${desc} Lv.${this._level}`}</Text>

                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: DesignConvert.getF(12),
                            marginTop: DesignConvert.getW(5),
                        }}
                    >{`距离下一等级还差:${this._marginValue}`}</Text>

                    <View
                        style={{
                            width: DesignConvert.getW(307),
                            height: DesignConvert.getH(7),
                            backgroundColor: "rgba(255,255, 255, 0.42)",
                            borderRadius: DesignConvert.getW(3.5),
                            marginTop: DesignConvert.getH(10),
                        }}
                    >

                        {/* <View
                            style={{
                                position: 'absolute',
                                width: DesignConvert.getW(307),
                                height: DesignConvert.getH(7),
                                backgroundColor: '#FFFFFFF',
                                display: this._isMax ? 'flex' : 'none'
                            }} 
                        /> */}

                        <View
                            style={{
                                position: 'absolute',
                                width: this._isMax ? DesignConvert.getW(307) : DesignConvert.getW(this._exp / this._maxExp * 307),
                                height: DesignConvert.getH(7),
                                backgroundColor: '#FFFFFF',
                                borderRadius: this._isMax ? 0 : DesignConvert.getW(3.5),
                            }} />
                    </View>

                    <View
                        style={{
                            width: DesignConvert.getW(307),
                            marginTop: DesignConvert.getH(5),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text
                            style={{
                                color: 'rgba(255,255, 255, 0.8)',
                                fontSize: DesignConvert.getF(12),
                            }}
                        >{`Lv.${this._level}`}</Text>
                        <Text
                            style={{
                                color: 'rgba(255,255, 255, 0.8)',
                                fontSize: DesignConvert.getF(12),
                            }}
                        >{this._isMax ? `满级` : `Lv.${this._level + 1}`}</Text>
                    </View>
                </ImageBackground>

                {this._renderLevelDesc()}
            </ScrollView >
        )
    }
}

export default class LevelDescriptionView extends BaseView {
    constructor(props) {
        super(props);

        this._selectTab = this.props.params.selectedTab;

        this._nickName = ''
        this._faceUrl = ''
        this._contributelV = 1
        this._charmLv = 1

        require("../../../model/main/MinePageModel").default.getPersonPage()
            .then(data => {
                this._nickName = decodeURI(data.nickName);
                this._faceUrl = Config.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl, 100);
                this._contributelV = data.contributeLv
                this._charmLv = data.charmLv
                this.forceUpdate()
            })

    }

    _onBackPress = () => {
        this.popSelf();
    }

    _onExplanationPress = () => {
        let tips = this._selectTab == 0 ? "三个字: 送送送" : "找人给自己刷刷刷";
        //"等级图标会展示在房间个人资料卡、个人详情页等地方。级别越高，等级图标越炫酷哦！"
        require("../../../router/level2_router").showInfoDialog(tips);
        // require("../../../router/level3_router").showLevelDescriptionDetailView(this._selectTab? 233 : 666);
    }

    _onPageChange = e => {
        this._selectTab = e.position;
        this.forceUpdate();
    }

    componentDidMount() {
        super.componentDidMount();
    }


    _renderTabLayout() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: DesignConvert.statusBarHeight,
                    width: DesignConvert.swidth,
                    flexDirection: "row",
                    height: DesignConvert.getH(44),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: DesignConvert.getW(42),
                        height: DesignConvert.getH(44),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this._onBackPress}
                >
                    <Image 
                        source={require("../../../hardcode/skin_imgs/lvdong").back_arrow()}
                        style={{
                            width: DesignConvert.getW(12),
                            height: DesignConvert.getH(21),
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 0;
                        this.forceUpdate();
                        this._viewPager.setPage(0);
                    }}
                >
                    <Text
                        style={{
                            color: this._selectTab == 0 ? "#FFFFFF" : "rgba(255,255, 255, 0.8)",
                            fontSize: DesignConvert.getF(17),
                            fontWeight: "bold",
                        }}
                    >财富等级</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 1;
                        this.forceUpdate();
                        this._viewPager.setPage(1);
                    }}
                >

                    <Text
                        style={{
                            color: this._selectTab == 1 ? "#FFFFFF" : "rgba(255,255, 255, 0.8)",
                            fontSize: DesignConvert.getF(17),
                            fontWeight: "bold",
                            marginLeft: DesignConvert.getW(70),
                        }}
                    >魅力等级</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: '#471025',
                }}
            >

                <ViewPager
                    initialPage={this._selectTab}
                    style={{
                        flex: 1,
                        width: DesignConvert.swidth,
                    }}
                    onPageSelected={this._onPageChange}
                    ref={(ref) => {
                        this._viewPager = ref;
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <MyLevelDescriptionPage
                            type={rich} />
                    </View>

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <MyLevelDescriptionPage
                            type={charm} />
                    </View>
                </ViewPager>

                {this._renderTabLayout()}
            </View>
        );
    }
}