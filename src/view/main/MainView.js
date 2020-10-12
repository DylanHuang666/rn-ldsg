/**
 * 主界面
 */
'use strict';

import * as React from 'react';
import { TouchableOpacity, Text, Image, View, ImageBackground, Animated, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DesignConvert from '../../utils/DesignConvert';
import BaseView from '../base/BaseView';
import { _MessageRedDot } from '../main/message/IMList';
import RoomInfoCache, { isChatRoom } from '../../cache/RoomInfoCache';
import ModelEvent from '../../utils/ModelEvent';
import { EVT_UPDATE_ROOM_MAIN_MIC, } from '../../hardcode/HGlobalEvent';
import { TX_IM_NEW_MSG, } from '../../hardcode/HNativeEvent';
import {
    EVT_LOGIC_LEAVE_ROOM,
    EVT_LOGIC_ROOM_REFRESH_ROOM,
    EVT_LOGIC_UPDATE_USER_INFO,
    EVT_LOGIC_SELF_BY_KICK,
    EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD,
    EVT_LOGIC_ENTER_ROOM,
} from '../../hardcode/HLogicEvent';
import ToastUtil from '../base/ToastUtil';
import _phoneFloatBtn from './item/_phoneFloatBtn';
import UserInfoCache from '../../cache/UserInfoCache';
const Tab = createBottomTabNavigator();

class TabItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this._unReadNum = 0;
        //立马刷不行，开个延时
        this._timer = null;
    }

    componentDidMount() {
        if (this.props.showUnReadNum) {
            ModelEvent.addEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._getUnReadNum);//刷新已读
            ModelEvent.addEvent(null, TX_IM_NEW_MSG, this._getUnReadNum);//新消息
            this._timer = setTimeout(this._getUnReadNum, 1000);
        }
    }

    componentWillUnmount() {
        if (this.props.showUnReadNum) {
            ModelEvent.removeEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._getUnReadNum);//刷新已读
            ModelEvent.removeEvent(null, TX_IM_NEW_MSG, this._getUnReadNum);//新消息
            this._timer && clearTimeout(this._timer);
        }

    }

    _getUnReadNum = () => {
        require("../../model/chat/ChatModel").getUnReadNum()
            .then(data => {
                this._unReadNum = data;
                // console.log("MainView", "未读数", this._unReadNum)
                this.forceUpdate();
            });
    }

    _onPress = () => {
        require('../../model/main/MainViewModel').doNavigationTo(this.props.bar_index);
    }
    _onLongPress = () => {
        require('../../model/main/MainViewModel').doLongPress(this.props.bar_index);
    }

    render() {
        const route = this.props.bar_state.routes[this.props.bar_index];
        const options = this.props.bar_descriptors[route.key];
        const isFocused = this.props.bar_state.index === this.props.bar_index;
        const label = this.props.tabBarLabel;
        const img = isFocused ? this.props.imageSel_url : this.props.image_url;

        return (
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityStates={isFocused ? ['selected'] : []}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={this._onPress}
                onLongPress={this._onLongPress}
                style={[
                    this.props.pos_style,
                    {
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: DesignConvert.getW(99),
                    }
                ]}
            >
                <Image
                    source={img}
                    style={{
                        width: DesignConvert.getW(28),
                        height: DesignConvert.getH(28),
                        resizeMode: 'contain'
                    }}
                />
                <Text
                    style={{
                        marginTop: DesignConvert.getH(3),
                        color: isFocused ? '#FF3A4C' : '#FFFFFF',
                        fontSize: DesignConvert.getF(10),
                    }}
                >{label}</Text>

                {this.props.showUnReadNum ? (
                    <_MessageRedDot
                        num={this._unReadNum}
                        style={{
                            position: "absolute",
                            left: DesignConvert.getW(49),
                            top: DesignConvert.getH(8),
                        }} />
                ) : null}

            </TouchableOpacity>
        );

    }
}

