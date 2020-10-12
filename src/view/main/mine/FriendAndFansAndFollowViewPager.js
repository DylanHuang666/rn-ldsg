/**
 * 消息 -> 粉丝或关注列表或好友列表(ViewPager版)
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Platform,
} from 'react-native';
import { ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import DesignConvert from '../../../utils/DesignConvert';
import { FList, Follow, Fans, Friend } from './FollowAndFansView';
import FriendsList from '../message/FriendsList';

export default class FriendAndFansAndFollowViewPager extends PureComponent {
    constructor(props) {
        super(props);

        if (!this.props.type) {
            this._selectTab = 0;
        } else {
            switch (this.props.type) {
                case Follow:
                    this._selectTab = 1;
                    return
                case Fans:
                    this._selectTab = 2;
                    return
                default:
                    this._selectTab = 0;
            }
        }
    }

    _renderTabLayout = () => {
        const unsel_style = {
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: DesignConvert.getF(13),
            fontWeight: "normal",
        }

        const sel_style = {
            color: "white",
            fontSize: DesignConvert.getF(13),
            fontWeight: "bold",
        }
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(44),
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: DesignConvert.getW(15),
                    }}>

                    <TouchableOpacity
                        onPress={() => {
                            this._selectTab = 0;
                            this.forceUpdate();
                            this._viewPager && this._viewPager.setPage(0);
                        }}
                        style={{
                            marginRight: DesignConvert.getW(28),
                            height: DesignConvert.getH(44),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={this._selectTab == 0 ? sel_style : unsel_style}
                        >好友</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            this._selectTab = 1;
                            this.forceUpdate();
                            this._viewPager && this._viewPager.setPage(1);
                        }}
                        style={{
                            marginRight: DesignConvert.getW(28),
                            height: DesignConvert.getH(44),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={this._selectTab == 1 ? sel_style : unsel_style}
                        >关注</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            this._selectTab = 2;
                            this.forceUpdate();
                            this._viewPager && this._viewPager.setPage(2);
                        }}
                        style={{
                            marginRight: DesignConvert.getW(28),
                            height: DesignConvert.getH(44),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={this._selectTab == 2 ? sel_style : unsel_style}
                        >粉丝</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }


    render() {

        let type
        switch (this._selectTab) {
            case 0:
                type = < FList
                    viewType={Friend}
                />
                break;
            case 1:
                type = < FList
                    viewType={Follow}
                />
                break;
            default:
                type = < FList
                    viewType={Fans}
                />;
                break;
        }
        return (
            <View
                style={{
                    flex: 1,
                }}>

                {this._renderTabLayout()}

                {Platform.OS == "ios" ? (
                    type
                ) : (
                        <ViewPager
                            initialPage={this._selectTab}
                            style={{
                                flex: 1,
                                width: DesignConvert.swidth,
                            }}
                            // onPageScroll={e => {
                            //     this._selectTab = e.position;
                            //     this._tabLayoutOffset = e.offset;
                            //     this.forceUpdate();
                            // }}
                            onPageSelected={e => {
                                this._selectTab = e.position;
                                this.forceUpdate();
                            }}
                            ref={(ref) => {
                                this._viewPager = ref;
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <FList
                                    viewType={Friend} />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <FList
                                    viewType={Follow} />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <FList
                                    viewType={Fans} />
                            </View>
                        </ViewPager>
                    )}


            </View>
        )
    }
}