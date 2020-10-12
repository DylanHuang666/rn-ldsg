/**
 * 主界面 -> 我的
 */
'use strict';

import React, { PureComponent, Component } from "react";
import { View, Image, ImageBackground, Text, TouchableOpacity, Clipboard, ScrollView, Platform } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import ToastUtil from "../../base/ToastUtil";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_USER_INFO, EVT_UPDATE_WALLET, } from "../../../hardcode/HLogicEvent";
import RoomInfoCache from "../../../cache/RoomInfoCache";
import UserInfoCache from "../../../cache/UserInfoCache";
import { COIN_NAME, } from '../../../hardcode/HGLobal';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import MedalWidget from "../../userinfo/MedalWidget";
import HomePageModel from '../../../model/main/HomePageModel';
import {
    mine_arrow_right,
    mine_coin_icon,
    mine_benifit,
    mine_level,
    mine_logout,
    mine_setting,
    icon_man,
    icon_woman,
    mine_shadow,
} from '../../../hardcode/skin_imgs/mine';
import { LINEARGRADIENT_COLOR } from "../../../styles";
import { toAnnouncerCertificationView } from "../../../model/announcer/AnnouncerCertificationModel";
import { Follow, Fans, Friend } from "./FollowAndFansView";

class ItemTouch extends PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    height: DesignConvert.getH(67),
                    width: DesignConvert.swidth,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Image
                    source={this.props.source}
                    style={{
                        width: DesignConvert.getW(21),
                        height: DesignConvert.getH(21),
                        resizeMode: 'contain',
                        marginLeft: DesignConvert.getW(16),
                        marginRight: DesignConvert.getW(10),
                    }}
                />
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(14)
                    }}
                >
                    {this.props.title}
                </Text>
                <Image
                    source={mine_arrow_right()}
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(18),
                        width: DesignConvert.getW(6),
                        height: DesignConvert.getH(9),
                    }}
                />
            </TouchableOpacity>
        )
    }
}

export default class MinePage extends PureComponent {

    constructor(props) {
        super(props);

        this._userId = UserInfoCache.userId;
        this._cutenumber = null//靓号
        this._cuteIcon = null//靓号icon
        this._avatar = null;
        this._nickName = "暂无昵称";
        this._richLv = 1;
        this._charmLv = 1;
        this._myLoves = 0;
        this._fans = 0;
        this._friends = 0;
        this._accountMoney = 0;

        this._hasNotRead = false;
    }

    _onAvatarPress = () => {
        require("../../../router/level2_router").showUserInfoView(this._userId);
    }

    _onEditPress = () => {
        require("../../../router/level2_router").showUserInfoEditView();
    }

    _onCopyPress = () => {
        Clipboard.setString(this._userId);
        ToastUtil.showCenter("复制成功");
    }

    _onRichPress = () => {
        require("../../../router/level2_router").showLevelDescriptionView(0);
    }

    _onCharmPress = () => {
        require("../../../router/level2_router").showLevelDescriptionView(1);
    }

    _onFriendsPress = () => {
        require("../../../router/level2_router").showFollowAndFansView(Friend);
    }

    _onFansPress = () => {
        require("../../../router/level2_router").showFollowAndFansView(Fans);
    }

    _onMyLovesPress = () => {
        require("../../../router/level2_router").showFollowAndFansView(Follow);
    }

    _onTopUpPress = () => {
        require("../../../router/level2_router").showMyWalletView();
    }

    _onMyLvPress = () => {


        require("../../../router/level2_router").showLevelDescriptionView(0);
    }

    _onHelpPress = () => {
        //TODO:帮助与反馈

    }

    _onSettingPress = () => {
        require("../../../router/level2_router").showSettingView();
        // require('../../../router/level2_router').showChatHallView()
    }

    _onEnterMyRoom = () => {
        require('../../../model/room/RoomModel').beforeOpenLive()
    }

    _onEnterMyCertVoice = async () => {
        toAnnouncerCertificationView()
    }

    _onEnterMyMall = () => {
        require("../../../router/level3_router").showPersonalLookMallView()
    }

    _onEnterMyBenefit = () => {
        require("../../../router/level2_router").showAnchorIncomeView()
    }

    _onExit = () => {
        require('../../../model/LoginModel').default.logout();
    }

    showAboutUs = () => {
        require('../../../router/level3_router').showAboutUsView()
    }

    showCertPage = () => {
        require('../../../router/level2_router').showCertificationPage()
    }

    showBindPhone = () => {
        require('../../../router/level3_router').showBindPhoneView()
    }