class StartPlay extends React.PureComponent {

    _onPress = () => {
        require('../../model/room/RoomModel').beforeOpenLive();
        // require('../../router/level3_router').showSetPassword();
    }
    render() {
        return (
            <TouchableOpacity
                style={this.props.style}
                onPress={this._onPress}
            >
                <Image
                    source={require('../../hardcode/skin_imgs/main').ic_start_play()}
                    style={{
                        width: DesignConvert.getW(59),
                        height: DesignConvert.getH(59),
                    }}
                />
            </TouchableOpacity>
        )
    }
}

class PlayItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this._cutenumber = ''//靓号
        this._cuteIcon = ''//靓号icon
        this._bShow = false;
    }

    _onPress = () => {
        require('../../model/room/RoomModel').beforeOpenLive();
        // require('../../router/level3_router').showSetPassword();
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_ENTER_ROOM, this._onRefresh)
        ModelEvent.addEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
        this._initial()
    }

    _initial = () => {
        require('../../model/userinfo/UserInfoModel').default.getGoodId(RoomInfoCache.viewRoomId)
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
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_ENTER_ROOM, this._onRefresh)
        ModelEvent.removeEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
    }

    _onRefresh = () => {
        if (!RoomInfoCache.isInRoom || isChatRoom(RoomInfoCache.roomId)) {
            this._bShow = false;
        } else {
            this._bShow = true;
        }
        this.forceUpdate()
    }

    _onKick = () => {
        require('../../model/room/RoomModel').default.leave();
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: DesignConvert.getH(49) + DesignConvert.addIpxBottomHeight(),
                    
                    left: 0
                }}>
                <TouchableOpacity
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(45),
                        display: this._bShow ? "flex" : "none",
                    }}
                    onPress={this._onPress}
                >
                    <View
                        style={{
                            backgroundColor: 'rgba(254, 80, 69, 0.79)',
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(45),
                            flexDirection: 'row',
                            alignItems: 'center',
                            
                        }}
                    >
                        <_playRoomImage />

                        <View
                            style={{
                                marginLeft: DesignConvert.getW(4),
                                height: DesignConvert.getH(37),
                                justifyContent: 'space-around',
                                flex: 1,
                            }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: DesignConvert.getF(13),
                                }}>
                                {!RoomInfoCache.roomData ? "" : decodeURI(RoomInfoCache.roomData.roomName)}
                            </Text>
                            {/* <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: DesignConvert.getH(6)
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
                                        fontSize: DesignConvert.getF(10),
                                        color: this._cutenumber ? "red" : "#FFFFFF80",
                                    }}>ID: {this._cutenumber ? this._cutenumber : RoomInfoCache.viewRoomId}</Text>
                            </View> */}
                            {/* <Text
        numberOfLines={1}
        style={{
            color: '#FFFFFF80',
            fontSize: DesignConvert.getF(10),
        }}>
        {(!RoomInfoCache.roomData || !RoomInfoCache.roomData.notic) ? "" : RoomInfoCache.roomData.notic}
        {`ID:${RoomInfoCache.roomId}`}
    </Text> */}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginEnd: DesignConvert.getW(45),
                            }}
                        >
                            <Image
                                source={require("../../hardcode/skin_imgs/main").live_status_white()}
                                style={{
                                    width: DesignConvert.getW(12),
                                    height: DesignConvert.getH(12),
                                    marginLeft: DesignConvert.getW(6),
                                    resizeMode: 'contain',
                                }} />
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: DesignConvert.getF(13),
                                    marginLeft: DesignConvert.getW(4),
                                }}>在房间中</Text>

                        </View>
                        <TouchableOpacity
                            onPress={this._onKick}
                            style={{
                                width: DesignConvert.getW(30),
                                height: DesignConvert.getH(40),
                                justifyContent:'center'
                            }}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(12),
                                    height: DesignConvert.getH(12),
                                    resizeMode: 'contain',
                                }}
                                source={require('../../hardcode/skin_imgs/main').room_closed()}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['rgba(255, 136, 238, 0.8)', 'rgba(248, 88, 104, 0.8)']}
                        // colors={['red', 'red']}
                        style={{
                            width: DesignConvert.getW(165),
                            height: DesignConvert.getH(45),
                            flexDirection: "row",
                            alignItems: "center",
                            borderRadius: DesignConvert.getW(50),
                        }}>
                        
                    </LinearGradient> */}


                </TouchableOpacity>
            </View>
        )
    }
}

