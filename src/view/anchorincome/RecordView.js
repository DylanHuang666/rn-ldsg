/**
 * 各种记录页   
 * _viewType {
 *  flowRecord,         流水记录
 *  withdrawRecord,     提现记录
 *  exchangeRecord,     兑换记录
 *  liveFlowRecord,     直播间流水
 *  giftGoldRecord,     转赠记录
 *  rechargeRecord,     兑换记录
 *  receivedGoldRecord, 受赠记录
 *  phoneLive,          通话流水
 * }
 */

'use strict';

import React, { PureComponent } from 'react';
import BaseView from '../base/BaseView';
import BackTitleView from '../base/BackTitleView';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Modal, FlatList, SectionList } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import { styles, TitleBar } from './ConvertView';
import DatePicker from 'react-native-date-picker';
import Picker from 'react-native-wheel-picker';
import Config from '../../configs/Config';
import moment from 'moment';
import { COIN_NAME } from '../../hardcode/HGLobal';
import StringUtil from '../../utils/StringUtil';
import UserInfoCache from '../../cache/UserInfoCache';
import TimeChooseButton from './item/TimeChooseButton';
import LinearGradient from 'react-native-linear-gradient';
import { LINEARGRADIENT_COLOR } from '../../styles';
import _flowRecordItem from './record/_flowRecordItem';
import _withdrawRecordItem from './record/_withdrawRecordItem';
import _rechargeRecordItem from './record/_rechargeRecordItem';
import _exchangeRecordItem from './record/_exchangeRecordItem';
import _giftGoldRecordItem from './record/_giftGoldRecordItem';
import _receivedGoldRecordItem from './record/_receivedGoldRecordItem';
import _liveFlowRecordItem from './record/_liveFlowRecordItem';
import _phoneLiveItem from './record/_phoneLiveItem';

const [flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord, giftGoldRecord, rechargeRecord, receivedGoldRecord, phoneLive] = [1, 2, 3, 4, 5, 6, 7, 8];
export { flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord, giftGoldRecord, rechargeRecord, receivedGoldRecord, phoneLive };
var PickerItem = Picker.Item;

const [DATE_START, DATE_END] = ["DATE_START", "DATE_END"];
export default class RecordView extends BaseView {