    _onSetPayPsw = () => {
        if (!UserInfoCache.phoneNumber) {
            ToastUtil.showCenter("请先绑定手机")
            return
        }
        require("../../../router/level3_router").showUpdatePasswordView(require("../../setting/UpdatePasswordView").updatePayPassword);
    }

    _onSetPsw = () => {
        if (!UserInfoCache.phoneNumber) {
            ToastUtil.showCenter("请先绑定手机")
            return
        }
        require('../../../router/level3_router').showUpdatePasswordView(require("../../setting/UpdatePasswordView").updatePassword)
    }

    componentDidMount() {
        //注册事件
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initData);
        ModelEvent.addEvent(null, EVT_UPDATE_WALLET, this._initData);
        this._initData();

    }

    componentWillUnmount() {
        //解绑事件
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initData);
        ModelEvent.removeEvent(null, EVT_UPDATE_WALLET, this._initData);
    }

    _initData = () => {
        if (!UserInfoCache.userInfo) {
            return
        }
        require('../../../model/userinfo/UserInfoModel').default.getGoodId(UserInfoCache.userId)
            .then(data => {
                if (data) {
                    //设置靓号
                    this._cutenumber = data.cutenumber
                    this._cuteIcon = data.icon
                } else {
                    //没有靓号
                    this._cutenumber = null
                    this._cuteIcon = null
                }
                this.forceUpdate()
            })
        require("../../../model/main/MinePageModel").default.getPersonPage()
            .then(data => {
                this._userId = data.userId;
                this._nickName = decodeURI(data.nickName);
                this._avatar = { uri: require("../../../configs/Config").default.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl) };
                this._richLv = data.contributeLv;
                this._charmLv = data.charmLv;
                this._myLoves = data.myLoves;
                this._fans = data.friends;
                this._sex = data.sex;
                this._age = data.age;
                this._constellation = data.constellation;
                this.forceUpdate();
            });

        require('../../../model/message/FriendsModel').default.getFriends(3)
            .then(data => {
                this._friends = data.length
            })

        require("../../../model/BagModel").default.getWallet()
            .then(data => {
                this._accountMoney = data.goldShell;
                this.forceUpdate();
            });

        require("../../../model/main/MinePageModel").default.getAdviseList()
            .then(data => {
                this._hasNotRead = data;
                this.forceUpdate();
            });
    }

    _renderMineInfo = () => {
        return (
                <ImageBackground
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(220)
                    }}
                    source={require('../../../hardcode/skin_imgs/mine').mine_header_bg()}
                >
                    <View
                        style={{
                            marginLeft: DesignConvert.getW(30),
                            marginTop: DesignConvert.getH(95)
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    maxWidth: DesignConvert.getW(140),
                                    color: "#FFFFFF",
                                    fontSize: DesignConvert.getF(16),
                                    fontWeight: "bold",
                                }}>{this._nickName}</Text>

                            {this.renderSexView()}
                        </View>
                        <MedalWidget
                            width={DesignConvert.getW(41)}
                            height={DesignConvert.getH(19)}
                            richLv={this._richLv}
                            charmLv={this._charmLv}
                            containerStyle={{
                                marginTop: DesignConvert.getH(10),
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: DesignConvert.getH(5)
                            }}
                        >

                            <Image
                                source={{ uri: this._cuteIcon }}
                                style={{
                                    marginEnd: DesignConvert.getW(5),
                                    width: DesignConvert.getW(15),
                                    height: DesignConvert.getH(15),
                                    display: this._cuteIcon ? 'flex' : 'none'
                                }}></Image>

                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(14),
                                    color: "#FFFFFF80",
                                }}>ID: {this._cutenumber ? this._cutenumber : this._userId}</Text>

                            <TouchableOpacity
                                style={{
                                    width: DesignConvert.getW(44),
                                    height: DesignConvert.getH(35),
                                    justifyContent: 'center',

                                }}
                                onPress={this._onCopyPress}>
                                <Image
                                    source={require('../../../hardcode/skin_imgs/mine').mine_copy_ic()}
                                    style={{
                                        width: DesignConvert.getW(10),
                                        height: DesignConvert.getH(10),
                                        marginLeft: DesignConvert.getW(5),
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this._onAvatarPress}
                        style={{
                            position:'absolute',
                                right: DesignConvert.getW(30),
                                top: DesignConvert.getH(78),
                        }}
                    >
                        <Image
                            source={this._avatar}
                            style={{
                                
                                width: DesignConvert.getW(100),
                                height: DesignConvert.getH(100),
                                borderRadius: DesignConvert.getW(100 * 0.5),
                            }}
                        />
                    </TouchableOpacity>
                </ImageBackground>
        )
    }

    _rnderMySocial = () => {
        return (

            <View
                style={{
                    width: DesignConvert.swidth - DesignConvert.getW(40),
                    paddingHorizontal: DesignConvert.getW(20),
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: DesignConvert.getH(29),
                }}
            >
                <TouchableOpacity
                    onPress={this._onFriendsPress}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(16),
                            fontWeight: "bold",
                        }}>{this._friends}</Text>
                    <Text
                        style={{
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: DesignConvert.getF(13),
                        }}>好友</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this._onMyLovesPress}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>

                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(16),
                            fontWeight: "bold",
                        }}>{this._myLoves}</Text>
                    <Text
                        style={{
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: DesignConvert.getF(13),
                        }}>关注</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this._onFansPress}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(16),
                            fontWeight: "bold",
                        }}>{this._fans}</Text>
                    <Text
                        style={{
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: DesignConvert.getF(13),
                        }}>粉丝</Text>
                </TouchableOpacity>

            </View>
        )
    }

    renderSexView = () => {
        return (
            <View
                style={{
                    height: DesignConvert.getH(13),
                    backgroundColor: this._sex == 2 ? '#FF3EB0' : '#2687FF',
                    borderRadius: DesignConvert.getW(3),
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: DesignConvert.getW(3),
                    flexDirection: "row",
                    marginLeft: DesignConvert.getW(6),
                }}
            >
                <Image
                    source={this._sex == 2 ? icon_woman() : icon_man()}
                    style={{
                        width: DesignConvert.getW(8),
                        height: DesignConvert.getH(8),
                        marginRight: DesignConvert.getW(2),
                    }}
                />
                <Text
                    style={{
                        fontSize: DesignConvert.getF(9),
                        color: '#FFFFFF',
                    }}
                >
                    {this._age}
                </Text>
            </View>
        )
    }

    _renderMyWallet = () => {
        return (
            <TouchableOpacity
                onPress={this._onTopUpPress}
                style={{
                    width: DesignConvert.getW(325),
                    height: DesignConvert.getH(81),
                    borderRadius: DesignConvert.getW(10),
                    backgroundColor: '#FFFFFF',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingHorizontal: DesignConvert.getW(18),
                    marginTop: DesignConvert.getH(-25),
                    marginLeft: DesignConvert.getW(25),
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        source={require('../../../hardcode/skin_imgs/mine').mine_wallet()}
                        style={{
                            width: DesignConvert.getW(42),
                            height: DesignConvert.getH(42),
                            marginRight: DesignConvert.getW(10)
                        }}
                    />
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(15),
                            color: '#333333',
                        }}
                    >
                        {'我的钱包'}
                    </Text>
                </View>


                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >

                    <Image
                        source={mine_coin_icon()}
                        style={{
                            width: DesignConvert.getW(17),
                            height: DesignConvert.getH(14),
                        }}
                    />

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(17),
                            color: '#333333',
                            marginLeft: DesignConvert.getW(8),
                            marginRight: DesignConvert.getW(18),
                        }}
                    >
                        {require("../../../utils/StringUtil").default.formatMoney(this._accountMoney, 0)}
                    </Text>
                    <Text
                        style={{
                            // marginLeft: DesignConvert.getW(10),
                            color: '#999999',
                            fontSize: DesignConvert.getF(13)
                        }}
                    ></Text>
                    <Image
                        source={mine_arrow_right()}
                        style={{
                            width: DesignConvert.getW(7),
                            height: DesignConvert.getH(12),
                        }}
                    />
                </View>

            </TouchableOpacity>
        )
    }

    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#3B0D1E', '#260713']}
                style={{
                    flex: 1,
                    marginTop: Platform.OS == 'ios' ? -DesignConvert.statusBarHeight : 0,
                }}
            >
                <ScrollView
                    style={{
                        width: DesignConvert.swidth,
                    }}
                >
                    {this._renderMineInfo()}
                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(40),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: DesignConvert.getH(15)
                        }}
                    >
                        <Text
                            style={{
                                color:'rgba(255, 255, 255, 0.6)',
                                marginHorizontal: DesignConvert.getW(15),
                                width: DesignConvert.getW(260),
                                height: DesignConvert.getH(40),
                                fontSize:DesignConvert.getW(12)
                            }}
                        >{this._slogan ? this._slogan : '没有音乐的世界，是荒芜的世界，没有音乐的'}</Text>
                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(63),
                                height: DesignConvert.getH(27),
                                borderRadius: DesignConvert.getW(5),
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: DesignConvert.getW(15)
                            }}
                            onPress={this._onEditPress}
                        >
                            
                         <Text
                            style={{
                                color:'#121212',
                                fontSize:DesignConvert.getW(12)
                                
                            }}
                         >编辑资料</Text>   
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(132),
                            marginTop: DesignConvert.getH(24),
                            justifyContent: 'space-around'
                        }}
                    >
                        <ImageTouchItem
                            source={require('../../../hardcode/skin_imgs/mine').mine_coin_icon()}
                            backgroundSource={require('../../../hardcode/skin_imgs/mine').mine_coin_bg()}
                            title={'我的钻石'}
                            subTitle={''}
                            onPress={this._onTopUpPress}
                        />
                        <ImageTouchItem
                            source={require('../../../hardcode/skin_imgs/mine').mine_benefit_icon()}
                            backgroundSource={require('../../../hardcode/skin_imgs/mine').mine_benefit_bg()}
                            title={'我的收益'}
                            subTitle={require("../../../utils/StringUtil").default.formatMoney(this._accountMoney)}
                            onPress={this._onEnterMyBenefit}
                        />
                        <ImageTouchItem
                            source={require('../../../hardcode/skin_imgs/mine').mine_follow_icon()}
                            backgroundSource={require('../../../hardcode/skin_imgs/mine').mine_follow_bg()}
                            title={'我的关注'}
                            subTitle={this._myLoves < 1 ? "0" : this._myLoves}
                            onPress={this._onMyLovesPress}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(132),
                            marginTop: DesignConvert.getH(15),
                            justifyContent: 'space-around'
                        }}
                    >
                        <ImageTouchItem
                            source={require('../../../hardcode/skin_imgs/mine').mine_fans_icon()}
                            backgroundSource={require('../../../hardcode/skin_imgs/mine').mine_fans_bg()}
                            title={'我的粉丝'}
                            subTitle={this._fans < 1 ? "0" : this._fans}
                            onPress={this._onFansPress}
                        />
                        <ImageTouchItem
                            source={require('../../../hardcode/skin_imgs/mine').mine_rich_icon()}
                            backgroundSource={require('../../../hardcode/skin_imgs/mine').mine_rich_bg()}
                            title={'财富值'}
                            subTitle={this._richLv ? this._richLv : 1}
                            onPress={this._onRichPress}
                        />
                        <ImageTouchItem
                            source={require('../../../hardcode/skin_imgs/mine').mine_charm_icon()}
                            backgroundSource={require('../../../hardcode/skin_imgs/mine').mine_charm_bg()}
                            title={'魅力值'}
                            subTitle={this._charmLv ? this._charmLv : 1}
                            onPress={this._onCharmPress}
                        />
                    </View>

                    <View
                        style={{
                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(380),
                            justifyContent: 'center',
                            marginTop: DesignConvert.getH(30)
                        }}
                    >
                        <ItemTouch
                            onPress={this.showCertPage}
                            title="实名认证"
                            source={require('../../../hardcode/skin_imgs/mine').mine_usercer()}
                        />

                        <ItemTouch
                            onPress={this.showBindPhone}
                            title="绑定手机号"
                            source={require('../../../hardcode/skin_imgs/mine').mine_bindphone()}
                        />

                        <ItemTouch
                            onPress={this._onSetPsw}
                            title="设置登录密码"
                            source={require('../../../hardcode/skin_imgs/mine').mine_loginpw()}
                        />

                        <ItemTouch
                            onPress={this._onSetPayPsw}
                            title="设置支付密码"
                            source={require('../../../hardcode/skin_imgs/mine').mine_paypw()}
                        />

                        <View
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(41),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <View
                                style={{
                                    marginHorizontal: DesignConvert.getW(15),
                                    width: DesignConvert.getW(345),
                                    height: DesignConvert.getH(1),
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)'
                                }}
                            />
                        </View>

                        <ItemTouch
                            onPress={this.showAboutUs}
                            title="关于"
                            source={require('../../../hardcode/skin_imgs/mine').mine_about()}
                        />

                        <ItemTouch
                            onPress={this._onExit}
                            title="退出"
                            source={require('../../../hardcode/skin_imgs/mine').mine_logout()}
                        />

                        {/* <ItemTouch
                            onPress={this._onEnterMyRoom}
                            title="我的房间"
                            source={require('../../../hardcode/skin_imgs/mine').mine_room()}
                        />

                        <ItemTouch
                            onPress={this._onEnterMyMall}
                            title="装扮商城"
                            source={require('../../../hardcode/skin_imgs/mine').mine_mall()}
                        />

                        <ItemTouch
                            onPress={this._onEnterMyBenefit}
                            title="我的收益"
                            source={require('../../../hardcode/skin_imgs/mine').mine_benifit()}
                        />

                        <ItemTouch
                            onPress={this._onMyLvPress}
                            title="我的等级"
                            source={require('../../../hardcode/skin_imgs/mine').mine_level()}
                        />

                        <ItemTouch
                            onPress={this._onSettingPress}
                            title="设置"
                            source={mine_setting()}
                        /> */}


                    </View>

                    <View
                        style={{
                            height: DesignConvert.getH(100)
                        }}
                    ></View>
                </ScrollView>
            </LinearGradient>
        );
    }
}

