/**
 * 我的 -> 钱包
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';
import ModelEvent from "../../utils/ModelEvent";
import { EVT_UPDATE_WALLET } from "../../hardcode/HLogicEvent";
import UserInfoCache from "../../cache/UserInfoCache";
import ToastUtil from "../base/ToastUtil";
import { COIN_NAME, } from '../../hardcode/HGLobal';
import BackTitleView from '../base/BackTitleView';
import { rechargeRecord, giftGoldRecord, receivedGoldRecord } from "../anchorincome/RecordView";
import StatusBarView from "../base/StatusBarView";
import { ic_back_black } from "../../hardcode/skin_imgs/common";
import { board_bg, ic_alipay, ic_choose, wa_jb, wa_unchoose, zd_bg, zd_zz_bg } from "../../hardcode/skin_imgs/mywallet";
import { ic_gold } from "../../hardcode/skin_imgs/main";
import StringUtil from "../../utils/StringUtil";
import { color } from "react-native-reanimated";



//充值表
class WalletTitleView extends PureComponent {


    render() {
        return (
            <View>
                <StatusBarView />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(44),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white'
                    }}
                >

                    <Text
                        numberOfLines={1}
                        style={{
                            maxWidth: DesignConvert.getW(200),
                            fontWeight: 'bold',
                            color: !this.props.tintColor ? '#212121' : this.props.tintColor,
                            fontSize: DesignConvert.getF(16),
                        }}
                    >{this.props.titleText}</Text>

                    <TouchableOpacity
                        style={{
                            height: DesignConvert.getH(44),
                            position: 'absolute',
                            left: 0,
                            justifyContent: 'center',
                        }}
                        onPress={this.props.onBack}
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

                    {this.props.rightText ? (
                        <TouchableOpacity
                            onPress={this.props.onRightPress}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: DesignConvert.getH(10),
                                width: DesignConvert.getW(80),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                colors={["#7479FF", "#B785FF"]}
                                style={{
                                    minWidth: DesignConvert.getW(60),
                                    height: DesignConvert.getW(24),
                                    borderRadius: DesignConvert.getW(15),
                                    marginRight: DesignConvert.getW(15),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: !this.props.tintColor ? "white" : 'white',
                                        fontSize: DesignConvert.getF(13),
                                    }}
                                >{!this.props.rightText ? "" : this.props.rightText}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : null}

                    {this.props.rightImg ? (
                        <TouchableOpacity
                            style={{
                                height: DesignConvert.getH(44),
                                position: 'absolute',
                                right: 0,
                                justifyContent: 'center',
                            }}
                            onPress={this.props.onRightPress}
                        >
                            <Image
                                style={[{
                                    width: DesignConvert.getW(17),
                                    height: DesignConvert.getH(20),
                                    marginLeft: DesignConvert.getW(15),
                                    marginEnd: DesignConvert.getW(15),
                                    tintColor: !this.props.tintColor ? null : this.props.tintColor,
                                }, this.props.rightImgStyle]}
                                source={this.props.rightImg}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {!this.props.tintColor ? (
                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(0.5),
                            backgroundColor: "#F1F1F1",
                        }}
                        onPress={this.props.onRightPress}
                    ></View>
                ) : null}
            </View>
        );
    }
}

class ChargeList extends PureComponent {
    constructor(props) {
        super(props);

        this._payType = 0;
        this._chargeList = [];
    }

    _selectedItem = (item) => {
        //TODO:设置选择item,回调
        this._selected.checked = false;
        this._selected = item;
        this._selected.checked = true;

        if (this.props.selectedItem != undefined) {
            this.props.selectedItem(item);
        }
        this.forceUpdate();
    }

    _onItemPress = (item) => {
        require("../../model/pay/PayModel").default.toPay(this._payType, item);
        this.forceUpdate();
    }

    componentDidMount() {
        require("../../model/mine/MyWalletModel").default.getRecharge()
            .then(data => {
                if (!data) {
                    return
                }
                // console.log("充值额度", data);
                data.forEach(element => {
                    element.checked = false;
                    element.key = element.id;
                });
                this._chargeList = data;
                if (this._chargeList.length > 0) {
                    this._selected = this._chargeList[0];
                    this._selectedItem(this._selected);
                }
                this.forceUpdate();
            })

        require("../../model/mine/MyWalletModel").default.getPayType()
            .then(data => {
                [this._alipay, this._wechat, this._union] = data;
                if (this._alipay) {
                    this._payType = 1;
                } else if (this._wechat) {
                    this._payType = 2;
                } else if (this._union) {
                    this._payType = 3;
                }
                this.forceUpdate();
            })
    }


    _renderItem = ({ item }) => {

        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.getW(97),
                    height: DesignConvert.getH(97),
                    alignItems: "center",
                    justifyContent: "center",
                    marginEnd: DesignConvert.getW(18),
                    // borderWidth: DesignConvert.getW(1),
                    borderColor: item.checked ? '#8808AA' : '#F0F0F0',
                    // borderRadius: DesignConvert.getW(5),
                    marginBottom: DesignConvert.getH(13),
                }}
                onPress={() => {
                    this._selectedItem(item)
                }}
            >
                <ImageBackground
                    style={{
                        width: DesignConvert.getW(97),
                        height: DesignConvert.getH(97),
                        alignItems: 'center'
                    }}
                    source={item.checked ? ic_choose() : wa_unchoose()}
                >
                    <Image source={wa_jb()} style={{
                        width: DesignConvert.getW(32),
                        height: DesignConvert.getH(32),
                        marginTop: DesignConvert.getH(7)
                    }} />
                    <Text
                        style={{
                            color: '#E46EFF',
                            fontWeight: '800',
                            fontSize: DesignConvert.getF(12),
                            marginTop: DesignConvert.getH(7),
                        }}>{`${item.goldShell}金币`}</Text>
                    <Text
                        style={{
                            color: item.checked ? '#999999' : '#999999',
                            fontSize: DesignConvert.getF(13),
                            marginTop: DesignConvert.getH(2)
                        }}>{`¥${item.price}`}</Text>

                </ImageBackground>

                {/* <TouchableOpacity
                    onPress={() => {
                        this._onItemPress(item);
                    }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[THEME_COLOR_LEFT, THEME_COLOR_RIGHT]}
                        style={{
                            width: DesignConvert.getW(67),
                            height: DesignConvert.getH(28),
                            borderRadius: DesignConvert.getW(4),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(12),
                            }}>购买</Text>
                    </LinearGradient>
                </TouchableOpacity> */}
            </TouchableOpacity >

        )

        // return (
        //     <TouchableOpacity
        //         style={{
        //             width: DesignConvert.getW(104),
        //             height: DesignConvert.getH(56),
        //             alignItems: "center",
        //             justifyContent: "center",
        //             marginEnd: DesignConvert.getW(16),
        //             borderWidth: DesignConvert.getW(1),
        //             borderColor: item.checked ? '#FD7687' : '#F0F0F0',
        //             borderRadius: DesignConvert.getW(5),
        //             marginBottom: DesignConvert.getH(10),
        //         }}
        //         onPress={() => {
        //             this._selectedItem(item)
        //         }}
        //     >

        //         <Text
        //             style={{
        //                 color: '#333333',
        //                 fontWeight: '800',
        //                 fontSize: DesignConvert.getF(13),
        //             }}>{`${item.goldShell}钻石`}</Text>
        //         <Text
        //             style={{
        //                 color: item.checked ? '#FD7687' : '#FD7687',
        //                 fontSize: DesignConvert.getF(12),
        //                 marginTop: DesignConvert.getH(5)
        //             }}>{`¥${item.price}元`}</Text>

        //         {/* <TouchableOpacity
        //             onPress={() => {
        //                 this._onItemPress(item);
        //             }}>
        //             <LinearGradient
        //                 start={{ x: 0, y: 0 }}
        //                 end={{ x: 1, y: 0 }}
        //                 colors={[THEME_COLOR_LEFT, THEME_COLOR_RIGHT]}
        //                 style={{
        //                     width: DesignConvert.getW(67),
        //                     height: DesignConvert.getH(28),
        //                     borderRadius: DesignConvert.getW(4),
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                 }}>
        //                 <Text
        //                     style={{
        //                         color: "white",
        //                         fontSize: DesignConvert.getF(12),
        //                     }}>购买</Text>
        //             </LinearGradient>
        //         </TouchableOpacity> */}
        //     </TouchableOpacity >

        // )
    }

    render() {
        // console.log("充值表更新",this._chargeList);
        return (
            <FlatList
                data={this._chargeList}
                numColumns={3}
                renderItem={this._renderItem}
                extraData={this._selected}

            // ListFooterComponent={
            //     <View
            //         style={{
            //             height: DesignConvert.getH(25),
            //         }}></View>
            // }
            ></FlatList>
        )
    }
}


