/**
 * 会话
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from '../../utils/DesignConvert';
import Config from '../../configs/Config';
import ToastUtil from '../base/ToastUtil';
import StatusBarView from '../base/StatusBarView';
import BaseView from '../base/BaseView';
import { ic_default_header } from '../../hardcode/skin_imgs/registered';
import BaseMessageItem, { LuckryMoneyMessageItem, _AnnouncerFinishMessage } from './MessageItem';
import { TX_IM_NEW_MSG } from '../../hardcode/HNativeEvent';
import { EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST } from '../../hardcode/HLogicEvent';
import ModelEvent from '../../utils/ModelEvent';
import { Follow } from '../main/mine/FollowAndFansView';
import _announcerItem from './item/_announcerItem';

export default class MessageLayout extends PureComponent {
    constructor(props) {
        super(props);

        this._messageList = [];
        this._lastMsg;
        this._loadMoreEnable = true;
        this._loadMore = false;
        this._flatList;
    }

    componentDidMount() {
        this._initData();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        require('../../model/chat/ChatModel').addEventListener(TX_IM_NEW_MSG, this._addMsg);
        ModelEvent.addEvent(null, EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST, this._clearMessageList);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        require('../../model/chat/ChatModel').removeEventListener(TX_IM_NEW_MSG, this._addMsg);
        ModelEvent.removeEvent(null, EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST, this._clearMessageList);
    }

    _clearMessageList = () => {
        this._loadMoreEnable = true;
        this._messageList = [];
        this.forceUpdate();
    };

    //有新消息更新
    _addMsg = async (msgs) => {
        // console.log('----------IM-------------','MessageLayout', '有新消息')

        msgs = msgs.filter(element => element.id == this.props.id);
        //是否显示时间
        for (let i = 0; i < msgs.length - 2; i++) {
            msgs[i].showTime = Config.isTimeBefore(msgs[i + 1].time * 1000, msgs[i].time * 1000) ? Config.getIMStatusTime(msgs[i].time * 1000) : '';
        }
        //只有一条新消息
        if (msgs.length == 1) {
            if (this._messageList.length == 0) {
                //消息列表没消息
                msgs[0].showTime = Config.getIMStatusTime(msgs[0].time * 1000);
            } else {
                msgs[0].showTime = Config.isTimeBefore(this._messageList[this._messageList.length - 1].time * 1000, msgs[0].time * 1000) ? Config.getIMStatusTime(msgs[0].time * 1000) : '';
            }
        }
        let data = await require('../../model/chat/ChatModel')._setMsgs(msgs);
        this._messageList = this._messageList.concat(data);
        this.forceUpdate();
        this._keyboardDidShow();
    };

    _onDelayScollEnd = () => {
        this._flatList && this._messageList.length > 0 && this._flatList.scrollToEnd({ animated: false });
    }

    _onDelayScollIndex = (index) => {
        setTimeout(() => {
            this._flatList && this._messageList.length > 0 && this._flatList.scrollToIndex({
                animated: false,
                index,
                viewOffset: 0,
                viewPosition: 0,
            });
        }, 500);
    }

    _keyboardDidShow = () => {
        setTimeout(this._onDelayScollEnd, 500);
    }

    _getFlatList = ref => {
        this._flatList = ref;
    };

    _onScrollToIndexFailed = () => {
        this._flatList && this._flatList.scrollToEnd();
    };

    _initData = () => {
        if (this._loadMoreEnable) {
            require('../../model/chat/ChatModel').getHistoryMsgs(this.props.isGroup, this.props.id, this._lastMsg)
                .then(data => {
                    if (this._lastMsg) {
                        this._messageList = data.concat(this._messageList);
                        this._onDelayScollIndex(data.length);
                    } else {
                        this._messageList = data;
                        this._keyboardDidShow();
                    }
                    // console.log("消息列表", data);
                    this._lastMsg = this._messageList[0];
                    this._loadMoreEnable = data.length == 10;
                    // console.log("能否加载更多", this._loadMoreEnable)
                    this.forceUpdate();
                });
        }
    };

    _rendrPhoto = (item) => {
        //{ uuid: '2_1400341243_1001084_a98ad19cf0f243a35c1189774c14a0b0.jpg',
        //  url: 'https://3a15-1400341243-1256635546.picsh.myqcloud.com/1001084/a98ad19cf0f243a35c1189774c14a0b0.jpg?imageView2/3/w/720/h/720',
        //  size: 0,
        //  width: 720,
        //  height: 1560,
        //  type: 2 }
        // console.log("_rendrPhoto", item.data)
        return (
            <Image
                source={{ uri: item.data.url }}
                style={{
                    width: DesignConvert.getW(200),
                    height: DesignConvert.getW(item.data.height / item.data.width * 200),
                    borderRadius: DesignConvert.getW(6),
                }}></Image>
        );
    };

    _renderItem = ({ item }) => {
        if (item.type == 2) {
            //图片
            return (
                <BaseMessageItem
                    isSelf={item.isSelf}
                    message={item}
                    renderContent={this._rendrPhoto}
                    isShowOverlay={this.props.isShowOverlay}></BaseMessageItem>
            );
        } else if (item.type == "luckryMoney") {
            //红包消息
            return (
                <BaseMessageItem
                    isSelf={item.isSelf}
                    message={item}></BaseMessageItem>
            );
        } else if (item.type == "announcerFinish") {
            //1v1陪聊结束消息
            return (
                <_AnnouncerFinishMessage
                    isSelf={item.isSelf}
                    message={item}
                />
            );
        } else if (item.type == 'userDataCard') {
            return (
                <BaseMessageItem
                    isSelf={item.isSelf}
                    message={item}></BaseMessageItem>
            );
        }
        else {
            //普通文本
            return (
                <BaseMessageItem
                    isSelf={item.isSelf}
                    message={item}
                    isShowOverlay={this.props.isShowOverlay}></BaseMessageItem>
            );
        }

    };

    _rendeHeadView = () => (
        <_announcerItem
            userId={this.props.id}
        />
    )

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    flex: 1,
                }}>
                {this._rendeHeadView()}

                <FlatList
                    ref={this._getFlatList}
                    data={this._messageList}
                    renderItem={this._renderItem}
                    refreshing={this._loadMore}
                    onRefresh={this._initData}
                    onScrollToIndexFailed={this._onScrollToIndexFailed}
                    //TODO:时间分隔
                    // ListHeaderComponent={
                    //     <_StatusMessage></_StatusMessage>
                    // }
                    style={[{
                        width: DesignConvert.swidth,
                        flex: 1,
                        // marginBottom: DesignConvert.getH(10),
                        // backgroundColor: 'red'
                    }, this.props.style]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this._renderEmptyView}></FlatList>
            </View>

        );
    }

    _renderEmptyView = () => {
        if (this.props.isGroup) {
            return (
                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(520),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Image
                        source={require('../../hardcode/skin_imgs/main').no_official_message()}
                        style={{
                            width: DesignConvert.getW(94.5),
                            height: DesignConvert.getH(116.5),
                        }}></Image>
                    <Text style={{
                        marginTop: DesignConvert.getH(16.5),
                        color: '#797979',
                        fontSize: DesignConvert.getF(15),
                    }}>{'暂未收到官方通知'}
                    </Text>
                </View>
            );
        } else {
            return null;
        }
    };
}
