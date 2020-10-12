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
import { duration2Time } from '../../../utils/CDTick';

export default class _phoneLiveItem extends PureComponent {


    /**
     * {
          "id": "5ef073000b6f980fc7b497c1",
          "anchor": {
            "userId": "36744591",
            "nickName": "%E6%B8%B8%E5%AE%A2%C2%B7%E9%9B%B6%E6%A0%80_%E5%BF%83%E6%81%8D1%E5%AE%88%E6%8A%A4%E7%A5%9E",
            "logoTime": 77751589,
            "thirdIconurl": "562",
            "sex": 1,
            "age": 18,
            "vipLv": 0,
            "slogan": "%E8%B0%81%E8%AF%B4%E6%88%91%E6%87%92%E4%BA%86%E3%80%82%E6%88%91%E5%91%8A%E8%AF%89%E4%BD%A0%E4%BB%AC%EF%BC%8C%E6%88%91%E5%AF%B9%E4%BA%8E%E5%90%83%E6%98%AF%E5%BE%88%E5%8B%A4%E5%BF%AB%E7%9A%84%E3%80%82%E5%A4%9A%E5%A5%BD%E5%A4%9A%E5%A5%BD%E7%9A%84%E6%89%A5%E7%AD%89%E4%BD%A0%E9%83%BD%E4%BC%9A%E8%A7%89%E5%BE%97%E7%94%B7%E7%9A%84%E5%A5%B3%E7%9A%84%E6%83%B3%E5%90%AB",
            "contributeLv": 109,
            "position": "湛江",
            "charmLv": 10
          },
          "caller": {
            "userId": "1001141",
            "nickName": "%E6%98%9F%E5%85%8932898",
            "logoTime": 0,
            "thirdIconurl": "148",
            "sex": 1,
            "age": 23,
            "vipLv": 0,
            "slogan": "%E5%BC%BA%E6%89%AD%E7%9A%84%E7%93%9C%E4%B8%8D%E7%94%9C",
            "contributeLv": 1,
            "position": "揭阳",
            "charmLv": 1
          },
          "chatTime": 23,
          "logTime": "2020-06-22 16:59:44"
        }
     */
    render() {
        const item = this.props.item;

        //对方
        const otherUserBean = item.anchor.userId == UserInfoCache.userId ? item.caller : item.anchor;

        const Img = { uri: Config.getHeadUrl(otherUserBean.userId, otherUserBean.logoTime, otherUserBean.thirdIconurl) };
        const nickName = decodeURI(otherUserBean.nickName);

        let desc;
        if(item.anchor.userId == UserInfoCache.userId) {
            //如果是主播
            desc = `+${item.totalMoney ? StringUtil.formatMoney(Math.floor(item.totalMoney) / 100) : "0.00"}元`;
        }else {
            desc = `-${item.totalMoney ? item.totalMoney : "0"}${COIN_NAME}`;
        }
        
        const desc2 = `通话时长 ${duration2Time(item.chatTime)}`;
        const time = item.logTime;


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
                        width: DesignConvert.getW(39),
                        height: DesignConvert.getH(39),
                        borderRadius: DesignConvert.getH(39),
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

                            <Text
                                style={{
                                    color: "#333333",
                                    fontSize: DesignConvert.getF(15),
                                    fontWeight: "normal",
                                }}
                            >{nickName}</Text>
                        </View>

                        <Text
                            style={{
                                color: "#333333",
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
                                color: '#999999',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: "normal",
                                alignSelf: 'center',
                                marginRight: DesignConvert.getH(5),
                            }}>
                            {desc2}
                        </Text>

                        <Text
                            style={{
                                color: '#999999',
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
                        backgroundColor: "#F0F0F0",
                        position: "absolute",
                        right: DesignConvert.getW(15),
                        bottom: 0,
                    }}></View>
            </View>
        )
    }
}