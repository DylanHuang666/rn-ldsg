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

export default class _withdrawRecordItem extends PureComponent {

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
        switch(item.payType) {
            case 1:
                payType = "支付宝";
                payTypeImg = record_alipay();;
                break;
            case 4:
                payType = "微信";
                payTypeImg = record_wechat();
                break;
            case 11:
                payType = "银行卡";
                payTypeImg = record_bank();
                break;
        }

        //状态判断
        const statusText = this._getStatusText(item.status);
        const statusColor = item.status == 1 ? "#8CE12F" : "#F74141";

        const desc = `${StringUtil.formatMoney(Math.floor(item.money) / 100)}元`;
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
                            {payType}
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
                        >{desc}</Text>
                    

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
                        {time}
                    </Text>

                    <Text
                        style={{
                            
                            alignSelf: 'center',

                            color: 'rgba(255,255,255,0.6)',
                            fontSize: DesignConvert.getF(11),
                            fontWeight: 'normal',
                            
                        }}
                    >{statusText}</Text>
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