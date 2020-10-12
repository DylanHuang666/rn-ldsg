/**
 * 个性装扮商城界面
 */

'use strict';

import React, { PureComponent } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { ViewPager } from 'rn-viewpager';
import { clearAll, getUserHeadData } from '../../cache/MallCache';
import UserInfoCache from '../../cache/UserInfoCache';
import Config from '../../configs/Config';
import { HEAD_DECORATOR_SCALE } from '../../hardcode/HGLobal';
import { EVT_UI_MALL_ENTER_EFFECT, EVT_UI_MALL_HEAD_FRAME_CHANGE } from '../../hardcode/HUIEvent';
import { ic_back_black } from '../../hardcode/skin_imgs/common';
import { top_bg } from '../../hardcode/skin_imgs/mall';
import DesignConvert from '../../utils/DesignConvert';
import ModelEvent from '../../utils/ModelEvent';
import BaseView from "../base/BaseView";
import EnterEffectPage from './personal/EnterEffectPage';
import HeadFramePage from './personal/HeadFramePage';

class _HeadItem extends PureComponent {

    constructor(props) {
        super(props);
        this._headUri = null;

        this._headFrameUri = null;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UI_MALL_HEAD_FRAME_CHANGE, this._onChangeHeadFrame);

        this._updateData();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UI_MALL_HEAD_FRAME_CHANGE, this._onChangeHeadFrame);

        clearAll();
    }

    _updateData() {
        if (this._headUri) return;

        require('../../model/user/UserInfoModel').default.getMyHeadUrl()
            .then(async data => {
                if (!data) return;

                this._headUri = data;
                this.forceUpdate();

                if (UserInfoCache.userInfo && UserInfoCache.userInfo.headFrameId) {
                    const havatarBox = await require('../../model/staticdata/StaticDataModel').getAvatarBox(UserInfoCache.userInfo.headFrameId);
                    if (havatarBox) {
                        this._headFrameUri = { uri: Config.getShopHeadFrameIdUrl(havatarBox.avatarboxid, havatarBox.updatetime) };
                        this.forceUpdate();
                    }
                }
            })
    }

    _onChangeHeadFrame = () => {
        const cache = getUserHeadData();
        if (!cache) return;

        if (!cache.selectedInfo) {
            this._headFrameUri = null;
            this.forceUpdate();
            return;
        }

        if (cache.selectedInfo == cache.equiped || !cache.selectedInfo.goodsInfo) {
            this._headFrameUri = { uri: Config.getShopHeadFrameIdUrl(cache.selectedInfo.hdata.avatarboxid, cache.selectedInfo.hdata.updatetime) };
            this.forceUpdate();
            return;
        }

        this._headFrameUri = null;
        this.forceUpdate();
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    alignSelf: "center",
                    top: DesignConvert.getH(77),
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(33),
                        top: DesignConvert.getH(33),

                        width: DesignConvert.getW(98),
                        height: DesignConvert.getH(98),

                        borderRadius: DesignConvert.getW(49),

                        color: '#FFFFFF66',
                    }}
                />

                <Image
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW((92 * HEAD_DECORATOR_SCALE - 92) * 0.5),
                        top: DesignConvert.getH((92 * HEAD_DECORATOR_SCALE - 92) * 0.5),

                        borderRadius: DesignConvert.getW(46),

                        width: DesignConvert.getW(92),
                        height: DesignConvert.getH(92),
                    }}
                    source={this._headUri}
                />

                <Image
                    style={{
                        width: DesignConvert.getW(92 * HEAD_DECORATOR_SCALE),
                        height: DesignConvert.getH(92 * HEAD_DECORATOR_SCALE),
                    }}
                    resizeMode='stretch'
                    source={this._headFrameUri}
                />

            </View>
        );
    }
}

class _EnterEffectMovieItem extends PureComponent {


