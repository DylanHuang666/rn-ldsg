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

export default class _exchangeRecordItem extends PureComponent {


    render() {
        const item = this.props.item;
        
        const Img = record_coin();
        //状态判断
        const statusText = item.type == 1 ? '兑换成功' : "兑换失败";
        const statusColor = item.type == 1 ? "#8CE12F" : "#F74141";

        const desc = `${item.goldShell}${COIN_NAME}`;
        const desc2 = `${COIN_NAME}发放ID：${item.targetId}`;
        const time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');

        const _last =item.last;


        return (
            <View
                style={{
                    
                    flexDirection: "row",
                    alignItems: 'center',

                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(75),
                    paddingHorizontal: DesignConvert.getW(10),

                    backgroundColor:'rgba(255,255,255,0.16)',
                    borderBottomLeftRadius:_last?DesignConvert.getW(10):0,
                    borderBottomRightRadius:_last?DesignConvert.getW(10):0,
                }}>

                {/* <Image
                    resizeMode="contain"
                    source={Img}
                    style={{
                        width: DesignConvert.getW(39),
                        height: DesignConvert.getH(39),
                        marginRight: DesignConvert.getW(11),
                    }}
                ></Image> */}

                <View
                    style={{
                        
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: "center",

                        height: DesignConvert.getH(40),
                        
                       
                    }}
                >
                    <View
                        style={{
                            
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',

                            height: DesignConvert.getH(20),
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
                                    color: "#FFFFFF",
                                    fontSize: DesignConvert.getF(14),
                                    fontWeight: "Bold",
                                }}>
                                {desc}
                            </Text>
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
                                    color: '#FFFFFF',
                                    fontSize: DesignConvert.getF(14),
                                    fontWeight: "Bold",
                                }}
                            >{statusText}</Text>
                        

                    </View>

                    <View
                        style={{
                            
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems:'center',
                            
                            height: DesignConvert.getH(15),
                            marginTop: DesignConvert.getH(5),

                            
                        }}>

                        <Text
                            numberOfLines={1}
                            style={{
                                flex: 1,
                                alignSelf: 'center',

                                color: 'rgba(255,255,255,0.6)',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: "normal",
                                
                            }}>
                            {desc2}
                        </Text>

                        <Text
                            style={{ 
                                
                                alignSelf: 'center',
                                
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: 'normal',
                               
                            }}
                        >{time}</Text>
                    </View>

                </View>

                {_last?
                    null
                    :
                    <View
                        style={{
                            
                            position: "absolute",
                            bottom: 0,
                            left: DesignConvert.getW(10),

                            width: DesignConvert.getW(335),
                            height: DesignConvert.getH(1),
                            
                            backgroundColor: 'rgba(255,255,255,0.16)',
                            
                    }}></View>
                }
            </View>
        )
    }
}