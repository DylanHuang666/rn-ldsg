/**
 * 收益->记录  
 * _viewType {
 *  flowRecord,         礼物明细
 *  withdrawRecord,     提现记录
 *  exchangeRecord,     兑换记录
 *  liveFlowRecord,     直播间流水
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
import { mine_timePick } from '../../hardcode/skin_imgs/mine';
import _flowRecordItem from './record/_flowRecordItem';
import _withdrawRecordItem from './record/_withdrawRecordItem';
import _exchangeRecordItem from './record/_exchangeRecordItem';
import _liveFlowRecordItem from './record/_liveFlowRecordItem';
import { right_bar_bg } from '../../hardcode/skin_imgs/user_info';

const [flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord] = [1, 2, 3, 4];
export { flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord };
var PickerItem = Picker.Item;

const [DATE_START, DATE_END] = ["DATE_START", "DATE_END"];
// 时间选择样式
class TimeItem extends PureComponent {
    render() {

        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: DesignConvert.getW(88),
                    height: DesignConvert.getH(25),
                    paddingHorizontal: DesignConvert.getW(7),
                    backgroundColor: "#FFFFFF",
                    borderRadius: DesignConvert.getW(12.5),

                    
                   

                    borderWidth: 1,
                    borderColor: '#0000',
                    ... this.props.containerStyle,
                }}
            >
                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#333333'
                    }}
                >{this.props.date}</Text>
                <Image
                    source={mine_timePick()}
                    style={{
                        width: DesignConvert.getW(7),
                        height: DesignConvert.getH(6),
                    }}
                ></Image>
            </TouchableOpacity>
        )
    }
}
export default class ShouYiRecordList extends BaseView {

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

        //判断是不是最后一个
        this._last = false;
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
        if (this.props.viewType == liveFlowRecord) {
            return "YYYY-MM";
        } else {
            return "YYYY-MM-DD";
        }
    }

    /**
     * datePicker返回数据
     */
    _onDateChangePress = s => {
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
        
        this._roomIdSelected = this._roomIdsList[index];
    };

    /**
     * 加载时加载动画
     */
    _renderFooter() {
        if (!this._loadmoreEnable && this._isLoadmore) {
            return (
                <View style={{  alignItems: 'center', justifyContent: 'flex-start',height: 30, }}>
                    <Text style={{
                        marginTop: 5,
                        marginBottom: 5,

                        color: '#999999',
                        fontSize: 14,
                       
                    }}
                    >没有更多数据了</Text>
                </View>
            );
        } else if (this._loadmoreEnable && this._isLoadmore) {
            return (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',

                    height: DesignConvert.getH(24),
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
        if (this.props.viewType == flowRecord) {
            //流水记录

            require('../../model/anchorincome/RecordViewModel').default.getLiveRecvList(this._startDate, this._endDate, this._row, this._lastId)
                .then((data) => {
                    data[data.length - 1].last = true;
                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                       
                        this._flowList = data;
                    }

                    this._isEmpty = this._isLoading && this._flowList.length == 0;

                    this._loadmoreEnable = data.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });

        } else if (this.props.viewType == withdrawRecord) {
            //提现记录
            require('../../model/anchorincome/RecordViewModel').default.getLiveExpense(this._startDate, this._endDate)
                .then(data => {

                    this._totalMoney = Math.floor(data.data) / 100;
                    this.forceUpdate();
                });

            require('../../model/anchorincome/RecordViewModel').default.getLiveExpenseList(this._startDate, this._endDate, this._row, '')
                .then(data => {
                    data[data.length - 1].last = true;
                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        
                        this._flowList = data;
                    }

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    
                    this._loadmoreEnable = data.length == this._row;
                    this._lastId = this._loadmoreEnable ? this._flowList[this._flowList.length - 1].id : '';
                    this._isLoading = false;
                    this._isLoadmore = false;
                    this.forceUpdate();
                });
        } else if (this.props.viewType == exchangeRecord) {
            //兑换记录
            require('../../model/anchorincome/RecordViewModel').default.getLiveExchangeList(this._startDate, this._endDate, this._row, '')
                .then(data => {
                   
                    data[data.length - 1].last = true;

                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data);
                    } else {
                        this._totalMoney = 0;
                        this._flowList = data;
                    }

                    this._flowList.forEach((item) => {
                        this._totalMoney += item.goldShell;
                    });

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
            
                    this._loadmoreEnable = data.length == this._row;
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
                    data[data.length - 1].last = true;
                    this._totalMoney = Math.floor(data.total) / 100;

                    if (this._isLoadmore) {
                        this._flowList = this._flowList.concat(data.list);
                    } else {
                        this._flowList = data.list;
                    }

                    this._isEmpty = this._isLoading && this._flowList.length == 0;
                    
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
        if (this.props.viewType == flowRecord) {
            return '流水记录';

        } else if (this.props.viewType == withdrawRecord) {
            return '提现记录';
        } else if (this.props.viewType == exchangeRecord) {
            return '兑换记录';
        } else {
            return '直播间流水';
        }
    };


    _topBar = () => {
        if (this.props.viewType == flowRecord) {
            return (
                <View>
                    <View
                        style={{

                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',

                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(38),
                            paddingHorizontal: DesignConvert.getW(57),

                            backgroundColor: 'rgba(255,255,255,0.16)',


                        }}>

                        <TimeItem
                            onPress={this._onStartDateBtnPress}
                            date={this._startDate}
                        />

                        <View
                            style={{
                                alignSelf: 'center',

                                width: DesignConvert.getW(25),
                                height: DesignConvert.getH(1),

                                backgroundColor: '#EED5FF',
                            }}></View>

                        <TimeItem
                            onPress={this._onEndDateBtnPress}
                            date={this._endDate}
                        />
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            
                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(1),

                            backgroundColor: 'rgba(255,255,255,0.16)',
                            
                        }}></View>
                </View>
            );
        } else if (this.props.viewType == withdrawRecord) {
            return (
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',

                             width: DesignConvert.getW(345),
                            height: DesignConvert.getH(38),
                            paddingHorizontal: DesignConvert.getW(10),

                            backgroundColor: 'rgba(255,255,255,0.16)',
                        }}>
                        <TimeItem
                            onPress={this._onEndDateBtnPress}
                            date={this._endDate}
                        />
                        <Text
                            style={{
                                color: '#FFF',
                                fontSize: DesignConvert.getF(12),
                            }}
                        >
                            合计:{`¥${StringUtil.formatMoney(this._totalMoney)}元`}
                        </Text>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,

                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(1),

                            backgroundColor: 'rgba(255,255,255,0.16)',
                           
                        }}></View>

                </View>
            );
        } else if (this.props.viewType == exchangeRecord) {
            return (
                <View>
                    <View
                        style={{

                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                           
                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(38),
                            paddingHorizontal: DesignConvert.getW(10),

                            backgroundColor: 'rgba(255,255,255,0.16)',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >

                            <TimeItem
                                onPress={this._onStartDateBtnPress}
                                date={this._startDate}
                            />
                            <TimeItem
                                onPress={this._onEndDateBtnPress}
                                date={this._endDate}
                                containerStyle={{
                                    marginLeft: DesignConvert.getW(10)
                                }}
                            />

                        </View>
                        <Text
                            style={{
                                color: '#FFF',
                                fontSize: DesignConvert.getF(12),
                            }}
                        >
                            合计:{`${StringUtil.formatMoney(this._totalMoney, 0)}${COIN_NAME}`}
                        </Text>
                    </View>
                    <View
                        style={{
                             position: "absolute",
                            bottom: 0,

                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(1),

                            backgroundColor: 'rgba(255,255,255,0.16)',
                           
                        }}></View>

                </View>


            );
        } else {

            return (
                <View>
                    <View
                        style={{

                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',

                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(38),
                            paddingHorizontal: DesignConvert.getW(10),

                            backgroundColor: 'rgba(255,255,255,0.16)',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <TimeItem
                                onPress={this._onLiveNoBtnPress}
                                date={this._liveNo}
                            />

                            <TimeItem
                                onPress={this._onEndDateBtnPress}
                                date={this._endDate}
                                containerStyle={{
                                    marginLeft: DesignConvert.getW(10)
                                }}
                            />

                        </View>

                        <Text
                            style={{
                                color: '#FFF',
                                fontSize: DesignConvert.getF(12),
                            }}
                        >
                            合计:{`${StringUtil.formatMoney(this._totalMoney, 0)}元`}
                        </Text>
                        <View
                            style={{
                                  position: "absolute",
                                bottom: 0,

                                width: DesignConvert.getW(345),
                                height: DesignConvert.getH(1),

                                backgroundColor: 'rgba(255,255,255,0.16)',
                              
                            }}></View>

                    </View>

                </View>
            );
        }
    };

    _renderImage(imageUri) {
        if (this.props.viewType == flowRecord) {
           
            return (
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            
                            alignSelf: 'center',

                            marginRight: DesignConvert.getW(6),

                            color: '#999999',
                            fontSize: DesignConvert.getF(13),
                            fontWeight: 'normal',
                            
                            
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

        switch (this.props.viewType) {
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
            case exchangeRecord:
                return (
                    <_exchangeRecordItem
                        item={item}
                    />
                )
            case liveFlowRecord:
                return (
                    <_liveFlowRecordItem
                        item={item}
                    />
                )

        }
    }

    _emptyPage() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(200),

                    justifyContent: 'center',
                    alignItems: 'center',

                    borderBottomLeftRadius: DesignConvert.getW(10),
                    borderBottomRightRadius: DesignConvert.getW(10),

                    backgroundColor: 'rgba(255,255,255,0.16)',
                }}
            >
                <Image
                    source={require('../../hardcode/skin_imgs/anchorincome').default_record2()}
                    style={{
                        width: DesignConvert.getW(136),
                        height: DesignConvert.getH(90.5),
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
                    width: DesignConvert.getW(345),
                    height: DesignConvert.sheight,
                    // backgroundColor:'rgba(255,255,255,0.16)',
                }}
            >

                {this._topBar()}

                <FlatList
                    data={this._flowList}
                    renderItem={this._renderItem}
                    ListEmptyComponent={this._emptyPage()}
                    refreshing={this._isLoading}
                    onRefresh={this._onRefresh}
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(217),

                        alignSelf: "center",

                        borderBottomEndRadius: DesignConvert.getW(10),
                        borderBottomRightRadius: DesignConvert.getW(10),

                    }}

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
