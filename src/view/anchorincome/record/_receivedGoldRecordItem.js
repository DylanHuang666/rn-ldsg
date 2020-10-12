/*
 * @Author: 
 * @Date: 2020-10-07 11:16:43
 * @LastEditors: your name
 * @LastEditTime: 2020-10-09 11:16:07
 * @Description: file content
 */
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

export default class _receivedGoldRecordItem extends PureComponent {


    render() {
        const item = this.props.item;

        const Img = record_coin();
        //状态判断
        const statusText = item.statusMsg;
        const statusColor = item.statusMsg.indexOf("成功") != -1 ? "#8CE12F" : "#F74141";

        const desc = `${item.goldShell}`;
        const desc2 = `赠送ID：${item.sourceId}`;
        const time = moment(item.recordDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');

        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: DesignConvert.swidth,
                height: DesignConvert.getH(70),
                paddingHorizontal: DesignConvert.getW(15)
            }}>
                <View style={{
                    flex: 1
                }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: 'rgba(255, 255, 255, 1)',
                            fontSize: DesignConvert.getF(14),
                            fontWeight: "normal",
                            marginTop: DesignConvert.getH(15),
                            marginBottom: DesignConvert.getH(5)
                            // alignSelf: 'center',
                            // marginRight: DesignConvert.getH(5),
                        }}>
                        {desc2}
                    </Text>

                    <Text
                        style={{
                            color: 'rgba(109, 109, 109, 1)',
                            fontSize: DesignConvert.getF(11),
                            fontWeight: 'normal',
                            // alignSelf: 'center',
                        }}
                    >{time}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image
                        resizeMode="contain"
                        source={record_jb()}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(20),
                            marginRight: DesignConvert.getW(5),
                        }}
                    ></Image>
                    <Text style={{
                        color: "rgba(255, 255, 255, 1)",
                        fontSize: DesignConvert.getF(14),
                        fontWeight: "bold",
                    }}>{desc}</Text>
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