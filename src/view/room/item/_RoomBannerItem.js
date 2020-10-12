'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import { ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import WebView from '../../base/X5WebView';
import Config from "../../../configs/Config";

export default class _RoomBannerItem extends PureComponent {

    constructor(props) {
        super(props);

        this._selectTab = 0;

        this._data = []
        this._pointNum = 0

        //获取直播间大Banner
        require('../../../model/BannerModel').default.getRoomBigBanner()
            .then(data => {
                this._data = data
                this._pointNum = this._data.length
                this.forceUpdate()
            })
    }

    _renderDotIndicator() {
        return (
            <PagerDotIndicator
                dotStyle={{
                    width: DesignConvert.getW(6),
                    height: DesignConvert.getH(2),
                    backgroundColor: '#FFFFFF33',
                }}
                selectedDotStyle={{
                    width: DesignConvert.getW(6),
                    height: DesignConvert.getH(2),
                    backgroundColor: 'white',
                }}
                style={{
                    bottom: -DesignConvert.getH(9),
                }}
                pageCount={this._pointNum}
            />
        );
    }

    render() {
        if (!this._data || this._data.length == 0) {
            return null;
        }

        const views = [];
        let i = 0;

        this._data.forEach(element => {

            if (element.flag == 2) {
                //图片
                views.push(
                    <View
                        key={i++}
                    >
                        <_ImageBanner
                            item={element} />
                    </View>
                )
            } else {
                //webview
                views.push(
                    <View
                        key={i++}
                    >
                        <_WebViewBanner
                            item={element}
                        />
                    </View>
                )
            }
        });


        return (
            <IndicatorViewPager
                initialPage={this._selectTab}
                style={{
                    position: 'absolute',
                    // top: DesignConvert.getH(550),
                    bottom: DesignConvert.getH(60) + DesignConvert.addIpxBottomHeight(),
                    right: DesignConvert.getW(15),
                    width: DesignConvert.getW(62),
                    height: DesignConvert.getH(62),

                    overflow: 'hidden',
                }}
                pagerStyle={{
                    width: DesignConvert.getW(62),
                    height: DesignConvert.getH(62),
                }}
                onPageScroll={e => {
                    this._selectTab = e.position;
                }}
                autoPlayEnable={true}
                indicator={this._renderDotIndicator()}
                keyboardDismissMode={'none'}
            >

                {views}

            </IndicatorViewPager>
        );
    }
}

class _WebViewBanner extends PureComponent {

    constructor(props) {
        super(props)

        this._item = this.props.item
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.getW(62),
                    height: DesignConvert.getH(62),
                }}
                onPress={() => {
                    require('../../../model/BannerModel').default._clickRoomBigBanner(this._item)
                }}
            >
                <WebView
                    source={{ uri: this._item.h5url }}
                />
            </TouchableOpacity>
        )
    }
}

class _ImageBanner extends PureComponent {

    constructor(props) {
        super(props)

        this._item = this.props.item
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.getW(62),
                    height: DesignConvert.getH(62),
                }}
                onPress={() => {
                    require('../../../model/BannerModel').default._clickRoomBigBanner(this._item)
                }}
            >
                <Image
                    style={{
                        width: DesignConvert.getW(62),
                        height: DesignConvert.getH(62),
                    }}
                    source={{ uri: Config.getBannerUrl(this._item.bannerurl) }}
                />
            </TouchableOpacity>
        )
    }
}