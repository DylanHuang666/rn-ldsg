/**
 * 麦位大表情显示组件
 */
'use strict';

import React, { PureComponent } from 'react';
import { Image } from 'react-native';
import Config from '../../../../configs/Config';
import { SOCK_BRO_RoomResultRecreationBroadcast } from '../../../../hardcode/HSocketBroadcastEvent';
import DesignConvert from '../../../../utils/DesignConvert';
import ModelEvent from '../../../../utils/ModelEvent';
import FlashView from '../../../base/FlashView';



class _WebpPlayer extends PureComponent {
    constructor(props) {
        super(props);

        this._timer = null;
    }

    render() {
        this._timer && clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this.props.onEnd();
        }, 2000)

        const url = Config.getRecreationUrl(this.props.data.hdata.flashName + '.webp');

        return (
            <Image
                style={{
                    position: 'absolute',
                    width: DesignConvert.getW(55),
                    height: DesignConvert.getH(55),
                }}


                source={{uri: url}}
                // source={{uri: Config.getRecreationUrl(this.props.data.flashName + '.webp')}}
            />
        )
    }
}

class _MagicMovieView extends PureComponent {
    constructor(props) {
        super(props);
        // this.state = {};

        this._data = this.props.data;

        this._bMounted = true;
    }

    componentWillMount() {
        this._bMounted = true;
    }

    componentWillUnmount() {
        this._bMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if (!this._data) {
            this._data = nextProps.data;
        }
    }

    _doEnd() {
        const data = this._data;
        this._data = null;

        this.props.onEnd();

        this.forceUpdate();

        data && require('../../../../model/room/RoomPublicScreenModel').magicEmoji(data);
    }

    _onFlashEnd = () => {
        // console.log('_onFlashEnd+++++++++++++1');
        // console.warn(Date.now(), '+++++++++++  -1');
        if (!this._bMounted) return;
        // console.log('_onFlashEnd+++++++++++++2');
        // console.warn(Date.now(), '+++++++++++  -2');
        if (!this._data) return;

        // console.log('_onFlashEnd+++++++++++++3', this._data.hdata.stopTick);
        // console.warn(Date.now(), '+++++++++++  -3', this._data.hdata.stopTick);
        if (this._data.hdata.stopTick <= 0) {
            this._doEnd();
            return;
        }

        let info = this._data.hdata;
        let results = this._data.results;
        // console.log('_onFlashEnd+++++++++++++4');
        // console.warn(Date.now(), '+++++++++++  -5');
        setTimeout(
            () => {
                if (!this._bMounted) {
                    // console.log('_onFlashEnd+++++++++++++5');
                    // console.warn(Date.now(), '+++++++++++1');
                    return;
                }

                // if (this._data.hdata != info || results != this._data.results) {
                //     // console.log('_onFlashEnd+++++++++++++6');
                //     // console.warn(Date.now(), '+++++++++++2');
                //     return;
                // }
                // console.log('_onFlashEnd+++++++++++++7');

                this._doEnd();
            },
            info.stopTick
        );
    }

