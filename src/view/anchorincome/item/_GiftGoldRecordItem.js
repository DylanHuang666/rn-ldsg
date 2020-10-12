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

export default class _GiftGoldRecordItem extends PureComponent {


    render() {
        const item = this.props.item;

        const Img = record_coin();
        //状态判断
        const statusText = item.statusMsg;
        const statusColor = item.statusMsg.indexOf("成功") != -1 ? "#34F1D5" : "#FF5D5D";

        const recevierName = decodeURIComponent(item.targetBase.nickName)

        const recevierAvatar = { uri: Config.getHeadUrl(item.targetBase.userId, item.targetBase.logoTime, item.targetBase.thirdIconurl) }

        const desc = `${item.goldShell}`;
        const desc2 = ` ID:${item.targetId}`;
        const time = moment(item.recordDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');


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
                        top: DesignConvert.getH(15),
                        left: DesignConvert.getW(15),

                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: "#000000",
                            fontSize: DesignConvert.getF(14),
                            lineHeight: DesignConvert.getH(20),
                        }}
                    >转赠</Text>
                    <Image
                        source={recevierAvatar}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(20),

                            borderRadius: DesignConvert.getW(30),

                            marginHorizontal: DesignConvert.getW(2)

                        }}
                    />
                    <Text
                        numberOfLines={1}
                        style={{
                            color: "#000000",
                            fontSize: DesignConvert.getF(14),
                            lineHeight: DesignConvert.getH(20),

                            maxWidth: DesignConvert.getW(80)
                        }}
                    >{recevierName}</Text>
                    <Text
                        style={{
                            color: "#000000",
                            fontSize: DesignConvert.getF(14),
                            lineHeight: DesignConvert.getH(20),
                        }}
                    >{desc2}</Text>
                </View>
                <Text
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(43),

                        color: '#949494',
                        fontSize: DesignConvert.getF(11),
                    }}
                >{time}</Text>
                <View
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(15),
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

                            marginRight: DesignConvert.getW(5)
                        }}
                    />
                    <Text
                        style={{


                            color: '#121212',
                            fontSize: DesignConvert.getF(14),
                            fontWeight: 'bold'
                        }}
                    >{desc}</Text>
                </View>

                <Text
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(15),
                        top: DesignConvert.getH(43),


                        color: statusColor,
                        fontSize: DesignConvert.getF(11),
                    }}>
                    {statusText}
                </Text>



            </View>
        )
    }
}