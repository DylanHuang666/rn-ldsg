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

export default class _flowRecordItem extends PureComponent {
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
                            
                            alignSelf: 'center',
                            marginRight:DesignConvert.getW(2),

                            color: 'rgba(255,255,255,0.6)',
                            fontSize: DesignConvert.getF(11),
                            fontWeight: 'normal',
                           
                           
                        }}
                    >来自</Text>

                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: DesignConvert.getW(15),
                            height: DesignConvert.getH(15),
                            marginRight:DesignConvert.getW(2),
                            
                            borderRadius: DesignConvert.getW(12),
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
        const desc = `+${StringUtil.formatMoney(Math.floor(item.recv) / 100)}`;
        const nickName = decodeURI(item.sendUserBase.nickName);
        const time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        //头像
        const headUrl = Config.getHeadUrl(item.sendUserBase.userId, item.sendUserBase.logoTime, item.sendUserBase.thirdIconurl);
        
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
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: DesignConvert.getF(14),
                                    fontWeight: "bold",
                                }}
                            >{content}</Text>
                        </View>

                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(14),
                                fontWeight: "bold",
                            }}>
                            {desc}
                        </Text>

                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems:'center',

                            height: DesignConvert.getH(15),
                            marginTop: DesignConvert.getH(5),
                           
                        }}>

                        {this._renderImage(headUrl)}

                        <Text
                            numberOfLines={1}
                            style={{
                                flex: 1,
                                alignSelf: 'center',

                                marginRight: DesignConvert.getH(5),

                                color: 'rgba(255,255,255,0.6)',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: "normal",
                               
                                
                            }}>
                            {nickName}
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