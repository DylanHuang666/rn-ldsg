/**
 * 全屏幕 礼物、座驾
 */

import React, { PureComponent } from "react";
import { Image, View } from "react-native";
import SVGAPlayer from 'react-native-svga-player';
import Config from "../../../../configs/Config";
import { GIFT_FLASH } from "../../../../hardcode/ERoom";
import {
    EVT_LOGIC_CAR_ENTER,
    EVT_LOGIC_SHOW_FULL_SCREEN_WEBP,
    EVT_LOGIC_SHOW_FULL_SCREEN_FLASH,
} from "../../../../hardcode/HLogicEvent";
import DesignConvert from "../../../../utils/DesignConvert";
import ModelEvent from "../../../../utils/ModelEvent";
import AlphaVideoView from "../../../base/AlphaVideoView";
import FlashViewItem from "./item/FlashViewItem";

class _ImageItem extends PureComponent {

    constructor(props) {
        super(props);
        this._extraData = 0;
    }

    _onMovieEnd = () => {
        this.props.fnOnImageEnd();
    }

    // _onLoadEnd = () => {
    //     //TODO:
    //     //目前不知道动图播放完毕

    //     // "keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]
    //     const tick = (this.props.vo.giftData && this.props.vo.giftData.duration) ? this.props.vo.giftData.duration * 1000 : 5000;

    //     // console.warn('==============', this._extraData, this.props.vo.giftWebpUrl);

    //     setTimeout(() => {
    //         this.props.fnOnImageEnd();
    //     }, tick);
    // }

    render() {
        // const uri = `${this.props.vo.giftWebpUrl}key=${Date.now()}`;
        const uri = this.props.vo.giftWebpUrl;
        const extraData = ++this._extraData;//this.props.extraData;

        let resizeMode;
        switch (this.props.vo.showarea) {
            case 2://中间
                resizeMode = 'center';
                break;
            // case 1://底部
            // case 3://全屏
            default:
                resizeMode = 'cover';
        }

        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    position: "absolute",
                }}
                pointerEvents={"none"}
            >
                <Image
                    // onLoadEnd={this._onLoadEnd}
                    onMovieEnd={this._onMovieEnd}
                    onError={this._onMovieEnd}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        position: "absolute",
                        resizeMode,
                    }}
                    loop={1}
                    source={{
                        uri,
                        extraData,
                    }}
                />
            </View>

        );
    }
}

class _SvgaItem extends PureComponent {

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    position: "absolute",
                }}
                pointerEvents={"none"}
            >
                <SVGAPlayer
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        position: "absolute",
                    }}
                    loops={1}
                    onFinished={this.props.fnOnImageEnd}
                    source={this.props.vo.giftWebpUrl}
                />
            </View>

        );
    }
}

class _Mp4Item extends PureComponent {

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    position: "absolute",
                }}
                pointerEvents={"none"}
            >
                <AlphaVideoView
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        position: "absolute",
                    }}
                    onEnd={this.props.fnOnImageEnd}
                    onError={this.props.fnOnImageEnd}
                    url={this.props.vo.giftWebpUrl}
                />
            </View>

        );
    }
}

function _isSvga(animationname) {
    return animationname && animationname.indexOf('.svga') > 0;
}

function _isMp4(animationname) {
    return animationname && animationname.indexOf('.mp4') > 0;
}

function _isFlash(animationname) {

    return animationname && animationname === GIFT_FLASH
}

function _getRenderItem(animationname) {
    if (_isSvga(animationname)) {
        return _SvgaItem;
    }

    if (_isMp4(animationname)) {
        return _Mp4Item;
    }

    if (_isFlash(animationname)) {
        return FlashViewItem
    }

    return _ImageItem;
}

export default class _RoomFullScreenGiftItem extends PureComponent {

