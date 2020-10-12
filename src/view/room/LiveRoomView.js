/**
 * 直播间
 */

'use strict';

import React from 'react';
import { findNodeHandle, Text, View } from "react-native";
import RoomInfoCache, { isChatRoom } from '../../cache/RoomInfoCache';
import { EVT_LOGIC_SELF_BY_KICK } from '../../hardcode/HLogicEvent';
import DesignConvert from '../../utils/DesignConvert';
import ModelEvent from '../../utils/ModelEvent';
import BaseView from "../base/BaseView";
import KeyboardAvoidingViewExt from '../base/KeyboardAvoidingViewExt';
import _RoomBottomItem from './item/bottom/_RoomBottomItem';
import _RoomCarEnterContainer from './item/car/_RoomCarEnterContainer';
import _RoomFullScreenGiftItem from './item/gift/_RoomFullScreenGiftItem';
import _RoomFullServiceGiftContainer from './item/gift/_RoomFullServiceGiftContainer';
import _RoomGiftBannerContainer from './item/gift/_RoomGiftBannerContainer';
import _RoomGiftComboItem from './item/gift/_RoomGiftComboItem';
import _RoomFullServiceZadanContainer from './item/smash/_RoomFullServiceZadanContainer';
import _RoomZadanContainer from './item/smash/_RoomZadanContainer';
import _BgItem from './item/_BgItem';
import _NoticeWidget from './item/_NoticeWidget';
import _OtherMicItem from './item/_OtherMicItem';
import _RoomBannerItem from './item/_RoomBannerItem';
import _RoomChatHistoryList from './item/_RoomChatHistoryList';
import _RoomOtherGiftFlyAnimateItem from './item/_RoomOtherGiftFlyAnimateItem';
import _RoomTopItem from './item/_RoomTopItem';
import _SmashEggItem from './item/_SmashEggItem';

let LEFT_MAX_WIDTH = DesignConvert.swidth;          // 左边最大宽度


export default class LiveRoomView extends BaseView {

    constructor(props) {
        super(props);
        // this.setSlidePanResponder();
        this._animating = false;
        // this._answerPanResponder = true;//是否响应左滑手势
        this.styleLeft = LEFT_MAX_WIDTH;
        this.isShowSliderView = false;
    }

    onResume(prevView) {
        //判定是否上一个界面是否是1v1聊天室,如果是就关闭自己
        if (require('../../router/level3_router').isChatRoomView(prevView)) {
            this.popSelf();
        }
        if (!RoomInfoCache.isInRoom || isChatRoom(RoomInfoCache.roomId)) {
            //在直播间进入IM再打电话，无法用以上条件判断
            this.popSelf();
        }
        if (require('../../router/level3_router').isPhoneView(prevView)) {
            this.popSelf();

        }
    }

    componentDidMount() {
        super.componentDidMount();

        ModelEvent.addEvent(null, EVT_LOGIC_SELF_BY_KICK, this._onKick)

        const roomData = RoomInfoCache.roomData;
        if (!roomData) {
            return;
        }

        require('../../model/room/RoomModel').default.getOwnerData(roomData.createId, roomData.roomOwnerId)
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        ModelEvent.removeEvent(null, EVT_LOGIC_SELF_BY_KICK, this._onKick)
        require('../../model/room/RoomModel').default.setBgRef(null);
    }
    _onCacheUpdated = () => {
        this.forceUpdate();

    }

    onHardwareBackPress() {
        this._onClose();
    }

    _onKick = () => {
        this.popSelf();
    }

    _onClose = () => {
        require('../../router/level3_router').showExitRoomView(this.popSelf);
    }

    _getAudioLiveBGRef = (ref) => {
        require('../../model/room/RoomModel').default.setBgRef(ref);

        this._audioLiveBGRef = ref;
        this._roomSliderRef && this._audioLiveBGRef && this._roomSliderRef.setState({ viewRef: findNodeHandle(this._audioLiveBGRef) });
    }

    // _getRoomSliderRef = (ref) => {
    //     this._roomSliderRef = ref;
    //     this._roomSliderRef && this._audioLiveBGRef && this._roomSliderRef.setState({viewRef: findNodeHandle(this._audioLiveBGRef)});
    // }

    // _showSliderView = (show) => {
    //     if (this._animating) {
    //         return;
    //     }
    //     this._animating = true;

    //     this.isShowSliderView = show;
    //     if (show) {
    //         this._recoverPage();
    //     } else {
    //         this._slidePage();
    //     }
    //     this._animating = false;
    // }

    // _recoverPage() {
    //     if (this._sliding) return;
    //     this._sliding = true;
    //     this.__recoverPage();
    // }

    // __recoverPage = () => {
    //     this._recoverTime = requestAnimationFrame(this._onAnimateFrame);
    // }

