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

export default class _liveFlowRecordItem extends PureComponent {


    render() {
        const item = this.props.item;
        
        //状态判断
        const recordDate = item.recordDate;
        const desc = `${StringUtil.formatMoney(Math.floor(item.money) / 100)}元`
        
        const _last =item.last;



        return (
            <View
                style={{
                    
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',

                    width:  DesignConvert.getW(345),
                    height: DesignConvert.getH(60),
                    paddingLeft: DesignConvert.getW(10),
                    paddingRight: DesignConvert.getW(10),

                    backgroundColor:'rgba(255,255,255,0.16)',
                    borderBottomLeftRadius:_last?DesignConvert.getW(10):0,
                    borderBottomRightRadius:_last?DesignConvert.getW(10):0,

                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            flex: 1,

                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(14),
                            fontWeight: "Bold",
                        }}
                    >{recordDate}</Text>

                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: DesignConvert.getF(14),
                            fontWeight: "Bold",
                        }}
                    >{desc}</Text>

                </View>

                {/* <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: DesignConvert.getH(5),
                    }}>

                    <Text
                        style={{
                            flex: 1,
                            color: '#999999',
                            fontSize: DesignConvert.getF(13),
                            fontWeight: 'normal',
                            alignSelf: 'center',
                        }}
                    >{""}</Text>

                    <Text
                        style={{
                            color: '#999999',
                            fontSize: DesignConvert.getF(13),
                            fontWeight: 'normal',
                            alignSelf: 'center',
                        }}
                    >{""}</Text>
                </View> */}
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