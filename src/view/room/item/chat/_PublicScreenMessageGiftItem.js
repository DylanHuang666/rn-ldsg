'use strict';

import React, { PureComponent } from "react";
import { Image, Text, View, Platform, ImageBackground, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { TYPE_GIFT } from "../../../../cache/RoomPublicScreenCache";
import { ESex_Type_MALE, COIN_NAME } from "../../../../hardcode/HGLobal";
import DesignConvert from "../../../../utils/DesignConvert";
import Config from "../../../../configs/Config";
import {
  room_chat_gift_bg
} from '../../../../hardcode/skin_imgs/room_gift';
import MedalWidget from "../../../userinfo/MedalWidget";


export default class _PublicScreenMessageGiftItem extends PureComponent {

  _onSender = () => {
    require('../../../../model/room/RoomUserClickModel').onClickUser(this.props.item.data.fromUserBase.userId, '')
  }

  _onReciever = () => {
    if (this.props.type == TYPE_GIFT) {
      require('../../../../model/room/RoomUserClickModel').onClickUser(this.props.item.receiverInfo.toUserId, '')
    }
  }

  render() {
    // 房间送礼物广播通知
    // message LiveRoomSendGiftsBroadcast {
    // 	required UserResult.UserBase fromUserBase = 1;// 送礼用户Id
    // 	//required string fromNickName = 2;// 送礼用户昵称
    // 	required string giftId = 2;//赠送的礼物ID
    // 	required int32 giftNum = 3;//赠送的礼物数量
    // 	optional int32 fromCharmLevel = 4;// 送礼用户魅力等级
    // 	optional int32 fromContributeLevel = 5;// 送礼用户土豪等级
    // 	optional string roomId = 6;//房间ID
    // 	repeated LiveRoomGiftReceiverInfo receiverInfos = 7;//房间礼物接收者数据数组
    // 	optional int32 groupNum = 8;//礼物分组数量，默认1
    // 	optional int32 charm = 9;// 当前房间日贡献值:已无用
    // 	optional int32 broadcastType = 10;//播放类型:0默认普通播放,1房间跑道,2全服跑道
    // 	optional string roomName = 11;//房间名字(2全服跑道时传值)
    // 	optional string boxId = 12;//赠送的宝箱ID
    // 	optional int64 contribute = 13;// 当前房间日贡献值
    // 	optional bool roomAll = 14;//是否全房间
    // 	optional int64 newContribute = 15;// 当前房间日新贡献值(神豪值)
    // 	optional int32 price = 16;// 礼物单价(金贝数)
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

    //房间礼物接收者数据
    // message LiveRoomGiftReceiverInfo {
    // 	required string toUserId = 1;// 接收用户Id
    // 	required string toNickName = 2;// 接收用户昵称
    // 	optional int32 toCharmLevel = 3;// 接收用户魅力等级
    // 	optional int32 toContributeLevel = 4;// 接收用户土豪等级
    // 	optional int64 toHeartValue = 5;// 接收用户交友心动值
    // 	optional int32 toSex = 6;//接收用户性别
    // }

    // "keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]

    // *      data : LiveRoomSendGiftsBroadcast,
    // *      receiverInfo: LiveRoomGiftReceiverInfo,
    // *      giftData: CS_GiftList,
    const senderHead = { uri: Config.getHeadUrl(this.props.item.data.fromUserBase.userId, this.props.item.data.fromUserBase.logoTime, this.props.item.data.fromUserBase.thirdIconurl) }
    const senderName = decodeURIComponent(this.props.item.data.fromUserBase.nickName);
    const senderContributeLv = this.props.item.data.fromUserBase.fromContributeLevel
    const senderCharmLv = this.props.item.data.fromUserBase.fromCharmLv ? this.props.item.data.fromUserBase.fromCharmLv : -1
    let recieverName
    let recieverIsMale

    if (this.props.type == TYPE_GIFT) {
      recieverIsMale = this.props.item.receiverInfo.toSex == ESex_Type_MALE;
      recieverName = decodeURIComponent(this.props.item.receiverInfo.toNickName);

    } else {
      recieverIsMale = true
      recieverName = '全麦'

    }
    const boxDrawable = this.props.item.giftData;// ? ({ uri: Config.getGiftUrl(this.props.item.giftData.giftid, this.props.item.giftData.alterdatetime) }) : null;
    const giftName = this.props.item.giftData ? this.props.item.giftData.giftname : '';
    const bShowPrice = true;//todo 暂时写死显示吧
    const giftPrice = this.props.item.data.price;
    const groupNum = this.props.item.data.groupNum;
    const giftNum = this.props.item.data.groupNum > 0 ? this.props.item.data.groupNum * this.props.item.data.giftNum : this.props.item.data.giftNum;
    // const bWorld = this.props.item.data.broadcastType == 2;

    const gift = giftName || "礼物";
    const price = bShowPrice ? `(${giftPrice}${COIN_NAME})` : "";

    // if (Platform.OS === 'android') {
    //     return (
    //         <LinearGradient
    //             start={{ x: 0, y: 0 }}
    //             end={{ x: 1, y: 0 }}
    //             colors={['#7591FF', '#FF78BC']}
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

    //             {/* <Image
    //                 source={require("../../../../hardcode/skin_imgs/main").mine_rich_lv(senderContributeLv)}
    //                 style={{
    //                     width: DesignConvert.getW(28),
    //                     height: DesignConvert.getH(14),
    //                     marginEnd: DesignConvert.getW(5),
    //                 }}
    //                 resizeMode={'contain'}
    //             /> */}

    //             <Text
    //                 style={{
    //                     color: '#FFF781',
    //                     fontSize: DesignConvert.getF(10),
    //                     flexDirection: 'row',
    //                     justifyContent: 'center'
    //                 }}
    //                 onPress={this._onSender}
    //             >
    //                 {senderName}


    //                 <Text
    //                     style={{
    //                         color: 'white',
    //                         fontSize: DesignConvert.getF(10),
    //                     }}
    //                     onPress={this._onSender}
    //                 >{'给'}</Text>

    //                 <Text
    //                     style={{
    //                         color: '#FFF781',
    //                         fontSize: DesignConvert.getF(10),
    //                     }}
    //                     onPress={this._onSender}
    //                 >
    //                     {recieverName}

    //                 </Text>

    //                 <Text
    //                     style={{
    //                         color: 'white',
    //                         fontSize: DesignConvert.getF(10),
    //                     }}
    //                     onPress={this._onSender}
    //                 >{`送出`}</Text>



    //                 <Text
    //                     style={{
    //                         color: '#FFF781',
    //                         fontSize: DesignConvert.getF(10),
    //                     }}
    //                     onPress={this._onSender}
    //                 >{`${gift}`}</Text>

    //                 {
    //                     groupNum > 1
    //                         ? (
    //                             <Text
    //                                 style={{
    //                                     color: '#FFF781',
    //                                     fontSize: DesignConvert.getF(10),
    //                                 }}
    //                             >x{groupNum * giftNum}</Text>
    //                         )
    //                         : (
    //                             <Text
    //                                 style={{
    //                                     color: '#FFF781',
    //                                     fontSize: DesignConvert.getF(10),
    //                                 }}
    //                             >x{giftNum}</Text>
    //                         )
    //                 }

    //                 {
    //                     boxDrawable
    //                         ? (
    //                             <Image
    //                                 resizeMode={'repeat'}
    //                                 source={{ uri: Config.getGiftUrl(this.props.item.giftData.giftid, this.props.item.giftData.alterdatetime) }}
    //                                 style={{
    //                                     width: DesignConvert.getW(18),
    //                                     height: DesignConvert.getH(18),
    //                                 }}
    //                             />
    //                         )
    //                         : (
    //                             <Text
    //                                 style={{
    //                                     color: 'white',
    //                                     fontSize: DesignConvert.getF(12),
    //                                 }}
    //                             >{gift}</Text>
    //                         )
    //                 }


    //             </Text>
    //         </LinearGradient>
    //     );
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
            source={senderHead}
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
            >{senderName}</Text>

            <MedalWidget
              richLv={senderContributeLv}
              charmLv={senderCharmLv}
            />
          </View>

          <ImageBackground
            resizeMode="contain"
            source={room_chat_gift_bg()}
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

              {"赠予"}

              <Text
                style={{
                  color: '#F7FF89',
                  fontSize: DesignConvert.getF(12),
                }}>
                {recieverName}
              </Text>

              {gift}

              {price}

              {
                groupNum > 1
                  ? (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(12),
                      }}
                    >*{groupNum * giftNum}</Text>
                  )
                  : (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(12),
                      }}
                    >*{giftNum}</Text>
                  )
              }
            </Text>

            {
              boxDrawable
                ? (
                  <Image
                    source={{ uri: Config.getGiftUrl(this.props.item.giftData.giftid, this.props.item.giftData.alterdatetime) }}
                    style={{
                      width: DesignConvert.getW(29),
                      height: DesignConvert.getH(29),

                      marginRight: DesignConvert.getW(5),
                    }}
                  />
                )
                : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: DesignConvert.getF(12),
                    }}
                  >{gift}</Text>
                )
            }
          </ImageBackground>
        </View>

      </View>
    );
  }
}
