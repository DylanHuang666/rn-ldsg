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

export default class _FlowRecordItem extends PureComponent {
    _renderImage(imageUri) {
        if (imageUri) {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            color: '#999999',
                            fontSize: DesignConvert.getF(11),
                            fontWeight: 'normal',
                            alignSelf: 'center',
                            marginRight: DesignConvert.getW(2),
                        }}
                    >来自</Text>

                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: DesignConvert.getW(22),
                            height: DesignConvert.getH(22),
                            borderRadius: DesignConvert.getW(22),
                            marginRight: DesignConvert.getW(1),
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

    render() {
        const item = this.props.item;
        const giftImg = { uri: Config.getGiftUrl(item.giftId, item.giftLogoTime) };

        const content = item.content;
        const desc = `+${StringUtil.formatMoney(Math.floor(item.recv) / 100)}元`;
        const nickName = decodeURI(item.sendUserBase.nickName);
        const time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        //头像
        const headUrl = Config.getHeadUrl(item.sendUserBase.userId, item.sendUserBase.logoTime, item.sendUserBase.thirdIconurl);


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
                            <Image
                                resizeMode="contain"
                                source={giftImg}
                                style={{
                                    width: DesignConvert.getW(22),
                                    height: DesignConvert.getH(22),
                                    marginRight: DesignConvert.getW(5),
                                }}
                            ></Image>

                            <Text
                                style={{
                                    color: "#333333",
                                    fontSize: DesignConvert.getF(15),
                                    fontWeight: "normal",
                                }}
                            >{content}</Text>
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
                                color: "#333333",
                                fontSize: DesignConvert.getF(15),
                                fontWeight: "normal",
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

                        {this._renderImage(headUrl)}

                        <Text
                            numberOfLines={1}
                            style={{
                                flex: 1,
                                color: '#141414',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: "normal",
                                alignSelf: 'center',
                                marginRight: DesignConvert.getH(5),
                            }}>
                            {nickName}
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