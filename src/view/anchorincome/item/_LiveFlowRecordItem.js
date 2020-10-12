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
// import { record_alipay, record_bank, record_wechat, record_cash, record_coin, record_gift } from '../../../hardcode/skin_imgs/record';

export default class _LiveFlowRecordItem extends PureComponent {


    render() {
        const item = this.props.item;

        // const Img = record_gift();
        //状态判断
        const recordDate = item.recordDate;
        const desc = `${StringUtil.formatMoney(Math.floor(item.money) / 100)}元`
        console.log('直播间流水', item)

        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(70),
                    paddingHorizontal: DesignConvert.getW(15),
                    flexDirection: "row",
                    alignItems: 'center',
                }}
            >
                {/* <Image
                    resizeMode="contain"
                    // source={Img}
                    style={{
                        width: DesignConvert.getW(29),
                        height: DesignConvert.getH(29),
                        marginRight: DesignConvert.getW(15),
                    }}
                ></Image> */}



                <Text
                    style={{

                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(43),

                        color: "#949494",
                        fontSize: DesignConvert.getF(11),
                        fontWeight: "normal",
                    }}
                >{recordDate}</Text>


                <Text
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(15),
                        top: DesignConvert.getH(15),

                        color: "#121212",
                        fontSize: DesignConvert.getF(14),
                    }}
                >礼物收入</Text>

                <Text
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(15),
                        top: DesignConvert.getH(15),

                        color: "#121212",
                        fontSize: DesignConvert.getF(14),
                        fontWeight: "bold",
                    }}
                >{desc}</Text>
                {/* <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: DesignConvert.getH(5),
                        }}>

                        <Text
                            style={{
                                flex: 1,
                                color: '#FFFFFF99',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: 'normal',
                                alignSelf: 'center',
                            }}
                        >{""}</Text>

                        <Text
                            style={{
                                color: '#FFFFFF99',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: 'normal',
                                alignSelf: 'center',
                            }}
                        >{""}</Text>
                    </View> */}


            </View>
        )
    }
}