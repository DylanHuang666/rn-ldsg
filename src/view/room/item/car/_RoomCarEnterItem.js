'use strict';

import React, { PureComponent } from "react";
import { Animated, Easing, Image, Text } from "react-native";
import Config from "../../../../configs/Config";
import { ic_enter_banner } from '../../../../hardcode/skin_imgs/room_gift';
import DesignConvert from "../../../../utils/DesignConvert";

/* <_RoomCarEnterItem
    key={key}
    keyIndex={key}
    item={vo}
    onEnd={this._onPlayEnd}
/> */

export default class _RoomCarEnterItem extends PureComponent {

    constructor(props) {
        super(props);

        this._translateXValue = new Animated.Value(DesignConvert.swidth)     // 起始值
        this._opacityValue = new Animated.Value(1);

        this._stopValue = 0;                // 0.5秒的出场地方
        this._firstStopDuration = 500;      // 出场时间

        this._secondDuration = 5000;        // 出场后停留五秒

        this._endLeaveDuration = 200;      // 渐变消失掉时间
    }

    componentDidMount() {
        this._startAnimated()
    }

    componentWillUnmount() {
        this._isCompUnmount = true;
        this._stopAnimated();
    }

    _stopAnimated = () => {
        this.animate && this.animate.stop();
        this.animate = null;
    }

    _startAnimated = () => {
        // 0 -> 0.5   从左到右
        // 5秒后消失

        // 起始值
        this._translateXValue.setValue(DesignConvert.swidth);
        this._opacityValue.setValue(1);

        this.animate = Animated.sequence(
            [
                Animated.timing(
                    this._translateXValue,
                    {
                        toValue: this._stopValue,
                        duration: this._firstStopDuration,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
                Animated.delay(this._secondDuration),
                Animated.timing(
                    this._opacityValue,
                    {
                        toValue: 0,
                        duration: this._endLeaveDuration,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
            ]
        )

        this.animate.start(
            endState => {
                if (this._isCompUnmount) return;

                if (endState.finished) {
                    this._stopAnimated();

                    this.props.onEnd(this.props.keyIndex);
                }
            }
        );
    }

    render() {

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

        const userName = decodeURIComponent(this.props.item.base.nickName);
        const userHeadUrl = Config.getHeadUrl(this.props.item.base.userId, this.props.item.base.logoTime, this.props.item.base.thirdIconurl, 60);

        const carName = this.props.item.hcar.carname;
        const carUrl = Config.getCarUrl(this.props.item.hcar.carid, this.props.item.hcar.alterdatetime);


        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(400) + DesignConvert.statusBarHeight,
                    width: DesignConvert.getW(340),
                    left: DesignConvert.getW(15),
                    height: DesignConvert.getH(68),
                    flexDirection: 'row',
                    alignItems: 'center',
                    transform: [{
                        translateX: this._translateXValue
                    }],
                    opacity: this._opacityValue,
                }}
            >

                <Image
                    resizeMode="contain"
                    source={ic_enter_banner()}
                    style={{
                        position: 'absolute',
                        width: DesignConvert.getW(340),
                        height: DesignConvert.getH(68),
                    }}
                />

                <Image
                    source={{ uri: userHeadUrl }}
                    style={{
                        width: DesignConvert.getW(44),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(20),
                        marginLeft: DesignConvert.getW(15),
                        marginRight: DesignConvert.getW(10),
                    }}
                />


                {/* 这里根据业务来调整吧 要怎么展示文字 */}
                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                        maxWidth: DesignConvert.getW(80),   // 50刚好显示4个字... 如果Text控件作为Text的子控件 貌似起不了作用
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{userName}</Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                    }}
                >骑着</Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFDA7E',
                        maxWidth: DesignConvert.getW(80),   // 80刚好显示五个字... 如果Text控件作为Text的子控件 貌似起不了作用
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{`"${carName}`}</Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                    }}
                >进入直播间</Text>

                <Image
                    source={{ uri: carUrl }}
                    style={{
                        width: DesignConvert.getW(44),
                        height: DesignConvert.getH(44),
                        resizeMode: 'contain',
                    }}
                />

            </Animated.View>
        );
    }
}