/**
 * 主界面 -> 首页
 */
'use strict';

import React, { Component, PureComponent } from 'react';
import { Image, RefreshControl, ScrollView, TouchableOpacity, View, Text, Platform, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import Config from '../../../configs/Config';
import { EVT_LOGIC_ROOM_REFRESH_ROOM, EVT_LOGIC_VOICE_FRIEND_BANNER } from "../../../hardcode/HLogicEvent";
import HomePageModel from '../../../model/main/HomePageModel';
import DesignConvert from '../../../utils/DesignConvert';
import ModelEvent from "../../../utils/ModelEvent";
import RoomCardView from './RoomCardView';
import HorseLamp from './HorseLamp';
import RoomTabs from './RoomTabs';
import BannerSwiper from './BannerSwiper';
import _ChatHallEnterItem from '../../chathall/_ChatHallEnterItem';
import { ic_rank } from '../../../hardcode/skin_imgs/main';
import { SearchItem, TouchAndIcon } from './HomePageItem';
import OficialRecommendRoom from './item/OficialRecommendRoom';
import { EVT_UPDATE_ROOM_TABS_POSITION } from '../../../hardcode/HGlobalEvent';

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
        this._onPress(this._item);
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this._onItemPress}
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    justifyContent: 'center',
                    // overflow: 'hidden',
                    alignItems: 'center',
                }}>
                <Image
                    style={{
                        width: this.props.width,
                        height: this.props.height,
                        borderRadius: this.props.isShowWhiteBg ? 0 : DesignConvert.getW(10),
                        // resizeMode: 'contain'
                    }}
                    resizeMethod="auto"
                    source={
                        this._url
                            ? { uri: Config.getBannerUrl(this._url) }
                            : require('../../../hardcode/skin_imgs/main.js').banner_demo()
                    }
                />
                {this.props.isShowWhiteBg && <Image
                    source={require('../../../hardcode/skin_imgs/main.js').white_bg()}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(44),
                        position: 'absolute',
                        bottom: 0,
                        // tintColor: 'blue',
                    }}
                />}
            </TouchableOpacity>
        )
    }
}

