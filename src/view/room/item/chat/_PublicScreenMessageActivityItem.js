'use strict';

import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text, Image, Platform, PixelRatio } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import HGlobal, { COIN_NAME, ESex_Type_MALE } from "../../../../hardcode/HGLobal";
import LinearGradient from "react-native-linear-gradient";
import Config from "../../../../configs/Config";
import { ic_gold } from "../../../../hardcode/skin_imgs/main";

export default class _PublicScreenMessageActivityItem extends PureComponent {

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
        // console.log('ssssssssssssssssssssss', this.props.item)
        const bWorld = this.props.item.isWorld;
        const smashUserName = decodeURIComponent(this.props.item.vo.data.smashUserBase.nickName);
        const smashUserIsMale = this.props.item.vo.data.smashUserBase.sex == ESex_Type_MALE;
        const giftNum = this.props.item.vo.giftVo.num
        const giftUrl = Config.getGiftUrl(this.props.item.vo.giftVo.giftId, this.props.item.vo.giftVo.alterdatetime)

        const minPrice = 0;//todo 这个需要数值
        const bubbletext = this.props.item.vo.bubbletext
        const bubblestylemedia = this.props.item.vo.bubblestylemedia
        const imgUri = { uri: Config.getActivityImageUrl(bubblestylemedia) }


        const userName = smashUserName.length > 5 ? smashUserName.slice(0, 5) + '...' : smashUserName
        const giftName = this.props.item.vo.giftVo.name;
        const price = this.props.item.vo.giftVo.price ? `${this.props.item.vo.giftVo.price}` : "";
        const extraPrice = this.props.item.vo.data.activityValue ? `${this.props.item.vo.data.activityValue}` : "";

        // console.log('kankankan', bubbletext, bubblestylemedia)
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#AA00FF00", "#FF527400", "#FFDB0000"]}
                style={{
                    marginBottom: DesignConvert.getH(10),

                    width: DesignConvert.getW(255),
                    height: DesignConvert.getH(53),

                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    // flexWrap: 'wrap',
                    // alignItems: "center",

                    // borderRadius: DesignConvert.getW(5),

                    paddingHorizontal: DesignConvert.getW(10),
                    paddingVertical: DesignConvert.getH(10),

                    flexDirection: 'row',
                    flexWrap: 'wrap'
                }}
            >
                <Image
                    source={imgUri}
                    style={{
                        width: DesignConvert.getW(255),
                        height: DesignConvert.getH(53),
                        position: 'absolute',
                        resizeMode: 'contain'
                    }}
                />

                <Text
                    style={{
                        color: smashUserIsMale ? '#FFFFFF' : '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >{bubbletext.format(userName, giftName, price, extraPrice)}</Text>
                {/* <Text
                    style={{
                        color: smashUserIsMale ? '#FFFFFF' : '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >恭喜</Text>
                <Text
                    numberOfLine={1}
                    style={{
                        color: smashUserIsMale ? '#FFFFFF' : '#FFFFFF',
                        fontSize: DesignConvert.getF(12),

                        maxWidth: DesignConvert.getW(80),
                    }}
                >{smashUserName}</Text>

                <Text
                    style={{
                        color: smashUserIsMale ? '#FFFFFF' : '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >{HGlobal.EGG_ACTION}中</Text>

                <Text
                    style={{
                        color: smashUserIsMale ? '#FFFFFF' : '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >{giftName}, </Text>
                <Text
                    style={{
                        color: smashUserIsMale ? '#FFFFFF' : '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >价值{price}, </Text>
                <Text
                    style={{
                        color: smashUserIsMale ? '#FFFFFF' : '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >额外获得{COIN_NAME}{price}!</Text> */}
                {/* <Image
                    style={{
                        width: DesignConvert.getW(25),
                        height: DesignConvert.getH(25),
                        resizeMode: 'contain'
                    }}
                    source={{ uri: giftUrl }}
                /> */}

            </LinearGradient>
        )


    }
}