export class _playRoomImage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0)
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onRefresh)
        ModelEvent.addEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
        ModelEvent.addEvent(null, EVT_LOGIC_SELF_BY_KICK, this._onKick)
        // this._spin()
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_MAIN_MIC, this._onRefresh)
        ModelEvent.removeEvent(null, EVT_LOGIC_LEAVE_ROOM, this._onRefresh)
        ModelEvent.removeEvent(null, EVT_LOGIC_SELF_BY_KICK, this._onKick)
    }

    _onKick = () => {
        //弹出弹框提示用户被踢出房间
        ToastUtil.showCenter('抱歉，您已被踢出房间')
        require('../../model/room/RoomModel').default.leave();
    }

    _onRefresh = () => {
        this.forceUpdate()
    }

    _spin = () => {
        this.spinValue.setValue(0)
        Animated.timing(this.spinValue, {
            toValue: 1, // 最终值 为1，这里表示最大旋转 360度
            duration: 4000,
            easing: Easing.linear,
            isInteraction: false,
            useNativeDriver: true
        }).start(() => this._spin())
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        });

        if (!RoomInfoCache.roomData) {
            return null
        }
        return (
            <View
                style={{
                    width: DesignConvert.getW(32),
                    height: DesignConvert.getH(32),
                    borderRadius: DesignConvert.getW(10),
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: DesignConvert.getW(15),
                }}
            >

                <Animated.Image
                    style={{
                        borderRadius: DesignConvert.getW(24),
                        width: DesignConvert.getW(36),
                        height: DesignConvert.getH(36),
                        backgroundColor: '#FFFFFF',
                        transform: [{ rotate: spin }]
                    }}
                    source={{ uri: RoomInfoCache.roomLogoUrl }}
                />

                <Image

                />
            </View>
        )
    }
}



