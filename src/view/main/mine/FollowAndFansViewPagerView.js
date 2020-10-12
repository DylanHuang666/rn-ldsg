/**
 * 我的 -> 粉丝或关注列表或好友列表(ViewPager版)
 */
'use strict';

import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { ViewPager, PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import DesignConvert from '../../../utils/DesignConvert';
import BackTitleView from '../../base/BackTitleView';
import Config from '../../../configs/Config';
import BaseView from '../../base/BaseView';
import ToastUtil from '../../base/ToastUtil';
import StatusBarView from '../../base/StatusBarView';
import { FList, Follow, Fans } from './FollowAndFansView';
import { ic_back_black } from '../../../hardcode/skin_imgs/common';
import { THEME_COLOR } from '../../../styles';

export default class FollowAndFansViewPagerView extends BaseView {
    constructor(props) {
        super(props);

        this._type = this.props.params.viewType;
        this._selectTab = this.props.params.viewType == Follow ? 0 : 1;
    }

    _onBackPress = () => {
        this.popSelf();
    };

    componentDidMount() {
        super.componentDidMount();
    }

    _renderTabLayout = () => {
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
                        width: DesignConvert.swidth - DesignConvert.getW(80),
                        height: DesignConvert.getH(44),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <TouchableOpacity
                        onPress={() => {
                            this._selectTab = 0;
                            this.forceUpdate();
                            this._viewPager.setPage(0);
                        }}
                        style={{
                            flex: 1,
                            height: DesignConvert.getH(44),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                color: this._selectTab == 0 ? "#1D1D1D" : "#AEAEAE",
                                fontSize: DesignConvert.getF(16),
                            }}>关注</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            this._selectTab = 1;
                            this.forceUpdate();
                            this._viewPager.setPage(1);
                        }}
                        style={{
                            flex: 1,
                            height: DesignConvert.getH(44),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                color: this._selectTab == 1 ? "#1D1D1D" : "#AEAEAE",
                                fontSize: DesignConvert.getF(16),
                            }}>粉丝</Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            width: DesignConvert.getW(16),
                            height: DesignConvert.getH(2),
                            borderRadius: DesignConvert.getW(1),
                            backgroundColor: THEME_COLOR,
                            position: "absolute",
                            bottom: DesignConvert.getH(7),
                            left: DesignConvert.getW(this._selectTab == 0 ? 65 : 215)
                        }}></View>
                </View>

                <TouchableOpacity
                    style={{
                        height: DesignConvert.getH(44),
                        position: 'absolute',
                        left: 0,
                        justifyContent: 'center',
                    }}
                    onPress={this.popSelf}
                >
                    <Image
                        style={{
                            width: DesignConvert.getW(12),
                            height: DesignConvert.getH(21),
                            marginLeft: DesignConvert.getW(15),
                            marginEnd: DesignConvert.getW(15),
                            tintColor: !this.props.tintColor ? null : this.props.tintColor,
                        }}
                        source={ic_back_black()}
                    />
                </TouchableOpacity>





            </View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}>

                <StatusBarView />

                {this._renderTabLayout()}

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
            </View>
        );
    }
}
