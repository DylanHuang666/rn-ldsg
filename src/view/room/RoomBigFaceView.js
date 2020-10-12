/**
 * 房间大表情面板
 */

'use strict';

import React, { PureComponent } from 'react';
import BaseView from "../base/BaseView";
import { View, Image, Text, TouchableOpacity, PointPropType } from "react-native";
import DesignConvert from '../../utils/DesignConvert';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import {
    ic_gift_gift,
} from '../../hardcode/skin_imgs/room_gift';
import RoomInfoCache from '../../cache/RoomInfoCache';
import Config from '../../configs/Config';

const PAGE_SIZE = 10;

export default class RoomBigFaceView extends BaseView {

    render() {

        return (
            <View
                style={{
                    flex: 1,
                }}
            >

                {/*顶部区域 点击关闭面板*/}
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: '#00000000'
                    }}
                    onPress={this.popSelf}
                />

                {/*大表情面板区域*/}
                <View
                    style={{
                        borderTopLeftRadius: DesignConvert.getW(10),
                        borderTopRightRadius: DesignConvert.getW(10),
                        width: DesignConvert.swidth,
                        alignItems: "center",
                        backgroundColor: 'white',
                    }}
                >

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(16),
                            color: 'black',
                            marginTop: DesignConvert.getH(16),
                            marginBottom: DesignConvert.getH(10),
                        }}
                    >
                        {'大表情'}
                    </Text>

                    {/* 大表情列表 */}
                    <_BigFaceList />

                </View>

            </View>

        );
    }
}

class _BigFaceList extends PureComponent {

    constructor(props) {
        super(props);

        this.initPage = 0;


        // 大表情列表
        //   { isShowScreen: '1',
        //     flashName: 'chouqian',
        //     msg: '',
        //     num: '1',
        //     playType: '3,1,60',
        //     range: '0,8',
        //     name: '抽麦序',
        //     flashVersion: '0',
        //     id: 'R021' },

        this._bigEmojiList = [{ id: 1 }]
    }


    componentDidMount() {
        require('../../model/room/EmojiModel').default.getBigEmoji()
            .then(data => {
                this._bigEmojiList = data
                this.forceUpdate()
            })
    }

    _renderDotIndicator = (pageCount) => {
        return (
            <PagerDotIndicator
                pageCount={pageCount}
                style={{
                    bottom: DesignConvert.getH(5),
                }}
                dotStyle={{
                    width: DesignConvert.getW(16),
                    height: DesignConvert.getH(6),
                    borderRadius: DesignConvert.getW(2),
                    backgroundColor: '#f2f2f233',
                    marginHorizontal: 0,
                }}
                selectedDotStyle={{
                    backgroundColor: '#f0f0f0',
                    height: DesignConvert.getH(6),
                    width: DesignConvert.getW(16),
                    borderRadius: DesignConvert.getW(2),
                    marginHorizontal: 0,
                }}
            />
        )
    }

    /**
    * 发送大表情
    */
    _clickFace = (faceItem) => {
        require('../../model/room/RoomModel').default.getRecreations(faceItem.id, RoomInfoCache.roomId)
    }

    _renderFaceItem = (pageIndex) => {
        let nextIndex = (pageIndex + 1) * PAGE_SIZE;
        if (nextIndex > this._bigEmojiList.length) {
            nextIndex = this._bigEmojiList.length;
        }

        const pageGiftViews = [];
        for (let i = pageIndex * PAGE_SIZE; i < nextIndex; ++i) {
            const faceItem = this._bigEmojiList[i];
            pageGiftViews.push(
                <TouchableOpacity
                    onPress={this._clickFace.bind(this, faceItem)}
                    key={faceItem.id}
                    style={{
                        width: DesignConvert.getW(75),
                        height: DesignConvert.getH(70),
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={{ uri: Config.getRecreationUrl(faceItem.flashName + '.png') }}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(50),
                            marginTop: DesignConvert.getH(10),
                            marginBottom: DesignConvert.getH(10),
                        }}
                    />
                    {/* <Text
                        style={{
                            fontSize: DesignConvert.getF(12),
                            color: '#FFFFFF',
                            lineHeight: DesignConvert.getH(16),
                            marginTop: DesignConvert.getH(4),
                        }}
                    >
                        {faceItem.name}
                    </Text> */}
                </TouchableOpacity>
            );
        }
        return (
            <View
                key={pageIndex}
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    height: DesignConvert.getH(208),
                }}
            >
                {pageGiftViews}
            </View>
        )
    }

    _onPageSelected = ({ position, offset }) => {
        this.initPage = position;
    }

    render() {
        const pageCount = Math.ceil(this._bigEmojiList.length / PAGE_SIZE);

        const items = [];
        for (let pageIndex = 0; pageIndex < pageCount; ++pageIndex) {
            items.push(this._renderFaceItem(pageIndex));
        }

        return (
            <IndicatorViewPager
                style={{
                    width: '100%',
                    height: DesignConvert.getH(70 * 2 + 20),
                    overflow: 'hidden',
                }}
                initialPage={this.initPage}
                onPageSelected={this._onPageSelected}
                indicator={this._renderDotIndicator(pageCount)}>
                {items}
            </IndicatorViewPager>
        )
    }
}