/**
 * 主界面 -> 首页 -> 跑马灯
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import RoomTabs from './RoomTabs';
import BannerSwiper from './BannerSwiper';
import RoomCardView from './RoomCardView';
import DesignConvert from '../../../utils/DesignConvert';
import Config from '../../../configs/Config';
import HomePageModel from '../../../model/main/HomePageModel';
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_ROOM_REFRESH_ROOM, EVT_LOGIC_VOICE_FRIEND_BANNER, } from "../../../hardcode/HLogicEvent";
import HGlobal, { COIN_NAME } from '../../../hardcode/HGLobal';
import { extChangeRankPageIndex } from '../../../cache/RankCache';
import SexAgeWidget from '../../userinfo/SexAgeWidget';
import _PublicScreenMessageBingoItem from '../../room/item/chat/_PublicScreenMessageBingoItem';




//TODO:跑马灯要实现或者用框架，暂时不浪费时间
export default class HorseLamp extends Component {
    constructor(props) {
        super(props);

        this._horseLampList = [];
        this._giftList = [];
        this.state = {
            index: 0,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        this._horseLampList = nextProps.horseLampList ? nextProps.horseLampList : [];
        this._giftList = nextProps.giftList;
        if (this._horseLampList && this._horseLampList.length > 0) {
            this._startTimeout();
        }
        return true;
    }

    componentWillUnmount() {
        this._stopTimeout();
    }

    _stopTimeout() {
        if (this._Timer) {
            clearTimeout(this._Timer);
            this._Timer = null;
        }
    }

    _startTimeout() {
        if (this._Timer) return;

        this._Timer = setTimeout(() => {

            this._Timer = null;

            if (!this._flatList) {
                this.setState({ index: 0, })
            } else {
                this._flatList.scrollToIndex({
                    animated: true,
                    index: this.state.index,
                    viewOffset: 0,
                    viewPosition: 0,
                });
                let currentIndex = this.state.index + 2 > this._horseLampList.length ? 0 : this.state.index + 1;
                this.setState({ index: currentIndex, })
            }

        }, 5000);
    }

    _getFlatList = (ref) => {
        this._flatList = ref;
    }

    _onScrollToIndexFailed = () => {
        this.setState({
            index: 0,
        })
        this._flatList.scrollToEnd();
    }

    _onHorseLampPress = () => {
        require("../../../router/level2_router").showHeadlinesView();
        // extChangeRankPageIndex(0)
        // require("../../../model/main/MainViewModel").navigateToRankPage();
    }

    _onAvatorPress = (userId) => {
        require("../../../router/level2_router").showUserInfoView(userId);
    }

    _renderHorseLampItem = ({ item }) => {
        // console.log('跑马灯', item)
        let action
        switch (item.action) {
            case 0:
                action = HGlobal.EGG_ACTION
                break;
            case 1:
                action = HGlobal.EGG_A
                break;
            case 10:
                action = HGlobal.EGG_B
                break;
            case 100:
                action = HGlobal.EGG_C
                break;
            default:
                break
        }

        action = "许愿瓶";

        return (
            <TouchableOpacity
                onPress={this._onHorseLampPress}
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getW(40),
                    // paddingLeft: DesignConvert.getW(75),
                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor:'#FE4F45',
                    borderRadius: DesignConvert.getW(12),
                }}>

                {/* <Image
                    style={{
                        width: DesignConvert.getW(19),
                        height: DesignConvert.getH(19),
                    }}
                    source={require('../../../hardcode/skin_imgs/main.js').icon_headlines()}
                /> */}
                {/* <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(13),
                        marginLeft: DesignConvert.getW(6),
                    }}
                >手气榜</Text> */}
                {/* <TouchableOpacity

                    style={{
                        marginLeft: DesignConvert.getW(5),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(20),
                            borderRadius: DesignConvert.getW(10),
                            marginRight: DesignConvert.getW(3),
                            overflow: 'hidden',
                        }}
                        source={{ uri: Config.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl) }}
                    />


                </TouchableOpacity> */}

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        // justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>

<Image
                    style={{
                        width: DesignConvert.getW(19),
                        height: DesignConvert.getH(19),
                        marginLeft: DesignConvert.getW(12)
                    }}
                    source={require('../../../hardcode/skin_imgs/main.js').icon_headlines()}
                />

                    <Text
                        onPress={() => {
                            this._onAvatorPress(item.userId)
                        }}
                        numberOfLines={1}
                        style={{
                            color: '#FFFFFF',
                            maxWidth: DesignConvert.getW(95),
                            fontSize: DesignConvert.getH(11),
                            marginLeft: DesignConvert.getW(12)
                        }}>
                        {decodeURI(item.nickName)}
                    </Text>

                    {/* <Text
                        style={{
                            color: 'rgba(33, 33, 33, 1)',
                            fontSize: DesignConvert.getH(12)
                        }}>{`${HGLobal.EGG_ACTION}获得`}</Text> */}
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(12)
                        }}> 在{HGlobal.EGG_ACTION_NAME} 中获得</Text>
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(12)
                        }}>
                        {item.gift.name}
                    </Text>
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(12)
                        }}>
                        {"x" + item.gift.amount}
                    </Text>
                    {/* <Image
                        style={{
                            width: DesignConvert.getW(31),
                            height: DesignConvert.getW(31),
                            marginLeft: DesignConvert.getW(5),
                            resizeMode: "contain",
                        }}
                        source={{ uri: Config.getGiftUrl(item.gift.giftId) }}
                    /> */}

                    {/* <Text
                        style={{
                            color: 'rgba(196, 94, 236, 1)',
                            fontSize: DesignConvert.getF(12)
                        }}>
                        {`价值${item.gift.price}${COIN_NAME}`}
                    </Text> */}
                </View>
                {/* <Image
                    source={require('../../../hardcode/skin_imgs/main.js').icon_arrow_next()}
                    style={{
                        width: DesignConvert.getW(8),
                        height: DesignConvert.getH(14),
                        resizeMode: 'contain',
                        position: 'absolute',
                        right: DesignConvert.getW(15),
                    }}
                /> */}
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(40),
                    marginTop: DesignConvert.getH(15) 
                }}
            >
                <Image
                    //source={require('../../../hardcode/skin_imgs/main').horse_bg()}
                    style={{
                        position: 'absolute',

                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(40),
                    }}
                />
                <FlatList
                    ref={this._getFlatList}
                    data={this._horseLampList}
                    // data={[]}
                    renderItem={this._renderHorseLampItem}
                    initialNumToRender={1}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    onScrollToIndexFailed={this._onScrollToIndexFailed}
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(40),
                        // backgroundColor: 'rgba(255, 255, 255, 0.36)',
                        // borderStyle: 'solid',
                        // borderColor: '#F2F2F2',
                        // borderWidth: DesignConvert.getW(1),
                        // borderRadius: DesignConvert.getW(10),
                    }}
                />
            </View>

        )
    }
}