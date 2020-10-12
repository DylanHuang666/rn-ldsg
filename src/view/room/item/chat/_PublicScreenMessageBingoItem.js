'use strict';

import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text, Image, Platform, ImageBackground } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import HGlobal, { COIN_NAME, ESex_Type_MALE } from "../../../../hardcode/HGLobal";
import LinearGradient from "react-native-linear-gradient";
import Config from "../../../../configs/Config";
import MedalWidget from "../../../userinfo/MedalWidget";
import {
    room_chat_egg_bg
} from '../../../../hardcode/skin_imgs/room_gift';


export default class _PublicScreenMessageBingoItem extends PureComponent {

    _onSender = () => {
        const userbase = this.props.item.vo.data.smashUserBase
        require('../../../../model/room/RoomUserClickModel').onClickUser(userbase.userId, decodeURIComponent(userbase.nickName))
    }


    render() {

        //砸蛋结果广播
        // message SmashEggResultBroadcast {
        // 	optional UserResult.UserBase smashUserBase = 1;// 砸蛋用户信息
        // 	repeated ReceiveGiftInfo giftList = 2;//中奖礼物列表
        // 	optional int32 broadcastType = 3;//播放类型:0公屏显示,1房间跑道,2全服跑道,3:全服公屏流水
        // 	optional int32 action = 4;//砸蛋动作(0:自动砸,1:单砸,10:十砸,100:百砸)	
        //     optional string eggType = 5; //蛋的类型(1:铁蛋 2:银蛋 3:金蛋) 
        //     optional string roomId = 6; //砸蛋所在房间Id	
        //     optional string roomName = 7; //砸蛋所在房间名称
        // }

        // 礼物信息
        // message ReceiveGiftInfo {
        // 	required string giftId = 1;//礼物ID
        // 	required int64 num = 2;//数量
        // 	required int32 price = 3;//价格(用户排序用)
        // 	optional string name = 4;//名称
        // }

        //获取玩家基本信息
        // message UserBase {
        // 	required string userId = 1;//用户ID
        // 	optional string nickName = 2;//用户昵称
        // 	optional int32 logoTime = 3;//修改logo的时间 0为没修改过
        // 	optional string thirdIconurl = 4;//第三方头像
        // 	optional string headFrameId = 5;// 头像框
        // 	optional int32 sex = 6; // 姓别 0 未知 1:男 2:女
        //     optional int32 age = 7; //年龄
        //     optional int32 vipLv = 8; //VIP等级
        // 	optional string slogan = 9;//
        // 	optional int32 contributeLv = 10;// 土豪等级
        // 	optional string position = 11;//地标
        // 	optional string channelId = 12;//用户渠道id
        // 	optional int32 friendStatus = 13;// 好友状态
        // }

        // *  data: SmashEggResultBroadcast,
        // *  giftVo: ReceiveGiftInfo,

        const bWorld = this.props.item.isWorld;
        const smashUserHead = { uri: Config.getHeadUrl(this.props.item.vo.data.smashUserBase.userId, this.props.item.vo.data.smashUserBase.logoTime, this.props.item.vo.data.smashUserBase.thirdIconurl) }
        const smashUserName = decodeURIComponent(this.props.item.vo.data.smashUserBase.nickName);
        const smashUserIsMale = this.props.item.vo.data.smashUserBase.sex == ESex_Type_MALE;
        const smashUserContributeLv = this.props.item.vo.data.smashUserBase.contributeLv ? this.props.item.vo.data.smashUserBase.contributeLv : -1;
        const smashUserCharmLv = this.props.item.vo.data.smashUserBase.charmLv ? this.props.item.vo.data.smashUserBase.charmLv : -1;

        const giftName = this.props.item.vo.giftVo.name;
        const giftNum = this.props.item.vo.giftVo.num

        const price = this.props.item.vo.giftVo.price ? `(${this.props.item.vo.giftVo.price}${COIN_NAME})` : "";
        const giftUrl = Config.getGiftUrl(this.props.item.vo.giftVo.giftId, this.props.item.vo.giftVo.alterdatetime)

        const minPrice = 0;//todo 这个需要数值

        // if (Platform.OS === 'android') {

        //     return (
        //         <LinearGradient
        //             start={{ x: 0, y: 0 }}
        //             end={{ x: 1, y: 0 }}
        //             colors={['#FF51BF', '#D170FF']}
        //             style={{
        //                 marginTop: DesignConvert.getH(5),
        //                 marginBottom: DesignConvert.getH(5),
        //                 maxWidth: DesignConvert.getW(260),
        //                 flexDirection: 'row',
        //                 justifyContent: 'flex-start',
        //                 flexWrap: 'wrap',
        //                 alignItems: 'baseline',
        //                 borderRadius: DesignConvert.getW(20),
        //                 padding: DesignConvert.getW(8),
        //             }}
        //         >

        //             <Text
        //                 style={{
        //                     flexWrap: 'wrap',
        //                     // borderLeftWidth: DesignConvert.getW(1),
        //                     // borderTopWidth: DesignConvert.getH(2),
        //                     // borderRightWidth: DesignConvert.getW(1),
        //                     // borderBottomWidth: DesignConvert.getH(2),
        //                     flexDirection: 'row',
        //                     justifyContent: 'flex-start',
        //                     fontSize: DesignConvert.getF(10),
        //                     color: '#FFFFFF',
        //                     // alignItems: 'center',
        //                 }}
        //             >
        //                 {
        //                     bWorld
        //                         ? (
        //                             '【喜提全服】 恭喜 '
        //                         )
        //                         : (
        //                             ' 恭喜 '
        //                         )
        //                 }


        //                 <Text
        //                     onPress={this._onSender}
        //                     style={{
        //                         color: smashUserIsMale ? "#FFFFFF" : "#FFFFFF",
        //                         fontSize: DesignConvert.getF(10),
        //                     }}
        //                 >{smashUserName}</Text>

        //                 {HGlobal.EGG_ACTION_NAME}
        //                 {`获得 `}
        //                 {giftName}
        //                 {`(${price})`}
        //                 {`x${giftNum}`}
        //                 <Image
        //                     style={{
        //                         width: DesignConvert.getW(18),
        //                         height: DesignConvert.getH(18),
        //                         resizeMode: 'cover'
        //                     }}
        //                     source={{ uri: giftUrl }}
        //                 />
        //             </Text>
        //         </LinearGradient>
        //     )

        // }

        return (
            <View
                style={{
                    marginBottom: DesignConvert.getH(10),
                    marginLeft: DesignConvert.getW(5),
                    width: DesignConvert.getW(290),

                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>

                <TouchableOpacity
                    onPress={this._onSender}
                >
                    <Image
                        source={smashUserHead}
                        style={{
                            width: DesignConvert.getW(35),
                            height: DesignConvert.getH(35),
                            borderRadius: DesignConvert.getW(21),
                        }}
                    />
                </TouchableOpacity>

                <View
                    style={{
                        marginLeft: DesignConvert.getH(10)
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>

                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(12),

                                marginRight: DesignConvert.getH(5)
                            }}
                            onPress={this._onSender}
                        >{smashUserName}</Text>

                        <MedalWidget
                            richLv={smashUserContributeLv}
                            charmLv={smashUserCharmLv}
                        />
                    </View>

                    <ImageBackground
                        resizeMode="contain"
                        source={room_chat_egg_bg()}
                        style={{
                            flexDirection: 'row',
                            alignItems: "center",

                            width: DesignConvert.getW(230),
                            height: DesignConvert.getH(46),

                            marginTop: DesignConvert.getH(5)
                        }}>
                        <Text
                            style={{
                                flex: 1,
                                height: DesignConvert.getH(33),

                                color: 'white',
                                fontSize: DesignConvert.getF(12),

                                marginLeft: DesignConvert.getW(10),
                                marginRight: DesignConvert.getW(5),
                            }}>

                            {`在`}

                            <Text
                                style={{
                                    color: '#F7FF89',
                                    fontSize: DesignConvert.getF(12),
                                }}>
                                {HGlobal.EGG_ACTION_NAME}
                            </Text>

                            {`获得`}

                            {giftName}

                            {price}

                            {`*${giftNum}`}
                        </Text>

                        <Image
                            source={{ uri: giftUrl }}
                            style={{
                                width: DesignConvert.getW(29),
                                height: DesignConvert.getH(29),

                                marginRight: DesignConvert.getW(5),
                            }}
                        />
                    </ImageBackground>
                </View>

            </View>
        )

    }
}