function MyTabBar({ state, descriptors, navigation }) {
    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#471025',
                width: DesignConvert.swidth,
                height: DesignConvert.getH(49) + DesignConvert.addIpxBottomHeight(),

                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <TabItem
                bar_index={require('../../model/main/MainViewModel').INDEX_HOME}
                bar_state={state}
                bar_descriptors={descriptors}
                bar_navigation={navigation}
                tabBarLabel='首页'
                image_url={require('../../hardcode/skin_imgs/yuanqi').home_unsel()}
                imageSel_url={require('../../hardcode/skin_imgs/yuanqi').home_sel()}
                pos_style={{
                    // position: 'absolute',
                    // left: DesignConvert.getW(15),
                    // top: 0,
                    // left: DesignConvert.getW(33),
                    // height: DesignConvert.getH(50),
                }}
            />
            <TabItem
                bar_index={require('../../model/main/MainViewModel').INDEX_RANK}
                bar_state={state}
                bar_descriptors={descriptors}
                bar_navigation={navigation}
                image_url={require('../../hardcode/skin_imgs/yuanqi').rank_unsel()}
                imageSel_url={require('../../hardcode/skin_imgs/yuanqi').rank_sel()}
                tabBarLabel='榜单'
                pos_style={{

                }}
            />
            {/* <TabItem
                bar_index={require('../../model/main/MainViewModel').INDEX_RANK}
                bar_state={state}
                bar_descriptors={descriptors}
                bar_navigation={navigation}
                image_url={require('../../hardcode/skin_imgs/main').rank()}
                imageSel_url={require('../../hardcode/skin_imgs/main').rank_sel()}
                tabBarLabel='1v1陪聊'
                pos_style={{
                    position: 'absolute',

                    left: DesignConvert.getW(108),
                    top: 0,
                    height: DesignConvert.getH(50),
                }}
            /> */}
            <TabItem
                bar_index={require('../../model/main/MainViewModel').INDEX_MESSAGE}
                bar_state={state}
                bar_descriptors={descriptors}
                bar_navigation={navigation}
                image_url={require('../../hardcode/skin_imgs/yuanqi').msg_unsel()}
                imageSel_url={require('../../hardcode/skin_imgs/yuanqi').msg_sel()}
                tabBarLabel='消息'
                pos_style={{
                    // position: 'absolute',

                    // right: DesignConvert.getW(108),
                    // top: 0,
                    // height: DesignConvert.getH(50),
                }}
                showUnReadNum
            />
            <TabItem
                bar_index={require('../../model/main/MainViewModel').INDEX_MINE}
                bar_state={state}
                bar_descriptors={descriptors}
                bar_navigation={navigation}
                image_url={require('../../hardcode/skin_imgs/yuanqi').mine_unsel()}
                imageSel_url={require('../../hardcode/skin_imgs/yuanqi').mine_sel()}
                tabBarLabel='我的'
                pos_style={{
                    // position: 'absolute',

                    // right: DesignConvert.getW(33),
                    // top: 0,
                    // height: DesignConvert.getH(50),
                }}
            />

            {/* <PlayItem /> */}
            {/* <StartPlay
                style={{
                    position: 'absolute',
                    left: DesignConvert.getW(158),
                    top: DesignConvert.getW(-21),
                }}
            /> */}

            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(1),
                    backgroundColor: '#471025',
                    position: "absolute",
                    top: 0,
                }}
            />
        </View>

    );
}

function _homePage() {
    const HomePage = require('./home/HomePage').default;
    return (
        <HomePage />
    )
}

function _rankPage() {
    const RankPage = require('./rank/RankPage').default;
    return (
        <RankPage />
    )
}

function _announcerPage() {
    const AnnouncerPage = require('./announcer/AnnouncerPage').default;
    return (
        <AnnouncerPage />
    )
}

function _messagePage() {
    const MessagePage = require('./message/MessagePage').default;
    return (
        <MessagePage />
    )
}

function _minePage() {
    const MinePage = require('./mine/MinePage').default;
    return (
        <MinePage />
    )
}

function _tabBar(props) {
    require('../../model/main/MainViewModel').setTabBarData(props.navigation, props.state);
    return (
        <MyTabBar {...props} />
    )
}


export default class MainView extends BaseView {
    constructor(props) {
        super(props);

        this._unReadNum = 0;
    }

    componentDidMount() {
        super.componentDidMount();

        require('../../model/PermissionModel').checkAppBasePermission();
    }

    onResume() {
        ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_REFRESH_ROOM, null);//刷新首页房间
        ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_USER_INFO, null);//刷新用户信息
        ModelEvent.dispatchEntity(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, null);//刷新会话列表
    }

    // onPause() {
    //     console.log("主页面暂停")
    // }

    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Home"
                    backBehavior='none'
                    tabBar={_tabBar}
                    pages_styles={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                    }}
                >
                    <Tab.Screen
                        name="Home"
                        component={_homePage}
                    />
                    <Tab.Screen
                        name="Rank"
                        component={_rankPage}
                    />
                    {/* <Tab.Screen
                        name="AnnouncerPage"
                        component={_announcerPage}
                    /> */}
                    <Tab.Screen
                        name="Message"
                        component={_messagePage}
                    />
                    <Tab.Screen
                        name="Mine"
                        component={_minePage}
                    />
                </Tab.Navigator>

                <PlayItem />

                <_phoneFloatBtn />
            </NavigationContainer>
        )
    }

}