    constructor(props) {
        super(props);

        this._list = [];
        this._vo = null;
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_SHOW_FULL_SCREEN_WEBP, this._onData);
        ModelEvent.addEvent(null, EVT_LOGIC_CAR_ENTER, this._onCarData);
        ModelEvent.addEvent(null, EVT_LOGIC_SHOW_FULL_SCREEN_FLASH, this._onFlashData);

    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_SHOW_FULL_SCREEN_WEBP, this._onData);
        ModelEvent.removeEvent(null, EVT_LOGIC_CAR_ENTER, this._onCarData);
        ModelEvent.removeEvent(null, EVT_LOGIC_SHOW_FULL_SCREEN_FLASH, this._onFlashData);
    }

    _onData = (vo) => {
        // {
        //     giftWebpUrl,
        //     giftData,
        // }

        //.giftData
        // "keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]

        const data = {
            renderItem: _getRenderItem(vo.giftData.animationname),
            giftWebpUrl: vo.giftWebpUrl,
            // duration: vo.giftData.duration ? vo.giftData.duration * 1000 : 5000,
            showarea: vo.giftData.showarea,
        };
        if (!this._vo) {
            this._vo = data;
            this.forceUpdate();
            return;
        }

        this._list.push(data);
    }

    _onCarData = (vo) => {
        //用户进入房间通知
        // message EnterRoomBroadcast {
        // 	required string roomId = 1;//房间ID
        // 	required int32 mainType = 2;//房间类型
        // 	required UserResult.UserBase base = 3;//用户基本信息
        // 	optional int32 onlineNum = 4;//在线成员数	
        // 	required int32 index = 5;//位置
        // 	optional string carId = 6;//坐驾ID
        // 	optional int32 charmLv = 7;//魅力等级
        // 	optional int32 contributeLv = 8;// 财富等级	
        // 	optional bool openMirror = 9;//是否开启镜像
        // 	optional int32 identity = 10;// 1-普通用户，2-vip，3-富豪
        // 	optional int32 source = 11;//来源 1：寻友 
        // 	optional int64 loginTime = 12;//登陆房间时间
        // 	optional bool showCar = 13;// 是否播放座驾动画
        // 	optional int32 jobId = 14;//职位
        // 	optional bool isGuardian = 15;// 是否是守护团成员，true是，false不是
        // 	optional int32 guardianLv = 17;// 用户在守护团的等级
        // 	optional int32 cardType = 18;//用户贵宾卡类型	
        // }

        // .hcar
        //"keys":["alterdatetime","animationname","animationurl","biganimationname","biganimationurl","carid","carname","carpictureurl","carsummary","cartype","coinmonth","coinyear","endtime","exclusiveid","funlevel","gamecdkey","gameid","gifttype","h5url","id","indate","inserttime","mallurl","onedayprice","pictype","sequenceid","sevendayprice","starttime","valid"]

        const data = {
            renderItem: _getRenderItem(vo.hcar.animationname),
            giftWebpUrl: Config.getCarAnimationUrl(vo.hcar.carid, vo.hcar.alterdatetime),
            duration: vo.hcar.duration ? vo.hcar.duration * 1000 : 5000,
        };
        if (!this._vo) {
            this._vo = data;
            this.forceUpdate();
            return;
        }

        this._list.push(data);
    }

    _onFlashData = (vo) => {

        const data = {
            renderItem: _getRenderItem(GIFT_FLASH),
            boxData: vo.boxData,
            giftData: vo.giftData,
            animName: vo.animName,
            replaceTexFileName: vo.replaceTexFileName,
            url: vo.url
            // duration: vo.giftData.duration ? vo.giftData.duration * 1000 : 5000,
        };



        if (!this._vo) {
            this._vo = data;
            this.forceUpdate();
            return;
        }

        this._list.push(data);
    }

    _onItemEnd = () => {
        if (this._list.length > 0) {
            this._vo = this._list.shift();
        } else {
            this._vo = null;
        }
        this.forceUpdate();
    }

    render() {
        //如果为空清掉动画
        if (!this._vo) {
            return null;
        }

        return (
            <this._vo.renderItem
                vo={this._vo}
                fnOnImageEnd={this._onItemEnd}
            />
        )

    }
}