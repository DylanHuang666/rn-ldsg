'use strict';

import React, { PureComponent } from "react";
import { Image, Text, TouchableOpacity, View, Platform } from "react-native";
import { ESex_Type_MALE } from "../../../../hardcode/HGLobal";
import DesignConvert from "../../../../utils/DesignConvert";
import MedalWidget from "../../../userinfo/MedalWidget";



export default class _PublicScreenMessageItem extends PureComponent {

  _onSender = () => {
    require('../../../../model/room/RoomUserClickModel').onClickUser(this.props.data.sender.userId, this.props.data.sender.nickName)
  }


  render() {

    // const data = {
    //     type: 1,    //MessageConstant.TEXT
    //     content,
    //     sender: {
    //         headUrl: Config.getHeadUrl(userInfo.userId, userInfo.logoTime, userInfo.thirdIconurl),
    //         charmLv: userInfo.charmLv,
    //         vipLv: userInfo.vipLv,
    //         sex: userInfo.sex,
    //         headFrameId: userInfo.headFrameId,
    //         contributeLv: userInfo.contributeLv,
    //         nickName: userInfo.nickName,
    //         userId: userInfo.userId,
    //         isNewUser: userInfo.isNew,

    //         hatId,
    //         guardianName,
    //         isGuardian,
    //         guardianLv,
    //     },
    // };

    const senderName = decodeURIComponent(this.props.data.sender.nickName);
    const contributeLv = this.props.data.sender.contributeLv;
    const charmLv = this.props.data.sender.charmLv;
    const senderIsMale = this.props.data.sender.sex == ESex_Type_MALE;

    return (
      <View
        style={{
          marginBottom: DesignConvert.getH(10),
          marginLeft: DesignConvert.getW(5),
          width: DesignConvert.getW(270),

          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>



        <View
          style={{

          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

            }}>
            <TouchableOpacity
              onPress={this._onSender}
            >
              <Image
                source={{ uri: this.props.data.sender.headUrl }}
                style={{
                  width: DesignConvert.getW(32),
                  height: DesignConvert.getH(32),
                  borderRadius: DesignConvert.getW(6),

                  marginRight: DesignConvert.getH(5)
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: senderIsMale ? '#FFFFFF' : '#FFFFFF',
                fontSize: DesignConvert.getF(12),

                marginRight: DesignConvert.getH(5)
              }}
              onPress={this._onSender}
            >{senderName}</Text>

            <MedalWidget
              richLv={contributeLv}
              charmLv={charmLv}
              width={DesignConvert.getW(34)}
              height={DesignConvert.getH(16)}
            />
          </View>


          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#78787899',

              borderRadius: DesignConvert.getW(8),
              paddingHorizontal: DesignConvert.getW(8),
              paddingVertical: DesignConvert.getH(8),

              borderColor: '#ffffff',
              borderWidth: DesignConvert.getW(1),

              marginTop: DesignConvert.getH(6)
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: DesignConvert.getF(12),
              }}>

              {this.props.data.content}
            </Text>

          </View>
        </View>

      </View>
    )


    if (Platform.OS === 'android') {
      return (

        <View
          style={{
            marginBottom: DesignConvert.getH(10),
            marginLeft: DesignConvert.getW(5),
            width: DesignConvert.getW(260),
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >

          {/* <TouchableOpacity
                        onPress={this._onSender}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(35),
                                height: DesignConvert.getH(35),
                                borderRadius: DesignConvert.getW(21),
                                marginTop: DesignConvert.getH(4),
                                marginBottom: DesignConvert.getH(4),
                            }}
                            source={{ uri: this.props.data.sender.headUrl }}
                        />
                    </TouchableOpacity> */}

          {/* <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require("../../../../hardcode/skin_imgs/main").mine_rich_lv(contributeLv)}
                                style={{
                                    width: DesignConvert.getW(28),
                                    height: DesignConvert.getH(14),
                                    marginEnd: DesignConvert.getW(5),
                                    resizeMode: 'contain',
                                }}
                            />

                            <Text
                                style={{
                                    color: senderIsMale ? '#A4AAFF' : '#FF8BC5',
                                    fontSize: DesignConvert.getF(12),
                                }}
                                onPress={this._onSender}
                            >{senderName}</Text>


                        </View> */}

          <Text
            style={{
              color: 'white',
              fontSize: DesignConvert.getF(11),
              flexDirection: 'row',
              backgroundColor: '#FFFFFF40',
              borderRadius: DesignConvert.getW(5),
              padding: DesignConvert.getW(8),
            }}
          >

            <Image
              source={require("../../../../hardcode/skin_imgs/main").mine_rich_lv(contributeLv)}
              style={{
                width: DesignConvert.getW(34),
                height: DesignConvert.getH(15),
                resizeMode: 'contain',
              }}
            />

            <Text
              style={{
                color: senderIsMale ? '#A4AAFF' : '#FF8BC5',
                fontSize: DesignConvert.getF(11),
              }}
              onPress={this._onSender}

            >{` ${senderName} `}</Text>


            {this.props.data.content}</Text>

        </View>

      );

    }


    return (

      <View
        style={{
          marginBottom: DesignConvert.getH(10),
          // maxWidth: DesignConvert.getW(256),
          // minWidth: DesignConvert.getW(100),
          // backgroundColor: '#FFFFFF19',
          // borderRadius: DesignConvert.getW(4),
          // padding: DesignConvert.getW(10),
          // flexWrap: 'wrap',
          // flexDirection: 'row',
          // justifyContent: 'flex-start',
          // alignItems: 'center',

          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        {/* <TouchableOpacity
                    onPress={this._onSender}
                >
                    <Image
                        style={{
                            width: DesignConvert.getW(35),
                            height: DesignConvert.getH(35),
                            borderRadius: DesignConvert.getW(21),
                            marginTop: DesignConvert.getH(4),
                            marginBottom: DesignConvert.getH(4),
                        }}
                        source={{ uri: this.props.data.sender.headUrl }}
                    />
                </TouchableOpacity> */}

        <View
          style={{
            marginLeft: DesignConvert.getW(5),
            borderRadius: DesignConvert.getW(6),
            width: DesignConvert.getW(260),
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#00000033',
            borderRadius: DesignConvert.getW(5),
            padding: DesignConvert.getW(8),
          }}
        >

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={require("../../../../hardcode/skin_imgs/main").mine_rich_lv(contributeLv)}
              style={{
                width: DesignConvert.getW(28),
                height: DesignConvert.getH(14),
                marginEnd: DesignConvert.getW(5),
                resizeMode: 'contain',
              }}
            />

            <Text
              style={{
                color: senderIsMale ? '#A4AAFF' : '#FF8BC5',
                fontSize: DesignConvert.getF(11),
              }}
              onPress={this._onSender}
            >{senderName}</Text>


          </View>

          <Text
            style={{
              color: 'white',
              fontSize: DesignConvert.getF(11),
            }}
          >{this.props.data.content}</Text>

        </View>

      </View>
    );

  }
}
