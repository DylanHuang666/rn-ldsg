/**
 * 各种记录页   {流水记录，提现记录， 兑换记录， 直播间记录}
 * _viewType {flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord}
 */

'use strict';

import moment from 'moment';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import UserInfoCache from '../../../cache/UserInfoCache';
import DesignConvert from '../../../utils/DesignConvert';
import { exchangeRecord, flowRecord, giftGoldRecord, liveFlowRecord, rechargeRecord, withdrawRecord, phoneLive, receivedGoldRecord } from '../RecordView';
import RecordNormalItem from './RecordNormalItem';
import _ReceivedGoldRecordItem from '../item/_ReceivedGoldRecordItem';
import _LiveFlowRecordItem from '../item/_LiveFlowRecordItem';
import _PhoneLiveItem from '../item/_PhoneLiveItem';
import _GiftGoldRecordItem from '../item/_GiftGoldRecordItem';
import _ExchangeRecordItem from '../item/_ExchangeRecordItem';
import _RechargeRecordItem from '../item/_RechargeRecordItem';
import _WithdrawRecordItem from '../item/_WithdrawRecordItem';
import _FlowRecordItem from '../item/_FlowRecordItem';
import TimeChooseButton from '../item/TimeChooseButton';
import StringUtil from '../../../utils/StringUtil';
import { COIN_NAME } from '../../../hardcode/HGLobal';


const [DATE_START, DATE_END] = ["DATE_START", "DATE_END"];
export default class RecordList extends Component {

