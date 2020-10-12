/**
 * 用户资料卡片
 */

'use strict';

import React,
{ PureComponent } from 'react';
import BaseView from '../base/BaseView';
import { View, TouchableOpacity, Image, Text, ImageBackground } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import ToastUtil from '../base/ToastUtil';
import Config from '../../configs/Config';
import {
    ic_send_gift,
    ic_open_chat,
    ic_send_goldshell,
    ic_close_usercard,
    icon_give,
    bg_usercard,
    ic_1v1,
} from '../../hardcode/skin_imgs/room';
import RoomInfoCache from '../../cache/RoomInfoCache';
import MedalWidget from '../userinfo/MedalWidget';
import AnnouncerModel, { isAnnouncer } from '../../model/main/AnnouncerModel';
import LinearGradient from 'react-native-linear-gradient';


export default class UserCardView extends BaseView {

    constructor(props) {
        super(props);


        this._userId = this.props.params.userId;
        this._nickName = '昵称加载中';

        this._age = 18;
        this._sex = 2;
        this._slogan = '';

        this._cutenumber = null//靓号
        this._cuteIcon = null//靓号icon
        this._richLv = 1;
        this._charmLv = 1;
        this._friendStatus = true;
        this._fansNum = 0;//粉丝数
        this._forceNum = 0;
        this._isAnnouncer = false;

        this._top = this.props.params.top;
        this._left = this.props.params.left;

        require('../../model/userinfo/UserInfoModel').default.getPersonPage(this._userId)
            .then(data => {
                if (data) {
                    this._age = data.age;
                    this._sex = data.sex;
                    this._slogan = data.slogan;
                    this._nickName = decodeURIComponent(data.nickName);
                    this._richLv = data.contributeLv;
                    this._charmLv = data.charmLv;
                    this._fansNum = data.friends;
                    this._forceNum = data.myLoves;
                    this._friendStatus = require('../../model/userinfo/UserInfoModel').default.isAddLover(data.friendStatus);
                    this._userHeadUrl = Config.getHeadUrl(this._userId, data.logoTime, data.thirdIconurl, 70);
                    this.forceUpdate();
                }
            });
        require('../../model/userinfo/UserInfoModel').default.getGoodId(this._userId)
            .then(data => {
                if (data) {
                    //设置靓号
                    this._cutenumber = data.cutenumber
                    this._cuteIcon = data.icon
                } else {
                    //没有靓号
                    this._cutenumber = null
                    this._cuteIcon = null
                }
                this.forceUpdate()
            })
    }

    async componentDidMount() {
        super.componentDidMount();
        await this._initData();
    }

    _initData = async () => {
        //判断是否声优
        let res = await isAnnouncer(this._userId);
        if (res === undefined) {
            this.forceUpdate();
            return
        }
        this._isAnnouncer = res;
        if (this._isAnnouncer) {
            this._AnnouncerData = await require("../../model/main/AnnouncerModel").default.getUserSkillInfo(this._userId)

        }
        this.forceUpdate();
    }

    _toChat = () => {
        this.popSelf();
        require('../../router/level2_router').showChatView(this._userId, decodeURI(this._nickName), false);
    };

    _addLover = async () => {
        if (this._friendStatus) return;

        this._friendStatus = await require('../../model/userinfo/UserInfoModel').default.addLover(this._userId, true);
        if (this._friendStatus) {
            ToastUtil.showCenter('关注成功');
        }
        this.forceUpdate();
    };

    _openUserInfo = () => {
        this.popSelf();
        require('../../router/level2_router').showUserInfoView(this._userId);
    };

    _open1V1 = () => {
        //1v1热聊
        this.popSelf();
        require("../../model/room/RoomModel").default.leave();
        AnnouncerModel.callAnchor(this._userId, this._AnnouncerData.price);
    }

    _sendGift = () => {
        //查询用户是否在麦上
        let _index = -1

        RoomInfoCache.roomData.infos.forEach((element, index) => {
            if (element && element.base && element.base.userId == this._userId) {
                _index = index
            }
        })

        //是否是主麦
        if (RoomInfoCache.mainMicUserInfo.userId == this._userId) {
            _index = 0
        }

        if (_index == -1) {
            ToastUtil.showCenter('该用户不在麦上,只能给麦上嘉宾送礼哦~')
            return
        }

        this.popSelf();
        require('../../router/level3_router').showRoomGiftPanelView(this._userId)
    };

    render() {
        const left = this.props.params.left;
        const top = this.props.params.top;
        return (
            <View
                style={{
                    flex: 1,

                    backgroundColor: 'rgba(255,255,255,0.2)',
                }}
            >

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                    }}
                    onPress={this.popSelf}
                />

                <View
                    style={{
                        position: 'absolute',
                        left: left,
                        top: top + DesignConvert.getH(76.5),

                        width: DesignConvert.getW(240),
                        height: DesignConvert.getH(165.5),

                        borderRadius: DesignConvert.getW(12),
                        backgroundColor: 'rgba(0,0,0,0.89)',
                    }}
                >
                    <Image
                        source={require('../../hardcode/skin_imgs/yuanqi').card_bg()}
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(-6.5),
                            left: !left ? DesignConvert.getW(55.5) : DesignConvert.getW(116.5),