    render() {
        if (!this._data) {
            // console.log('render++++++++++2');
            return null;
        }
        const info = this._data.hdata;
        if (!info.flashName) {
            // console.log('render++++++++++3');
            return null;
        }

        const url = Config.getMagicFlash(info.flashName + '.zip', info.flashVersion);
        if (!url) {
            // console.log('render++++++++++4');
            return null;
        }

        const results = this._data.results;

        let stopWith;
        let fromIndex;
        let toIndex;
        let replaceTexture;
        switch (info.playType) {
            case 1:
                // 1、直接播放动画
                // 格式：1,最后一帧停留秒数
                break;

            case 2:
                // 2、播放到指定帧后，逐一显示抽取图片
                // 格式：2,最后一帧停留秒数,旧图片前缀,新图片前缀,指定帧序号,指定帧序号…,指定帧序号
                // return null;
                if (
                    !results
                    || !info.frameIndex
                    || results.length != info.frameIndex.length
                ) {
                    //数据错误
                    console.error('data error');
                    return null;
                }
                replaceTexture = [];
                if (info.frameIndex && results) {
                    const fil = info.frameIndex.length;
                    for (let i = 0; i < fil; ++i) {
                        replaceTexture.push({
                            anim: info.flashName,
                            from: info.frameIndex[i] - 1,
                            to: -1,
                            // to: ((i + 1) < fil ? info.frameIndex[i + 1] - 2 : -1),
                            oldTex: info.oldPrevName + i + '.png',
                            newTex: info.newPrevName + results[i] + '.png',
                        });
                    }
                }
                break;

            case 3:
                // 3、播放一次后，定在抽取的帧
                // 格式：3,最后一帧停留秒数,最后非抽取帧序号
                if (!results || results.length == 0) {
                    //数据错误
                    console.error('data error');
                    return null;
                }
                fromIndex = 0;
                toIndex = info.frameIndex - 1;
                stopWith = info.frameIndex + results[0];

                break;

            default:
                // console.log('render++++++++++5');
                return null;
        }


        // console.log('render++++++++++6');
        // console.log('url', url)
        // console.log('flashName', info.flashName)
        // console.log('stopWith', stopWith)
        // console.log('fromIndex', fromIndex)
        // console.log('toIndex', toIndex)
        // console.log('replaceTexture', replaceTexture)
        // console.log('stopTick', info.stopTick);

        return (
            <FlashView
                style={{
                    position: 'absolute',
                    width: DesignConvert.getW(55),
                    height: DesignConvert.getH(55),
                }}
                url={url}
                flashFileName={info.flashName}
                stopWith={stopWith}
                fromIndex={fromIndex}
                toIndex={toIndex}
                replaceTexture={replaceTexture}
                onEnded={this._onFlashEnd}
                // extraScale={[{
                //     x: this.outsizeWidth / DesignConvert.getW(93),
                //     y: this.outsizeHeight / DesignConvert.getW(93),
                // }]}
                // loopTimes={0}
            />
        );
    }
}

/* <_RecreationItem
    bMainMic={true}
    userId={userId}
/> */

export default class _RecreationItem extends PureComponent {

    constructor(props) {
        super(props);

        // this._data;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, SOCK_BRO_RoomResultRecreationBroadcast, this._playEmoji)
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, SOCK_BRO_RoomResultRecreationBroadcast, this._playEmoji)
    }

    _playEmoji = (data) => {
        // { results: [],
        //     roomId: 'A1001048',
        //     userId: '1001078',
        //     recreationId: 'R001',
        // }

        //hdata
        // "keys":["id","name","playType","num","range","msg","flashName","flashVersion","isShowScreen"]
        if (this.props.userId != data.userId) {
            return;
        }

        this._data = data;
        this.forceUpdate();
    }

    _onEnd = () => {
        this._data = null;
        this.forceUpdate();
    }

    render() {
        if (!this._data) {
            return null;
        }

        if (1 == this._data.hdata.playType) {
            return (
                <_WebpPlayer
                    data={this._data}
                    onEnd={this._onEnd}
                />
            )
        }

        return (
            <_MagicMovieView
                data={this._data}
                onEnd={this._onEnd}
            />
        )

        // // 大表情列表
        // //   { isShowScreen: '1',
        // //     flashName: 'chouqian',
        // //     msg: '',
        // //     num: '1',
        // //     playType: '3,1,60',
        // //     range: '0,8',
        // //     name: '抽麦序',
        // //     flashVersion: '0',
        // //     id: 'R021' },
        // const playType = this._data.playType && this._data.playType.split(',');
        // if (!playType) {
        //     return null;
        // }

        // // /**
        // //  * webp播放
        // //  */
        // // String WEBP_PLAY = "1";
        // // /**
        // //  * 目前只用于老虎机
        // //  */
        // // String HARD_PLAY = "2";
        // // /**
        // //  * 最后结果有概率控制，比如摇塞子
        // //  */
        // // String NORMAL_PLAY = "3";
        // // /**
        // //  * 支持一般的webp播放功能
        // //  */
        // // String SIMPLE_PLAY = "4";
        // switch (playType[0]) {
        //     case '1':
        //         //webp播放
        //         return (
        //             <_WebpPlayer
        //                 data={this._data}
        //                 onEnd={this._onEnd}
        //             />
        //         )
        //         break;

        //     case '2':
        //         break;

        //     case '3':
        //         break;

        //     case '4':
        //         break;

        //     default:
        //         return null;
        // }

        // return null;
    }
}