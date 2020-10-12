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

export default class _ExchangeRecordItem extends PureComponent {


    render() {
        const item = this.props.item;

        const Img = record_coin();
        //状态判断
        const statusText = item.type == 1 ? '兑换成功' : "兑换失败";
        const statusColor = item.type == 1 ? "#34F1D5" : "#FF5D5D";

        const desc = `${item.goldShell}`;
        const desc2 = `兑换ID：${item.targetId}`;
        const time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');

        const money = -desc / 10


        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(70),
                    paddingHorizontal: DesignConvert.getW(15),
                    flexDirection: "row",
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(15),

                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        resizeMode="contain"
                        source={Img}
                        style={{
                            width: DesignConvert.getW(18),
                            height: DesignConvert.getH(18),
                            marginRight: DesignConvert.getW(5),
                        }}
                    />
                    <Text
                        style={{
                            color: "#121212",
                            fontSize: DesignConvert.getF(14),
                            fontWeight: "bold",
                        }}
                    >{desc}</Text>
                </View>
                <Text
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(15),
                        top: DesignConvert.getH(15),

                        color: "#121212",
                        fontSize: DesignConvert.getF(14),
                    }}
                >{money}</Text>
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
                        top: DesignConvert.getH(43),

                        color: statusColor,
                        fontSize: DesignConvert.getF(11),
                        fontWeight: "normal",
                    }}>
                    {statusText}
                </Text>
                {/* 
                <Text
                    numberOfLines={1}
                    style={{
                        flex: 1,
                        color: '#999999',
                        fontSize: DesignConvert.getF(11),
                        fontWeight: "normal",
                        alignSelf: 'center',
                        marginRight: DesignConvert.getH(5),
                    }}>
                    {desc2}
                </Text> */}
            </View>
        )
    }
}