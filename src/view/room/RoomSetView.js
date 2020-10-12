/**
 * 房间设置
 */

'use strict';

import React, { PureComponent } from 'react';
import BaseView from "../base/BaseView";
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import RoomInfoCache from '../../cache/RoomInfoCache';
import { ic_room_movie_open, ic_room_movie_close } from '../../hardcode/skin_imgs/room_more';
import { ERoomActionType, ERoomModify } from '../../hardcode/ERoom';
import ModelEvent from '../../utils/ModelEvent';
import { EVT_LOGIC_REFRESH_ROOM_MORE } from '../../hardcode/HLogicEvent';
import { THEME_COLOR } from '../../styles';
import ImagePicker from 'react-native-image-crop-picker';
import ToastUtil from '../base/ToastUtil';
import { arrow_right } from '../../hardcode/skin_imgs/common';
import LinearGradient from 'react-native-linear-gradient';
import Config from '../../configs/Config';


function _getRecentRoomBgDatas(voiceRoomBackgroundList, bgs) {
    if (!voiceRoomBackgroundList || !bgs) {
        return [];
    }

    const ret = [];
    for (let i = 0; i < bgs.length; ++i) {
        const id = bgs[i];
        for (let j = 0; j < voiceRoomBackgroundList.length; ++j) {
            // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
            const voiceRoomBackground = voiceRoomBackgroundList[j];

            if (id == voiceRoomBackground.backgroundid) {
                ret.push(voiceRoomBackground);
            }
        }
    }

    return ret;
}

class RoomTypeItem extends PureComponent {

    _onPress = () => {
        this.props.onPress(this.props.index, this.props.data);
    }

    render() {

        const textStyle = this.props.selected
            ? {
                color: '#FFFFFF',
                fontSize: DesignConvert.getF(13),
            }
            : {
                color: '#808080',
                fontSize: DesignConvert.getF(13),
            };

        return (
            <TouchableOpacity
                style={{
                    marginRight: DesignConvert.getW(18),
                    marginBottom: DesignConvert.getH(12.5),
                }}
                onPress={this._onPress}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={this.props.selected ? ['#CD5BFB', '#FD4E95'] : ["#0000001A", "#0000001A"]}
                    style={{
                        width: DesignConvert.getW(100),
                        height: DesignConvert.getH(44),
                        borderRadius: DesignConvert.getW(5),
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={textStyle}
                    >{this.props.data.type}</Text>
                </LinearGradient>
            </TouchableOpacity>

        );
    }
}


class RoomTypesListView extends PureComponent {

    _onPress = (index, data) => {
        this.props.onChangeRoomType(index, data);
    }

    _renderItems() {
        if (!this.props.datas || this.props.datas.length == 0) {
            return null;
        }

        const ret = [];

        for (let i = 0; i < this.props.datas.length; ++i) {
            ret.push(
                <RoomTypeItem
                    key={i}
                    selected={this.props.selectedIndex == i}
                    index={i}
                    data={this.props.datas[i]}
                    onPress={this._onPress}
                />
            );
        }
        return ret;
    }

    render() {
        return (
            <View
                style={{
                    marginTop: DesignConvert.getW(12),
                    marginLeft: DesignConvert.getW(15),
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                {this._renderItems()}
            </View>
        )
    }
}


export default class RoomSetView extends BaseView {

    constructor(props) {
        super(props)

        this._myHead = null;
        this._roomTitle = RoomInfoCache.roomData.roomName
        this._count = decodeURIComponent(this._roomTitle).length
        this._needPwd = RoomInfoCache.roomData.needPassword
        this._roomPwd = RoomInfoCache.roomData.password

        this._iRoomTypeList = null;
        this._selectIndex = 0;
        this._selectData = null;

        this._selectBgId = RoomInfoCache.roomData.bg

        require('../../model/user/UserInfoModel').default.getMyHeadUrl(Math.ceil(DesignConvert.toPixel(70)))
            .then(uri => {
                if (uri) {
                    this._myHead = uri;
                    this.forceUpdate();
                }

            });

    }

    componentDidMount() {
        super.componentDidMount()
        ModelEvent.addEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)

        require('../../model/room/ReadyToStartBroadcastingModel').default.getInfo()
            .then(data => {

                if (!data) return;
                this._iRoomTypeList = data.iRoomTypeList;
                this._selectIndex = data.selectIndex;
                this._selectData = this._iRoomTypeList[this._selectIndex];
                this.forceUpdate();
            });


    }

    componentWillUnmount() {
        super.componentWillUnmount()
        ModelEvent.removeEvent(null, EVT_LOGIC_REFRESH_ROOM_MORE, this._refresh)
    }


    _onChangeRoomIcon = async () => {
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 400,
                height: 400,
                cropping: true,
            });
            this._roomImagPath = image.path;
            this._myHead = { uri: image.path };
            this.forceUpdate();
        }
    }

    _refresh = () => {
        this.forceUpdate()
    }


    _onManager = () => {
        require("../../router/level3_router").showRoomManagerView(RoomInfoCache.roomId);
    }

