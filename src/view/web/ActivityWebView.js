
import React from 'react';
import { View } from "react-native";
import RoomInfoCache from '../../cache/RoomInfoCache';
import UserInfoCache from '../../cache/UserInfoCache';
import Config from '../../configs/Config';
import { H5Action } from '../../hardcode/H5Action';
import { EVT_UPDATE_WALLET } from '../../hardcode/HLogicEvent';
import ModelEvent from '../../utils/ModelEvent';
import BaseView from "../base/BaseView";
import WebView from '../base/X5WebView';


export const _setUrlParams = (url, valuse = []) => {
    if (!url) {
        return '';
    }
    const params = [];

    if (url.indexOf('appPlatform=') < 0) {
        params.push(['appPlatform', Config.H5_appPlatform]);
    }

    if (url.indexOf('userId=') < 0) {
        params.push(['userId', require('../../cache/UserInfoCache').default.userId]);
    }

    if (url.indexOf('userName=') < 0) {
        params.push(['userName', UserInfoCache.userName]);
    }

    if (url.indexOf('roomId=') < 0) {
        params.push(['roomId', RoomInfoCache.roomId]);
    }

    const bContain = url.indexOf('?') > 0;
    let bFirst = true;
    for (const vo of params) {
        if (bFirst) {
            bFirst = false;
            url += bContain ? '&' : '?';
        } else {
            url += '&';
        }
        url += vo[0] + '=' + vo[1];
    }

    for (const vo of valuse) {
        if (vo[0] == 'hashValue') {
            url += vo[1]
            continue
        }

        if (bFirst) {
            bFirst = false;
            url += bContain ? '&' : '?';
        } else {
            url += '&';
        }
        url += vo[0] + '=' + vo[1];
    }



    return url;
}


/**
 * 活动WebView 透明背景
 */
export default class ActivityWebView extends BaseView {

    constructor(props) {
        super(props);

        this._userId = require('../../cache/UserInfoCache').default.userId;
        this._url = _setUrlParams(this.props.params.url, this.props.params.valuse);
    }


    componentDidMount() {
        super.componentDidMount()

        ModelEvent.addEvent(null, EVT_UPDATE_WALLET, this._refreshWallet)
    }

    componentWillUnmount() {
        super.componentWillUnmount()

        ModelEvent.removeEvent(null, EVT_UPDATE_WALLET, this._refreshWallet)
    }


    _onBackPress = () => {
        this.popSelf();
    }

    /**
     * 刷新钱包
     */
    _refreshWallet = () => {
        const data = { 'action': H5Action.REFRESH_WALLET }
        this._postMessage(data)
    }

    /**
     * 充值成功
     */
    _rechargeSuccess = () => {
        const data = { 'action': H5Action.RECHARGE_SUCCESS }
        this._postMessage(data)
    }


    /**
     * 接收H5发送的消息
     */
    _onMessage = (event) => {
        // console.log('接收H5发送的消息', event)
        let message = event.nativeEvent.data;
        try {
            if (typeof JSON.parse(message) == 'object') {
                const webMessage = JSON.parse(message)
                switch (webMessage.action) {
                    case H5Action.CLOSE_WINDOW:
                        this.popSelf()
                        break;
                    case H5Action.OPEN_USER_INFO:

                        break;
                    case H5Action.OPEN_LIVE_ROOM:

                        break;
                    case H5Action.OPEN_RECHARGE:
                        this.popSelf()
                        require("../../router/level2_router").showMyWalletView();
                        break;
                    case H5Action.TO_RECHARGE:
                        require('../../model/pay/PayModel').default.h5ToPay(webMessage.type, webMessage.id, webMessage.price)
                        break;
                    case H5Action.LUCKER_LIST:
                        require("../../router/level2_router").showHeadlinesView(true);
                        break;
                }
            }
        } catch (e) {
            // console.log('_onMessage Error() ----->', e)
        }
    }

    /**
     * 向H5发消息
     */
    _postMessage = (data) => {
        // console.log('向H5发送信息', data)
        if (this.webview) {
            this.webview.postMessage(JSON.stringify(data))
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}>

                <WebView
                    ref={webview => this.webview = webview}
                    useWebKit={false}
                    onLoadEnd={this._onLoaderEnd}
                    onMessage={this._onMessage}
                    javaScriptEnabled={true}
                    renderError={(e) => { if (e) return }}
                    source={{ uri: this._url }}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.0)',
                        flex: 1,
                    }}/>
            </View>
        )
    }
}