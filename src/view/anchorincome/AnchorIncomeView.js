/**
 * 我的收益
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { COIN_NAME, } from '../../hardcode/HGLobal';
import { TitleBar } from "../anchorincome/ConvertView"
import BackTitleView from "../base/BackTitleView";
import { bg_income, bg_shouyi } from "../../hardcode/skin_imgs/mine";
import AnchorIncomeBill from "./AnchorIncomeBill";

function TextAndText(props) {
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',

                height: DesignConvert.getH(42),

                ...props.containerStyle,
            }}
        >

            <Text
                style={{
                    fontSize: DesignConvert.getF(19),
                    fontWeight: 'bold',
                    lineHeight: DesignConvert.getF(23),
                    color: '#FFFFFF',
                }}
                numberOfLines={1}
            >
                {props.moneyNum}
            </Text>
            <Text
                style={{

                    marginTop: DesignConvert.getH(4.5),

                    fontSize: DesignConvert.getF(10),
                    lineHeight: DesignConvert.getF(14),
                    color: '#FFFFFF',

                    opacity: 0.8,
                }}
            >
                {props.title}
            </Text>
            {/* 
            {!props.isHideLine && <View
                style={{
                    width: DesignConvert.getW(1),
                    height: DesignConvert.getH(20),
                    backgroundColor: 'white',
                    position: 'absolute',
                    right: 0
                }}
            />} */}
        </View>
    )
}

//兑换金币
class ExchangeButton extends PureComponent {