                            width: DesignConvert.getW(8),
                            height: DesignConvert.getH(7.5),
                        }}

                    />

                    <View
                        style={{
                            flexDirection: 'row',

                        }}
                    >

                        <TouchableOpacity
                            onPress={this._openUserInfo}
                        >
                            <Image
                                style={{
                                    height: DesignConvert.getH(50),
                                    width: DesignConvert.getW(50),
                                    marginLeft: DesignConvert.getW(15),
                                    marginTop: DesignConvert.getH(15.5),

                                    borderRadius: DesignConvert.getW(6),
                                }}
                                source={{ uri: this._userHeadUrl }}>
                            </Image>
                        </TouchableOpacity>

                        <View
                            style={{
                                marginLeft: DesignConvert.getW(10),
                                marginTop: DesignConvert.getH(14.5),
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        maxWidth: DesignConvert.getW(160),
                                        marginRight: DesignConvert.getW(5),

                                        includeFontPadding: false,
                                        color: '#FFFFFF',
                                        fontSize: DesignConvert.getF(12),
                                        fontWeight: "bold",

                                    }}
                                    numberOfLines={1}
                                >
                                    {this._nickName}
                                </Text>
                                <Image
                                    source={this._sex == 2 ? require('../../hardcode/skin_imgs/yuanqi').card_woman()
                                        : require('../../hardcode/skin_imgs/yuanqi').card_man()}
                                    style={{
                                        width: DesignConvert.getW(13),
                                        height: DesignConvert.getH(13),
                                        marginRight: DesignConvert.getW(8),

                                        resizeMode: 'contain',
                                    }}
                                />
                                <MedalWidget
                                    richLv={this._richLv}
                                    charmLv={this._charmLv}
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',

                                    marginTop: DesignConvert.getH(5),
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {this._cuteIcon ?
                                        <Image
                                            source={require('../../hardcode/skin_imgs/yuanqi').card_lianghao()}
                                            style={{
                                                width: DesignConvert.getW(12),
                                                height: DesignConvert.getH(12),
                                                marginRight: DesignConvert.getW(5)
                                            }} />

                                        :
                                        null
                                    }

                                    <Text
                                        style={{
                                            includeFontPadding: false,
                                            fontSize: DesignConvert.getF(10),
                                            color: 'rgba(255,255,255,0.8)',
                                            lineHeight: DesignConvert.getH(14),
                                        }}>
                                        {`ID:${this._cutenumber ? this._cutenumber : this._userId}`}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',

                                }}
                            >
                                <Text
                                    style={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: DesignConvert.getF(10),
                                    }}
                                >粉丝：{this._fansNum}</Text>
                                <Text
                                    style={{
                                        marginLeft: DesignConvert.getW(10),

                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: DesignConvert.getF(10),
                                    }}
                                >关注：{this._forceNum}</Text>
                            </View>


                        </View>
                    </View>
                    <Text
                        style={{
                            includeFontPadding: false,
                            fontSize: DesignConvert.getF(12),
                            color: '#FFFFFF',
                            lineHeight: DesignConvert.getH(18),
                            marginTop: DesignConvert.getH(8),
                            marginLeft: DesignConvert.getW(15),
                            width: DesignConvert.getW(207.5),

                        }}
                        numberOfLines={2}
                    >
                        个性签名：{this._slogan}
                    </Text>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: DesignConvert.getH(15.5),

                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',

                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(24),
                            paddingHorizontal: DesignConvert.getW(18),


                        }}
                    >
                        <_BtnItem
                            onPress={this._openUserInfo}
                            source={require('../../hardcode/skin_imgs/yuanqi').card_chat()}
                        />

                        <_BtnItem
                            onPress={this._addLover}
                            source={this._friendStatus ? require('../../hardcode/skin_imgs/yuanqi').card_isfocus() : require('../../hardcode/skin_imgs/yuanqi').card_focus()}
                        />

                        {this._userHeadUrl ?
                            <_SendGoldShell
                                userId={this._userId}
                                nickName={this._nickName}
                                userHeadUrl={this._userHeadUrl}
                                popSelf={this.popSelf}
                            />
                            :
                            null
                        }

                        <_BtnItem
                            onPress={this._sendGift}
                            source={require('../../hardcode/skin_imgs/yuanqi').card_gift()}
                        />
                    </View>
                </View>
            </View>
        );
    }

}


class _SendGoldShell extends PureComponent {


    constructor(props) {
        super(props);

        //指定转赠id
        this._userId = this.props.userId;
        this._nickName = this.props.nickName;
        this._userHeadUrl = this.props.userHeadUrl;

        //转赠权限
        this._hadSendGoldPermiss = false;

        //查询是否有转赠权限
        require('../../model/mine/MyWalletModel').default.getMoneyGivingList()
            .then(data => {
                if (this._havaSendPermiss == data) {
                    return;
                }
                this._hadSendGoldPermiss = data;
                this.forceUpdate();
            });
    }

    //转赠
    _sendGoldShell = () => {
        this.props.popSelf();
        // require('../../model/mine/MyWalletModel').default.onWalletSendGoldShell(this._userId)
        require('../../model/mine/MyWalletModel').default.onLiveSendGoldShell(this._userId, this._nickName, this._userHeadUrl);
    };


    render() {

        // if (!this._hadSendGoldPermiss) {
        //     return null;
        // }

        return (
            <TouchableOpacity
                onPress={this._sendGoldShell}
            >
                <Image
                    style={{
                        height: DesignConvert.getH(24),
                        width: DesignConvert.getW(24),
                        resizeMode: 'contain',
                    }}
                    source={require('../../hardcode/skin_imgs/yuanqi').card_send()}>
                </Image>
            </TouchableOpacity>
        );
    }
}

class _BtnItem extends PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
            >
                <Image
                    source={this.props.source}
                    style={{
                        width: DesignConvert.getW(24),
                        height: DesignConvert.getH(24),
                        resizeMode: 'contain',
                    }}
                />
            </TouchableOpacity>
        )
    }
}