    // _onBlack = () => {
    //     require('../../router/level3_router').showRoomBlackListView();
    // }

    _onOpenRoomMovie = () => {
        if (RoomInfoCache.isGiftAnimation) {
            //关闭
            require("../../router/level2_router").showNormInfoDialog("关闭后将看不到礼物特效，运作更加流畅，是否确认关闭礼物特效。",
                "确定", this._onCloseRoomMovie,
                "取消", undefined);
        } else {
            //打开
            require('../../model/room/RoomModel').default.action(ERoomActionType.OPEN_GIFT_ANIMATION, 0, '')
        }
    }

    _onCloseRoomMovie = () => {
        require('../../model/room/RoomModel').default.action(ERoomActionType.CLOSE_GIFT_ANIMATION, 0, '')
    }

    _onSave = () => {

        if (!this._roomTitle) {
            ToastUtil.showCenter('请输入房间标题')
            return
        }

        // if (this._needPwd && !this._roomPwd) {
        //     ToastUtil.showCenter('请输入房间密码')
        //     return
        // }
        // if (this._needPwd && (this._roomPwd.length == 0 || this._roomPwd.length < 4)) {
        //     ToastUtil.showCenter('请输入房间密码')
        //     return
        // }

        if (this._roomImagPath) {
            require("../../model/UploadModel").default.uploadRoomImage(this._roomImagPath, RoomInfoCache.roomId);
            require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_ROOM_LOGO, '1')
        }