class BannerSwiper extends Component {

    constructor(props) {
        super(props);

        this._bannerList = [];
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     // console.log('刷新banner============', nextProps)
    //     this._bannerList = nextProps.bannerList;
    //     return true;
    // }

    componentDidMount() {
        this._getBannerList();
    }

    _getBannerList = async () => {

        require('../../../model/BannerModel').default.getSquareBanner()
            .then(data => {
                this._bannerList = data
                this.forceUpdate
            })
    }

    _renderDotIndicator = count => <PagerDotIndicator pageCount={count} />;

    _onBannnerPress = (title = "百度一下", targetobject = "https://www.baidu.com/") => {
        // console.log('banner跳转' + title)
        //"https://" + targetobject， 可能要这样才能加载
        //TODO:看android逻辑好像需要跳转聊天室
        if (targetobject.indexOf("https://") == -1) {
            targetobject = "https://" + targetobject;
        }
        require("../../../router/level2_router").showMyWebView(title, targetobject);
    }

    render() {
        if (!this._bannerList || this._bannerList.length == 0) {
            return null;
        }
        return (
            <View
                style={{
                    overflow: 'hidden',
                    width: DesignConvert.getW(339),
                    height: DesignConvert.getH(60),
                    borderRadius: DesignConvert.getW(12),
                    marginTop: DesignConvert.getH(18),
                    marginLeft: DesignConvert.getW(18),
                }}>
                <IndicatorViewPager
                    autoPlayEnable
                    style={{ height: DesignConvert.getH(60) }}
                // indicator={this._renderDotIndicator(this._bannerList.length)}
                >
                    {this._bannerList.map(item => (
                        <View
                            key={item.id}>
                            <ImageTouchableBox
                                width={339}
                                height={60}
                                url={item.bannerurl}
                                onPress={this._onBannnerPress}
                                item={item}
                            />
                        </View>
                    ))}
                </IndicatorViewPager>
            </View>
        )
    }
}

class ImageTouchableBox extends Component {
    constructor(props) {
        super(props);

        this._url = props.url;
        this._width = props.width;
        this._height = props.height;
        this._onPress = props.onPress;
        this._item = props.item;
    }

