'use strict';

import React, { PureComponent } from "react";
import { Image, Text, View } from "react-native";
import Config from "../../../../configs/Config";
import { ESex_Type_MALE } from "../../../../hardcode/HGLobal";
import DesignConvert from "../../../../utils/DesignConvert";

export default class _PublicScreenMagicEmojiItem extends PureComponent {

    _onSender = () => {
        require('../../../../model/room/RoomUserClickModel').onClickUser(this.props.data.userInfo.userId, this.props.data.userInfo.nickName)
    }

    _renderResults() {
        const ret = [];

        for (const result of this.props.data.results) {
            ret.push(
                <Image
                    key={result}
                    style={{
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),

                        marginRight: DesignConvert.getW(8),
                    }}
                    source={{ uri: Config.getMagicResult(this.props.data.hdata.flashName, result, this.props.data.hdata.flashVersion) }}
                    resizeMode='stretch'
                />
            )
        }

        return ret;
    }

    render() {

        // { results: [],
        //     roomId: 'A1001048',
        //     userId: '1001078',
        //     recreationId: 'R001',
        // }

        //hdata
        // "keys":["id","name","playType","num","range","msg","flashName","flashVersion","isShowScreen"]

        //userInfo
        // 用户信息
        // message UserInfo {
        // 	required string userId = 1;//用户ID
        // 	optional string nickName = 2;//昵称	
        // 	optional int32 logoTime = 3;//修改logo的时间 0为没修改过
        // 	optional string thirdIconurl = 4;//第三方头像
        // 	optional string headFrameId = 5;// 头像框
        // 	optional int32 sex = 6;// 姓别 0 未知 1:男 2:女
        // 	optional int32 level = 7;//玩家等级
        // 	optional string phoneNum = 8;// 电话号码
        // 	optional int32 age = 9;//年龄	
        // 	optional string slogan = 10;//个性化签名
        // 	optional string position = 11;//地标	
        // 	optional string constellation = 12;//星座
        // 	optional string birthday = 13;//生日		
        // 	optional string banners = 14;//banner图，图ID列表，逗号分隔	

        // 	optional int32 vipLv = 15;//平台VIP等级 
        // 	optional int32 charmLv = 16;// 魅力等级
        // 	optional int64 charm = 17;// 魅力值
        // 	optional int32 contributeLv = 18;// 土豪等级
        // 	optional int64 contribute = 19;// 土豪值	

        // 	optional int32 goldShell = 20;// 金贝
        // 	optional int32 bindGoldShell = 21;// 绑定金贝	

        // 	optional int32 myLoves = 22;// 关注数
        // 	optional int32 friends = 23;// 被关注数(粉丝数) 
        // 	optional int32 friendStatus = 24;//好友状态 0是自己,1是好友,2已关注,3已被关注,4未被关注也没关注	
        // 	optional string friendRemark = 25;  // 好友备注

        // 	optional bool hasCar = 26;//是否拥有座驾
        // 	optional bool hasGift = 27;//是否收到礼物	

        // 	optional int32 momentNum = 28;// 动态数量
        // 	optional bool modifyTips = 29;// 编辑提示

        // 	optional string roomId = 30;//所在房间，若空，则不在房间
        // 	optional string roomName = 31;//房间名
        // 	optional int32 roomType = 32;//所在房间类型 ERoomMainType	
        // 	optional int32 roomStatus = 33;// 房间状态:0未开播,1开播未上锁,2开播上锁

        // 	optional bool followEnterRoom = 34;// 是否跟随进房
        // 	optional bool openTips = 35;// 开播提醒
        // 	optional bool shakeMicUp = 36;// 摇一摇上mic	

        // 	optional bool online = 37;  // 是否在线	
        // 	optional int32 lastLogoutTime = 38;//最后登出时间=0代表在线(需要加2017-01-01)	
        // 	optional bool official = 39;//是否为官方黑马
        // 	optional bool invisible = 40;//是否隐身

        // 	optional int64 totalLiveEarn = 41;//总收益(分)(已没用)
        // 	optional int64 dayLiveEarn = 42;//当天收益(分)(已没用)
        // 	optional int64 balance = 43;//可提现(分)(已没用)

        // 	optional int32 rabbitCoin = 44;//兔子币
        // 	optional string carId = 45;//当前使用的坐驾ID
        // 	optional string dialogFrameId = 46;//当前使用的对话框ID
        // 	optional bool isCertification = 47;//是否实名认证：true已实名认证，false未实名认证
        // 	optional bool isNew = 48;// 是否新用户
        // 	optional string familyId = 49;// 家族id

        // 	optional int32 pullBlackStatus = 50;// 拉黑状态
        // 	optional bool updatedSex = 51;// 是否修改过性别
        // 	optional int32 guardians = 52;// 守护我的人

        // 	repeated string useMedals = 53;//当前使用的勋章
        // 	optional int32 roomLogoTime = 54;//房间修改logo的时间 0为没修改过

        // 	optional Coordinate coordinate = 55;// 坐标，经纬度
        // 	optional bool isOpenLoveRing = 56;// 是否开启恋爱铃
        // 	optional bool isGuardian = 57;// 是否是守护团成员，true：是，false：否
        // 	optional bool isAcptMicInvt = 58;// 是否开启接受房间外连麦邀请

        // 	optional int32 roomSubType = 59;// 所在房间子类型 ERoomType(用于判断是否在相亲视频房)	
        // 	optional int32 matchmakerStatus = 60;// 月老/红娘 状态(-1:无关 0:申请中 1:通过 2:拒绝 3:取消资格)
        // 	optional bool notFriendNeedAgree = 61;// 非好友邀请进群是否需求同意，默认false不需要，true需要

        // 	optional UserCpInfo cpInfo = 62;// 用户cp

        // 	optional bool setPayPassword = 63;//是否已经设置支付密码（提现，回购时检查）
        // }

        const senderName = decodeURIComponent(this.props.data.userInfo.nickName);
        const contributeLv = this.props.data.userInfo.contributeLv;
        const senderIsMale = this.props.data.userInfo.sex == ESex_Type_MALE;

        return (
            <View
                style={{
                    marginBottom: DesignConvert.getH(10),
                    marginLeft: DesignConvert.getW(5),

                    backgroundColor: '#FFFFFF40',

                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(11),
                        flexDirection: 'row',
                        borderRadius: DesignConvert.getW(5),
                        padding: DesignConvert.getW(8),
                    }}
                >

                    <Image
                        source={require("../../../../hardcode/skin_imgs/main").mine_rich_lv(contributeLv)}
                        style={{
                            width: DesignConvert.getW(34),
                            height: DesignConvert.getH(15),
                            resizeMode: 'contain',
                        }}
                    />

                    <Text
                        style={{
                            color: senderIsMale ? '#A4AAFF' : '#FF8BC5',
                            fontSize: DesignConvert.getF(11),
                        }}
                        onPress={this._onSender}

                    >{` ${senderName} `}</Text>
                </Text>

                {this._renderResults()}
            </View >
        )
    }
}