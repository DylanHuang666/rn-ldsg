/**
 * 主界面 -> 消息 ->消息List
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import ToastUtil from "../../base/ToastUtil";
import StatusBarView from "../../base/StatusBarView";
import UserInfoCache from "../../../cache/UserInfoCache";
import { TX_IM_NEW_MSG, } from "../../../hardcode/HNativeEvent";
import { EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, } from "../../../hardcode/HLogicEvent";
import ModelEvent from "../../../utils/ModelEvent";
import { SYSTEM_UNION_SECRETARY_ID } from "../../../model/chat/ChatModel";

export class _MessageRedDot extends PureComponent {

  render() {
    if (this.props.num < 1) {
      return (
        <View></View>
      )
    } else if (this.props.num < 10) {
      return (
        <View
          style={[{
            width: DesignConvert.getW(16),
            height: DesignConvert.getH(16),
            backgroundColor: "#FA495F",
            borderRadius: DesignConvert.getW(16),
            justifyContent: "center",
            alignItems: "center",
          }, this.props.style]}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: DesignConvert.getF(10),
            }}>{this.props.num}</Text>
        </View>
      )
    } else if (this.props.num <= 99) {
      return (
        <View
          style={[{
            width: DesignConvert.getW(28),
            height: DesignConvert.getH(16),
            backgroundColor: "#FA495F",
            borderRadius: DesignConvert.getW(16),
            justifyContent: "center",
            alignItems: "center",
          }, this.props.style]}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: DesignConvert.getF(10),
            }}>{this.props.num}</Text>
        </View>
      )
    } else {
      return (
        <View
          style={[{
            width: DesignConvert.getW(33),
            height: DesignConvert.getH(16),
            backgroundColor: "#FA495F",
            borderRadius: DesignConvert.getW(16),
            justifyContent: "center",
            alignItems: "center",
          }, this.props.style]}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: DesignConvert.getF(10),
            }}>99+</Text>
        </View>
      )
    }
  }
}

class _MessageItem extends PureComponent {

  _onItemPress = () => {
    if (this.props.onItemPress) {
      this.props.onItemPress(this.props.message.id, this.props.message.userInfo.nickName, this.props.message.isGroup);
    } else {
      require("../../../router/level2_router").showChatView(this.props.message.id, this.props.message.userInfo.nickName, this.props.message.isGroup);
    }
  }

  _getAvatorUrl = () => {
    if (this.props.message.id == UserInfoCache.officialGroupId) {
      return require("../../../hardcode/skin_imgs/main").icon_official_msg();
    }
    if (this.props.message.id == SYSTEM_UNION_SECRETARY_ID && !this.props.isSelf) {
      return require("../../../hardcode/skin_imgs/main").icon_sys_msg();
    }
    return { uri: Config.getHeadUrl(this.props.message.id, this.props.message.userInfo.logoTime, this.props.message.userInfo.thirdIconurl) };
  }

  render() {
    if (this.props.message.id == UserInfoCache.officialGroupId && !this.props.onItemPress) return null
    if (this.props.message.id == SYSTEM_UNION_SECRETARY_ID && !this.props.onItemPress) return null
    return (
      <TouchableOpacity
        onPress={this._onItemPress}
        style={{
          width: DesignConvert.getW(345),
          height: DesignConvert.getH(64),

          paddingHorizontal: DesignConvert.getW(15),

          flexDirection: "row",
          alignItems: 'center',

          justifyContent: "space-between",
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>

          <Image
            source={this._getAvatorUrl()}
            style={{
              width: DesignConvert.getW(44),
              height: DesignConvert.getH(44),
              borderRadius: DesignConvert.getW(22),
            }}
          />

          <View
            style={{
              marginLeft: DesignConvert.getW(10),
              height: DesignConvert.getH(44),
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: DesignConvert.getF(14),
                marginTop: DesignConvert.getH(3),
              }}>{this.props.message.userInfo.nickName}</Text>

            <Text
              numberOfLines={1}
              style={{
                width: DesignConvert.getW(180),
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: DesignConvert.getF(12),

                marginTop: DesignConvert.getH(3),
              }}>{this.props.message.desc}</Text>
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: DesignConvert.getF(11),
              marginRight: DesignConvert.getH(5),
            }}>
            {this.props.message.time}
            {/* {'上午 10:15'} */}
          </Text>

          <_MessageRedDot
            num={this.props.message.unRead}
            style={{
              marginTop: DesignConvert.getH(7)
            }} />

          {/* <Image
                        source={require('../../../hardcode/skin_imgs/main').msg_arrow_right()}
                        style={{
                            width: DesignConvert.getW(8),
                            height: DesignConvert.getH(14),
                        }}
                    /> */}
        </View>

      </TouchableOpacity>

    )
  }
}
export default class IMList extends PureComponent {
  constructor(props) {
    super(props);

    this._messageList = [];

    this._bLoading = false;
  }

  componentDidMount() {
    this._initData();
    require("../../../model/chat/ChatModel").addEventListener(TX_IM_NEW_MSG, this._updateConversation);
    ModelEvent.addEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._initData);
  }

  _updateConversation = msgs => {
    // console.log('----------IM-------------','IMList', '有新消息')
    this._initData();
  }

  componentWillUnmount() {
    require("../../../model/chat/ChatModel").removeEventListener(TX_IM_NEW_MSG, this._updateConversation);
    ModelEvent.removeEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._initData)
  }

  _initData = () => {
    if (this._bLoading) {
      return
    }
    this._bLoading = true
    require("../../../model/chat/ChatModel").getConversationList()
      .then(data => {
        if (data) {
          this._messageList = data
        }
        this._bLoading = false;
        this.forceUpdate();
      })
  }

  _onRefresh = () => {
    this._initData();
  }

  _renderEmptyView = () => {
    return (
      <View
        style={{
          width: DesignConvert.swidth,
          height: DesignConvert.getH(520),
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Image
          source={require("../../../hardcode/skin_imgs/main").no_message()}
          style={{
            width: DesignConvert.getW(130),
            height: DesignConvert.getH(96),
          }}></Image>
      </View>
    )
  }

  _renderFooterView = () => {
    return (
      <View
        style={{
          width: DesignConvert.swidth,
          height: DesignConvert.getH(50),
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text
          style={{
            color: "#808080",
            fontSize: DesignConvert.getF(12),
          }}></Text>
      </View>
    )
  }

  _onHeaderPress = (item) => {
    require("../../../router/level2_router").showUserInfoView((item.userId));
  }

  _renderItem = ({ item }) => {
    return (
      <_MessageItem
        message={item}
        onItemPress={this.props.onItemPress} />
    )
  }

  render() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this._messageList}
        refreshing={false}
        onRefresh={this._onRefresh}
        renderItem={this._renderItem}
        style={{

          backgroundColor: this.props.onItemPress ? '#ffffff00' : 'rgba(120, 120, 120, 0.42)',

          borderRadius: DesignConvert.getW(12)
        }}
        // ListFooterComponent={this._renderFooterView}
        ListEmptyComponent={this._renderEmptyView} />
    )
  }
}