    constructor(props) {
        super(props);

        this._startDate = '2020-04-01';
        this._endDate = moment().format(this._getDateFormat());

        this._liveNo = 'A' + UserInfoCache.userId;
        this._roomIdSelected = this._liveNo;
        this._roomIdsPickerVisible = false;
        this._payPassword = '';

        this._totalMoney = 0;
        this._row = 15;
        this._lastId = '';
        this._isLoading = false;
        this._isLoadmore = false;
        this._loadmoreEnable = false;

        this._isEmpty = true;
        //流水
        this._flowList = [];
        this._giftList = [];

        this._roomIdsList = [this._liveNo];

        //Timer
        this._refreshTimer;
        this._loadMoreTimer;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.viewType != nextProps.viewType) {
            this._lastId = '';
            this._initData(nextProps.viewType);
            return true;
        }
        return false;
    }

    /**
     * 日期按钮记录按下那个
     */
    _onStartDateBtnPress = () => {
        this._datePickerType = DATE_START;
        require("../../../router/level3_router").showDatePickerDialog(this._onDateChangePress, this._getDateFormat());
        this.forceUpdate();
    };

    _onEndDateBtnPress = () => {
        this._datePickerType = DATE_END;
        require("../../../router/level3_router").showDatePickerDialog(this._onDateChangePress, this._getDateFormat());
        this.forceUpdate();
    };

    /**
     * datePicker返回数据
     */
    _onDateChangePress = s => {
        // console.log("时间", s, this._datePickerType)
        if (this._datePickerType == DATE_START) {
            this._startDate = s;
        } else {
            this._endDate = s;
        }

        this.forceUpdate();
        this._onRefresh();
    };

    /**
     * 日期格式
     */
    _getDateFormat = () => {
        if (this.props.viewType == liveFlowRecord || this.props.viewType == giftGoldRecord || this.props.viewType == receivedGoldRecord) {
            return "YYYY-MM";
        } else {
            return "YYYY-MM-DD";
        }
    }

    _onRefresh = () => {
        this._isLoading = true;
        this.forceUpdate();

        this._lastId = '';
        this._initData();

        //取消刷新
        this._refreshTimer = setTimeout(() => {
            this._isLoading = false;
            this.forceUpdate();
        }, 5000);
    };


    _onLoadMore = () => {
        if (this._loadmoreEnable && !this._isLoadmore && !this._isLoading) {
            this._isLoadmore = true;
            this.forceUpdate();

            if (!this._loadmoreEnable) {
                //取消加载
                this._loadMoreTimer = setTimeout(() => {
                    this._isLoadmore = false;
                    this.forceUpdate();
                }, 2000);
            } else {
                this._initData();
            }
        }
    };

    /**
     * 加载时加载动画
     */
    _renderFooter() {
        if (!this._loadmoreEnable && this._isLoadmore) {
            return (
                <View style={{ height: 30, alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Text style={{
                        color: '#999999',
                        fontSize: 14,
                        marginTop: 5,
                        marginBottom: 5,
                    }}
                    >没有更多数据了</Text>
                </View>
            );
        } else if (this._loadmoreEnable && this._isLoadmore) {
            return (
                <View style={{
                    flexDirection: 'row',
                    height: DesignConvert.getH(24),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: DesignConvert.getH(10),
                }}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else {
            return (
                <View></View>
            );
        }
    }

    _initData = (type2) => {
        let type = type2 ? type2 : this.props.viewType;
        if (type == phoneLive) {
            //通话流水
            require('../../../model/anchorincome/RecordViewModel').default.getChatEarningList(this._startDate, this._endDate, this._row, this._lastId)
                .then((data) => {

                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        // console.log(this._flowList);
                        this._flowList = data;
                    }

                    this._isEmpty = this._isLoading && this._flowList.length == 0;

                    this._loadmoreEnable = data.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        } else if (type == flowRecord) {
            //流水记录

            require('../../../model/anchorincome/RecordViewModel').default.getLiveRecvList(this._startDate, this._endDate, this._row, this._lastId)
                .then((data) => {

                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        // console.log(this._flowList);
                        this._flowList = data;
                    }

                    this._isEmpty = this._isLoading && this._flowList.length == 0;

                    this._loadmoreEnable = data.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });

        } else if (type == withdrawRecord) {
            //提现记录
            require('../../../model/anchorincome/RecordViewModel').default.getLiveExpense(this._startDate, this._endDate)
                .then(data => {
                    this._totalMoney = Math.floor(data.data) / 100;
                    this.forceUpdate();
                });

            require('../../../model/anchorincome/RecordViewModel').default.getLiveExpenseList(this._startDate, this._endDate, this._row, '')
                .then(data => {
                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        // console.log(this._flowList);
                        this._flowList = data;
                    }

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    // console.log(this._isEmpty);

                    this._loadmoreEnable = data.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        } else if (type == rechargeRecord) {
            //充值记录
            require('../../../model/anchorincome/RecordViewModel').default.getRechargeData(this._startDate, this._endDate, this._row, '')
                .then(data => {
                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        this._totalMoney = 0;
                        this._flowList = data;
                    }

                    this._flowList.forEach((item) => {
                        if (item.state == 1) {
                            this._totalMoney += Math.floor(item.money) / 100;
                        }
                    });

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    // console.log(this._isEmpty);

                    this._loadmoreEnable = data.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        } else if (type == exchangeRecord) {
            //兑换记录
            require('../../../model/anchorincome/RecordViewModel').default.getLiveExchangeList(this._startDate, this._endDate, this._row, '')
                .then(data => {
                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        this._totalMoney = 0;
                        this._flowList = data;
                    }
                    // console.log("兑换记录",this._flowList);
                    this._flowList.forEach((item) => {
                        this._totalMoney += item.goldShell;
                    });

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    // console.log(this._isEmpty);

                    this._loadmoreEnable = data.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        } else if (type == giftGoldRecord) {
            //转赠记录
            require('../../../model/anchorincome/RecordViewModel').default.getSendGoldShellLog(this._endDate, this._lastId)
                .then(data => {
                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        this._totalMoney = 0;
                        this._flowList = data;
                    }
                    // console.log("转赠记录",this._flowList);
                    this._flowList.forEach((item) => {
                        this._totalMoney += item.goldShell;
                    });

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    // console.log(this._isEmpty);

                    this._loadmoreEnable = data.length == 30;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        } else if (type == receivedGoldRecord) {
            //受赠记录
            require('../../../model/anchorincome/RecordViewModel').default.getReceivedGoldShellData(this._endDate, this._lastId)
                .then(data => {
                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        this._totalMoney = 0;
                        this._flowList = data;
                    }
                    // console.log("受赠记录",this._flowList);
                    this._flowList.forEach((item) => {
                        this._totalMoney += item.goldShell;
                    });

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    // console.log(this._isEmpty);

                    this._loadmoreEnable = data.length == 30;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        } else {
            //直播间流水
            require('../../../model/anchorincome/RecordViewModel').default.getMyLiveList()
                .then(data => {
                    this._roomIdsList = this._roomIdsList.concat(data);
                });

            require('../../../model/anchorincome/RecordViewModel').default.getLiveEarningData(this._endDate, 1, this._liveNo, this._row, '')
                .then(data => {
                    if (data == undefined) {
                        return;
                    }
                    this._totalMoney = Math.floor(data.total) / 100;

                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data.list);
                    } else {
                        this._flowList = data.list;
                    }

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    // console.log(this._isEmpty);

                    this._loadmoreEnable = data.list.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        }
    }

    componentDidMount() {
        this._initData();
    }

    componentWillUnmount() {
        clearTimeout(this._refreshTimer);
        clearTimeout(this._loadMoreTimer);
    }

    _topBar = () => {
        //时间选择期是否只有一条
        const bLongStyle = true
        const isShowTotal = this.props.viewType == liveFlowRecord || this.props.viewType == exchangeRecord || this.props.viewType == withdrawRecord

        const totalText = this.props.viewType == exchangeRecord ? COIN_NAME : '元'

        if (bLongStyle) {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    <TimeChooseButton
                        bLongStyle
                        onPress={this._onEndDateBtnPress}
                        btnText={this._endDate}
                        totalText={`${StringUtil.formatMoney(this._totalMoney)}${totalText}`}
                        isShowTotal={isShowTotal}
                    />

                </View>
            )
        }

        if (this.props.viewType == flowRecord || this.props.viewType == phoneLive || this.props.viewType == rechargeRecord) {
            return (
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingTop: DesignConvert.getH(10),
                            paddingBottom: DesignConvert.getH(10),
                        }}>

                        <TimeChooseButton
                            onPress={this._onStartDateBtnPress}
                            btnText={this._startDate} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(34),
                                height: DesignConvert.getH(1),
                                backgroundColor: '#FFFFFF99',
                            }}></View>

                        <TimeChooseButton
                            title="结束时间"
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />
                    </View>

                    {this._renderLine()}
                </View>
            );
        } else if (this.props.viewType == withdrawRecord) {
            return (
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingTop: DesignConvert.getH(10),
                            paddingBottom: DesignConvert.getH(10),
                        }}>

                        <TimeChooseButton
                            title="选择时间"
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(34),
                                height: DesignConvert.getH(1),
                                backgroundColor: '#FFFFFF99',
                            }}></View>

                        <TimeChooseButton
                            bHideArrowDown
                            title="合计"
                            btnText={`¥${StringUtil.formatMoney(this._totalMoney)}`} />
                    </View>

                    {this._renderLine()}
                </View>
            );
        } else if (this.props.viewType == exchangeRecord || this.props.viewType == giftGoldRecord || this.props.viewType == receivedGoldRecord) {
            return (
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingTop: DesignConvert.getH(10),
                            paddingBottom: DesignConvert.getH(10),
                        }}>

                        <TimeChooseButton
                            bWhite={this.props.viewType == giftGoldRecord}
                            title="选择时间"
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(34),
                                height: DesignConvert.getH(1),
                                backgroundColor: '#FFFFFF99',
                            }}></View>

                        <TimeChooseButton
                            bWhite={this.props.viewType == giftGoldRecord}
                            bHideArrowDown
                            title="合计"
                            btnText={`${StringUtil.formatMoney(this._totalMoney, 0)}${COIN_NAME}`} />
                    </View>

                    {this.props.viewType == giftGoldRecord ? null : this._renderLine()}
                </View>
            );
        } else {
            return (
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingTop: DesignConvert.getH(10),
                            paddingBottom: DesignConvert.getH(10),
                        }}>

                        {/* <TimeChooseButton
                            title="房间号"
                            onPress={this._onLiveNoBtnPress}
                            btnText={this._liveNo} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(34),
                                height: DesignConvert.getH(1),
                                backgroundColor: '#FFFFFF99',
                            }}></View> */}

                        <TimeChooseButton
                            title="选择时间"
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(34),
                                height: DesignConvert.getH(1),
                                backgroundColor: '#FFFFFF99',
                            }}></View>

                        <TimeChooseButton
                            bHideArrowDown
                            title="合计"
                            btnText={`${StringUtil.formatMoney(this._totalMoney, 0)}元`} />
                    </View>

                </View>
            );
        }
    };

    _emptyPage() {
        return (
            <View
                style={{
                    flex: 1,
                    width: DesignConvert.swidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* <Image
                    source={require('../../../hardcode/skin_imgs/anchorincome').default_record2()}
                    style={{
                        width: DesignConvert.getW(136),
                        height: DesignConvert.getH(90.5),
                        marginTop: DesignConvert.getH(120),
                    }} /> */}

                <Text style={{
                    marginTop: DesignConvert.getH(16.5),
                    color: '#797979',
                    fontSize: DesignConvert.getF(15),
                }}>暂无记录
                </Text>
            </View>
        );
    }

    _renderItem = ({ item }) => {
        switch (this.props.viewType) {
            case flowRecord:
                return (
                    <_FlowRecordItem
                        item={item}
                    />
                )
            case withdrawRecord:
                return (
                    <_WithdrawRecordItem
                        item={item}
                    />
                )
            case rechargeRecord:
                return (
                    <_RechargeRecordItem
                        item={item}
                    />
                )
            case exchangeRecord:
                return (
                    <_ExchangeRecordItem
                        item={item}
                    />
                )
            case giftGoldRecord:
                return (
                    <_GiftGoldRecordItem
                        item={item}
                    />
                )
            case receivedGoldRecord:
                return (
                    <_ReceivedGoldRecordItem
                        item={item}
                    />
                )
            case liveFlowRecord:
                return (
                    <_LiveFlowRecordItem
                        item={item}
                    />
                )
            case phoneLive:
                return (
                    <_PhoneLiveItem
                        item={item}
                    />
                )
        }
    }

    _renderLine = () => (
        <View
            style={{
                width: DesignConvert.swidth,
                height: DesignConvert.getH(1),
                backgroundColor: "#FFFFFF4D",
            }} />
    )

    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}>
                {this.props.showTimeChooseButton ? (
                    <View
                        style={{
                            width: DesignConvert.swidth,
                            backgroundColor: "#F9F9F9"
                        }}>
                        {this._topBar()}
                    </View>
                ) : null}

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this._flowList}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._emptyPage()}
                    refreshing={this._isLoading}
                    onRefresh={this._onRefresh}

                    ListFooterComponent={this._renderFooter()}
                    onEndReached={this._onLoadMore}
                    onEndReachedThreshold={0.2}
                    style={{
                        flex: 1,
                    }}
                    extraData={
                        this.props.viewType
                    }
                />
            </View>

        );
    }
}
