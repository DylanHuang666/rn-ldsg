/**
 * 消费记录
 * 把几个记录页用Tab和ViewPager合起来
 */

'use strict';

import React, { PureComponent } from 'react';
import BaseView from '../base/BaseView';
import LinearGradient from 'react-native-linear-gradient';
import BackTitleView from '../base/BackTitleView';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Modal, FlatList, SectionList } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import { styles } from './ConvertView';
import DatePicker from 'react-native-date-picker';
import Picker from 'react-native-wheel-picker';
import Config from '../../configs/Config';
import moment from 'moment';
import { COIN_NAME } from '../../hardcode/HGLobal';
import { record_alipay, record_bank, record_wechat, record_cash, record_coin } from '../../hardcode/skin_imgs/record';
import StringUtil from '../../utils/StringUtil';
import RecordNormalItem from './record/RecordNormalItem';
import UserInfoCache from '../../cache/UserInfoCache';
import { THEME_COLOR } from '../../styles';
import RecordView, { rechargeRecord, giftGoldRecord } from './RecordView';
import { ViewPager } from 'rn-viewpager';

export default class TabRecordView extends BaseView {
    constructor(props) {
        super(props);

        this._selectTab = this.props.params.viewType == rechargeRecord ? 0 : 1;
    }

    _getViewPager = (ref) => {
        this.viewPager = ref;
    }

    _onPagerSelected = (e) => {
        this._selectTab = e.position;
        this.forceUpdate();
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    flex: 1,
                }}>
                <BackTitleView
                    titleText={"消费记录"}
                    onBack={this.popSelf}
                />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(58),
                        backgroundColor: "#FCFCFC",
                        flexDirection: "column-reverse",
                        alignItems: "center",
                    }}>

                    <View
                        style={{
                            width: DesignConvert.getW(290),
                            height: DesignConvert.getH(32),
                            borderWidth: DesignConvert.getW(1),
                            borderColor: THEME_COLOR,
                            borderRadius: DesignConvert.getW(20),
                            flexDirection: "row",
                            justifyContent: "center",
                                alignItems: "center",
                        }}>

                        <TouchableOpacity
                            onPress={() => {
                                this._selectTab = 0;
                                this.forceUpdate();
                                this.viewPager && this.viewPager.setPage(0);
                            }}
                            style={{
                                width: DesignConvert.getW(145),
                                height: DesignConvert.getH(30),
                                backgroundColor: this._selectTab == 0 ? THEME_COLOR : null,
                                borderRadius: DesignConvert.getW(20),
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Text
                                style={{
                                    color: this._selectTab == 0 ? "white" : THEME_COLOR,
                                    fontSize: DesignConvert.getF(13),
                                }}>充值记录</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this._selectTab = 1;
                                this.forceUpdate();
                                this.viewPager && this.viewPager.setPage(1);
                            }}
                            style={{
                                width: DesignConvert.getW(145),
                                height: DesignConvert.getH(30),
                                backgroundColor: this._selectTab == 1 ? THEME_COLOR : null,
                                borderRadius: DesignConvert.getW(20),
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Text
                                style={{
                                    color: this._selectTab == 1 ? "white" : THEME_COLOR,
                                    fontSize: DesignConvert.getF(13),
                                }}>转赠记录</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <ViewPager
                    initialPage={this._selectTab}
                    ref={this._getViewPager}
                    onPageSelected={this._onPagerSelected}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight - DesignConvert.getH(102) - DesignConvert.statusBarHeight,
                    }}>

                    <View
                        style={{
                            flex: 1,
                        }}>
                        <RecordView
                            params={{
                                viewType: rechargeRecord,
                            }}
                            hideTitle />
                    </View>

                    <View
                        style={{
                            flex: 1,
                        }}>
                        <RecordView
                            params={{
                                viewType: giftGoldRecord,
                            }}
                            hideTitle />
                    </View>
                </ViewPager>
            </View>
        )
    }
}