    // _onAnimateFrame = () => {
    //     this.styleLeft -= 30;
    //     if (this.styleLeft <= 0) {
    //         this.styleLeft = 0;
    //         cancelAnimationFrame(this._recoverTime);
    //         this._recoverTime = null;
    //         this._sliding = false;
    //         //刷新左滑出来的数据

    //     } else {
    //         this.__recoverPage();
    //     }
    //     this._updateStyle();
    // }

    // _slidePage() {
    //     if (this._sliding) return;
    //     this._sliding = true;
    //     this.__slidePage();
    // }

    // __slidePage = () => {
    //     this._slideTimer = requestAnimationFrame(() => {
    //         this.styleLeft += 30;
    //         if (this.styleLeft >= LEFT_MAX_WIDTH) {
    //             this.styleLeft = LEFT_MAX_WIDTH;
    //             cancelAnimationFrame(this._slideTimer);
    //             this._slideTimer = null;
    //             this._sliding = false;
    //         } else {
    //             this.__slidePage();
    //         }
    //         this._updateStyle();
    //     });
    // }

    // _updateStyle() {
    //     this._onlineViewRef && this._onlineViewRef.setNativeProps({
    //         style: {
    //             left: this.styleLeft,
    //         }
    //     });
    // }


    render() {
        const roomData = RoomInfoCache.roomData;

        if (!roomData) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text>退出房间</Text>
                </View>
            );
        }

        return (
            <View
                onLayout={(evt) => {
                    this._roomSliderRef && this._roomSliderRef.setHeight(evt.nativeEvent.layout.height)
                }}
                style={{ flex: 1 }}
            >
                <KeyboardAvoidingViewExt
                    behavior="height"
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{ flex: 1 }}
                        ref={this._getAudioLiveBGRef}
                        collapsable={false}
                    >

                        <_BgItem
                        />

                        <_RoomTopItem
                            fnOnClose={this._onClose}
                        />


                        <_OtherMicItem
                            index={1}
                            left={DesignConvert.getW(22)}
                            top={DesignConvert.getH(169) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />
                        <_OtherMicItem
                            index={2}
                            left={DesignConvert.getW(110)}
                            top={DesignConvert.getH(169) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />
                        <_OtherMicItem
                            index={3}
                            left={DesignConvert.getW(198)}
                            top={DesignConvert.getH(169) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />
                        <_OtherMicItem
                            index={4}
                            left={DesignConvert.getW(286)}
                            top={DesignConvert.getH(169) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />

                        <_OtherMicItem
                            index={5}
                            left={DesignConvert.getW(22)}
                            top={DesignConvert.getH(271) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />
                        <_OtherMicItem
                            index={6}
                            left={DesignConvert.getW(110)}
                            top={DesignConvert.getH(271) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />
                        <_OtherMicItem
                            index={7}
                            left={DesignConvert.getW(198)}
                            top={DesignConvert.getH(271) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />
                        <_OtherMicItem
                            index={8}
                            left={DesignConvert.getW(286)}
                            top={DesignConvert.getH(271) + DesignConvert.statusBarHeight}
                            width={68}
                            height={68}
                        />


                        <_SmashEggItem
                            onClose={this.popSelf}
                            roomId={roomData.roomId}
                            type={roomData.type}
                        />

                        <_NoticeWidget
                        />

                        {/* 麦位上的人收到礼物时的飞行动画  (不是自己送的 别人送的) */}
                        <_RoomOtherGiftFlyAnimateItem />

                        <_RoomBannerItem />

                        {/* <_ChatTypeItem /> */}

                        <_RoomChatHistoryList />

                        {/* 底部按钮组 */}
                        <_RoomBottomItem />

                        {/* 砸蛋跑道 */}
                        <_RoomZadanContainer />

                        {/* 送礼跑道 */}
                        <_RoomGiftBannerContainer />

                        {/* 全服砸蛋跑道 */}
                        <_RoomFullServiceZadanContainer />

                        {/* 玩家座驾进场 */}
                        <_RoomCarEnterContainer />

                        {/* 全服送礼跑道 */}
                        <_RoomFullServiceGiftContainer />

                        <_RoomGiftComboItem />

                        <_RoomFullScreenGiftItem />

                        {/* <View
                            ref={ref => this._onlineViewRef = ref}
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                elevation: 10,
                                flex: 1,
                                backgroundColor: '#00000000',
                                top: 0,
                                left: this.styleLeft,
                                overflow: 'hidden'
                            }}>
                            <_RoomSliderView
                                onGetMe={this._getRoomSliderRef}
                                showSliderView={this._showSliderView}/>
                        </View> */}
                    </View>
                </KeyboardAvoidingViewExt>
            </View>
        )
    }

}