    render() {
        const DesignConvert = require('../../utils/DesignConvert').default;

        return (
            <TouchableOpacity
                style={{
                    marginTop: DesignConvert.getH(29.6)
                }}
                onPress={this.props.onPress}
            >
                <View
                    style={{

                        justifyContent: 'center',
                        alignItems: 'center',

                        width: DesignConvert.getW(130),
                        height: DesignConvert.getH(40),

                        backgroundColor: 'white',
                        borderRadius: DesignConvert.getW(20),
                        borderColor: '#FA495F',
                        borderWidth: DesignConvert.getBorderWidth(3),


                    }}
                >
                    <Text
                        style={{
                            color: '#FA4B5C',
                            fontSize: DesignConvert.getF(15),
                            fontWeight: "bold",
                        }}
                    >{`兑换${COIN_NAME}`}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

//提现
class WithdrawButton extends PureComponent {

    render() {
        const DesignConvert = require('../../utils/DesignConvert').default;

        return (
            <TouchableOpacity
                style={{
                    marginTop: DesignConvert.getH(29.6)
                }}
                onPress={this.props.onPress}
            >
                <View
                    style={{

                        justifyContent: 'center',
                        alignItems: 'center',

                        width: DesignConvert.getW(130),
                        height: DesignConvert.getH(40),

                        backgroundColor: '#FA495F',
                        borderRadius: DesignConvert.getW(20),


                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(15),
                            fontWeight: "bold",
                        }}
                    >提 现</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

//收益页
export default class AnchorIncomeView extends BaseView {

    constructor(props) {
        super(props);

        this._weekEarning = 0;
        this._accountMoney = 0;

        this._bExplanationDiaVisible = false;

        this._minCatchValue = 100;
        this._maxCatchValue = 10000;

        this._dayChatLiveRecv = 0;
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _explanationPress = () => {
        this._bExplanationDiaVisible = true;
        this.forceUpdate();
    }

    /**
     * 判断是否绑定手机
     * 判断是否设置支付密码
     * 然后跳转兑换页
     */
    _exchangePress = () => {
        require('../../model/anchorincome/AnchorIncomeModel').default.onClickExchange()
    }

    _withdrawPress = () => {
        require('../../model/anchorincome/AnchorIncomeModel').default.toWithdraw(this._accountMoney, this._minCatchValue, this._maxCatchValue);
    }

    /**
     * 四个记录
     */
    _flowRecord = () => {
        require("../../router/level3_router").showRecordView(require("./RecordView").flowRecord);
    }
    _withdrawalsRecord = () => {
        require("../../router/level3_router").showRecordView(require("./RecordView").withdrawRecord);
    }
    _exchangeRecord = () => {
        require("../../router/level3_router").showRecordView(require("./RecordView").exchangeRecord);
    }
    _liveFlowRecord = () => {
        require("../../router/level3_router").showRecordView(require("./RecordView").liveFlowRecord);
    }

    onResume() {
        this._initData();
    }

    componentDidMount() {
        super.componentDidMount();

        this._initData();
        require('../../model/anchorincome/AnchorIncomeModel').default.getPublicConfigTableData()
            .then(data => {
                if (!data) {
                    return;
                }

                this._minCatchValue = data.minCatch;
                this._maxCatchValue = data.maxCatch;
                this.forceUpdate();
            });

    }

    _initData = () => {
        require('../../model/anchorincome/AnchorIncomeModel').default.getIncomeData()
            .then(data => {
                
                this._weekEarning = Math.floor(data.weekLiveEarn) / 100;
                this._accountMoney = Math.floor(data.balance) / 100;
                this._dayLiveRecv = Math.floor(data.dayLiveRecv) / 100;
                this._dayLiveEarn = Math.floor(data.dayLiveEarn) / 100;
                this._dayChatLiveRecv = Math.floor(data.dayChatRecv) / 100;
                this.forceUpdate();
            });
    }

    _incomeDetail = () => {
        require("../../router/level2_router").showAnchorIncomeBill();
    }

    render() {
        const DesignConvert = require("../../utils/DesignConvert").default;

        const StatusBarView = require("../base/StatusBarView").default;

        return (
            <ImageBackground
                style={{

                    flex: 1,
                    alignItems: 'center',

                }}
                resizeMode={'stretch'}
                source={bg_shouyi()}
            >
                <BackTitleView
                    titleText={'我的收益'}
                    onBack={this._onBackPress}
                    bgColor={['#00000000', '#00000000']}
                    backImgStyle={{
                        tintColor: 'white'
                    }}
                    titleTextStyle={{
                        color: 'white'
                    }}
                    rightTextStyle={{
                        color: 'white'
                    }}

                />

                {/* <ImageBackground
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(180),
                        marginTop: DesignConvert.getH(12),
                        alignItems: 'center',
                    }}
                    source={bg_income()}
                >
 */}



                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',

                        minWidth: DesignConvert.getW(96),
                        height: DesignConvert.getH(60),
                        marginTop: DesignConvert.getH(20),

                    }}
                >

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(12),
                            color: '#FFFFFF',
                            opacity: 0.8
                        }}
                    >
                        {'可提现金额（元）'}
                    </Text>
                    <Text
                        style={{
                            flex: 1,
                            marginTop: DesignConvert.getH(10),
                            lineHeight: DesignConvert.getH(36.5),
                            fontSize: DesignConvert.getF(30),
                            color: '#FFFFFF',
                            fontWeight: "bold",
                        }}
                    >
                        {require("../../utils/StringUtil").default.formatMoney(this._accountMoney)}
                    </Text>


                </View>

                <View
                    style={{

                        flexDirection: 'row',
                        justifyContent: 'space-between',

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(42),
                        paddingHorizontal: DesignConvert.getW(10),
                        marginTop: DesignConvert.getH(32),

                    }}
                >
                    <TextAndText
                        moneyNum={require("../../utils/StringUtil").default.formatMoney(this._accountMoney)}
                        title="总收益（元）"
                    />
                    {/* <TextAndText
                            moneyNum={require("../../utils/StringUtil").default.formatMoney(this._dayChatLiveRecv)}
                            title="今日陪聊流水"
                        /> */}
                    <TextAndText
                        moneyNum={require("../../utils/StringUtil").default.formatMoney(this._weekEarning)}
                        title="本周收益（元）"
                    />
                    <TextAndText
                        moneyNum={require("../../utils/StringUtil").default.formatMoney(this._dayLiveEarn)}
                        title="本日收益（元）"
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(29),
                        paddingHorizontal: DesignConvert.getW(45),
                        marginTop: DesignConvert.getH(30),

                    }}
                >

                    <TouchableOpacity
                        onPress={this._withdrawPress}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',

                            width: DesignConvert.getW(105),
                            height: DesignConvert.getH(29),

                            borderRadius: DesignConvert.getW(14.5),

                        }}
                    >

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#FF5245', '#CD0031']}
                            style={{
                                position: 'absolute',

                                width: DesignConvert.getW(105),
                                height: DesignConvert.getH(29),

                                borderRadius: DesignConvert.getW(14.5),
                            }}
                        />

                        <Text
                            style={{
                                fontSize: DesignConvert.getF(12),
                                color: '#FFFFFF',
                            }}
                        >
                            {'申请提现'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._exchangePress}
                        style={{

                            alignItems: 'center',
                            justifyContent: 'center',

                            width: DesignConvert.getW(105),
                            height: DesignConvert.getH(29),


                            borderRadius: DesignConvert.getW(14.5),
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={['#FF5245', '#CD0031']}
                            style={{
                                position: 'absolute',

                                width: DesignConvert.getW(105),
                                height: DesignConvert.getH(29),

                                borderRadius: DesignConvert.getW(14.5),
                            }}
                        />
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(12),
                                color: '#FFF',
                            }}
                        >
                            {`兑换${COIN_NAME}`}
                        </Text>

                    </TouchableOpacity>


                </View>

                {/* 分割线 */}
                <View
                    style={{

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(1),

                        marginTop: DesignConvert.getH(30),

                        backgroundColor: '#E0E0E0',
                        opacity: 0.5
                    }}
                />
                {/* 
                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(18),
                                color: '#333333',
                                fontWeight: 'bold',
                            }}
                        >
                            {require("../../utils/StringUtil").default.formatMoney(this._dayLiveRecv)}
                        </Text>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(13),
                                color: '#999999',
                                marginTop: DesignConvert.getH(9),
                            }}
                        >
                            {'今日流水'}
                        </Text>
                    </View>

                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(18),
                                color: '#333333',
                                fontWeight: 'bold',
                            }}
                        >
                            {require("../../utils/StringUtil").default.formatMoney(this._dayLiveEarn)}
                        </Text>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(13),
                                color: '#999999',
                                marginTop: DesignConvert.getH(9),
                            }}
                        >
                            {'今日收益'}
                        </Text>
                    </View> */}


                {/* </ImageBackground> */}

                <AnchorIncomeBill
                    dayChatRec={this._dayChatLiveRecv}
                />

                <View
                    style={{
                        flex: 1,
                    }}
                />


                {/* <ImageBackground
                    source={require("../../hardcode/skin_imgs/anchorincome").bg1()}
                    style={{
                        width: DesignConvert.getW(339),
                        height: DesignConvert.getH(209),
                        marginTop: DesignConvert.getH(-35),
                        padding: DesignConvert.getW(20),
                    }}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                        }}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Text
                                style={styles.normalText}
                            >本周收益（元）</Text>

                            <View
                                style={[styles.line, { marginTop: DesignConvert.getH(10) }]} />

                            <Text
                                style={[styles.moneyText, { marginTop: DesignConvert.getH(22.6) }]}
                            >{require("../../utils/StringUtil").default.formatMoney(this._weekEarning)}</Text>

                            <ExchangeButton
                                onPress={this._exchangePress} />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Text
                                style={styles.normalText}
                            >可提现（元）</Text>

                            <View
                                style={[styles.line, { marginTop: DesignConvert.getH(10) }]} />

                            <Text
                                style={[styles.moneyText, { marginTop: DesignConvert.getH(22.6) }]}
                            >{require("../../utils/StringUtil").default.formatMoney(this._accountMoney)}</Text>

                            <WithdrawButton
                                onPress={this._withdrawPress} />
                        </View>
                    </View>
                </ImageBackground> */}

                {/* <ImageBackground
                    source={require("../../hardcode/skin_imgs/anchorincome").bg2()}
                    style={{
                        width: DesignConvert.getW(339),
                        height: DesignConvert.getH(88.67),
                        marginTop: DesignConvert.getH(18.3),
                        padding: DesignConvert.getW(5),
                    }}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                        }}>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._flowRecord}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Image
                                    source={require("../../hardcode/skin_imgs/anchorincome").turnover_record()}
                                    style={styles.bottomImage} />
                                <Text
                                    style={styles.bottomlText}
                                >流水记录</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._withdrawalsRecord}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Image
                                    source={require("../../hardcode/skin_imgs/anchorincome").draw_record()}
                                    style={styles.bottomImage} />
                                <Text
                                    style={styles.bottomlText}
                                >提现记录</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._exchangeRecord}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Image
                                    source={require("../../hardcode/skin_imgs/anchorincome").exchange_record()}
                                    style={styles.bottomImage} />
                                <Text
                                    style={styles.bottomlText}
                                >兑换记录</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._liveFlowRecord}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Image
                                    source={require("../../hardcode/skin_imgs/anchorincome").live_record()}
                                    style={styles.bottomImage} />
                                <Text
                                    style={styles.bottomlText}
                                >直播间流水</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </ImageBackground> */}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this._bExplanationDiaVisible}
                    onRequestClose={() => {
                        // alert("Modal has been closed.");
                        this._bExplanationDiaVisible = false;
                        this.forceUpdate();
                    }}
                >

