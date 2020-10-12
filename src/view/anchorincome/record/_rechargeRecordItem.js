'use strict';

import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Modal, FlatList, SectionList } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import Config from '../../../configs/Config';
import moment from 'moment';
import { COIN_NAME } from '../../../hardcode/HGLobal';
import StringUtil from '../../../utils/StringUtil';
import UserInfoCache from '../../../cache/UserInfoCache';
import LinearGradient from 'react-native-linear-gradient';
import { LINEARGRADIENT_COLOR } from '../../../styles';
import { record_alipay, record_bank, record_wechat, record_cash, record_coin, record_jb } from '../../../hardcode/skin_imgs/record';

export default class _rechargeRecordItem extends PureComponent {

    _getPayTypeText = (payType) => {
        //判断充值类型
        switch (payType) {
            case -3:
                return '交易关闭';
            case -2:
                return 'Apply沙盒';
            case -1:
                return '虚拟订单';
            case 1:
            case 8:
            case 9:
                return '支付宝支付';
            case 2:
            case 7:
            case 10:
                return '微信支付';
            case 3:
                return 'Apple';
            case 4:
                return '微信公众号';
            case 5:
                return '他人代充';
            case 6:
                return '阿里公众号';
            case 32:
                return `公会收益${COIN_NAME}回购`;
            case 33:
                return `红包收益${COIN_NAME}回购`;
            default:
                return '其他';
        }
    }

    render() {
        const item = this.props.item;
        
        //判断支付类型
        const Img = record_coin();
        const payTypeText = this._getPayTypeText(item.payType);

        //状态判断
        const statusText = item.state == 1 ? '充值成功' : '充值失败';
        const statusColor = item.state == 1 ? "#8CE12F" : "#F74141";

        const desc = `${StringUtil.formatMoney(Math.floor(item.money) / 100)}金币`;
        const time = moment(item.logTime).format('YYYY-MM-DD HH:mm:ss');


        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(70),
                    paddingHorizontal: DesignConvert.getW(15),
                    flexDirection: "row",
                    alignItems: 'center',
                }}>

                <Image
                    resizeMode="contain"
                    source={record_jb()}
                    style={{
                        width: DesignConvert.getW(39),
                        height: DesignConvert.getH(39),
                        marginRight: DesignConvert.getW(11),
                    }}
                ></Image>

                <View
                    style={{
                        flex: 1,
                        height: DesignConvert.getH(73),
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                            {/* <Image
                                resizeMode="contain"
                                source={giftImg}
                                style={{
                                    width: DesignConvert.getW(18),
                                    height: DesignConvert.getH(18),
                                    marginRight: DesignConvert.getW(5),
                                }}
                            ></Image> */}

                            <Text
                                style={{
                                    color: statusColor,
                                    fontSize: DesignConvert.getF(15),
                                    fontWeight: "normal",
                                }}
                            >{statusText}</Text>
                        </View>

                        {/* <Image
                            resizeMode="contain"
                            source={record_coin()}
                            style={{
                                width: DesignConvert.getW(18),
                                height: DesignConvert.getH(18),
                                marginRight: DesignConvert.getW(5),
                            }}
                        ></Image> */}

                        <Text
                            style={{
                                color: "rgba(255, 255, 255, 1)",
                                fontSize: DesignConvert.getF(15),
                                fontWeight: "bold",
                            }}>
                            {desc}
                        </Text>

                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: DesignConvert.getH(5),
                        }}>

                        <Text
                            numberOfLines={1}
                            style={{
                                flex: 1,
                                color: 'rgba(151, 151, 151, 1)',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: "normal",
                                alignSelf: 'center',
                                marginRight: DesignConvert.getH(5),
                            }}>
                            {payTypeText}
                        </Text>

                        <Text
                            style={{
                                color: 'rgba(151, 151, 151, 1)',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: 'normal',
                                alignSelf: 'center',
                            }}
                        >{time}</Text>
                    </View>

                </View>

                <View
                    style={{
                        width: DesignConvert.getW(292),
                        height: DesignConvert.getH(0.5),
                        backgroundColor: "rgba(142, 142, 142, 0.2)",
                        position: "absolute",
                        right: DesignConvert.getW(15),
                        bottom: 0,
                    }}></View>
            </View>
        )
    }
}