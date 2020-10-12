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
import { record_alipay, record_bank, record_wechat, record_cash, record_coin } from '../../../hardcode/skin_imgs/record';

export default class _RechargeRecordItem extends PureComponent {

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
        const statusColor = item.state == 1 ? "#34F1D5" : "#FF5D5D";

        const desc = `${StringUtil.formatMoney(Math.floor(item.money) / 100)}元`;
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
                    source={Img}
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(22),
                        left: DesignConvert.getW(15),

                        width: DesignConvert.getW(28),
                        height: DesignConvert.getH(28),
                    }}
                />

                <Text
                    style={{
                        position: 'absolute',
                        top: DesignConvert.getH(15),
                        left: DesignConvert.getW(53),

                        color: statusColor,
                        fontSize: DesignConvert.getF(14),
                    }}
                >{statusText}</Text>

                <Text
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(15),
                        top: DesignConvert.getH(15),

                        color: "#121212",
                        fontSize: DesignConvert.getF(14),
                    }}>
                    {desc}
                </Text>
                <Text
                    numberOfLines={1}
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(53),
                        top: DesignConvert.getH(43),

                        color: '#949494',
                        fontSize: DesignConvert.getF(11),
                    }}>
                    {payTypeText}
                </Text>
                <Text
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(15),
                        top: DesignConvert.getH(43),


                        color: '#999999',
                        fontSize: DesignConvert.getF(11),
                    }}
                >{time}</Text>


            </View>
        )
    }
}