export default class HomePage extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            defaultSelected: 0,
            bannerList: [],
            roomTypeList: [],
            recommendList: []
        };
        this._isRefreshing = false;
        this._refreshEnable = true;
        this._viewHieght = 0;
        this._isTop = true;

    }

    async componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_VOICE_FRIEND_BANNER, this._onRefresh);
        await this._onRefresh();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_VOICE_FRIEND_BANNER, this._onRefresh);
    }

    _itemClick = (s, i) => {
        this.setState({ defaultSelected: i })
        this.viewPager.setPage(i);
    }

    _getViewPager = (ref) => {
        this.viewPager = ref;
    }



    _onPagerSelected = (e) => {
        this.setState({ defaultSelected: e.position })
        // console.log(this.state.defaultSelected);
        // ModelEvent.dispatchEntity(null, EVT_UPDATE_ROOM_TABS_POSITION, e.position)
        // EVT_UPDATE_ROOM_TABS_POSITION

    }



    _onScroll = ({
        nativeEvent: {
            contentInset: { bottom, left, right, top },
            contentOffset: { x, y },
            zoomScale
        }
    }) => {
        if (y <= 70) {
            // this._alpha = (y + DesignConvert.statusBarHeight) / 70;
            // this._isTop = (y + DesignConvert.statusBarHeight) <= 0;
            this._alpha = y / 70;
            this._isTop = y <= 0;
            this.forceUpdate();
        } else {
            this._alpha = 1;
            this._isTop = y <= 0;
            // console.warn(this._alpha)
            this.forceUpdate();
        }

    }

    _onRefresh = async () => {

        const bannerList = await HomePageModel.getBannerList();

        const horseLamp = await HomePageModel.getHorseLamp();

        let roomTypeList = await HomePageModel.getRoomTypeList();

        this.giftList = await HomePageModel.getGiftListTableData();

        const recommendList = await HomePageModel.getFunRoomList(0, true)

        const info = await require("../../../model/main/MinePageModel").default.getPersonPage()
        this._avatar = { uri: Config.getHeadUrl(info.userId, info.logoTime, info.thirdIconurl) }
        
        roomTypeList = roomTypeList.length > 1 ? roomTypeList.slice(1) : roomTypeList
        this.setState({
            bannerList,
            horseLamp,
            roomTypeList,
            recommendList
        })
        this._isRefreshing = false;
        this.forceUpdate();
        ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_REFRESH_ROOM, null);
    }

    _getRefreshEnable = (y) => {
        let bool = y == 0;
        // console.log("_getRefreshEnable", bool)
        if (this._refreshEnable != bool) {
            this._refreshEnable = bool;
            this.forceUpdate();
        }
    }

    _onSearch = () => {
        // console.log('~~~~', '弹出搜索框')
        require("../../../router/level2_router").showSearchView();
        // require("../../../router/level3_router").showRoomMusicPlayView();

    }

    _openRank = () => {
        require('../../../router/level2_router').showRankPage()
    }

    _onBeforeOpenLivePress = () => {
        require("../../../model/room/RoomModel").beforeOpenLive();
    }

    _getHeightCallBack = (height, index, key) => {
        // console.log('=======2', '_getHeightCallBack2', key)
        let roomTypeList1 = this.state.roomTypeList;

        roomTypeList1[index].height = height;

        this.setState(
            {
                roomTypeList: roomTypeList1,
            }
        )
        this.forceUpdate();
    }

    _getViewPageHeight = (height = 0, index, key) => {
        let roomTypeList1 = this.state.roomTypeList;
        roomTypeList1[index].height = height;

        this.forceUpdate()
    }

    _renderTitle = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(88),
                    paddingTop: DesignConvert.getH(44),
                    paddingHorizontal: DesignConvert.getW(15),
                    alignItems: 'center'
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(18),
                        fontWeight: 'bold',

                        marginRight: DesignConvert.getW(20)

                    }}
                >首页</Text>

                <SearchItem />

                <TouchAndIcon
                    source={require('../../../hardcode/skin_imgs/main').ic_enterRoom()}
                    onPress={this._onBeforeOpenLivePress}
                    styleContianer={{
                        position: 'absolute',
                        top: DesignConvert.getH(51),
                        right: DesignConvert.getW(15)
                    }}
                />
            </View>
        )
    }

    _renderTopBtns = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),
                    position: 'absolute',
                    top: DesignConvert.statusBarHeight,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >

                <TouchableOpacity
                    style={{
                        flex: 1,
                        marginLeft: DesignConvert.getW(15),
                    }}
                    onPress={this._openRank}
                >
                    <Image
                        source={require('../../../hardcode/skin_imgs/yuanqi').rank_btn()}
                        style={{
                            width: DesignConvert.getW(73),
                            height: DesignConvert.getH(29),
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginRight: DesignConvert.getW(10),
                    }}
                    onPress={this._onSearch}
                >
                    <Image
                        source={require('../../../hardcode/skin_imgs/yuanqi').search_btn()}
                        style={{
                            width: DesignConvert.getW(60),
                            height: DesignConvert.getH(29),
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginRight: DesignConvert.getW(15),
                    }}
                    onPress={this._onBeforeOpenLivePress}
                >
                    <Image
                        source={require('../../../hardcode/skin_imgs/yuanqi').room_btn()}
                        style={{
                            width: DesignConvert.getW(60),
                            height: DesignConvert.getH(29),
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    _renderHeaderBar = () => {
        return (
            <RoomTabs
                defaultSelected={this.state.defaultSelected}
                items={this.state.roomTypeList}
                itemClick={this._itemClick}
            />
        );
    };

    // render() {
    //     // let viewPagerHeight = - this.state.bannerList.length == 0 ? DesignConvert.sheight - DesignConvert.getH(88) - DesignConvert.getH(145) - DesignConvert.getH(50) - DesignConvert.addIpxBottomHeight() : DesignConvert.sheight - DesignConvert.getH(88) - DesignConvert.getH(145) - DesignConvert.getH(50) - DesignConvert.addIpxBottomHeight();
    //     const viewPagerHeight = DesignConvert.sheight - DesignConvert.getH(245) - DesignConvert.getH(51) - DesignConvert.getH(49) + DesignConvert.addIpxBottomHeight()
    //     const num = Platform.OS === 'ios' ? 1 : 0
    //     return (
    //         <View
    //             style={{
    //                 flex: 1,
    //                 backgroundColor: 'white',
    //             }}>



    //             <View
    //                 style={{
    //                     // height: DesignConvert.sheight - DesignConvert.getH(88) - DesignConvert.getH(50) - DesignConvert.addIpxBottomHeight()
    //                     flex: 1
    //                 }}>

    //                 <View
    //                     style={{
    //                         flex: 1,
    //                         // backgroundColor: 'red',
    //                         alignItems: 'center',
    //                         width: DesignConvert.swidth,
    //                         backgroundColor: 'white',
    //                         borderTopLeftRadius: DesignConvert.getW(10),
    //                         borderTopRightRadius: DesignConvert.getW(10),
    //                         // position: 'relative',
    //                     }}>

    //                     <BannerSwiper
    //                         bannerList={this.state.bannerList}
    // width={DesignConvert.swidth}
    // height={DesignConvert.getH(245)}
    //                         isShowWhiteBg={true}
    //                     />

    //                     {/* <_ChatHallEnterItem /> */}

    //                     {/* <View
    //                         style={{
    //                             width: DesignConvert.getW(335),
    //                             height: DesignConvert.getH(21),
    //                             marginTop: DesignConvert.getH(15),
    //                             // borderStyle: 'solid',
    //                             // borderColor: '#F2F2F2',
    //                             // borderWidth: DesignConvert.getW(1),
    //                             // borderRadius: DesignConvert.getW(5),
    //                         }}>
    //                         <HorseLamp
    //                             horseLampList={this.state.horseLamp}
    //                             giftList={this.giftList} />
    //                     </View> */}

    //                     {this._renderTopBtns()}

    //                     {this._renderHeaderBar()}

    //                     <ViewPager
    //                         ref={this._getViewPager}
    //                         onPageSelected={this._onPagerSelected}
    //                         style={{
    //                             width: DesignConvert.swidth,
    //                             height: viewPagerHeight,
    //                             marginBottom: DesignConvert.addIpxBottomHeight(),
    //                         }}>
    //                         {this.state.roomTypeList.map((item, i) => (
    //                             <View
    //                                 style={{
    //                                     flex: 1,
    //                                 }}
    //                                 key={i}>
    //                                 <RoomCardView
    //                                     bannerList={this.state.bannerList}
    //                                     index={i}
    //                                     onScroll={this._getRefreshEnable}
    //                                     scrolling={this._onScroll}
    //                                     roomType={item.id}
    //                                     enabled={this._refreshEnable}
    //                                     refreshing={this._isRefreshing}
    //                                     roomTypeList={this.state.roomTypeList}
    //                                     onRefreshData={this._onRefresh}
    //                                     changeHeight={this._getViewPageHeight}
    //                                 />
    //                             </View>
    //                         ))}
    //                     </ViewPager>
    //                 </View>
    //             </View>
    //         </View >
    // );
    // }


    render() {
        let viewPagerHeight = - this.state.bannerList.length == 0 ? DesignConvert.sheight - DesignConvert.getH(102) : DesignConvert.sheight - DesignConvert.getH(102) - DesignConvert.getH(155);
        viewPagerHeight = viewPagerHeight - DesignConvert.statusBarHeight - DesignConvert.addIpxBottomHeight();
        return (
            <ImageBackground
                style={{
                    flex: 1,
                }}
                source={require('../../../hardcode/skin_imgs/login').bg()}
            >
                {this._renderTitle()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this._isRefreshing}
                            onRefresh={this._onRefresh}
                            enabled={this._refreshEnable}
                        />
                    }
                    contentContainerStyle={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                    scrollEnabled
                    style={{
                        flex: 1,
                        height: DesignConvert.sheight - DesignConvert.getH(44) - DesignConvert.getH(50) - DesignConvert.addIpxBottomHeight() - DesignConvert.statusBarHeight,

                        paddingTop: DesignConvert.statusBarHeight,
                    }}>

                    <BannerSwiper bannerList={this.state.bannerList} />


                    <HorseLamp
                        horseLampList={this.state.horseLamp}
                        giftList={this.giftList} />

                    {this.state.recommendList.length > 0 ? (
                        <OficialRecommendRoom
                            roomTypeList={this.state.roomTypeList}
                            data={this.state.recommendList}
                        />
                    ) : null}

                    {this._renderHeaderBar()}

                    <ViewPager
                        ref={this._getViewPager}
                        onPageSelected={this._onPagerSelected}
                        style={{
                            minHeight: (this.state.roomTypeList.length > this.state.defaultSelected &&
                                this.state.roomTypeList[this.state.defaultSelected] &&
                                this.state.roomTypeList[this.state.defaultSelected].height > viewPagerHeight) ?

                                this.state.roomTypeList[this.state.defaultSelected].height :
                                viewPagerHeight,

                            width: DesignConvert.swidth,
                            marginBottom: DesignConvert.addIpxBottomHeight(),
                            marginTop: DesignConvert.getH(10)
                        }}>
                        {this.state.roomTypeList.map((item, i) => (
                            <View
                                key={i}>
                                <RoomCardView
                                    index={i}
                                    onScroll={this._getRefreshEnable}
                                    roomType={item.id}
                                    roomTypeList={this.state.roomTypeList}
                                    onRefreshData={this._onRefresh}
                                    getHeightCallBack={this._getHeightCallBack}
                                />
                            </View>
                        ))}
                    </ViewPager>
                </ScrollView>

            </ImageBackground>
        );
    }
}
