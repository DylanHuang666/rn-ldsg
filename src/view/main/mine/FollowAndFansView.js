/**
 * 我的 -> 粉丝或关注列表
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Slider,
} from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../../utils/DesignConvert';
import BackTitleView from '../../base/BackTitleView';
import Config from '../../../configs/Config';
import StatusBarView from '../../base/StatusBarView';
import BaseView from '../../base/BaseView';
import ToastUtil from '../../base/ToastUtil';
import ModelEvent from '../../../utils/ModelEvent';
import { EVT_LOGIC_UPDATE_USER_INFO } from '../../../hardcode/HLogicEvent';
import SexAgeWidget from '../../userinfo/SexAgeWidget';
import FriendAndFansAndFollowViewPager from './FriendAndFansAndFollowViewPager';
import { THEME_COLOR } from '../../../styles';
import RoomInfoCache from '../../../cache/RoomInfoCache';

const [Follow, Fans, Friend] = [486, 777, 999];
export { Follow, Fans, Friend };

export class FList extends PureComponent {
    constructor(props) {
        super(props);

        this._type = this.props.viewType;
        this._list = [];
        this._extraData = 0;
    }

    componentDidMount() {
        //注册事件
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initData);
        this._initData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this._type === nextProps.viewType) return false
        this._type = nextProps.viewType
        this._initData();
        return true;
    }
    componentWillUnmount() {
        //解绑事件
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_USER_INFO, this._initData);
    }

    getFriendsType = () => {
        switch (this._type) {
            case Follow:
                return 1;
            case Fans:
                return 2;
            case Friend:
                return 3;
        }
    }

    _initData = () => {
        require('../../../model/message/FriendsModel').default.getFriends(this.getFriendsType())
            .then(data => {
                this._list = data;
                this._extraData++;
                this.forceUpdate();
            });
    }

    getEmptyDesc = () => {
        switch (this._type) {
            case Follow:
                return '快去关注你喜欢的人吧';
            case Fans:
                return '主动关注说不定就有故事了呢？';
            case Friend:
                return '还没有好友哦';
        }
    }

    _renderFooterView = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(50),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text
                    style={{
                        color: "white",
                        fontSize: DesignConvert.getF(11),
                    }}>--- 已经到最底部了 ---</Text>
            </View>
        )
    }

    _renderEmptyView = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(520),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    source={require('../../../hardcode/skin_imgs/main').no_friend2()}
                    style={{
                        width: DesignConvert.getW(94.5),
                        height: DesignConvert.getH(116.5),
                    }}></Image>
                <Text
                    style={{
                        marginTop: DesignConvert.getH(16.5),
                        color: THEME_COLOR,
                        fontSize: DesignConvert.getF(15),
                    }}>{this.getEmptyDesc()}
                </Text>
            </View>
        );
    };

    _onHeadPress = (item) => {
        require('../../../router/level2_router').showUserInfoView(item.userId);
    };

    _onItemPress = (item) => {
        require("../../../router/level2_router").showChatView(item.userId, decodeURI(item.nickName), false);
    }

    _enterLiveRoom = (item) => {

        //在房间
        if (RoomInfoCache.isInRoom && item.roomId == RoomInfoCache.roomId) {
            require('../../../model/room/RoomModel').getRoomDataAndShowView(RoomInfoCache.roomId);
            return;
        }

        require('../../../model/room/RoomModel').default.enterLiveRoom(item.roomId, '')
    }

    _renderHasFocusView = (userId) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this._onAttentionPress(userId, false);
                }}
                style={{
                    position: "absolute",
                    top: DesignConvert.getH(16.5),
                    right: DesignConvert.getW(15),
                    width: DesignConvert.getW(54),
                    height: DesignConvert.getH(24),
                    borderRadius: DesignConvert.getW(15),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: '#979797',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        fontSize: DesignConvert.getF(12),
                        color: '#979797'
                    }}
                >
                    {'已关注'}
                </Text>
            </TouchableOpacity>
        )
    }

    // 0是自己,1是好友,2已关注,3已被关注
    _onAttentionPress = async (userId, bool = true) => {
        let res = require("../../../model/userinfo/UserInfoModel").default.addLover(userId, bool);

        if (res) {
            if (bool) {
                ToastUtil.showCenter("关注成功");
            } else {
                ToastUtil.showCenter("取消关注成功");
            }

            this._initData();
        } else {
            ToastUtil.showCenter("操作失败");
        }
    }

    _renderUnfocusView = (userId) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this._onAttentionPress(userId, true);
                }}
                style={{
                    position: "absolute",
                    top: DesignConvert.getH(16.5),
                    right: DesignConvert.getW(15),
                    width: DesignConvert.getW(54),
                    height: DesignConvert.getH(24),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: 'white',
                    backgroundColor: '#FF5245',
                    borderRadius: DesignConvert.getW(15),
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                <Text
                    style={{
                        fontSize: DesignConvert.getF(12),
                        color: '#FFFFFF',
                        marginLeft: DesignConvert.getW(3),
                    }}
                >
                    {'+ 关注'}
                </Text>
            </TouchableOpacity>
        )
    }

    _renderFriendView = () => {
        return (
            <View
                style={{
                    position: "absolute",
                    top: DesignConvert.getH(16.5),
                    right: DesignConvert.getW(15),
                    width: DesignConvert.getW(75),
                    height: DesignConvert.getH(24),
                    borderRadius: DesignConvert.getW(15),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                {/* <Image
                    source={require('../../../hardcode/skin_imgs/main').friend_sign()}
                    style={{
                        width: DesignConvert.getW(11),
                        height: DesignConvert.getH(8),
                        tintColor: "#C7C7C7",
                    }}
                /> */}

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: 'white',
                        marginLeft: DesignConvert.getW(4)
                    }}
                >
                    {'互相关注'}
                </Text>
            </View>
        )
    }

    // 0是自己,1是好友,2已关注,3已被关注
    renderRightView = (item) => {
        // return (
        //     <TouchableOpacity
        //         onPress={() => {
        //             this._enterLiveRoom(item);
        //         }}
        //         style={{
        //             position: "absolute",
        //             right: DesignConvert.getW(15),
        //             width: DesignConvert.getW(40),
        //             height: DesignConvert.getH(65),
        //             justifyContent: 'center',
        //             alignItems: 'center',
        //         }}>
        //         <Image
        //             source={require('../../../hardcode/skin_imgs/main').ic_location()}
        //             style={{
        //                 width: DesignConvert.getW(18),
        //                 height: DesignConvert.getH(23),
        //             }}></Image>
        //         <Text
        //             style={{
        //                 marginTop: DesignConvert.getH(5),
        //                 color: "#333333",
        //                 fontSize: DesignConvert.getF(11),
        //             }}>
        //             去找TA
        //         </Text>
        //     </TouchableOpacity>
        // )
        switch (this._type) {
            case Follow:
                if (item.friendStatus == 3) {
                    return this._renderUnfocusView(item.userId)
                } else {
                    return this._renderHasFocusView(item.userId);
                }
            case Fans:
                if (item.friendStatus == 3) {
                    return this._renderUnfocusView(item.userId)
                } else if (item.friendStatus == 1) {
                    return this._renderFriendView()
                } else {
                    return this._renderHasFocusView(item.userId);
                }
            case Friend:
                return this._renderFriendView()
            default:
                return null;
        }
    }

    _renderSexView = (item) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>



                {/* 性别岁数 和 等级 */}
                <SexAgeWidget
                    sex={item.sex}
                    age={item.age} />

                {/* <MedalWidget
                    width={DesignConvert.getW(34)}
                    height={DesignConvert.getH(14)}
                    richLv={item.contributeLv}
                    charmLv={item.charmLv}
                /> */}
            </View>
        )
    }

    _renderItem = ({ item }) => {
        return (
            <View
                onPress={() => {
                    this._onItemPress(item);
                }}
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(65),
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this._onHeadPress(item);
                    }}
                >
                    <Image
                        source={{ uri: Config.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(50),
                            marginLeft: DesignConvert.getW(15),
                            marginRight: DesignConvert.getW(12),
                            borderRadius: DesignConvert.getW(50*0.5),
                        }}></Image>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(14),
                                marginRight: DesignConvert.getW(8),
                                maxWidth: DesignConvert.getW(150),
                            }}>{decodeURI(item.nickName)}</Text>


                        {/* {this._renderSexView(item)} */}

                    </View>

                    {/* <Text
                        numberOfLines={1}
                        style={{
                            color: "#999999",
                            fontSize: DesignConvert.getF(12),
                            marginTop: DesignConvert.getW(6),
                            maxWidth: DesignConvert.getW(240),
                        }}>{item.slogan ? decodeURI(item.slogan) : "这个家伙很懒什么也没留下～"}</Text> */}
                </View>

                {item.roomId ? this.renderRightView(item) : null}

                {/* <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(0.5),
                        backgroundColor: "#F6F6F6",
                    }}></View> */}
            </View>
        );
    };

    getTitle = () => {
        switch (this._type) {
            case Follow:
                return '关注';
            case Fans:
                return '粉丝';
            case Friend:
                return '好友';
        }
    }

    render() {
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this._list}
                renderItem={this._renderItem}
                extraData={this._extraData}
                refreshing={false}
                onRefresh={this._initData}
                ListEmptyComponent={this._renderEmptyView}
                ListFooterComponent={this._renderFooterView}
                style={{
                    flex: 1,
                    marginTop: DesignConvert.getH(5),
                }}
            />
        );
    }
}

