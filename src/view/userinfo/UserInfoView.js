
/**
 * 首页 -> 个人主页
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView, Clipboard, Animated, DevSettings } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../utils/DesignConvert';
import Config from '../../configs/Config';
import BackTitleView from '../base/BackTitleView';
import StatusBarView from "../base/StatusBarView";
// import { IndicatorViewPager, PagerDotIndicator,ViewPager } from 'rn-viewpager';
import BaseView from '../base/BaseView';
import { ic_back_black, sex_female } from "../../hardcode/skin_imgs/common";
import ToastUtil from "../base/ToastUtil";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_USER_INFO, EVT_LOGIC_LEAVE_ROOM, EVT_LOGIC_SELF_BY_KICK } from "../../hardcode/HLogicEvent";
import UserInfoCache from '../../cache/UserInfoCache';
import RoomInfoCache, { isChatRoom } from '../../cache/RoomInfoCache';
import UserInfoModel from '../../model/userinfo/UserInfoModel';
import { user } from '../../hardcode/skin_imgs/login';
import { THEME_COLOR, LINEARGRADIENT_COLOR } from '../../styles';
import AnnouncerModel, { isAnnouncer } from '../../model/main/AnnouncerModel';
import { COIN_NAME, ANNOUNCER_UNIT, ESex_Type_FEMALE } from '../../hardcode/HGLobal';
import _VioceItem from './item/_VioceItem';
import _PersonalEvaluation from './item/_PersonalEvaluation';
import SoundUtil from '../../model/media/SoundUtil';
import MedalWidget from "../userinfo/MedalWidget";

class ElbumSwiper extends Component {

    _renderDotIndicator = count => <PagerDotIndicator
        pageCount={count}
        dotStyle={{
            width: DesignConvert.getW(10),
            height: DesignConvert.getW(10),
            borderRadius: DesignConvert.getW(10),
            borderWidth: DesignConvert.getW(1),
            borderColor: 'white',
        }}
        selectedDotStyle={{
            width: DesignConvert.getW(10),
            height: DesignConvert.getW(10),
            borderRadius: DesignConvert.getW(10),
            borderWidth: DesignConvert.getW(1),
            borderColor: 'white',
            backgroundColor: 'white',
        }}
    />;

    render() {
        return (
            <View>
                <IndicatorViewPager
                    keyboardDismissMode={'none'}
                    indicator={this._renderDotIndicator(this.props.imgs.length)}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(344)
                    }}
                >
                    {this.props.imgs.map(item => (
                        <View
                            key={item.id}
                        >
                            <Image
                                source={{ uri: item.uri }}
                                style={{
                                    width: DesignConvert.swidth,
                                    height: DesignConvert.getH(344)
                                }}
                            />
                        </View>
                    ))}
                </IndicatorViewPager>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#00000000', '#00000033']}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(64),
                    }}
                />
            </View>
        )
    }
}



export default class UserInfoView extends BaseView {
    constructor(props) {
        super(props);

        this._userId = this.props.params.userId;
        this._cutenumber = null//靓号
        this._cuteIcon = null//靓号icon
        this._isMyself = this._userId == UserInfoCache.userId;
        this._cuteNumber = null;
        this._userInfo = undefined;
        this._isAttention = true;
        this._isPullBlack = false;
        this._roomId = null;

        this._richLv = 1;
        this._charmLv = 1;
        this._sex = 1;

        this._myLoves = 0;
        this._fans = 0;

        this._myAblumList = [];


        this._giftList = [];
        this._alpha = 0;
        this._isTop = true;


        // 他人所在房间信息
        this._userRoomName = '';
        this._userRoomLiver = '';
        this._userRoomBg = '';
        this._userRommOnlineNum = null;

        //判断是否声优
        this._isAnnouncer = false;
        this._AnnouncerData = null;
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _onMenuPress = () => {
        SoundUtil._stop()
        if (this._isMyself) {
            require("../../router/level2_router").showUserInfoEditView();
        } else {
            require("../../router/level3_router").showInfoDialog(this._pullBlackPressPress, this._reportPress, this._isAttention ? this._cancelAttentionPress : undefined, this._isPullBlack)
        }
    }

    _onCopyPress = () => {
        Clipboard.setString(this._userId);
        ToastUtil.showCenter("复制成功");
    }

    _onChatPress = () => {
        SoundUtil._stop()
        require("../../router/level2_router").showChatView(this._userId, decodeURI(this._userInfo.nickName), false);
    }

    _onHotChatPress = () => {
        AnnouncerModel.callAnchor(this._AnnouncerData.userId, this._AnnouncerData.price);
    }

    //举报
    _reportPress = () => {
        require("../../router/level3_router").showReportDialog(this._userId, 1);
    }

    _pullBlackPressPress = async (action) => {
        // 操作类型：true-拉黑 false-解除拉黑
        let res = await require("../../model/userinfo/UserInfoModel").default.pullBlackStatus(this._userId, action);

        if (res) {
            this._isPullBlack = action;
        } else {
            this._isAttention = !action;
        }
        await this._initData();
        this.forceUpdate();
    }

    _cancelAttentionPress = async () => {
        let res = await require("../../model/userinfo/UserInfoModel").default.addLover(this._userId, false);

        if (res) {
            this._isAttention = false;
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_USER_INFO, null);//刷新用户信息
        } else {
            this._isAttention = true;
        }
        await this._initData();
    }

    _onAttentionPress = async () => {
        if (this._isAttention) return false
        let res = require("../../model/userinfo/UserInfoModel").default.addLover(this._userId, true);

        if (res) {
            ToastUtil.showCenter("关注成功");
            this._isAttention = true;
        } else {
            ToastUtil.showCenter("关注失败");
            this._isAttention = false;
        }
        ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_USER_INFO, null)
        this.forceUpdate();
    }

    _openSoundOrClose = () => {
        this._isOpenSound = !this._isOpenSound;
        this.forceUpdate()
    }

    _renderMyIcon = () => {
        return (
            <View
                style={{
                    alignItems: "center",
                    // justifyContent: "center",
                    marginLeft: DesignConvert.getW(24),
                    flexDirection: "row",
                    marginTop: DesignConvert.getH(6),
                }}
            >

                <View
                    style={{
                        width: DesignConvert.getW(34),
                        height: DesignConvert.getH(18),
                        borderRadius: DesignConvert.getW(12),
                        backgroundColor: (!this._userInfo || this._userInfo.sex == 1) ? '#2687FF' : '#FF5DC0',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        style={{
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(9),
                            tintColor: 'white'
                        }}
                        source={(!this._userInfo || this._userInfo.sex == 1) ? require('../../hardcode/skin_imgs/registered').ic_default_male() : require('../../hardcode/skin_imgs/registered').ic_default_female()}
                    />
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(12),
                            marginLeft: DesignConvert.getW(3)
                        }}
                    >{!this._userInfo ? "18" : this._userInfo.age}</Text>
                </View>
                <TouchableOpacity
                    // onPress={this._onRichPress}
                    style={{
                        marginHorizontal: DesignConvert.getW(4)
                    }}
                >
                    <Image
                        source={require("../../hardcode/skin_imgs/main").mine_rich_lv(this._richLv)}
                        style={{
                            width: DesignConvert.getW(40),
                            height: DesignConvert.getH(18),
                            resizeMode: 'contain'
                        }}></Image>
                </TouchableOpacity>

                <TouchableOpacity
                // onPress={this._onCharmPress}
                >
                    <Image
                        source={require("../../hardcode/skin_imgs/main").mine_charm_lv(this._charmLv)}
                        style={{
                            width: DesignConvert.getW(40),
                            height: DesignConvert.getH(18),
                            resizeMode: 'contain',
                        }}></Image>
                </TouchableOpacity>


            </View>
        )
    }


    _renderEmptyView = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(400),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image
                    style={{
                        width: DesignConvert.getW(121),
                        height: DesignConvert.getH(101),
                    }}
                    source={require("../../hardcode/skin_imgs/user_info").no_gift()}
                />
            </View>
        )
    }

    _renderItem = ({ item, idnex }) => {
        return (
            <View
                key={idnex}
                style={{
                    width: DesignConvert.getW(50),
                    height: DesignConvert.getH(85),
                    marginBottom: DesignConvert.getH(11),
                    marginRight: (idnex + 1) % 4 === 0 ? 0 : DesignConvert.getW(40),
                    justifyContent: "center",
                    alignItems: 'center',
                }}>
                <Image
                    resizeMode="contain"
                    source={{ uri: Config.getGiftUrl(item.giftId, item.logoTime) }}
                    style={{
                        width: DesignConvert.getW(39),
                        height: DesignConvert.getH(39),
                        resizeMode: 'contain'
                    }}></Image>

                <Text
                    style={{
                        color: "#666666",
                        width: DesignConvert.getW(50),
                        fontSize: DesignConvert.getF(12),
                        marginTop: DesignConvert.getH(10),
                        textAlign: "center",
                    }}>{item.giftname}</Text>

                <Text
                    style={{
                        color: THEME_COLOR,
                        width: DesignConvert.getW(50),
                        fontSize: DesignConvert.getF(11),
                        marginTop: DesignConvert.getH(6),
                        textAlign: "center",
                    }}>X{item.num}</Text>
            </View>
        )
    }

    /**
     * 个人设置的标签
     */
    _renderMyLabels = () => {
        if (!this._isAnnouncer || !this._AnnouncerData || !this._AnnouncerData.myLabels || this._AnnouncerData.myLabels.length == 0) {
            return null
        }
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: DesignConvert.getH(9)
                }}
            >

                {this._AnnouncerData.myLabels.map((element, i) => (
                    <View
                        style={{
                            paddingHorizontal: DesignConvert.getW(5),
                            height: DesignConvert.getH(20),
                            borderRadius: DesignConvert.getW(3),
                            backgroundColor: i == 0 ? '#FD798A' : i == 1 ? '#B54CF7' : '#F5B664',
                            marginRight: DesignConvert.getW(6),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(8),
                                color: '#FFFFFF',
                            }}
                        >
                            {element}
                        </Text>
                    </View>
                ))}
            </View>
        )
    }

    // 个性签名区域
    _renderPersonalSignature = () => {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getH(5),
                    marginLeft: DesignConvert.getW(24),
                    marginEnd: DesignConvert.getW(24),
                    // display: this._isMyself ? 'none' : 'flex'
                }}
            >
                <Text
                    style={{
                        color: '#333333',
                        fontSize: DesignConvert.getF(14)
                    }}
                >{this._userInfo && this._userInfo.slogan ? this._userInfo.slogan : '填写个性签名更容易获得别人的关注哦'}</Text>

                {this._renderMyLabels()}
            </View>
        )
    }

    // 所在房间区域
    _renderRomm = () => {
        if (!this._userInfo || !this._userInfo.roomId || isChatRoom(this._userInfo.roomId)) {
            return null
        }
        if (this._isMyself) return null
        return (
            <View
                style={{
                    height: DesignConvert.getH(105),
                    marginTop: DesignConvert.getH(15)
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(17),
                        fontWeight: 'bold'
                    }}
                >直播间</Text>
                <TouchableOpacity
                    style={{
                        width: DesignConvert.getW(55),
                        height: DesignConvert.getH(25),
                        borderRadius: DesignConvert.getW(15),
                        borderWidth: DesignConvert.getW(1),
                        borderColor: THEME_COLOR,
                        position: 'absolute',
                        right: DesignConvert.getW(24),
                        top: DesignConvert.getH(390),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={this._entryRoom}
                >
                     {/* <Image
                    style={{
                        width: DesignConvert.getW(60),
                        height: DesignConvert.getH(60),
                        borderRadius: DesignConvert.getW(12)
                    }}
                    //source={{ uri: Config.getRoomCreateLogoUrl(item.logoTime, item.roomId, item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
                /> */}
                <View
                    style={{
                        marginLeft: DesignConvert.getW(8),
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            maxWidth: DesignConvert.getW(95),
                            fontWeight: 'bold',
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),
                        }}>{`直播间名称${this._userInfo.roomName}`}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: DesignConvert.getF(12)
                            }}
                        >{`房间ID:${this._userInfo.roomId}`}</Text>

                    </View>
                </View>
                </TouchableOpacity >
            </View>

        )

    }

    _renderMyVoice = () => {

    }

    _onCacheUpdated = () => {
        this.forceUpdate();
    }

    _initData = async () => {

        let cuteData = await require('../../model/userinfo/UserInfoModel').default.getGoodId(this._userId)
        if (cuteData) {
            //设置靓号
            this._cutenumber = cuteData.cutenumber
            this._cuteIcon = cuteData.icon
        } else {
            //没有靓号
            this._cutenumber = null
            this._cuteIcon = null
        }

        let data = await require("../../model/userinfo/UserInfoModel").default.getPersonPage(this._userId)

        if (!data) {
            ToastUtil.showBottom("获取信息失败");
        }
        this._userInfo = data;
        this._isAttention = UserInfoModel.isAddLover(this._userInfo.friendStatus)
        this._isPullBlack = this._userInfo.pullBlackStatus == 6;
        this._richLv = data.contributeLv;
        this._charmLv = data.charmLv;
        this._roomId = data.roomId
        this._sex = data.sex;

        this._myLoves = data.myLoves;
        this._fans = data.friends;

        /**
         * 获取banner
         */
        if (data.banners) {
            let bannerList = data.banners.split(",");
            bannerList.forEach(element => {
                if (element.length > 0) {
                    this._myAblumList.push({ ablumId: element, uri: Config.getUserBannerUrl(this._userId, element) });
                }
            });
        }
        if (this._myAblumList.length == 0) {
            this._myAblumList.push({ ablumId: this._userInfo.userId, uri: Config.getHeadUrl(this._userInfo.userId, this._userInfo.logoTime, this._userInfo.thirdIconurl) });
        }

        if (data.roomId) {
            // 获取房间房主基本信息
            let roomData = await require("../../model/userinfo/UserInfoModel").default.getUserRoom(data.roomId)

            if (!roomData) {
                return ToastUtil.showBottom("获取房间信息信息失败");
            }
            // 获取房间信息成功
            this._userRoomName = roomData.roomName;
            this._userRoomLiver = roomData.anchorData;
            this._userRoomBg = roomData.bgs;

            // 获取房间在线人数
            let roomData2 = await require("../../model/userinfo/UserInfoModel").default.getUserRoomOnline(data.roomId)
            this._userRommOnlineNum = roomData2.onlineNum;
        }

        this._giftList = await require("../../model/userinfo/UserInfoModel").default.getReceiveGiftsByChange(this._userId)

        //判断是否声优
        let res = await isAnnouncer(this._userId);
        if (res === undefined) {
            this.forceUpdate();
            return
        }
        this._isAnnouncer = res;
        if (this._isAnnouncer) {
            this._AnnouncerData = await require("../../model/main/AnnouncerModel").default.getUserSkillInfo(this._userId)

            this._mySoundDuration = this._AnnouncerData.voiceTimeSpan;
        }


        this.forceUpdate();
    }

    _onScroll = ({
        nativeEvent: {
            contentInset: { bottom, left, right, top },
            contentOffset: { x, y },
            zoomScale
        }
    }) => {
        if (y <= 70) {
            this._alpha = y / 70;
            this._isTop = y <= 0;
            this.forceUpdate();
        } else {
            this._alpha = 1;
            this.forceUpdate();
        }
    }

    _entryRoom = () => {
        require('../../model/room/RoomModel').default.enterLiveRoom(this._userInfo.roomId, 0);
    }

    _onKick = () => {
        // console.warn('...........................')
        require('../../model/room/RoomModel').default.leave()
            .then(() => {
            })
    }

    async componentDidMount() {
        super.componentDidMount();
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initData);
        ModelEvent.addEvent(null, EVT_LOGIC_LEAVE_ROOM, this._initData);
        ModelEvent.addEvent(null, EVT_LOGIC_SELF_BY_KICK, this._initData);
        await this._initData();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initData);
        ModelEvent.removeEvent(null, EVT_LOGIC_LEAVE_ROOM, this._initData);
        ModelEvent.removeEvent(null, EVT_LOGIC_SELF_BY_KICK, this._initData);
    }

    _rnderMySocial = () => {
        return (
            <ImageBackground
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getW(270)
                }}
                source={require("../../hardcode/skin_imgs/yuanqi").userinfo_bg()}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        position: 'absolute',
                        left: DesignConvert.getW(50),
                        top: DesignConvert.getH(118),
                        width: DesignConvert.getW(75),
                        height: DesignConvert.getH(105)
                    }}
                >
                    <Image
                        style={{
                            width: DesignConvert.getW(74),
                            height: DesignConvert.getH(74),
                            borderRadius: DesignConvert.getW(74 * 0.5)
                        }}
                        source={{ uri: Config.getRNImageUrl('timg.jpg', 0, 375, 375) }} />
                    <MedalWidget
                        width={DesignConvert.getW(41)}
                        height={DesignConvert.getH(19)}
                        richLv={this._richLv}
                        charmLv={this._charmLv}
                        containerStyle={{
                            marginTop: DesignConvert.getH(15),
                        }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        height: DesignConvert.getH(45),
                        position: 'absolute',
                        right: DesignConvert.getW(30),
                        top: DesignConvert.getH(134)
                    }}
                >
                    <MySocialItem
                        title={this._myLoves}
                        subTitle={'关注'}
                        style={{marginRight: DesignConvert.getW(20)}}
                    />
                    <MySocialItem
                        style={{
                            height: DesignConvert.getH(45),
                            marginLeft: DesignConvert.getW(50)
                        }}
                        title={this._fans}
                        subTitle={'粉丝'}
                    />

                </View>
            </ImageBackground>
        )
    }

    render() {
        console.warn(this._isAttention)
        return (
            <View
                style={{
                    flex: 1,
                    marginTop: Platform.OS == 'ios' ? -DesignConvert.statusBarHeight : 0,
                    backgroundColor: "white",
                }}>
                <ScrollView
                    style={{
                        flex: 1
                    }}
                    onScroll={this._onScroll}
                    showsVerticalScrollIndicator={false}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#3B0D1E', '#260713']}
                        style={{
                            flex: 1,
                        }}
                    >
                        {this._rnderMySocial()}
                        <View
                            style={{
                                marginTop: DesignConvert.getH(15),
                                marginLeft: DesignConvert.getH(15),
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: DesignConvert.getF(17),
                                    fontWeight: 'bold'
                                }}
                            >个人信息</Text>
                            <MyDetaileItem
                                title={'昵称'}
                                subTitle={!this._userInfo ? "" : decodeURI(this._userInfo.nickName)}
                            />
                            <MyDetaileItem
                                title={'ID'}
                                subTitle={!this._userInfo ? "" : decodeURI(this._userInfo.nickName)}
                                isIDDetaile={true}
                                cuteIcon={this._cuteIcon}
                                cutenumber={this._cuteNumber}
                                userId={this._userId}
                                onPress={this._onCopyPress}
                            />
                            <MyDetaileItem
                                title={'性别'}
                                subTitle={`性别：${!this._userInfo ? "-" : this._userInfo.sex === ESex_Type_FEMALE ? "女" : "男"}`}
                            />
                            <MyDetaileItem
                                title={'生日'}
                                subTitle={`性别：${!this._userInfo ? "-" : this._userInfo.birthday}`}
                            />
                            <MyDetaileItem
                                title={'签名'}
                                subTitle={this._userInfo && this._userInfo.slogan ? this._userInfo.slogan : '填写个性签名更容易获得别人的关注哦'}

                            />
                        </View>
                        {this._renderRomm()}
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(14),
                                marginRight: DesignConvert.getW(13),
                                marginTop: DesignConvert.getH(20),
                                marginBottom: DesignConvert.getH(15),
                                fontWeight: "bold",
                                marginLeft: DesignConvert.getW(15),
                            }}>礼物墙</Text>

                        <FlatList
                            numColumns={4}
                            data={this._giftList}
                            renderItem={this._renderItem}
                            ListEmptyComponent={this._renderEmptyView}
                            initialNumToRender={6}
                            scrollEnabled={false}
                            contentContainerStyle={{
                                justifyContent: 'center',
                            }}
                            style={{
                                marginLeft: DesignConvert.getW(24),
                                paddingHorizontal: DesignConvert.getW(8),
                                width: DesignConvert.getW(336),
                                marginBottom: DesignConvert.getH(100),
                            }}
                        />
                        {/* <_VioceItem
                            userId={this._userId}
                        /> */}
                        {!this._isMyself ? (
                            <View
                                style={{
                                    position: "absolute",
                                    flexDirection: 'row',
                                    top: DesignConvert.getH(236),
                                    right: DesignConvert.getW(30)
                                }}>

                                <TouchableOpacity
                                    onPress={this._onAttentionPress}>
                                    <Image
                                        source={
                                            this._isAttention ? require("../../hardcode/skin_imgs/yuanqi").userinfo_attention_yet()
                                                : require("../../hardcode/skin_imgs/yuanqi").userinfo_attention()
                                        }
                                        style={{
                                            resizeMode: 'contain',
                                            width: DesignConvert.getW(43),
                                            height: DesignConvert.getH(43),

                                            marginRight: DesignConvert.getW(34),
                                        }}></Image>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={this._onChatPress}
                                    style={{
                                        marginBottom: DesignConvert.getH(15)
                                    }}>

                                    <Image
                                        source={require("../../hardcode/skin_imgs/yuanqi").userinfo_chat()}
                                        style={{
                                            width: DesignConvert.getW(43),
                                            height: DesignConvert.getH(43),

                                            marginRight: DesignConvert.getW(5),
                                        }}></Image>
                                </TouchableOpacity>


                            </View>
                        ) : null}
                    </LinearGradient>



                </ScrollView>
                <View
                    style={{
                        position: "absolute",
                        top: Platform.OS == 'ios' ? DesignConvert.statusBarHeight : 0,
                    }}>

                    <Animated.View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(80),
                            backgroundColor: this._isTop ? "rgba(255, 255, 255, 0)" : "white",
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            minWidth: DesignConvert.getW(60),
                        }}
                        onPress={this._onBackPress}
                    >
                        <TouchableOpacity

                            style={{
                                position: 'absolute',
                                left: 0,
                                top: DesignConvert.getH(40),
                                minWidth: DesignConvert.getW(60),
                            }}
                            onPress={this._onBackPress}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(21.5),
                                    height: DesignConvert.getH(19),
                                    marginLeft: DesignConvert.getW(20),
                                    resizeMode: 'contain',
                                    tintColor: this._isTop ? "white" : "black",
                                }}
                                source={ic_back_black()}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                minWidth: DesignConvert.getW(21),
                                minHeight: DesignConvert.getH(21),
                                position: 'absolute',
                                right: DesignConvert.getW(20),
                                top: DesignConvert.getH(40),
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={this._onMenuPress}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(22),
                                    height: DesignConvert.getH(22),
                                    tintColor: this._isTop ? "white" : "black",
                                }}
                                source={this._isMyself ? require("../../hardcode/skin_imgs/user_info").icon_edit() : require("../../hardcode/skin_imgs/user_info").ic_menu()}
                            />
                        </TouchableOpacity>
                    </Animated.View>


                </View>
            </View>
        )
    }
}

