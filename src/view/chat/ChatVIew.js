/**
 * 消息List -> 会话
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../utils/DesignConvert";
import Config from "../../configs/Config";
import ToastUtil from "../base/ToastUtil";
import StatusBarView from "../base/StatusBarView";
import BaseView from "../base/BaseView";
import MessageLayout from "./MessageLayout";
import { ic_back_black, ic_back_white } from "../../hardcode/skin_imgs/common";
import { ic_setting, ic_attend_status } from "../../hardcode/skin_imgs/chat";
import MessageInputLayout from "./MessageInputLayout";
import EmojiView from "./EmojiView";
import UserInfoCache from "../../cache/UserInfoCache";
import KeyboardAvoidingViewExt from '../base/KeyboardAvoidingViewExt';
import { LINEARGRADIENT_COLOR } from "../../styles";
import { SYSTEM_UNION_SECRETARY_ID } from "../../model/chat/ChatModel";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST } from "../../hardcode/HLogicEvent";
import ThemeBgc from "../main/ThemeBgc";
class _TitleView extends PureComponent {
  constructor(props) {
    super(props)

    this._avatar = {}
    this._selfAvatar = {}
  }
  componentDidMount() {
    if (this.props.isOfficialOrSys) return
    require("../../model/userinfo/UserInfoModel").default.getPersonPage(this.props.userID)
      .then(data => {
        this._avatar = { uri: Config.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl) }
        // console.log("用户资料",  this._userInfo)
        this.forceUpdate();
      })
    require("../../model/userinfo/UserInfoModel").default.getPersonPage(UserInfoCache.userId)
      .then(data => {
        this._selfAvatar = { uri: Config.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl) }
        // console.log("用户资料",  this._userInfo)
        this.forceUpdate();
      })
  }
  render() {
    const isOfficialAvatar = this.props.userID === UserInfoCache.officialGroupId

    return (
      <View>

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#ffffff00', '#ffffff00']}
          style={{
            width: DesignConvert.swidth,
            height: DesignConvert.getH(55),

            marginTop: DesignConvert.statusBarHeight,

            flexDirection: 'row',
            alignItems: 'center',

            paddingHorizontal: DesignConvert.getW(15),

          }}
        >

          <TouchableOpacity
            style={{

            }}
            onPress={this.props.onBack}
          >
            <Image
              style={{
                width: DesignConvert.getW(21.5),
                height: DesignConvert.getH(19),
                resizeMode: 'contain',
              }}
              source={ic_back_white()}
            />
          </TouchableOpacity>


          {!isOfficialAvatar && <Image
            style={{
              width: DesignConvert.getW(37),
              height: DesignConvert.getH(37),

              borderRadius: DesignConvert.getW(30),

              marginLeft: DesignConvert.getW(8)
            }}
            source={this._avatar}
          />}

          <Text
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              color: '#FFFFFF',
              fontSize: DesignConvert.getF(16),

              maxWidth: DesignConvert.getW(150),
              marginLeft: DesignConvert.getW(8)
            }}
          >{this.props.titleText}</Text>
          {/* <Image
            style={{
              width: DesignConvert.getW(42),
              height: DesignConvert.getH(18),
              display: this.props.isAttend ? "flex" : "none",
            }}
            source={ic_attend_status()}
          /> */}




          <TouchableOpacity
            style={{
              position: 'absolute',
              right: DesignConvert.getW(15)
            }}
            onPress={this.props.onMenu}
          >
            <Image
              style={{


                width: DesignConvert.getW(21),
                height: DesignConvert.getH(21),
                resizeMode: 'contain',
                display: this.props.isShowSetting ? "flex" : "none",
              }}
              source={ic_setting()}
            />
          </TouchableOpacity>
        </LinearGradient>

      </View>
    );
  }
}

export class BaseChatView extends PureComponent {
  constructor(props) {
    super(props);

    this._userInfo;

  }

  componentDidMount() {
    this._initData();
  }

  _initData() {
    //TODO:消息已读
    require("../../model/chat/ChatModel").setReadMsg(this.props.isGroup, this.props.id);
    if (!this.props.isGroup) {
      require("../../model/userinfo/UserInfoModel").default.getPersonPage(this.props.id)
        .then(data => {
          this._userInfo = data;
          this.forceUpdate();
        })
    }
  }

  _renderInput = () => {
    if (this.props.id != UserInfoCache.officialGroupId && this.props.id != SYSTEM_UNION_SECRETARY_ID) {
      return (
        <MessageInputLayout
          id={this.props.id}
          isGroup={this.props.isGroup}
          // nickName={this._nickName}
          isShowOverlay={this.props.isShowOverlay} ></MessageInputLayout>
      )
    } else {
      return (
        <View></View>
      )
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingBottom: DesignConvert.getH(10)
        }}>

        <MessageLayout
          isGroup={this.props.isGroup}
          id={this.props.id}
          isShowOverlay={this.props.isShowOverlay} ></MessageLayout>

        {this._renderInput()}

        {/* <EmojiView /> */}
      </View>
    )
  }
}

export default class ChatView extends BaseView {

  _onBackPress = () => {
    this.popSelf();
  }

  _onChatSettingPress = () => {
    require("../../router/level3_router").showChatSettingView(this.props.params.isGroup, this.props.params.id);
  }

  componentDidMount() {
    super.componentDidMount()
    ModelEvent.addEvent(null, EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST, this._onBackPress);
  }


  componentWillUnmount() {
    super.componentWillUnmount()
    ModelEvent.removeEvent(null, EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST, this._onBackPress);
  }

  render() {
    return (
      <KeyboardAvoidingViewExt
        behavior="height"
        style={{
          flex: 1,
        }}>
        <ThemeBgc />

        <_TitleView
          onBack={this._onBackPress}
          onMenu={this._onChatSettingPress}
          titleText={this.props.params.nickName}
          userID={this.props.params.id}
          isAttend={this._userInfo ? this._userInfo.friendStatus == 1 || this._userInfo.friendStatus == 2 : false}
          isShowSetting={this.props.params.id != UserInfoCache.officialGroupId && this.props.params.id != SYSTEM_UNION_SECRETARY_ID}></_TitleView>

        <BaseChatView
          id={this.props.params.id}
          isGroup={this.props.params.isGroup} />
      </KeyboardAvoidingViewExt>
    )
  }
}