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

export default class _WithdrawRecordItem extends PureComponent {

    _getStatusText = (status) => {
        //判断状态类型
        switch (status) {
            case 1:
                return '已到账';
            case 2:
                return '请求失败';
            case 3:
                return '失败';
            case 4:
            case 16:
                return '系统处理中';
            case 5:
            case 6:
            case 9:
            case 11:
                return '审核中';
            case 7:
                return '已过期';
            case 8:
            case 14:
                return '审核不通过';
            case 12:
                return '提现账号不存在';
            case 13:
                return '实名信息不一致';
            case 15:
                return '等待运营审核';
            case 17:
                return '系统处理失败，转账异常';
        }
    }

    render() {
        const item = this.props.item;
        //判断支付类型
        let payTypeImg;
        let payType;
        switch (item.payType) {
            case 1:
                payType = "收益提现-到支付宝";
                payTypeImg = record_alipay();;
                break;
            case 4:
                payType = "收益提现-到微信";
                payTypeImg = record_wechat();
                break;
            case 11:
                payType = "收益提现-到银行卡";
                payTypeImg = record_bank();
                break;
        }

        //状态判断
        const statusText = this._getStatusText(item.status);
        const statusColor = item.status == 1 ? "#63DA2B" : "#F74141";

        const desc = `${StringUtil.formatMoney(Math.floor(item.money) / 100)}元`;
        const time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');


        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(70),
                    paddingHorizontal: DesignConvert.getW(15),
                    flexDirection: "row",
                    alignItems: 'center',
                }}>

                {/* <Image
                    resizeMode="contain"
                    source={payTypeImg}
                    style={{
                        width: DesignConvert.getW(39),
                        height: DesignConvert.getH(39),
                        marginRight: DesignConvert.getW(11),
                    }}
                ></Image> */}
                <Text
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(15),
                        top: DesignConvert.getH(43),

                        color: statusColor,
                        fontSize: DesignConvert.getF(11),
                        fontWeight: "normal",
                    }}>
                    {statusText}
                </Text>
                <Text
                    numberOfLines={1}
                    style={{

                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(15),

                        color: "#121212",
                        fontSize: DesignConvert.getF(14),
                    }}>
                    {payType}
                </Text>
                <Text
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(43),

                        color: '#999999',
                        fontSize: DesignConvert.getF(11),
                        fontWeight: 'normal',
                    }}
                >{time}</Text>
                <Text
                    style={{

                        position: 'absolute',
                        right: DesignConvert.getW(15),
                        top: DesignConvert.getH(15),

                        color: "#333333",
                        fontSize: DesignConvert.getF(15),
                    }}
                >{desc}</Text>

            </View>
        )
    }
}