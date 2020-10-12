'use strict';

import React, { PureComponent } from "react";
import { FlatList, View, Text, TouchableOpacity, Image } from "react-native";
import { CLASSIC_ALL, CLASSIC_GIFT, CLASSIC_IM, getCurClassic, getInfos, getUpdateTimes, isAutoToEnd, setAutoToEnd, setCurClassic, TYPE_ENTER_ROOM, TYPE_FOLLOW_NOTICE, TYPE_GIFT, TYPE_GIFT_ALL_MIC, TYPE_IM_PHOTO, TYPE_IM_TEXT, TYPE_SMASH_EGG, TYPE_SYSTEM_NOTICE, TYPE_TEXT, TYPE_NEW_MESSAGE, setNewItemReaded, getNewMessageInfo, setLastVisibleInfo, getLastVisibleInfo, TYPE_MAGIC_EMOJI } from "../../../cache/RoomPublicScreenCache";
import { EVT_UPDATE_ROOM_PUBLIC_SCREEN } from "../../../hardcode/HGlobalEvent";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";
import _ChatClassicTypeItem from "./chat/classic/_ChatClassicTypeItem";
import _PublicScreenFollowNotice from "./chat/_PublicScreenFollowNotice";
import _PublicScreenMessageBingoItem from "./chat/_PublicScreenMessageBingoItem_lvdongshiguang";
import _PublicScreenMessageEnterRoomItem from "./chat/_PublicScreenMessageEnterRoomItem";
import _PublicScreenMessageGiftItem from "./chat/_PublicScreenMessageGiftItem_lvdongshiguang";
import _PublicScreenMessageItem from "./chat/_PublicScreenMessageItem";
import _PublicScreenMessageLocalItem from "./chat/_PublicScreenMessageLocalItem";
import _PublicScreenMessageTipsItem from "./chat/_PublicScreenMessageTipsItem";
import _PublicScreenMagicEmojiItem from "./chat/_PublicScreenMagicEmojiItem";
import _ChatNewMsgTips from "./chat/newmsg/_ChatNewMsgTips";
import { icon_arrowdown_black } from "../../../hardcode/skin_imgs/anchorincome";
import RoomInfoCache from "../../../cache/RoomInfoCache";

function _isEnd(evt) {
  const offsetY = evt.nativeEvent.contentOffset.y;
  const h = evt.nativeEvent.contentSize.height;

  const bottom = DesignConvert.getH(10 + 5) + DesignConvert.getH(33) + DesignConvert.addIpxBottomHeight();
  const top = DesignConvert.getH(410);
  const h2 = DesignConvert.sheight - top - bottom;

  return offsetY + h2 >= h - 1;
}

export default class _RoomChatHistoryList extends PureComponent {

  constructor(props) {
    super(props);

    this._bCallScrollToLastRecord = false;
    this._callScrollToLastRecord = getLastVisibleInfo();
  }

  componentDidMount() {
    ModelEvent.addEvent(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, this._onUpdateEvent);
  }

  componentWillUnmount() {
    ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_PUBLIC_SCREEN, this._onUpdateEvent);

    this._refList = null;
    this._callScrollToLastRecord = null;