    constructor(props) {
        super(props);

        this._startDate = '2020-04-01';
        this._endDate = moment().format(this._getDateFormat());

        this._datePickerType = DATE_START;

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


    /**
     * 日期按钮记录按下那个
     */
    _onStartDateBtnPress = () => {
        this._datePickerType = DATE_START;
        require("../../router/level4_router").showDatePickerDialog(this._onDateChangePress, this._getDateFormat());
        this.forceUpdate();
    };

    _onEndDateBtnPress = () => {
        this._datePickerType = DATE_END;
        require("../../router/level4_router").showDatePickerDialog(this._onDateChangePress, this._getDateFormat());
        this.forceUpdate();
    };

    /**
     * 日期格式
     */
    _getDateFormat = () => {
        if (this.props.params.viewType == liveFlowRecord || this.props.params.viewType == giftGoldRecord || this.props.params.viewType == receivedGoldRecord) {
            return "YYYY-MM";
        } else {
            return "YYYY-MM-DD";
        }
    }

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
     * Picker的确定按钮
     */
    _onRoomIDChangePress = () => {
        this._liveNo = this._roomIdSelected;

        this._roomIdsPickerVisible = false;
        this.forceUpdate();
        this._onRefresh();
    };

    _onLiveNoBtnPress = () => {
        this._roomIdsPickerVisible = true;
        this.forceUpdate();
    };

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
     * roomIdsPicker滑动时暂存
     */
    _onPickerSelect = (index) => {
        // console.log(index);
        this._roomIdSelected = this._roomIdsList[index];
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

    _initData() {
        if (this.props.params.viewType == phoneLive) {
            //通话流水
            require('../../model/anchorincome/RecordViewModel').default.getChatEarningList(this._startDate, this._endDate, this._row, this._lastId)
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
        } else if (this.props.params.viewType == flowRecord) {
            //流水记录

            require('../../model/anchorincome/RecordViewModel').default.getLiveRecvList(this._startDate, this._endDate, this._row, this._lastId)
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

        } else if (this.props.params.viewType == withdrawRecord) {
            //提现记录
            require('../../model/anchorincome/RecordViewModel').default.getLiveExpense(this._startDate, this._endDate)
                .then(data => {
                    this._totalMoney = Math.floor(data.data) / 100;
                    this.forceUpdate();
                });

            require('../../model/anchorincome/RecordViewModel').default.getLiveExpenseList(this._startDate, this._endDate, this._row, '')
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
        } else if (this.props.params.viewType == rechargeRecord) {
            //充值记录
            require('../../model/anchorincome/RecordViewModel').default.getRechargeData(this._startDate, this._endDate, this._row, '')
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
        } else if (this.props.params.viewType == exchangeRecord) {
            //兑换记录
            require('../../model/anchorincome/RecordViewModel').default.getLiveExchangeList(this._startDate, this._endDate, this._row, '')
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
        } else if (this.props.params.viewType == giftGoldRecord) {
            //转赠记录
            require('../../model/anchorincome/RecordViewModel').default.getSendGoldShellLog(this._endDate, this._lastId)
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
        } else if (this.props.params.viewType == receivedGoldRecord) {
            //受赠记录
            require('../../model/anchorincome/RecordViewModel').default.getReceivedGoldShellData(this._endDate, this._lastId)
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
            require('../../model/anchorincome/RecordViewModel').default.getMyLiveList()
                .then(data => {
                    this._roomIdsList = this._roomIdsList.concat(data);
                });

            require('../../model/anchorincome/RecordViewModel').default.getLiveEarningData(this._endDate, 1, this._liveNo, this._row, '')
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
        super.componentDidMount();
        this._initData();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearTimeout(this._refreshTimer);
        clearTimeout(this._loadMoreTimer);
    }

    _title = () => {
        if (this.props.params.viewType == flowRecord) {
            return '流水记录';
        } else if (this.props.params.viewType == withdrawRecord) {
            return '提现记录';
        } else if (this.props.params.viewType == exchangeRecord) {
            return '兑换记录';
        } else if (this.props.params.viewType == giftGoldRecord) {
            return '转赠记录';
        } else if (this.props.params.viewType == receivedGoldRecord) {
            return '受赠记录';
        } else if (this.props.params.viewType == rechargeRecord) {
            return '充值记录';
        } else if (this.props.params.viewType == phoneLive) {
            return '陪聊流水';
        } else {
            return '直播间流水';
        }
    };

    _renderLine = () => (
        <View
            style={{
                width: DesignConvert.swidth,
                height: DesignConvert.getH(1),
                backgroundColor: "#F0F0F0",
            }} />
    )

    _topBar = () => {
        if (this.props.params.viewType == flowRecord || this.props.params.viewType == phoneLive) {
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
                                width: DesignConvert.getW(1),
                                height: DesignConvert.getH(30),
                                backgroundColor: '#F1F1F1',
                            }}></View>

                        <TimeChooseButton
                            title="结束时间"
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />
                    </View>

                    {this._renderLine()}
                </View>
            );
        } else if (this.props.params.viewType == withdrawRecord || this.props.params.viewType == rechargeRecord || this.props.params.viewType == receivedGoldRecord || this.props.params.viewType == giftGoldRecord) {
            return (
                <View>
                    
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingTop: DesignConvert.getH(15),
                            paddingBottom: DesignConvert.getH(5),
                            paddingLeft: DesignConvert.getW(15),
                            paddingRight: DesignConvert.getW(20),
                        }}>

                        <TimeChooseButton
                            title=''
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />

                        {/* <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(1),
                                height: DesignConvert.getH(30),
                                backgroundColor: '#F1F1F1',
                            }}></View> */}

                        {/* <TimeChooseButton
                            bHideArrowDown
                            title="合计"
                            btnText={`¥${StringUtil.formatMoney(this._totalMoney)}`} /> */}
                    </View>

                    {/* {this._renderLine()} */}
                </View>
            );
        } else if (this.props.params.viewType == exchangeRecord || this.props.params.viewType == giftGoldRecord || this.props.params.viewType == receivedGoldRecord) {
            return (
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingTop: DesignConvert.getH(10),
                            paddingBottom: DesignConvert.getH(10),
                            paddingLeft: DesignConvert.getW(20),
                            paddingRight: DesignConvert.getW(20),
                        }}>

                        <TimeChooseButton
                            bWhite={this.props.params.viewType == giftGoldRecord}
                            title="选择时间"
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(1),
                                height: DesignConvert.getH(30),
                                backgroundColor: '#F1F1F1',
                            }}></View>

                        <TimeChooseButton
                            bWhite={this.props.params.viewType == giftGoldRecord}
                            bHideArrowDown
                            title="合计"
                            btnText={`${StringUtil.formatMoney(this._totalMoney, 0)}${COIN_NAME}`} />
                    </View>

                    {this.props.params.viewType == giftGoldRecord ? null : this._renderLine()}
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
                            paddingLeft: DesignConvert.getW(20),
                            paddingRight: DesignConvert.getW(20),
                        }}>

                        <TimeChooseButton
                            title="房间号"
                            onPress={this._onLiveNoBtnPress}
                            btnText={this._liveNo} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(1),
                                height: DesignConvert.getH(30),
                                backgroundColor: '#F1F1F1',
                            }}></View>

                        <TimeChooseButton
                            title="选择时间"
                            onPress={this._onEndDateBtnPress}
                            btnText={this._endDate} />

                        <View
                            style={{
                                alignSelf: 'center',
                                width: DesignConvert.getW(1),
                                height: DesignConvert.getH(30),
                                backgroundColor: '#F1F1F1',
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

    _renderImage(imageUri) {
        if (this.props.params.viewType == flowRecord) {
            // console.log(imageUri);
            return (
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            color: '#999999',
                            fontSize: DesignConvert.getF(13),
                            fontWeight: 'normal',
                            alignSelf: 'center',
                            marginRight: DesignConvert.getW(6),
                        }}
                    >来自</Text>

                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: DesignConvert.getW(16),
                            height: DesignConvert.getH(16),
                            borderRadius: DesignConvert.getW(16),
                            marginRight: DesignConvert.getW(3),
                        }}
                    ></Image>
                </View>
            );
        } else {
            return (
                <View></View>
            );
        }
    }

    _renderItem = ({ item }) => {
        switch (this.props.params.viewType) {
            case flowRecord:
                return (
                    <_flowRecordItem
                        item={item}
                    />
                )
            case withdrawRecord:
                return (
                    <_withdrawRecordItem
                        item={item}
                    />
                )
            case rechargeRecord:
                return (
                    <_rechargeRecordItem
                        item={item}
                    />
                )
            case exchangeRecord:
                return (
                    <_exchangeRecordItem
                        item={item}
                    />
                )
            case giftGoldRecord:
                return (
                    <_giftGoldRecordItem
                        item={item}
                    />
                )
            case receivedGoldRecord:
                return (
                    <_receivedGoldRecordItem
                        item={item}
                    />
                )
            case liveFlowRecord:
                return (
                    <_liveFlowRecordItem
                        item={item}
                    />
                )
            case phoneLive:
                return (
                    <_phoneLiveItem
                        item={item}
                    />
                )
        }
    }

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
                <Image
                    source={require('../../hardcode/skin_imgs/anchorincome').default_record2()}
                    style={{
                        width: DesignConvert.getW(136),
                        height: DesignConvert.getH(90.5),
                        marginTop: DesignConvert.getH(120),
                    }} />

                <Text style={{
                    marginTop: DesignConvert.getH(16.5),
                    color: '#797979',
                    fontSize: DesignConvert.getF(15),
                }}>暂无{this._title()}
                </Text>
            </View>
        );
    }


    render() {

        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    backgroundColor: this.props.params.viewType == rechargeRecord || this.props.params.viewType == receivedGoldRecord || this.props.params.viewType == giftGoldRecord ? "rgba(38, 7, 19, 1)" : 'white',
                }}
            >

                <BackTitleView
                    titleText={this._title()}
                    onBack={this.popSelf}
                    bgColor={this.props.params.viewType == giftGoldRecord || this.props.params.viewType == rechargeRecord || this.props.params.viewType == receivedGoldRecord ? ["rgba(38, 7, 19, 1)", "rgba(38, 7, 19, 1)"] : LINEARGRADIENT_COLOR}
                    titleTextStyle={{
                        color: "white",
                    }}
                    backImgStyle={{
                        tintColor: "white",
                    }}
                />

                {this._topBar()}

                <FlatList
                    data={this._flowList}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._emptyPage()}
                    refreshing={this._isLoading}
                    onRefresh={this._onRefresh}
                    // style={this.props.params.viewType == giftGoldRecord ? {
                    //     width: DesignConvert.getW(345),
                    //     alignSelf: "center",
                    //     borderRadius: DesignConvert.getW(13),
                    //     backgroundColor: "white",
                    // } : null}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this._renderFooter()}
                    onEndReached={this._onLoadMore}
                    onEndReachedThreshold={0.2}
                />


                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this._roomIdsPickerVisible}
                    onRequestClose={() => {
                        this._roomIdsPickerVisible = false;
                        this.forceUpdate();
                    }}>
                    <View
                        style={{
                            width: DesignConvert.swidth,
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>

                        <View
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(26),
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: DesignConvert.getW(20),
                                paddingRight: DesignConvert.getW(20),
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this._roomIdsPickerVisible = false;
                                    this.forceUpdate();
                                }}>
                                <Text style={{
                                    color: '#FA495F',
                                    fontSize: DesignConvert.getF(16),
                                    fontWeight: 'normal',
                                    alignSelf: 'center',
                                }}>取消</Text>
                            </TouchableOpacity>

                            <View style={{ flex: 1 }}></View>

                            <TouchableOpacity
                                onPress={this._onRoomIDChangePress}>
                                <Text style={{
                                    color: '#FA495F',
                                    fontSize: DesignConvert.getF(16),
                                    fontWeight: 'normal',
                                    alignSelf: 'center',
                                }}>确定</Text>
                            </TouchableOpacity>

                        </View>

                        <Picker
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(200),
                                backgroundColor: 'white',
                            }}
                            selectedValue={0}
                            itemStyle={{
                                color: 'black',
                                fontSize: DesignConvert.getF(26),
                            }}
                            onValueChange={(index) => this._onPickerSelect(index)}>
                            {this._roomIdsList.map((i, value) => (
                                <PickerItem label={i} value={value} key={i} />
                            ))}
                        </Picker>
                    </View>
                </Modal>
            </View>
        );
    }
}
