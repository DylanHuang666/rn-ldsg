
/**
 * 房间 -> 在线
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Modal, PanResponder, Animated, findNodeHandle, Platform } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../utils/DesignConvert";
import BaseView from "../base/BaseView";
import RoomInfoCache from '../../cache/RoomInfoCache';
import RoomModel, { isUserOnSeat, getUserSeatPosition } from '../../model/room/RoomModel';
import { BlurView } from 'react-native-blur'
import MedalWidget from "../userinfo/MedalWidget";
import SexAgeWidget from "../userinfo/SexAgeWidget";
import { THEME_COLOR } from "../../styles";
import { ERoomActionType } from '../../hardcode/ERoom';
import UserInfoCache from '../../cache/UserInfoCache';

export default class OnlineMemberPage extends BaseView {
  constructor(props) {
    super(props);

    this._roomId = this.props.params.roomId;
    this._dialogVisable = true;

    this._viewRef = Platform.OS === 'ios' && RoomModel.getBgRef() && findNodeHandle(RoomModel.getBgRef());

    this._list = [];
    this.start = 1;

    this._loadMoreEnable = true;
    this._left = 20;

    this._extraData = 0;
  }

  componentDidMount() {
    super.componentDidMount();
    this.start = 1;
    this._initData()
  }

  _dismissDia = () => {
    // this._dialogVisable = false;
    // this.forceUpdate();
    this.popSelf();
  }

  _loadMore = () => {
    if (this._loadMoreEnable) {
      this._initData();
    }
  }

  _initData() {
    require("../../model/room/RoomManagerModel").default.getOnlineMembers(this._roomId, this.start)
      .then(data => {
        if (this.start == 1) {
          this._list = data;
        } else {
          this._list = this._list.concat(data);
        }
        // console.log("在线人员", data);
        // this._list = [{base: {userId: "7529881", nickName: "活泼的北极熊", logoTime: 72478346, thirdIconurl: "84", sex: 2, age: 26, contributeLv: 1}, onMic: true}, {base: {userId: "7529881", nickName: "活泼的北极熊", logoTime: 72478346, thirdIconurl: "84", sex: 1, age: 26, contributeLv: 1}, onMic: false}]
        this._loadMoreEnable = data.length != 0;
        this.start += 22;
        this.forceUpdate();
      })
  }

  _renderItem = ({ item, index }) => {

    const inMic = isUserOnSeat(item.base.userId)
    return (
      <TouchableOpacity
        onPress={() => {
          this.popSelf();
          require('../../model/room/RoomUserClickModel').onClickUser(item.base.userId, item.base.nickName)
          // require("../../router/level2_router").showUserInfoView(item.base.userId);
        }}
        style={{
          width: DesignConvert.getW(196),
          height: DesignConvert.getH(59),

          flexDirection: "row",
          alignItems: "center",

          paddingHorizontal:DesignConvert.getW(20)

        }}
      >

        <Image
          source={{ uri: require("../../configs/Config").default.getHeadUrl(item.base.userId, item.base.logoTime, item.base.thirdIconurl) }}
          style={{
            width: DesignConvert.getW(44),
            height: DesignConvert.getH(44),
            borderRadius: DesignConvert.getW(8),
          }}
        />
        {/* <Image 
                        source={item.base.sex == 2 ? require('../../hardcode/skin_imgs/ccc').ttq_nv() : require('../../hardcode/skin_imgs/ccc').ttq_nan()}
                        style={{
                            width: DesignConvert.getW(12),
                            height: DesignConvert.getH(12),
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                        }}
                    /> */}

        <View
          style={{
            marginLeft: DesignConvert.getW(12),

            height: DesignConvert.getH(44),

            justifyContent: 'space-between',

          }}
        >

          <Text
            numberOfLines={1}
            style={{
              color: '#ffffff',
              fontSize: DesignConvert.getF(12),

              maxWidth:DesignConvert.getW(70)
            }}
          >{decodeURIComponent(item.base.nickName)}</Text>
          <MedalWidget
            width={DesignConvert.getW(34)}
            height={DesignConvert.getH(16)}
            richLv={item.base.contributeLv}
          // charmLv={item.base.charmLv}
          />

        </View>
        <View
          style={{
            height:DesignConvert.getH(44),
            justifyContent: 'flex-start'
          }}
        >

          {/* {item.jobId == 1 || item.jobId == 2 &&
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={['#F85868', '#FF87ED']}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: DesignConvert.getW(38),
                height: DesignConvert.getH(16),
                borderRadius: DesignConvert.getW(10),
                marginRight: DesignConvert.getW(5),
              }}
            >
              <Text
                style={{
                  fontSize: DesignConvert.getF(10),
                  color: '#FFFFFF'
                }}
              >{'房主'}</Text>
            </LinearGradient>
          } */}

          {item.jobId == 3 &&
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={['#5D67FF', '#D98BFF']}
              style={{
                alignItems: 'center',
                justifyContent: 'center',

                width: DesignConvert.getW(13),
                height: DesignConvert.getH(13),
                borderRadius: DesignConvert.getW(4),

                marginLeft: DesignConvert.getW(5),
                marginTop:DesignConvert.getH(3)
              }}
            >
              <Text
                style={{
                  fontSize: DesignConvert.getF(10),
                  color: '#FFFFFF'
                }}
              >{'管'}</Text>
            </LinearGradient>
          }

          {/* {!(item.jobId == 1 || item.jobId == 2 || item.jobId == 3) &&
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={['#FFA557', '#FFBF20']}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: DesignConvert.getW(38),
                height: DesignConvert.getH(16),
                borderRadius: DesignConvert.getW(10),
                marginRight: DesignConvert.getW(5),
              }}
            >
              <Text
                style={{
                  fontSize: DesignConvert.getF(9),
                  color: '#FFFFFF'
                }}
              >{'游客'}</Text>
            </LinearGradient>
          } */}




          {/* {inMic &&
                            <LinearGradient
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                colors={['#A055FF', '#6B77FF']}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: DesignConvert.getW(27),
                                    height: DesignConvert.getH(13),
                                    borderRadius: DesignConvert.getW(2),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: DesignConvert.getF(9),
                                        color: '#FFFFFF'
                                    }}
                                >麦上</Text>
                            </LinearGradient>
                        } */}
        </View>
        {/* {RoomInfoCache.haveRoomPermiss && item.base.userId !== UserInfoCache.userId ?
          (
            inMic ? (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                }}
                onPress={() => {
                  //下麦
                  RoomModel.action(ERoomActionType.MIC_DOWN, item.base.userId, getUserSeatPosition(item.base.userId), 'true');
                  // 暂时先这样子搞
                  setTimeout(() => {
                    this._extraData++;
                    this.forceUpdate();
                  }, 500)
                }}
              >
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={['#CB5CFF80', '#FF4D9180']}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: DesignConvert.getW(60),
                    height: DesignConvert.getH(27),
                    borderRadius: DesignConvert.getW(30),

                  }}
                >
                  <Text
                    style={{
                      fontSize: DesignConvert.getF(10),
                      color: '#FFFFFF'
                    }}
                  >下麦</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (

                item.jobId == 4 ?
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: DesignConvert.getW(60),
                      height: DesignConvert.getH(27),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: DesignConvert.getW(30),
                    }}
                    onPress={() => {
                      require('../../model/room/MicQueModel').default.upMicUser(item.base.userId)
                      // 暂时先这样子搞
                      setTimeout(() => {
                        this._extraData++;
                        this.forceUpdate();
                      }, 500)
                    }}
                  >

                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      colors={['#CB5CFF', '#FF4D91']}
                      style={{
                        position: 'absolute',
                        width: DesignConvert.getW(60),
                        height: DesignConvert.getH(27),
                        borderRadius: DesignConvert.getW(30),
                      }}
                    />

                    <Text
                      style={{
                        fontSize: DesignConvert.getF(10),
                        color: '#FFFFFF',
                      }}
                    >抱TA上麦</Text>
                  </TouchableOpacity>
                  : null

              )
          )
          : null
        } */}

      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => item.base.userId;

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: DesignConvert.swidth,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          style={{
            width: DesignConvert.swidth,
            height: DesignConvert.getH(272),
          }}
          onPress={this.popSelf}
        />

        <View
          style={{
            position: 'absolute',
            right: DesignConvert.getW(15),
            top: DesignConvert.getH(127) + DesignConvert.statusBarHeight,

            width: DesignConvert.getW(186),
            height: DesignConvert.getH(433),

            backgroundColor: 'rgba(0, 0, 0, 0.8)',

            alignItems: 'center',

            borderRadius: DesignConvert.getW(10),
          }}
        >
          <View
            style={{
              position: 'absolute',
              right: DesignConvert.getW(35),
              top: DesignConvert.getH(-4),

              width: DesignConvert.getW(8),
              height: DesignConvert.getH(8),

              backgroundColor: 'rgba(0, 0, 0, 0.8)',

            }}
          />

          {/* <Text
            style={{
              color: '#333333',
              fontSize: DesignConvert.getF(17),
              textAlign: 'center',
              width: DesignConvert.swidth,
              marginTop: DesignConvert.getH(15),
              marginBottom: DesignConvert.getH(5),
            }}
          >{`在线用户`}</Text> */}

          <FlatList
            data={this._list}
            renderItem={this._renderItem}
            onEndReached={this._loadMore}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={false}
            extraData={this._extraData}
            keyExtractor={this._keyExtractor}
          />

        </View>
      </View>
    )
  }
}