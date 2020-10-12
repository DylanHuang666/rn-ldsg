/**
 * 房间礼物流光
 */

'use strict';

import React, { Component, PureComponent } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Config from "../../../../configs/Config";
import { EVT_LOGIC_GIFT_MY_ROOM } from "../../../../hardcode/HLogicEvent";
import { fonts_gift_map } from "../../../../hardcode/skin_imgs/fontImg";
import DesignConvert from "../../../../utils/DesignConvert";
import ModelEvent from "../../../../utils/ModelEvent";

const CD_TICK = 2 * 1000;


class _ImgNums extends Component {

    constructor(props) {
        super(props);

        this._scale = new Animated.Value(1)     // 起始值
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.vo == nextProps.vo) {
            //数据相同就不刷新吧
            return false;
        }

        this._startAnimated();
        return true;
    }

    componentDidMount() {
        this._startAnimated();
    }

    componentWillUnmount() {
        this._isCompUnmount = true;
        this._stopAnimated();
    }

    _stopAnimated = () => {
        if (this._animate) {
            this._animate.stop();
            this._animate = null;
        }
    }

    _startAnimated = () => {
        if (this._animate) {
            // console.warn('---------------------------222');
            this.props.onEnd(this.props.vo);
            return;
        }

        // 0 -> 0.5   从左到右
        // 5秒后消失

        // 起始值
        this._scale.setValue(1);

        this._animate = Animated.sequence(
            [
                Animated.timing(
                    this._scale,
                    {
                        toValue: 2,
                        duration: 100,
                        easing: Easing.ease,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
                Animated.delay(50),
                Animated.timing(
                    this._scale,
                    {
                        toValue: 1,
                        duration: 100,
                        easing: Easing.ease,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
            ]
        )

        this._animate.start(
            endState => {
                if (this._isCompUnmount) return;

                if (endState.finished) {
                    this._stopAnimated();

                    this.props.onEnd(this.props.vo);
                }
            }
        );
    }

    render() {
        return (
            <Animated.View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    transform: [{ scale: this._scale }]
                }}
            >
                {('x' + this.props.vo.combo).split('').map((item, index) => {
                    const vo = fonts_gift_map(item);
                    if (!vo) return null
                    return (<Image
                        key={index}
                        style={{
                            height: DesignConvert.getH(vo.h),
                            width: DesignConvert.getW(vo.w),
                            resizeMode: 'contain',
                        }}
                        source={vo.img}
                    />)
                })}
            </Animated.View>
        )
    }
}

export default class _RoomGiftComboItem extends PureComponent {

    constructor(props) {
        super(props);

        this._nowOp = null;
        this._opQueue = [];
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_GIFT_MY_ROOM, this._onData);
    }

    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_GIFT_MY_ROOM, this._onData);

        this._stopEndTimeout();
        this._nowOp = null;
        this._opQueue = [];
    }

    _onData = (list) => {
        // {
        //     data,
        //     receiverInfo,
        //     giftData,
        // }

        //data -------------
        // 房间送礼物广播通知
        // message LiveRoomSendGiftsBroadcast {
        // 	required UserResult.UserBase fromUserBase = 1;// 送礼用户Id
        // 	//required string fromNickName = 2;// 送礼用户昵称
        // 	required string giftId = 2;//赠送的礼物ID
        // 	required int32 giftNum = 3;//赠送的礼物数量
        // 	optional int32 fromCharmLevel = 4;// 送礼用户魅力等级
        // 	optional int32 fromContributeLevel = 5;// 送礼用户土豪等级
        // 	optional string roomId = 6;//房间ID
        // 	repeated LiveRoomGiftReceiverInfo receiverInfos = 7;//房间礼物接收者数据数组
        // 	optional int32 groupNum = 8;//礼物分组数量，默认1
        // 	optional int32 charm = 9;// 当前房间日贡献值:已无用
        // 	optional int32 broadcastType = 10;//播放类型:0默认普通播放,1房间跑道,2全服跑道
        // 	optional string roomName = 11;//房间名字(2全服跑道时传值)
        // 	optional string boxId = 12;//赠送的宝箱ID
        // 	optional int64 contribute = 13;// 当前房间日贡献值
        // 	optional bool roomAll = 14;//是否全房间
        // 	optional int64 newContribute = 15;// 当前房间日新贡献值(神豪值)
        // 	optional int32 price = 16;// 礼物单价(金贝数)
        // }

        // //房间礼物接收者数据
        // message LiveRoomGiftReceiverInfo {
        // 	required string toUserId = 1;// 接收用户Id
        // 	required string toNickName = 2;// 接收用户昵称
        // 	optional int32 toCharmLevel = 3;// 接收用户魅力等级
        // 	optional int32 toContributeLevel = 4;// 接收用户土豪等级
        // 	optional int64 toHeartValue = 5;// 接收用户交友心动值
        // 	optional int32 toSex = 6;//接收用户性别
        // }

        // //Mic位数据
        // message MicInfo {
        //     optional UserResult.UserBase base = 1;//用户(空为没有人)
        // 	optional int32 position = 2;//麦位1-N
        // 	optional bool lock = 3;//是否上锁
        // 	optional bool forbidMic = 4;//被禁麦
        // 	optional string friendRemark = 5;//好友备注名
        // 	optional bool openMic = 6;//是否开麦中
        // 	optional int64 forbidTime = 7;//被禁麦过期时间(时间戳) 0为没有禁麦
        // 	optional int64 heartValue = 8; //交友房(或抢帽子玩法或相亲视频房)此mic位上用户的心动值
        // 	optional string chooseId = 9; //交友房此mic位上用户选择的对象Id(空为没有选择)
        // 	optional int32 jobId = 10;// 身份id 0-官方人员 1-房主 2-嘉宾 3-管理员
        // 	optional string hatId = 11;// 抢帽子玩法的帽子id
        // 	optional bool isHatBuff = 12;// 是否在抢帽子玩法buff状态
        // 	repeated int32 dragonBalls = 13;// 黑8结果:为空未开结果,0值为?
        // 	repeated UserResult.UserBase contributeUser = 14;// 相亲视频房心动值贡献者信息
        // 	optional string banners = 15;// mic位上用户的banner图
        // 	optional bool openVideo = 16;// 是否开启了视频
        // 	optional int64 micOverTime = 17;//视频房男嘉宾mic位倒计时过期时间(-1为没限制)
        // 	optional int32 cardType = 18; //用户贵宾卡类型(3:星耀 2:钻石 1:白银 0:无卡)
        // }

        //receiverInfo: LiveRoomGiftReceiverInfo

        //giftData: "keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]

        const now = Date.now();

        let prevOp = null;
        if (this._opQueue.length > 0) {
            prevOp = this._opQueue[this._opQueue.length - 1];
        }

        const op = prevOp || this._nowOp;
        if (
            op
            // && now - op.tick < CD_TICK
        ) {
            for (const vo of list) {
                if (
                    op.data.data.fromUserBase.userId == vo.data.fromUserBase.userId
                    && op.data.receiverInfo.toUserId == vo.receiverInfo.toUserId
                    && op.data.data.giftId == vo.data.giftId
                ) {
                    this._opQueue.push({
                        tick: now,
                        combo: op.combo + vo.data.giftNum * vo.data.groupNum,
                        data: vo,
                    });
                    // console.log('1111^^^^^^^^^^^^^^', op.combo + vo.data.giftNum * vo.data.groupNum);
                    return;
                }
            }
        }

        const vo = list[0];
        this._opQueue.push({
            tick: now,
            combo: vo.data.giftNum * vo.data.groupNum,
            data: vo,
        });
        // console.log('2222^^^^^^^^^^^^^^', vo.data.giftNum * vo.data.groupNum);

        if (this._nowOp) {
            return;
        }

        this._nowOp = this._opQueue[0];
        this.forceUpdate();
    }

    _startEndTimeout() {
        this._stopEndTimeout();

        //延迟2000关闭
        this._timer = setTimeout(() => {
            if (this._opQueue.length > 0) {
                this._nowOp = this._opQueue[0];
                this.forceUpdate();
                return;
            }

            this._nowOp = null;
            this.forceUpdate();
        }, CD_TICK);
    }

    _stopEndTimeout() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    _onMovieEnd = (op) => {
        if (!this._opQueue) return;

        if (this._nowOp != op) {
            // console.warn('=================', this._opQueue.indexOf(this._nowOp), !!this._nowOp)
            return;
        }
        this._nowOp = null;

        if (this._opQueue.length == 0) {
            this._startEndTimeout();
            return;
        }

        this._nowOp = this._opQueue[0];
        this.forceUpdate();
    }


    render() {
        if (this._opQueue.length == 0) {
            return null;
        }
        if (!this._nowOp) {
            // console.warn('!!!!!!!!!!!!');
            this._nowOp = this._opQueue.shift();
        } else if (this._nowOp != this._opQueue[0]) {
            // console.warn('###############', this._opQueue.indexOf(this._nowOp), !!this._nowOp);
        } else {
            this._nowOp = this._opQueue.shift();
        }

        const sendUserHead = { uri: Config.getHeadUrl(this._nowOp.data.data.fromUserBase.userId, this._nowOp.data.data.fromUserBase.logoTime, this._nowOp.data.data.fromUserBase.thirdIconurl, 60) };
        const sendUserName = decodeURIComponent(this._nowOp.data.data.fromUserBase.nickName);
        const recvUserName = decodeURIComponent(this._nowOp.data.receiverInfo.toNickName);

        const giftUri = this._nowOp.data.giftData ? ({ uri: Config.getGiftUrl(this._nowOp.data.giftData.giftid, this._nowOp.data.giftData.alterdatetime) }) : null;

        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#CB5CFF', '#CB5CFF19']}
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(375) + DesignConvert.statusBarHeight,
                    left: DesignConvert.getW(15),

                    width: DesignConvert.getW(260),
                    height: DesignConvert.getH(44),

                    borderTopLeftRadius: DesignConvert.getW(25),
                    borderBottomLeftRadius: DesignConvert.getW(25),

                    flexDirection: 'row',
                    alignItems: 'flex-end',
                }}
            >
                <Image
                    style={{
                        margin: DesignConvert.getW(3),

                        width: DesignConvert.getW(38),
                        height: DesignConvert.getH(38),

                        borderRadius: DesignConvert.getW(19),
                    }}
                    source={sendUserHead}
                />

                <View
                    style={{
                        marginLeft: DesignConvert.getW(7),

                        height: DesignConvert.getH(44),

                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(13),
                            maxWidth: DesignConvert.getW(80),
                        }}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >{sendUserName}</Text>

                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: DesignConvert.getF(11),
                            }}
                        >打赏</Text>
                        <Text
                            style={{
                                marginLeft: DesignConvert.getW(2),

                                color: 'white',
                                fontSize: DesignConvert.getF(11),
                                maxWidth: DesignConvert.getW(40),
                            }}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >{recvUserName}</Text>
                    </View>

                </View>

                <Image
                    style={{
                        marginLeft: DesignConvert.getW(10),
                        marginBottom: DesignConvert.getH(3),

                        width: DesignConvert.getW(38),
                        height: DesignConvert.getH(38),

                    }}
                    source={giftUri}
                />

                <_ImgNums
                    vo={this._nowOp}
                    onEnd={this._onMovieEnd}
                />
            </LinearGradient>
        );
    }
}