const [ALIPAY, BANK, WECHAAT] = [555, 778, 996];
class _PayItem extends PureComponent {
    constructor(props) {
        super(props);

    }

    _getIcon = () => {
        // console.log("_getIcon", this.props.type);
        switch (this.props.type) {
            case ALIPAY:
                return require("../../hardcode/skin_imgs/mywallet").ic_alipay();
            case BANK:
                return require("../../hardcode/skin_imgs/mywallet").ic_pay_bank();
            case WECHAAT:
                return require("../../hardcode/skin_imgs/mywallet").ic_pay_wechat();
        }
    }

    _getText = () => {
        switch (this.props.type) {
            case ALIPAY:
                return "支付宝支付";
            case BANK:
                return "银联支付";
            case WECHAAT:
                return "微信支付";
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    width: DesignConvert.getW(100),
                    height: DesignConvert.getH(40),
                    borderWidth: DesignConvert.getW(1),
                    borderColor: this.props.isChecked ? "#FA495F" : "#E5E5E5",
                    backgroundColor: this.props.isChecked ? "#FFD0DC" : "white",
                    borderRadius: DesignConvert.getW(6),
                    margin: DesignConvert.getW(12),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    display: !this.props.isHide ? "flex" : "none",
                }}>
                <Image
                    source={this._getIcon()}
                    style={{
                        width: DesignConvert.getW(this.props.type == BANK ? 22 : 16),
                        height: DesignConvert.getH(this.props.type == BANK ? 14 : 16),
                        marginRight: DesignConvert.getW(5),
                    }}></Image>

