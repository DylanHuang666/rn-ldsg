/**
 * 主界面 -> 首页 -> banner
 */
'use strict';

import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import Config from '../../../configs/Config';
import DesignConvert from '../../../utils/DesignConvert';


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
                    width: DesignConvert.getW(this._width),
                    height: DesignConvert.getH(this._height),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Image
                    style={{
                        width: DesignConvert.getW(this._width),
                        height: DesignConvert.getH(this._height),
                        borderRadius: DesignConvert.getW(10)
                        // resizeMode: 'contain'
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

export default class BannerSwiper extends Component {

    constructor(props) {
        super(props);

        this._bannerList = [];
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('刷新banner============', nextProps)
        this._bannerList = nextProps.bannerList;
        return true;
    }

    _renderDotIndicator = (pageCount) => {
        return (
            <PagerDotIndicator
                pageCount={pageCount}
                style={{
                    bottom: DesignConvert.getH(5),
                }}
                dotStyle={{
                    width: DesignConvert.getW(6),
                    height: DesignConvert.getH(6),
                    borderRadius: DesignConvert.getW(5),
                    backgroundColor: '#370267',
                    marginHorizontal: DesignConvert.getW(3.5),
                }}
                selectedDotStyle={{
                    backgroundColor: '#FE2A54',
                    height: DesignConvert.getH(6),
                    width: DesignConvert.getW(6),
                    borderRadius: DesignConvert.getW(5),
                    marginHorizontal: DesignConvert.getW(3.5),
                }}
            />
        )
    }

    _onBannnerPress = (item) => {
        switch (item.type) {
            case 2:

                break;
            case 3:
                require('../../../router/level3_router').openActivityWebView(item.targetobject)
                break;
            default:
                require("../../../router/level2_router").showMyWebView(item.title, item.targetobject);
                break
        }
    }

    render() {
        if (this._bannerList.length == 0) {
            return (
                <View>
                    {/* <TouchableOpacity
                        onPress={this._onBannnerPress}
                        style={{
                            width: DesignConvert.getW(335),
                            height: DesignConvert.getH(90),
                            marginTop: DesignConvert.getH(11),
                        }}>
                        <ImageTouchableBox
                                width={335}
                                height={90}
                                onPress={() => { }}
                            />
                    </TouchableOpacity> */}
                </View>
            )
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                // onPress={this._onBannnerPress}
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(125),
                    borderRadius: DesignConvert.getW(10),
                    overflow: 'hidden',
                    ...this.props.style
                }}>

                <IndicatorViewPager
                    keyboardDismissMode={'none'}
                    autoPlayEnable
                    style={{ height: DesignConvert.getH(125) }}
                    indicator={this._renderDotIndicator(this.props.showIndicator? this._bannerList.length : 0)}>
                    {this._bannerList.map(item => (
                        <View
                            key={item.id}>
                            <ImageTouchableBox
                                width={345}
                                height={130}
                                url={item.bannerurl}
                                onPress={this._onBannnerPress}
                                item={item}
                            />
                        </View>
                    ))}
                </IndicatorViewPager>
            </TouchableOpacity>
        )
    }
}