    _onItemPress = () => {
        if (!this._item) {
            this._onPress();
            return
        }
        this._onPress(this._item.title, this._item.targetobject);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._onItemPress}
                style={{
                    width: DesignConvert.getW(this._width),
                    height: DesignConvert.getH(this._height),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    style={{
                        width: DesignConvert.getW(this._width),
                        height: DesignConvert.getH(this._height),
                    }}
                    resizeMethod="auto"
                    source={
                        this._url
                            ? { uri: Config.getBannerUrl(this._url) }
                            : require('../../../hardcode/skin_imgs/main.js').banner_demo()
                    }
                />
            </TouchableOpacity>
        )
    }
}

function ImageTouchItem(props) {
    const { onPress, backgroundSource, source, title, subTitle } = props


    return (
        <View
            style={{
                flexDirection: 'column',
                alignItems: 'center',
                width: DesignConvert.getW(105),
                height: DesignConvert.getH(132)
            }}
        >
            <Text
                style={{
                    fontSize: DesignConvert.getF(11),
                    color: 'rgba(255, 255, 255, 0.6)',
                    height: DesignConvert.getH(17),
                    alignSelf: 'flex-start'
                }}
            >
                {title}
            </Text>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    marginTop: DesignConvert.getH(10)
                }}
            >
                <ImageBackground
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: DesignConvert.getW(105),
                        height: DesignConvert.getH(105),
                    }}
                    source={backgroundSource}
                >
                    <Image
                        style={{
                            width: DesignConvert.getW(23),
                            height: DesignConvert.getH(23)
                        }}
                        source={source}
                    />

                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getW(14),
                            fontWeight: 'bold'
                        }}
                    >
                        {subTitle}
                    </Text>

                </ImageBackground>
            </TouchableOpacity>
        </View>
    )
}