export default class FollowAndFansView extends BaseView {
    constructor(props) {
        super(props);

        this._type = this.props.params.viewType;
    }


    getTitle = () => {
        switch (this._type) {
            case Follow:
                return '关注';
            case Fans:
                return '粉丝';
            case Friend:
                return '好友';
        }
    }

    render() {
        // return (
        //     <ImageBackground
        //         source={require('../../../hardcode/skin_imgs/main').home_bg()}
        //         style={{
        //             flex: 1,
        //         }}>
        //         <BackTitleView
        //             titleText={"联系人"}
        //             onBack={this._onBackPress}
        //             titleTextStyle={{
        //                 color: "white",
        //             }}
        //             backImgStyle={{
        //                 tintColor: "white",
        //             }}
        //         />

        //         <FriendAndFansAndFollowViewPager
        //             type={this._type} />
        //     </ImageBackground>
        // )
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#3B0D1E', '#260713']}
                style={{
                    flex: 1,
                }}
            >
                <BackTitleView
                    titleText={this.getTitle()}
                    onBack={this.popSelf}
                    bgColor={['#3B0D1E','#260713']}
                    titleTextStyle={{
                        color:'white'
                    }}
                />

                <FList
                    viewType={this._type} />

            </LinearGradient>
        );
    }
}
