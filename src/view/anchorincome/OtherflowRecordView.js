/**
 * 一般通用的消费记录
 * 把几个记录页用Tab和ViewPager合起来
 */

'use strict';

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ViewPager } from 'rn-viewpager';
import { THEME_COLOR } from '../../styles';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from '../base/BaseView';
import RecordView, { flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord, giftGoldRecord, rechargeRecord, receivedGoldRecord, phoneLive } from './RecordView';
import RecordList from './record/RecordList';
import _SelectTab, { _SelectTab2 } from './record/_SelectTab';

export default class OtherflowRecordView extends BaseView {
    constructor(props) {
        super(props);

        this._list = [

          
        ]

        this._selectTab = this.props.params.viewType ? this._list.indexOf(this.props.params.viewType) : 0;
    }

    componentDidMount() {
        super.componentDidMount()

        this._initData()
    }

    _initData = () => {
        require("../../model/mine/MyWalletModel").default.getMoneyGivingList()
            .then(res => {
                if (res) {
                    this._list = [
                        rechargeRecord,
                        giftGoldRecord,

                        receivedGoldRecord,
                        // phoneLive
                    ]
                } else {
                    this._list = [
                        // rechargeRecord,
                        rechargeRecord,

                        receivedGoldRecord,
                        // phoneLive
                    ]
                }
                this._selectTab = this.props.params.viewType ? this._list.indexOf(this.props.params.viewType) : 0;

                this.forceUpdate()
            })

    }

    _getViewPager = (ref) => {
        this.viewPager = ref;
    }

    _onPagerSelected = (e) => {
        this._selectTab = e.position;
        this.forceUpdate();
    }

    _tabClick = (title, index) => {
        this._selectTab = index;
        this.forceUpdate();
        this.viewPager && this.viewPager.setPage(index);
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                }}>
                <BackTitleView
                    titleText={"收益明细"}
                    onBack={this.popSelf}
                />

                <_SelectTab2
                    defaultSelected={this._selectTab}
                    items={this._list}
                    itemClick={this._tabClick}
                    style={{


                    }} />

                <ViewPager
                    initialPage={this._selectTab}
                    ref={this._getViewPager}
                    onPageSelected={this._onPagerSelected}
                    style={{
                        flex: 1,
                    }}>

                    {this._list.map(
                        (item, index) => (
                            <View
                                style={{
                                    flex: 1,
                                }}>
                                <RecordList
                                    showTimeChooseButton
                                    key={index}
                                    viewType={item}
                                />
                            </View>
                        )
                    )}
                </ViewPager>
            </View>
        )
    }
}