                <Text
                    style={{
                        color: "#1A1A1A",
                        fontSize: DesignConvert.getF(13),
                    }}>{this._getText()}</Text>
            </TouchableOpacity>
        )
    }
}


export default class MyWalletView extends BaseView {

    constructor(props) {
        super(props);

        this._accountMoney = 0;
        this._payType = 0;
        this._giftEnable = false;

        this.state = {
            isclickpay: false
        }
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _onChargePress = () => {
        require("../../router/level3_router").showRecordView(require("../anchorincome/RecordView").rechargeRecord);
    }


    _onMenuPress = () => {
        let items = [
            { text: "充值记录", onPress: this._onRechargeRecordPress },
            { text: "受赠记录", onPress: this._onReceivedGoldRecordPress },
        ]
        require("../../router/level2_router").showListDialog(items);
    }

    /**
     * 打开受赠记录
     */
    _onReceivedGoldRecordPress = () => {

        this.setState({
            isclickpay: !this.state.isclickpay
        })

        require("../../router/level3_router").showRecordView(receivedGoldRecord);
    }

    /**
     * 打开充值记录
     */
    _onRechargeRecordPress = () => {
        this.setState({
            isclickpay: !this.state.isclickpay
        })

        require("../../router/level3_router").showRecordView(rechargeRecord);
    }

    _onGiftRecordPress = () => {
        this.setState({
            isclickpay: !this.state.isclickpay
        })
        require("../../router/level3_router").showRecordView(require("../anchorincome/RecordView").giftGoldRecord);
    }

    _onExchangePress = () => {
        require("../../router/level3_router").showConVertView();
    }

    _onGiftPress = () => {
        require('../../model/mine/MyWalletModel').default.onWalletSendGoldShell()
    }

    _selectedItem = (item) => {
        this.selectedRecharge = item;
    }

    _onSubmitPress = () => {
        require("../../model/pay/PayModel").default.toPay(this._payType, this.selectedRecharge);
    }

    _onAliPayPress = () => {
        this._payType = 1;
        this.forceUpdate();
    }

    _onWetChatPress = () => {
        this._payType = 2;
        this.forceUpdate();
    }

    _onBankPress = () => {
        this._payType = 3;
        this.forceUpdate();
    }

    _update = () => {
        require("../../model/BagModel").default.getWallet()
            .then(data => {
                this._accountMoney = data.goldShell;
                this.forceUpdate();
            })
    }

    _initData() {
        require("../../model/mine/MyWalletModel").default.getMoneyGivingList()
            .then(data => {
                if (this._giftEnable == data) {
                    return;
                }
                this._giftEnable = data;
                this.forceUpdate();
            })

        require("../../model/BagModel").default.getWallet()
            .then(data => {
                this._accountMoney = data.goldShell;
                this.forceUpdate();
            })

        require("../../model/mine/MyWalletModel").default.getPayType()
            .then(data => {
                [this._alipay, this._wechat, this._union] = data;
                if (this._alipay) {
                    this._payType = 1;
                } else if (this._wechat) {
                    this._payType = 2;
                } else if (this._union) {
                    this._payType = 3;
                }
                this.forceUpdate();
            })
    }

    _changePayClickState = () => {
        this.setState({
            isclickpay: !this.state.isclickpay
        })
    }

    onResume() {
        this._update();
    }

    componentDidMount() {
        super.componentDidMount();
        ModelEvent.addEvent(null, EVT_UPDATE_WALLET, this._update);
        this._initData();
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_UPDATE_WALLET, this._update);
        super.componentWillUnmount();
    }
    render() {
        const DesignConvert = require("../../utils/DesignConvert").default;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: this.state.isclickpay ? 'rgba(0, 0, 0, 0.1)' : 'white'
                }}>
                {this.state.isclickpay ? (<View style={{
                    position: 'absolute',
                    zIndex: 2,
                    top: DesignConvert.getH(67),
                    right: DesignConvert.getW(15)
                }}>
                    <ImageBackground
                        style={{
                            width: DesignConvert.getW(80),
                            height: this._giftEnable ? DesignConvert.getH(119) : DesignConvert.getH(89)
                        }}
                        source={this._giftEnable ? zd_zz_bg() : zd_bg()}
                    >
                        <View>
                            <Text
                                onPress={this._onRechargeRecordPress}
                                style={{
                                    fontSize: DesignConvert.getF(13),
                                    color: '#333333',
                                    marginTop: DesignConvert.getH(23),
                                    marginLeft: DesignConvert.getW(14)
                                }}>充值记录
                                </Text>
                            {this._giftEnable && <Text
                                onPress={this._onGiftRecordPress}
                                style={{
                                    fontSize: DesignConvert.getF(13),
                                    color: '#333333',
                                    marginTop: DesignConvert.getH(15),
                                    marginLeft: DesignConvert.getW(14)
                                }}>转赠记录
                                </Text>}
                            <Text
                                onPress={this._onReceivedGoldRecordPress}
                                style={{
                                    fontSize: DesignConvert.getF(13),
                                    color: '#333333',
                                    marginTop: DesignConvert.getH(15),
                                    marginLeft: DesignConvert.getW(14)
                                }}>受赠记录
                                </Text>
                        </View>
                    </ImageBackground>
                </View>) : null}
                <BackTitleView
                    bgColor={['#00000000', '#00000000']}
                    titleText={'我的钱包'}
                    rightText="账单"
                    onBack={this.popSelf}
                    onRightPress={this._changePayClickState}
                    backImgStyle={{
                        tintColor: '#000000'
                    }}
                    titleTextStyle={{
                        color: '#000000'
                    }}
                    rightTextStyle={{
                        fontSize: DesignConvert.getF(13),
                        color: '#FFFFFF',
                    }}
                    rightTouchStyle={{
                        width: DesignConvert.getW(50),
                        height: DesignConvert.getH(25),

                        justifyContent: 'center',
                        alignContent: 'center',

                        backgroundColor: '#CD0031',
                        borderRadius: DesignConvert.getW(12.5),
                    }}
                />

                <ImageBackground
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(125),

                        marginTop: DesignConvert.getW(10),
                        marginLeft: DesignConvert.getW(15),
                        marginRight: DesignConvert.getW(15)
                    }}
                    source={board_bg()}
                >
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(12),
                            color: '#FFFFFF',
                            position: 'absolute',
                            top: DesignConvert.getH(30),
                            left: DesignConvert.getW(20)
                        }}>
                        金币余额
                    </Text>
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(17),
                            color: '#FFFFFF',
                            position: 'absolute',
                            top: DesignConvert.getH(56.5),
                            left: DesignConvert.getW(20)
                        }}>
                        {StringUtil.formatMoney(this._accountMoney, 0)}
                    </Text>
                    {this._giftEnable && <TouchableOpacity
                        onPress={this._onGiftPress}
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(46.5),
                            right: DesignConvert.getH(10),
                            width: DesignConvert.getW(60),
                            height: DesignConvert.getH(32),
                            borderRadius: DesignConvert.getW(16),
                            // marginTop: DesignConvert.getH(20),
                            // marginBottom: DesignConvert.getH(15) + DesignConvert.addIpxBottomHeight(),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#FF5245', '#CD0031']}
                            style={{
                                position: 'absolute',
                                width: DesignConvert.getW(60),
                                height: DesignConvert.getH(32),
                                borderRadius: DesignConvert.getW(16),
                            }}
                        />

                        <Text
                            style={{
                                fontSize: DesignConvert.getF(13),
                                color: 'white'
                            }}
                        >转赠</Text>

                    </TouchableOpacity>}
                </ImageBackground>

                <View style={{
                    marginLeft: DesignConvert.getW(25),
                    marginRight: DesignConvert.getW(25),
                }}>
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(14),
                            color: '#636363',
                            marginTop: DesignConvert.getH(15),
                            marginBottom: DesignConvert.getH(18)
                        }}>
                        请选择充值金额
                    </Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                // style={{
                //     flex: 1,
                // }}
                >

                    <View
                        style={{
                            marginTop: DesignConvert.getH(5),
                            marginLeft: DesignConvert.getW(26),
                        }}
                    >
                        <ChargeList
                            selectedItem={this._selectedItem} />

                        {/* <Text
                            style={{
                                color: '#333333',
                                fontSize: DesignConvert.getF(14),
                                marginStart: DesignConvert.getW(15),
                                marginBottom: DesignConvert.getH(10),
                            }}
                        >
                            {`选择支付方式`}
                        </Text> */}

                        {/* <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingStart: DesignConvert.getW(15),
                                paddingEnd: DesignConvert.getW(28),
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(46),
                            }}
                        >

                            <Image
                                style={{
                                    width: DesignConvert.getW(22),
                                    height: DesignConvert.getH(22),
                                }}
                                source={ic_alipay()}
                            />

                            <Text
                                style={{
                                    color: '#333333',
                                    fontSize: DesignConvert.getF(13)
                                }}
                            >
                                {`支付宝支付`}
                            </Text>

                            <View
                                style={{
                                    flex: 1
                                }}
                            />

                            <Image
                                style={{
                                    width: DesignConvert.getW(15),
                                    height: DesignConvert.getH(15),
                                    resizeMode: 'contain'
                                }}
                                source={ic_choose()}
                            />

                        </View>

                    </View> */}


                        {/* <Text
                        style={{
                            color: "#808080",
                            fontSize: DesignConvert.getF(12),
                            marginTop: DesignConvert.getH(10),
                            marginLeft: DesignConvert.getW(27),
                        }}>支付方式</Text>

                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(70),
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}>

                        <_PayItem
                            isHide={!this._alipay}
                            type={ALIPAY}
                            onPress={this._onAliPayPress}
                            isChecked={this._payType == 1} />

                        <_PayItem
                            isHide={!this._wechat}
                            type={WECHAAT}
                            onPress={this._onWetChatPress}
                            isChecked={this._payType == 2} />

                        <_PayItem
                            isHide={!this._union}
                            type={BANK}
                            onPress={this._onBankPress}
                            isChecked={this._payType == 3} />
                        */}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    onPress={this._onSubmitPress}
                    style={{
                        width: DesignConvert.getW(160),
                        height: DesignConvert.getH(40),
                        borderRadius: DesignConvert.getW(18.5),
                        // marginTop: DesignConvert.getH(20),
                        // marginBottom: DesignConvert.getH(15) + DesignConvert.addIpxBottomHeight(),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: DesignConvert.getW(107.5),
                    }}>

                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#FF5245', '#CD0031']}
                        style={{
                            position: 'absolute',
                            width: DesignConvert.getW(160),
                            height: DesignConvert.getH(40),
                            borderRadius: DesignConvert.getW(18.5),
                        }}
                    />

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(13),
                            color: 'white'
                        }}
                    >确定充值</Text>

                </TouchableOpacity>
            </View>

        )
    }
}