                    <View
                        style={styles.bg}>

                        <View
                            style={{

                                justifyContent: "center",
                                alignItems: "center",

                                width: DesignConvert.swidth - DesignConvert.getW(120),
                                padding: DesignConvert.getW(22),

                                backgroundColor: "white",
                                borderRadius: DesignConvert.getW(10),
                            }}
                        >
                            <Text
                                style={styles.dialogTitleText}
                            >提现规则</Text>

                            <Text
                                style={styles.dialogContentText}
                            >{"1.发起提现后，下个工作日到账；\n2.目前平台提现不需要收取手续费，\n后续手续费费率会根据相关政策。"}</Text>

                            <TouchableOpacity
                                style={styles.dialogBtnBg}
                                onPress={() => {
                                    this._bExplanationDiaVisible = false;
                                    this.forceUpdate();
                                }}>

                                <Text
                                    style={styles.dialogBtnText}
                                >我知道了</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    normalText: {
        color: "#1A1818",
        fontSize: DesignConvert.getF(12),
    },
    moneyText: {
        color: "#FA495F",
        fontSize: DesignConvert.getF(27),
    },
    bottomlText: {
        color: "#666666",
        fontSize: DesignConvert.getF(11),
        marginTop: DesignConvert.getH(10),
    },
    line: {
        width: DesignConvert.getW(32),
        height: DesignConvert.getW(2),
        backgroundColor: "#FA495F",
        borderRadius: DesignConvert.getH(1),
    },
    bottomImage: {
        width: DesignConvert.getW(28),
        height: DesignConvert.getW(28),
    },
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: DesignConvert.swidth,
        height: DesignConvert.sheight,
        backgroundColor: "rgba(0,0,0,0.5)",  //rgba  a0-1  其余都是16进制数
        justifyContent: "center",
        alignItems: "center",
    },

    dialogTitleText: {
        color: "#000000",
        fontSize: DesignConvert.getF(15),
        marginTop: DesignConvert.getH(10),
        marginBottom: DesignConvert.getH(10),
    },

    dialogContentText: {
        color: "#000000",
        fontSize: DesignConvert.getF(13),
        marginTop: DesignConvert.getH(20),
        marginBottom: DesignConvert.getH(20),
    },

    dialogBtnText: {
        color: "white",
        fontSize: DesignConvert.getF(13),
        textAlign: "center",
    },

    dialogBtnBg: {
        width: DesignConvert.getW(170),
        height: DesignConvert.getW(40),
        backgroundColor: "#FA495F",
        borderRadius: DesignConvert.getW(20),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        textAlignVertical: "center",
    },
})