        if (this._roomTitle) {
            require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_ROOM_NAME, this._roomTitle)
        }

        if (this._needPwd) {
            if (this._roomPwd) {
                require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_PASSWORD_KEY, this._roomPwd)
            }
        } else {
            require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_PASSWORD_KEY, '')
        }

        if (RoomInfoCache.roomData.bg != this._selectBgId) {
            require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_BG_KEY, this._selectBgId)
        }

        this.popSelf()
    }

    _onChangeBg = () => {
        if (!this._selectData) return;

        require('../../router/level3_router').showRoomBgChooseView(
            this._selectBgId,
            this._onChooseBg
        );
    }

    //更改房间背景
    _onChooseBg = (bg) => {
        this._selectBgId = bg.backgroundid
        this.forceUpdate();
    }



    _onChangeRoomName = s => {
        this._roomTitle = s
        this._count = s.length
        this.forceUpdate()
    }

    _onChangPwd = s => {
        this._roomPwd = s
    }

    _rederCode = () => {
        if (!this._needPwd) {
            return null
        }
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    marginStart: DesignConvert.getW(30),
                }}
            >

                <View
                    style={{
                        position: 'absolute',
                        marginTop: DesignConvert.getH(2),
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}

                >
                    {[0, 1, 2, 3].map(item => {
                        return (
                            <View
                                style={{
                                    width: DesignConvert.getW(50),
                                    height: DesignConvert.getH(50),
                                    borderColor: '#CDCDCD',
                                    borderWidth: DesignConvert.getW(1),
                                    borderRadius: DesignConvert.getW(10),
                                    marginEnd: DesignConvert.getW(10),
                                    marginStart: DesignConvert.getW(10),
                                }}
                            ></View>
                        )
                    })}
                </View>


                <TextInput
                    maxLength={4}
                    textAlign="left"
                    style={{
                        height: DesignConvert.getH(50),
                        letterSpacing: Platform.OS === 'ios' ? DesignConvert.getW(60) : DesignConvert.getW(59),
                        color: 'black',
                        fontSize: DesignConvert.getF(18),
                        // selectionColor: 'red',
                        // backgroundColor: 'red',
                        padding: 0,
                        marginLeft: Platform.OS === 'ios' ? DesignConvert.getW(30) : 0
                    }}

                    selectionColor='#000000'
                    keyboardType='number-pad'
                    underlineColorAndroid="transparent"
                    returnKeyType='next'
                    onChangeText={this._onChangPwd}
                    defaultValue={this._roomPwd}
                // onSubmitEditing={this._onLogin}
                />

            </View>
        )
    }

    _onChangeRoomType = (index, data) => {
        if (this._selectIndex == index) {
            return;
        }

        this._selectIndex = index;
        this._selectData = data;
        this.forceUpdate();
    }

    render() {


        const voiceRoomBackgroundUrl = require("../../configs/ImageUrl").voiceRoomBackgroundUrl;

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF'
                }}
            >
                <BackTitleView
                    titleText={'房间设置'}
                    rightText={'保存'}
                    onBack={this.popSelf}
                    onRightPress={this._onSave}
                />

                <View
                    style={{
                        height: DesignConvert.getH(61),
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginStart: DesignConvert.getW(15),
                        marginEnd: DesignConvert.getW(15),
                    }}
                >

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(13),
                            color: '#B8B8B8'
                        }}
                    >房间封面</Text>

                    <View
                        style={{
                            flex: 1,
                        }}
                    />

                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(50),
                        }}
                        onPress={this._onChangeRoomIcon}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(44),
                                height: DesignConvert.getH(44),
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: DesignConvert.getW(5),
                            }}
                            source={this._myHead}
                        >
                        </Image>

                    </TouchableOpacity>

                    <Image
                        style={{
                            width: DesignConvert.getW(7),
                            height: DesignConvert.getH(13),
                            marginStart: DesignConvert.getW(13),
                            marginEnd: DesignConvert.getW(15),
                        }}
                        source={arrow_right()}
                    />
                </View>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(13),
                        color: '#B8B8B8',
                        marginStart: DesignConvert.getW(15),
                        marginBottom: DesignConvert.getH(10),
                        marginTop: DesignConvert.getH(10),
                    }}
                >房间名称</Text>

                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(50),
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginStart: DesignConvert.getW(15),
                        marginEnd: DesignConvert.getW(15),
                        backgroundColor: '#F9F9F9',
                        borderRadius: DesignConvert.getW(5)
                    }}
                >
                    <TextInput
                        style={{
                            color: 'black',
                            flex: 1,
                            height: DesignConvert.getH(50),
                            fontSize: DesignConvert.getF(15),
                            marginTop: DesignConvert.getH(2),
                        }}

                        maxLength={15}
                        underlineColorAndroid="transparent"
                        placeholder="请输入房间标题"
                        placeholderTextColor="#00000080"
                        selectionColor={THEME_COLOR}
                        defaultValue={decodeURIComponent(this._roomTitle)}
                        onChangeText={this._onChangeRoomName}
                    />

                    <Text
                        style={{
                            color: '#6D6D6D',
                            fontSize: DesignConvert.getF(13),
                            marginStart: DesignConvert.getW(12),
                            marginEnd: DesignConvert.getW(12),
                        }}
                    >
                        {this._count}

                        <Text
                            style={{
                                color: '#B8B8B8'
                            }}
                        >
                            {`/15`}
                        </Text>

                    </Text>

                </View>

                {/* 
                <View
                    style={{
                        height: DesignConvert.getH(50),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginStart: DesignConvert.getW(15),
                        marginEnd: DesignConvert.getW(15),
                    }}
                    onPress={this._onBlack}
                >

                    <Text>房间密码</Text>

                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(54),
                            height: DesignConvert.getH(27),
                            backgroundColor: this._needPwd ? THEME_COLOR : '#E0E0E0',
                            borderRadius: DesignConvert.getW(50),
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            this._needPwd = !this._needPwd
                            this.forceUpdate()
                        }}
                    >

                        {!this._needPwd &&
                            <View
                                style={{
                                    position: 'absolute',
                                    left: DesignConvert.getW(1.5),
                                    top: DesignConvert.getH(1.5),
                                    width: DesignConvert.getW(24),
                                    height: DesignConvert.getH(24),
                                    backgroundColor: 'white',
                                    borderRadius: DesignConvert.getW(25),
                                }}
                            />
                        }

                        {this._needPwd &&
                            <View
                                style={{
                                    position: 'absolute',
                                    right: DesignConvert.getW(1.5),
                                    top: DesignConvert.getH(1.5),
                                    width: DesignConvert.getW(24),
                                    height: DesignConvert.getH(24),
                                    backgroundColor: 'white',
                                    borderRadius: DesignConvert.getW(25),
                                }}
                            />}

                    </TouchableOpacity>
                </View>

                <this._rederCode /> */}

                <View
                    style={{
                        height: DesignConvert.getH(50),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingStart: DesignConvert.getW(15),
                        paddingEnd: DesignConvert.getW(15)
                    }}
                >

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(13),
                            color: '#808080',
                            marginEnd: DesignConvert.getW(30),
                        }}
                    >
                        {'房间类型'}
                    </Text>

                </View>

                <RoomTypesListView
                    datas={this._iRoomTypeList}
                    selectedIndex={this._selectIndex}
                    onChangeRoomType={this._onChangeRoomType}
                />

                <TouchableOpacity
                    style={{
                        width: DesignConvert.swidth,
                        marginTop: DesignConvert.getH(30),
                        height: DesignConvert.getH(44),
                        flexDirection: 'row',
                        alignItems: 'center',
                        // justifyContent: 'flex-start',
                        // alignItems: 'center',
                    }}
                    onPress={this._onChangeBg}
                >
                    <Text
                        style={{
                            marginLeft: DesignConvert.getW(15),
                            color: '#B8B8B8',
                            fontSize: DesignConvert.getF(13),
                        }}
                    >房间背景</Text>

                    <View
                        style={{
                            flex: 1,
                        }}
                    />

                    <Image
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(35),

                            width: DesignConvert.getW(40),
                            height: DesignConvert.getH(40),

                            borderRadius: DesignConvert.getW(5),

                            // justifyContent: 'center',
                            // alignItems: 'center',
                        }}
                        source={voiceRoomBackgroundUrl(this._selectBgId)}
                    />

                    <Image
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(15),
                            right: DesignConvert.getW(15),

                            width: DesignConvert.getW(7),
                            height: DesignConvert.getH(13),
                        }}
                        source={arrow_right()}
                    />

                </TouchableOpacity>
            </View >
        )
    }
}