function MyDetaileItem(props) {
    const { isIDDetaile, title, subTitle, style, cuteIcon, onPress, cutenumber, userId } = props
    return (
        <View
            style={{
                flexDirection: 'row',
                marginTop: DesignConvert.getH(12),
                ...style
            }}
        >
            <Text
                style={{
                    color: 'rgba(255, 255, 255, 0.59)',
                    fontSize: DesignConvert.getF(14),
                    fontWeight: 'bold'
                }}
            >
                {title}
            </Text>
            { isIDDetaile ? (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: 'absolute',
                        left: DesignConvert.getW(59)
                    }}
                >

                    <Image
                        source={require('../../hardcode/skin_imgs/mine').mine_idleve_icon()}
                        style={{
                            marginEnd: DesignConvert.getW(5),
                            width: DesignConvert.getW(15),
                            height: DesignConvert.getH(15),
                            // display: cuteIcon ? 'flex' : 'none'
                        }} />

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(14),
                            color: "rgba(255, 255, 255, 1)",
                        }}>{cutenumber ? cutenumber : userId}</Text>

                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(44),
                            height: DesignConvert.getH(35),
                            justifyContent: 'center',

                        }}
                        onPress={onPress}>
                        <Image
                            source={require('../../hardcode/skin_imgs/mine').mine_copy_ic()}
                            style={{
                                width: DesignConvert.getW(10),
                                height: DesignConvert.getH(10),
                                marginLeft: DesignConvert.getW(5),
                            }}
                        />
                    </TouchableOpacity>
                </View>
            ) : <Text
                style={{
                    color: '#FFFFFF',
                    fontSize: DesignConvert.getF(14),
                    fontWeight: 'bold',
                    position: 'absolute',
                    left: DesignConvert.getW(59)
                }}
            >
                    {subTitle}
                </Text>}

        </View>
    )
}

function MySocialItem(props) {
    const { onPress, title, subTitle, style } = props

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                alignItems: 'center',
                ...style
            }}
        >
            <Text
                style={{
                    color: 'white',
                    fontSize: DesignConvert.getF(17),
                    fontWeight: 'bold'
                }}
            >
                {title}
            </Text>
            <Text
                style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: DesignConvert.getF(11),
                }}
            >
                {subTitle}
            </Text>
        </TouchableOpacity>
    )
}