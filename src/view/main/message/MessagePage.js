/**
 * 主界面 -> 消息
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, ScrollView, ActivityIndicator, Slider } from 'react-native';
import { IndicatorViewPager, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../../utils/DesignConvert';
import Config from '../../../configs/Config';
import BackTitleView from '../../base/BackTitleView';
import StatusBarView from "../../base/StatusBarView";
import BaseView from '../../base/BaseView';
import { ic_back_black } from "../../../hardcode/skin_imgs/common";
import ToastUtil from "../../base/ToastUtil";
import FriendsList from "./FriendsList";
import IMList, { _MessageRedDot } from "./IMList";
import { LINEARGRADIENT_COLOR } from "../../../styles";
import UserInfoCache from "../../../cache/UserInfoCache";
import { OFFICIAL_NAME, SECRETARY_NAME } from "../../../hardcode/HGLobal";
import { SYSTEM_UNION_SECRETARY_ID } from "../../../model/chat/ChatModel";
import { TX_IM_NEW_MSG } from "../../../hardcode/HNativeEvent";
import { EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD } from "../../../hardcode/HLogicEvent";
import ModelEvent from "../../../utils/ModelEvent";
import ThemeBgc from "../ThemeBgc";
import { Fans, Follow } from "../mine/FollowAndFansView";

class TouchableOpacityImg extends PureComponent {

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: DesignConvert.getW(37),
            height: DesignConvert.getH(37),

          }}
        >

          <Image
            source={this.props.source}
            style={{
              width: DesignConvert.getW(37),
              height: DesignConvert.getH(37),

            }}
          />
          {this.props.unRead > 0 && <_MessageRedDot
            num={this.props.unRead}
            style={{
              position: 'absolute',
              minWidth: DesignConvert.getW(18),
              height: DesignConvert.getH(18),
              top: DesignConvert.getH(-6),
              right: DesignConvert.getW(-6),
              padding: 0,
              borderWidth: DesignConvert.getW(1),
              borderColor: 'white'

            }}
          />}
        </View>

        <Text
          style={{
            color: '#ffffff',
            marginTop: DesignConvert.getH(8),
            fontSize: DesignConvert.getF(11)
          }}
        >{this.props.title}</Text>


      </TouchableOpacity>
    )
  }
}

export default class MessagePage extends PureComponent {
  constructor(props) {
    super(props);
    this._selectTab = 0;
    this._officailUnred = 0;
    this._systemlUnred = 0;
  }

  _onPageChange = e => {
    this._selectTab = e.position;
    this.forceUpdate();
  }

  componentDidMount() {
    this._initData();
    require("../../../model/chat/ChatModel").addEventListener(TX_IM_NEW_MSG, this._initData);
    ModelEvent.addEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._initData);
  }

  componentWillUnmount() {
    require("../../../model/chat/ChatModel").removeEventListener(TX_IM_NEW_MSG, this._initData);
    ModelEvent.removeEvent(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, this._initData)
  }

  _initData = () => {
    require("../../../model/chat/ChatModel").getConversationList(true)
      .then(data => {
        if (!data) return null
        data.forEach(item => {
          if (item.id === UserInfoCache.officialGroupId) {
            this._officailUnred = item.unRead
          }
          if (item.id === SYSTEM_UNION_SECRETARY_ID) {
            this._systemlUnred = item.unRead
          }
        })
        // console.warn(this._officailUnred, this._systemlUnred)
        this.forceUpdate()

      })
  }

  _onMorePress = () => {
    require("../../../router/level2_router").showSearchView();
  }

  _onEnterOfficialMsg = () => {
    require("../../../router/level2_router").showChatView(UserInfoCache.officialGroupId, OFFICIAL_NAME, true);
  }

  _onEnterSyslMsg = () => {
    require("../../../router/level2_router").showChatView(SYSTEM_UNION_SECRETARY_ID, SECRETARY_NAME, false);

  }

  _onEnterPhoneRecord = () => {
    require("../../../router/level3_router").showPhoneRecordView();
  }

  _onEnterOnline = () => {
    require("../../../router/level3_router").showOnlineView();
  }

  _onFansPress = () => {
    require("../../../router/level2_router").showFollowAndFansView(Fans);
}

_onMyLovesPress = () => {
    require("../../../router/level2_router").showFollowAndFansView(Follow);
}

  _renderTabLayout() {
    return (
      <View
        style={{
          width: DesignConvert.swidth,
          height: DesignConvert.getH(55) + DesignConvert.statusBarHeight,

          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      // start={{ x: 0, y: 0 }}
      // end={{ x: 1, y: 0 }}
      // colors={LINEARGRADIENT_COLOR}
      >
        {/* <TouchableOpacity/> */}
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: DesignConvert.getF(17),
            fontWeight: "bold",
            // position: "absolute",
            // left: DesignConvert.getW(18),
            // bottom: DesignConvert.getH(14),
          }}
        >消息</Text>

        {/* <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this._selectTab = 1;
                        this.forceUpdate();
                        this._viewPager.setPage(1);
                    }}
                >
                    <Text
                        style={{
                            color: this._selectTab==1?"white":"rgba(255, 255, 255, 0.8)",
                            fontSize: DesignConvert.getF(this._selectTab==1? 19: 15),
                            fontWeight: this._selectTab==1?"bold":"normal",
                            marginLeft: DesignConvert.getW(28),
                        }}
                    >好友</Text>
                </TouchableOpacity> */}

        {/* <View
                    style={{
                        width: DesignConvert.getW(11),
                        height: DesignConvert.getH(4),
                        borderRadius: DesignConvert.getW(2),
                        position: "absolute",
                        backgroundColor: "white",
                        bottom: DesignConvert.getH(1),
                        left: DesignConvert.getW(this._selectTab==0?32:88),
                    }}
                ></View> */}

        {/* <TouchableOpacity
                    onPress={this._onMorePress}
                    style={{
                        position: "absolute",
                        right: DesignConvert.getW(20),
                        bottom: DesignConvert.getH(12),
                    }}>
                    <Image
                        source={require("../../../hardcode/skin_imgs/main").ic_more()}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(20),
                        }}></Image>
                </TouchableOpacity> */}
      </View>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
      }}>
        <ThemeBgc />

        {this._renderTabLayout()}
        <View
          style={{
            marginTop: DesignConvert.getH(15),
            alignSelf: 'center',

            width: DesignConvert.getW(345),
            height: DesignConvert.getH(90),
            borderRadius: DesignConvert.getW(12),

            backgroundColor: 'rgba(120, 120, 120, 0.4)',

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

            paddingHorizontal: DesignConvert.getW(33),

          }}
        >
          <TouchableOpacityImg
            source={require('../../../hardcode/skin_imgs/main').icon_official_msg()}
            title="官方通知"
            onPress={this._onEnterOfficialMsg}
            unRead={this._officailUnred}
          />
          <TouchableOpacityImg
            source={require('../../../hardcode/skin_imgs/main').icon_sys_msg()}
            title="小助手"
            onPress={this._onEnterSyslMsg}
            unRead={this._systemlUnred}
          />
          {/* <TouchableOpacityImg
                        source={require('../../../hardcode/skin_imgs/main').icon_phone_record()}
                        title="通话记录"
                        onPress={this._onEnterPhoneRecord}
                    /> */}
          <TouchableOpacityImg
            source={require('../../../hardcode/skin_imgs/main').icon_fans()}
            title="粉丝"
            onPress={this._onFansPress}
          />
          <TouchableOpacityImg
            source={require('../../../hardcode/skin_imgs/main').icon_follow()}
            title="关注"
            onPress={this._onMyLovesPress}
          />
        </View>
       
        <View
          style={{


            justifyContent: "center",
            alignItems: "center",

            marginTop: DesignConvert.getH(20),
            marginBottom: DesignConvert.getH(50),
          }}
        >
          <IMList />
        </View>

        {/* <ViewPager
                    initialPage={this._selectTab}
                    style={{
                        flex:1,
                        marginBottom: DesignConvert.getH(50),
                     }}
                    onPageSelected={this._onPageChange}
                    ref={(ref) => {
                        this._viewPager = ref;
                    }}
                >

                    <View 
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <IMList />
                    </View>

                    <View 
                        style={{
                            flex: 1,
                        }}
                    >
                        <FriendsList />
                    </View>
                </ViewPager> */}
      </View>
    );
  }
}