    constructor(props) {
        super(props);
        this._uri = null;

        this._timer = null;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_UI_MALL_ENTER_EFFECT, this._onEffect);
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UI_MALL_ENTER_EFFECT, this._onEffect);

        this._stopTimer();
    }

    _onEffect = (url) => {
        if (this._uri && this._uri.uri == url) return;

        this._uri = { uri: url };

        this.forceUpdate();
    }

    _startNext() {
        this._stopTimer();
        this._timer = setTimeout(() => {
            this._uri = null;
            this.forceUpdate();
        }, 2000);
    }

    _stopTimer() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    render() {
        if (!this._uri) {
            return null;
        }

        this._startNext();

        return (
            <Image
                style={{
                    position: 'absolute',
                    // right: DesignConvert.getW(36),
                    // top: DesignConvert.getH(86),

                    // width: DesignConvert.getW(80),
                    // height: DesignConvert.getH(80),

                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                }}
                source={this._uri}
            />
        )
    }
}

class _TabItems extends PureComponent {

    _onHead = () => {
        this.props.onPress(0);
    }

    _onEnterEffect = () => {
        this.props.onPress(1);
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,

                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(40),

                    backgroundColor: '#00000019',
                }}
            >

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(64),

                        width: DesignConvert.getW(49),
                        height: DesignConvert.getH(40),

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this._onHead}
                >
                    <Text
                        style={{
                            color: this.props.selectedIndex == 0 ? 'white' : '#FFFFFF80',
                            fontSize: DesignConvert.getF(13),
                        }}
                    >头像框</Text>

                    {
                        this.props.selectedIndex == 0 ? (
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: DesignConvert.getW(14),

                                    backgroundColor: 'white',

                                    borderRadius: DesignConvert.getW(14),

                                    width: DesignConvert.getW(21),
                                    height: DesignConvert.getH(5),
                                }}
                            />
                        ) : (
                                null
                            )
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(65),

                        width: DesignConvert.getW(60),
                        height: DesignConvert.getH(40),

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this._onEnterEffect}
                >
                    <Text
                        style={{
                            color: this.props.selectedIndex == 1 ? 'white' : '#FFFFFF80',
                            fontSize: DesignConvert.getF(13),
                        }}
                    >进场特效</Text>

                    {
                        this.props.selectedIndex == 1 ? (
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: DesignConvert.getW(20),

                                    backgroundColor: 'white',

                                    borderRadius: DesignConvert.getW(14),

                                    width: DesignConvert.getW(21),
                                    height: DesignConvert.getH(5),
                                }}
                            />
                        ) : (
                                null
                            )
                    }
                </TouchableOpacity>

            </View>
        )
    }
}

export default class PersonalLookMallView extends BaseView {

    constructor(props) {
        super(props);

        this._selectedIndex = 0;
    }

    _onChangeSelectIndex = (i) => {
        if (this._selectedIndex == i) return;

        this._selectedIndex = i;
        this.forceUpdate();
        this._viewPager && this._viewPager.setPage(i);
    }

    _onPageChange = e => {
        this._selectedIndex = e.position;
        this.forceUpdate();
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                {/* <StatusBarView /> */}

                <ImageBackground
                    source={top_bg()}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(260),
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(10) + DesignConvert.statusBarHeight,

                            width: DesignConvert.swidth,

                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: DesignConvert.getF(17),
                            }}
                        >个性商城</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(10) + DesignConvert.statusBarHeight,
                            width: DesignConvert.getW(51),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={this.popSelf}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(21),
                                height: DesignConvert.getH(19),

                                tintColor: 'white',
                            }}
                            source={ic_back_black()}
                        />
                    </TouchableOpacity>

                    <_HeadItem />

                    <_TabItems
                        selectedIndex={this._selectedIndex}
                        onPress={this._onChangeSelectIndex}
                    />
                </ImageBackground>

                <ViewPager
                    initialPage={this._selectedIndex}
                    style={{
                        position: 'absolute',
                        top: DesignConvert.statusBarHeight + DesignConvert.getH(260),
                        bottom: DesignConvert.addIpxBottomHeight(),

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
                        <HeadFramePage />
                    </View>

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <EnterEffectPage />
                    </View>

                </ViewPager>

                <_EnterEffectMovieItem />
            </View>
        );
    }
}