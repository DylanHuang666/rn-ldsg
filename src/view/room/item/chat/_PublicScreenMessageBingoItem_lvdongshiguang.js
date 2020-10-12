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



    return (
      <View
        style={{
          marginBottom: DesignConvert.getH(10),
          marginLeft: DesignConvert.getW(5),

          width: DesignConvert.getW(261),
          height: DesignConvert.getH(63.5),

          paddingLeft: DesignConvert.getW(10),
          paddingRight: DesignConvert.getW(58),
          paddingTop: DesignConvert.getH(14),

          flexDirection: 'row',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
        }}>

        <Image
          source={room_chat_egg_bg()}
          style={{
            position: 'absolute',

            width: DesignConvert.getW(261),
            height: DesignConvert.getH(63.5),
          }}
        />
        <Text
          numberOfLines={1}
          style={{
            maxWidth: DesignConvert.getW(70),

            color: '#FFCC85FF',
            fontSize: DesignConvert.getF(12),
          }}
          onPress={this._onSender}
        >{smashUserName}</Text>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: DesignConvert.getF(12),
          }}>{`在`}{HGlobal.EGG_ACTION_NAME}{`中获得`}

         
        </Text>
        <Text
          style={{

            color: '#FFCC85FF',
            fontSize: DesignConvert.getF(12),
          }}
          onPress={this._onSender}
        >{giftName}</Text>
        <Text
          style={{

            color: '#FFCC85FF',
            fontSize: DesignConvert.getF(12),
          }}
          onPress={this._onSender}
        >{price}</Text>
          <Text
          style={{

            color: '#FFCC85FF',
            fontSize: DesignConvert.getF(12),
          }}
          onPress={this._onSender}
        > {`x${giftNum}`}</Text>
        <Image
          source={{ uri: giftUrl }}
          style={{
            position: 'absolute',
            right: DesignConvert.getW(10),
            top: DesignConvert.getH(15),

            width: DesignConvert.getW(34),
            height: DesignConvert.getH(34),

          }}
        />
      </View>
    )

  }
}