    if (RoomInfoCache.isInRoom) {
      //设置缓存到待添加队列
      require('../../../cache/RoomPublicScreenCache').setIsCacheAddInfos(true);
      require('../../../cache/RoomPublicScreenCache').setAutoToEnd(false);
    }
  }

  _onUpdateEvent = () => {
    this.forceUpdate();
  }

  _onScrollToIndexFailed = ({ index, highestMeasuredFrameIndex, averageItemLength }) => {
    //重试
    if (this._callScrollToLastRecord) {
      setTimeout(() => {
        if (isAutoToEnd()) return;
        if (!this._callScrollToLastRecord) return;

        this._refList && this._refList.scrollToItem({
          item: this._callScrollToLastRecord,
          animated: false,
        });
      }, 1);
      return;
    }
  }

  _onRenderItem = ({ item, index, separators }) => {
    switch (item.type) {
      case TYPE_ENTER_ROOM:
        return (
          <_PublicScreenMessageEnterRoomItem
            result={item.result}
          />
        );

      case TYPE_SYSTEM_NOTICE:
        return (
          <_PublicScreenMessageLocalItem
            data={item.content}
          />
        );

      case TYPE_SMASH_EGG:
        return (
          <_PublicScreenMessageBingoItem
            item={item}
          />
        )

      case TYPE_GIFT:
        return (
          <_PublicScreenMessageGiftItem
            item={item.vo}
            type={TYPE_GIFT}
          />
        );
      case TYPE_GIFT_ALL_MIC:
        return (
          <_PublicScreenMessageGiftItem
            item={item.vo}
            type={TYPE_GIFT_ALL_MIC}
          />
        );

      case TYPE_TEXT:
        return (
          <_PublicScreenMessageTipsItem
            data={item.content}
          />
        );

      case TYPE_IM_TEXT:
        return (
          <_PublicScreenMessageItem
            data={item.data}
            type={TYPE_IM_TEXT}
          />
        )

      case TYPE_IM_PHOTO:
        return (
          <_PublicScreenMessageItem
            data={item.data}
            type={TYPE_IM_PHOTO}
          />
        )

      case TYPE_FOLLOW_NOTICE:
        return (
          <_PublicScreenFollowNotice
            data={item.data}
            type={TYPE_FOLLOW_NOTICE}
          />
        )

      case TYPE_MAGIC_EMOJI:
        return (
          <_PublicScreenMagicEmojiItem
            data={item.data}
          />
        );

      case TYPE_NEW_MESSAGE:
        return (
          <Text
            style={{
              color: 'white'
            }}
          >{'----------以下是新消息-----------'}</Text>
        )

      default:
        return null;
    }
  }

  _onScrollToNew = () => {
    this._refList && this._refList.scrollToItem({
      item: getNewMessageInfo(),
      animated: true,
    });
    setNewItemReaded();
  }

  //-------------- 滚动到底部 begin -----------------------------------------------------------------------

  _onDelayScollEnd = () => {
    if (!isAutoToEnd() || !this._refList) {
      return;
    }
    const data = getInfos();
    if (!data || data.length <= 0) {
      return;
    }

    this._refList.scrollToEnd({ animated: false });

    if (isAutoToEnd() && data && data.length > 0) {
      setTimeout(this._onDelayScollEnd2, 30);
    }
  }

  _onDelayScollEnd2 = () => {
    if (!isAutoToEnd() || !this._refList) {
      return;
    }
    const data = getInfos();
    if (!data || data.length <= 0) {
      return;
    }

    this._refList.scrollToEnd({ animated: false });
  }

  //-------------- 滚动到底部 end -----------------------------------------------------------------------

  _onMomentumScrollEnd = (evt) => {
    setAutoToEnd(_isEnd(evt));
  }

  _onScrollEndDrag = (evt) => {
    setAutoToEnd(_isEnd(evt));
  }

  _onViewableItemsChanged = (info) => {
    if (!info) return;
    if (!info.viewableItems) return;
    // let bFirst = true;
    for (const vo of info.viewableItems) {
      // if (bFirst) {
      //     bFirst = false;
      setLastVisibleInfo(vo.item);
      // }

      if (this._callScrollToLastRecord == vo.item) {
        this._callScrollToLastRecord = null;
      }
      if (vo.item.bReaded) continue;

      if (vo.item.type == TYPE_NEW_MESSAGE) {
        setNewItemReaded();
      } else {
        vo.item.bReaded = true;
      }

    }
  }

  _checkScrollTo(data) {
    if (!data || data.length == 0) return;

    //滚动到底部
    if (isAutoToEnd()) {
      this._bCallScrollToLastRecord = true;
      setTimeout(this._onDelayScollEnd, 1);
      return;
    }

    //不需要滚动底部
    //检查是否需要触发滚动到上次记录的数据
    if (this._bCallScrollToLastRecord) return;

    this._bCallScrollToLastRecord = true;

    if (!this._callScrollToLastRecord) return;

    setTimeout(() => {
      if (isAutoToEnd()) return;
      if (!this._callScrollToLastRecord) return;

      this._refList && this._refList.scrollToItem({
        item: this._callScrollToLastRecord,
        animated: false,
      });
    }, 1);

  }

  render() {
    const bottom = DesignConvert.getH(10 + 5) + DesignConvert.getH(33) + DesignConvert.addIpxBottomHeight();
    const top = DesignConvert.getH(381) + DesignConvert.statusBarHeight;


    const data = getInfos();
    const extraData = getUpdateTimes();

    this._checkScrollTo(data);

    return (
      <View
        style={{
          position: 'absolute',
          top: top,
          bottom: bottom,
          width: DesignConvert.getW(300),
        }}
      >
        <FlatList

          ref={ref => this._refList = ref}
          style={{
            position: 'absolute',
            left: DesignConvert.getW(12),
            top: 0,
            bottom: 0,

            // width: DesignConvert.getW(260),
            // height: DesignConvert.sheight - bottom - top,
          }}
          contentContainerStyle={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',


          }}
          // onScroll={this._onScroll}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollEndDrag={this._onScrollEndDrag}
          onViewableItemsChanged={this._onViewableItemsChanged}
          data={data}
          onScrollToIndexFailed={this._onScrollToIndexFailed}
          renderItem={this._onRenderItem}
          showsVerticalScrollIndicator={false}
          extraData={extraData}
        />




        <_ChatNewMsgTips
          onPress={this._onScrollToNew}
        />

      </View >


    )
  }

};