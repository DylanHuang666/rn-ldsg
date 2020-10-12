/**
 * 排麦面板
 */

'use strict';

import React, { PureComponent } from "react";
import BaseView from "../base/BaseView";
import { View, TouchableOpacity, FlatList, Text, Image } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import RoomInfoCache from "../../cache/RoomInfoCache";
import { ERoomActionType, ERoomModify } from "../../hardcode/ERoom";
import Config from "../../configs/Config";
import LinearGradient from "react-native-linear-gradient";
import ToastUtil from "../base/ToastUtil";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_UPDATE_ROOM_DATA } from "../../hardcode/HGlobalEvent";
import MicQueModel from "../../model/room/MicQueModel";
import { user } from "../../hardcode/skin_imgs/login";
import { sex_female, sex_male } from "../../hardcode/skin_imgs/common";
import { ic_mic_null } from "../../hardcode/skin_imgs/default";
import { ic_close_roommode, ic_open_roommode } from "../../hardcode/skin_imgs/room";
import MedalWidget from "../userinfo/MedalWidget";


export default class MicQueView extends BaseView {

    constructor(props) {
        super(props)

        this._roomMode = RoomInfoCache.roomData.roomMode //房间发言模式:0自由,1非自由
        this._micQues = RoomInfoCache.roomData.micQues
        this._micQueNum = this._micQues.length

        this._selfInMicQue = MicQueModel.selfInMicQue()//自己是否在排麦列表

        this._userId = null
    }

    componentDidMount() {
        super.componentDidMount();
        //监听房间数据变化，因为排麦数据是在房间数据里的
        ModelEvent.addEvent(null, EVT_UPDATE_ROOM_DATA, this._onRefresh)

        require("../../model/main/MinePageModel").default.getPersonPage()
            .then(data => {
                this._userId = data.userId;
                // this._nickName = decodeURI(data.nickName);
                // this._avatar = { uri: require("../../../configs/Config").default.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl) };
                // this._richLv = data.contributeLv;
                // this._charmLv = data.charmLv;
                // this._myLoves = data.myLoves;
                // this._fans = data.friends;
                // this._sex = data.sex;
                // this._age = data.age;
                // this._constellation = data.constellation;
                this.forceUpdate();
            });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        ModelEvent.removeEvent(null, EVT_UPDATE_ROOM_DATA, this._onRefresh)
    }

    _onRefresh = () => {
        this._roomMode = RoomInfoCache.roomData.roomMode //房间发言模式:0自由,1非自由
        this._micQues = RoomInfoCache.roomData.micQues
        this._micQueNum = this._micQues.length
        this._selfInMicQue = MicQueModel.selfInMicQue()
        this.forceUpdate()
    }

    _onChangeRoomMode = () => {
        if (this._roomMode == 0) {
            require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_ROOM_MODE_KEY, '1')
                .then(data => {
                    if (data) {
                        this._roomMode = 1
                        this.forceUpdate()
                    }
                })
        } else {
            require('../../model/room/RoomModel').default.modifyRoom(ERoomModify.UPDATE_ROOM_MODE_KEY, '0')
                .then(data => {
                    if (data) {
                        this._roomMode = 0
                        this.forceUpdate()
                    }
                })
        }
    }

    _removeQue = (userId) => {
        //移除
        require('../../model/room/MicQueModel').default.removeUser(userId)
    }

    _upMic = (userId) => {
        //抱上麦
        require('../../model/room/MicQueModel').default.upMicUser(userId)
    }

    _cancelMicQue = () => {
        //取消连麦
        require('../../model/room/MicQueModel').default.cancelMicQue()
    }

    _joinMicQue = () => {
        //加入连麦
        require('../../model/room/MicQueModel').default.joinMicQue()
    }

    _cleanMicQue = () => {
        //一键清空
        require('../../model/room/MicQueModel').default.cleanList()
    }

    _randomUpMic = () => {
        //随机上麦
        require('../../model/room/MicQueModel').default.randomUpMic()
    }
    //麦序
    _indexOfMic = () => {
        let ind = this._micQues.findIndex((item, index) => {
            return item.userId == this._userId
        })
        return ind + 1
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >

                <TouchableOpacity
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight,
                        position: 'absolute'
                    }}
                    onPress={this.popSelf}
                />

                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        // width: DesignConvert.swidth,
                        width: DesignConvert.getW(345),
                        paddingBottom: DesignConvert.addIpxBottomHeight(),
                        marginLeft: DesignConvert.getW(15),
                        marginRight: DesignConvert.getW(15),
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        flexDirection: 'column',
                        borderTopLeftRadius: DesignConvert.getW(12),
                        borderTopRightRadius: DesignConvert.getW(12),
                    }}>


                    <View
                        style={{
                            // width: DesignConvert.swidth,
                            height: DesignConvert.getH(70),
                            alignItems: 'center',
                            // paddingStart: DesignConvert.getW(18),
                        }}>

                        {/* <Text>排麦({this._micQueNum}人)</Text> */}

                        {/* {RoomInfoCache.haveRoomPermiss &&
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: DesignConvert.getH(18),
                                    right: 0,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onPress={this._onChangeRoomMode}
                            >

                                <Image
                                    style={{
                                        width: DesignConvert.getW(12),
                                        height: DesignConvert.getH(12),
                                        resizeMode: 'contain',
                                    }}
                                    source={this._roomMode == 0 ? ic_close_roommode() : ic_open_roommode()}
                                />

                                <Text
                                    style={{
                                        marginEnd: DesignConvert.getW(18),
                                        color: '#B8B8B8',
                                        fontSize: DesignConvert.getF(12),
                                        marginStart: DesignConvert.getW(5),
                                    }}
                                >{this._roomMode == 0 ? '关闭自由排麦' : '开启自由排麦'}</Text>
                            </TouchableOpacity>

                        } */}

                        {this._selfInMicQue && !RoomInfoCache.haveRoomPermiss ? (
                            <Text
                                // onPress={this._onGiftRecordPress}
                                style={{
                                    position: 'absolute',
                                    top: DesignConvert.getH(19),
                                    left: DesignConvert.getW(15),
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: DesignConvert.getF(12)
                                }}>
                                您的麦序:{this._indexOfMic()}
                            </Text>
                        ) : null}

                        {RoomInfoCache.haveRoomPermiss ? (
                            <Text
                                // onPress={this._onGiftRecordPress}
                                style={{
                                    position: 'absolute',
                                    top: DesignConvert.getH(19),
                                    left: DesignConvert.getW(15),
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: DesignConvert.getF(12)
                                }}>
                                排麦人数:{this._micQueNum}
                            </Text>
                        ) : null}

                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(17),
                                marginTop: DesignConvert.getH(15),
                            }}
                        >
                            {`排麦列表`}
                        </Text>

                        <TouchableOpacity
                            onPress={this.popSelf}
                            style={{
                                position: 'absolute',
                                top: DesignConvert.getH(18),
                                right: DesignConvert.getW(15),
                            }}
                        >
                            <Image
                                source={require("../../hardcode/skin_imgs/lvdong").set_dialog_close()}
                                style={{
                                    width: DesignConvert.getW(18),
                                    height: DesignConvert.getH(18),
                                }}
                            />
                        </TouchableOpacity>

                        {/* <Text
                            style={{
                                fontSize: DesignConvert.getF(11),
                                color: '#B8B8B8',
                                marginTop: DesignConvert.getH(5),
                            }}
                        >
                            {`当前模式:${this._roomMode == 0 ? '自由连麦' : '非自由连麦'}`}
                        </Text> */}
                    </View>

                    {this._micQues.length > 0 &&
                        <FlatList
                            data={this._micQues}
                            renderItem={this._renderItem}
                            style={{
                                // width: DesignConvert.swidth,
                                height: DesignConvert.getH(133),
                            }}
                        />
                    }

                    {this._micQues.length == 0 &&

                        <View
                            style={{
                                // width: DesignConvert.swidth,
                                height: DesignConvert.getH(133),
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >

                            <Image
                                style={{
                                    width: DesignConvert.getW(110),
                                    height: DesignConvert.getH(110),
                                }}
                                source={ic_mic_null()}
                            />

                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(13),
                                    color: '#FF4D91',
                                    marginTop: DesignConvert.getH(10),
                                }}
                            >{`还没有人上麦哦~`}</Text>


                        </View>

                    }


                    <View
                        style={{
                            // width: DesignConvert.swidth,
                            height: DesignConvert.getH(44),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: DesignConvert.getH(11.5)
                        }}>

                        {RoomInfoCache.haveRoomPermiss && this._micQueNum > 0 &&

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    left: DesignConvert.getW(0),
                                    width: DesignConvert.getW(160),
                                    height: DesignConvert.getH(44),
                                    borderRadius: DesignConvert.getW(50),
                                    backgroundColor: '#FFF3F5',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={this._cleanMicQue}
                            >
                                <Text
                                    style={{
                                        fontSize: DesignConvert.getF(13),
                                        color: '#FF95A4',
                                    }}
                                >{`清空排队列表`}</Text>
                            </TouchableOpacity>

                        }

                        {RoomInfoCache.haveRoomPermiss && this._micQueNum > 0
                            && <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#CD5BFB', '#FD4E95']}
                                style={{
                                    position: 'absolute',
                                    right: DesignConvert.getW(0),
                                    borderRadius: DesignConvert.getW(50),
                                    width: DesignConvert.getW(160),
                                    height: DesignConvert.getH(44),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontSize: DesignConvert.getF(15),
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: 'white'
                                    }}
                                    onPress={this._randomUpMic}
                                >随机上麦</Text>
                            </LinearGradient>
                        }


                        {this._selfInMicQue &&
                            <TouchableOpacity
                                style={{
                                    width: DesignConvert.getW(160),
                                    height: DesignConvert.getH(34),
                                    borderRadius: DesignConvert.getW(16),
                                    // backgroundColor: '#FFF3F5',
                                    fontSize: DesignConvert.getF(12),
                                    color: '#FF95A4',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={this._cancelMicQue}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    colors={['#FF5245', '#CD0031']}
                                    style={{
                                        width: DesignConvert.getW(160),
                                        height: DesignConvert.getH(34),
                                        borderRadius: DesignConvert.getW(16),
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: DesignConvert.getF(13),
                                            color: '#FFFFFF',
                                        }}
                                    >{`取消上麦`}</Text>
                                </LinearGradient>


                            </TouchableOpacity>
                        }



                        {!this._selfInMicQue && !RoomInfoCache.haveRoomPermiss
                            && <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#7479FF', '#B785FF']}
                                style={{
                                    borderRadius: DesignConvert.getW(5),
                                    color: '#A055FF',
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    marginStart: DesignConvert.getW(89),
                                    marginEnd: DesignConvert.getW(89),
                                }}>
                                <Text
                                    style={{
                                        width: DesignConvert.getW(196),
                                        height: DesignConvert.getH(40),
                                        fontSize: DesignConvert.getF(15),
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        color: 'white'
                                    }}
                                    onPress={this._joinMicQue}
                                >加入连麦</Text>
                            </LinearGradient>
                        }


                    </View>


                </View>

            </View >
        )
    }

    _renderItem = ({ item, index }) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(49),
                }}
            >

                <Text
                    style={{
                        width: DesignConvert.getW(35),
                        textAlign: 'center',
                        fontSize: DesignConvert.getF(13),
                        color: '#FFFFFF',
                    }}
                >
                    {index + 1}
                </Text>

                <Image
                    style={{
                        borderRadius: DesignConvert.getW(50),
                        width: DesignConvert.getW(35),
                        height: DesignConvert.getH(35),
                    }}
                    source={{ uri: Config.getHeadUrl(item.userId, item.logoTime, item.thirdIconurl, 44) }}
                />

                <Text
                    numberOfLines={1}
                    style={{
                        marginStart: DesignConvert.getW(12),
                        fontSize: DesignConvert.getF(13),
                        color: '#FFFFFF',
                        maxWidth: DesignConvert.getW(60),
                    }}
                >{decodeURIComponent(item.nickName)}</Text>

                {/* <Image
                    style={{
                        width: DesignConvert.getW(18),
                        height: DesignConvert.getH(18),
                        resizeMode: 'contain',
                        marginStart: DesignConvert.getW(5),
                    }}
                    source={item.sex == 2 ? sex_female() : sex_male()}
                /> */}

                <MedalWidget
                    width={DesignConvert.getW(34)}
                    height={DesignConvert.getH(16)}
                    richLv={item.contributeLv}
                    charmLv={item.charmLv}
                // containerStyle={{
                //     marginTop: DesignConvert.getH(10),
                // }}
                />

                {RoomInfoCache.haveRoomPermiss &&
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: DesignConvert.getW(92),
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(24),
                            borderRadius: DesignConvert.getW(20),
                            backgroundColor: '#FFF3F5',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            this._removeQue(item.userId)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(11),
                                color: '#FF95A4',
                            }}

                        >移除</Text>

                    </TouchableOpacity>
                }

                {RoomInfoCache.haveRoomPermiss &&

                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(47),
                            height: DesignConvert.getH(24),
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            borderRadius: DesignConvert.getW(16),
                            right: DesignConvert.getW(40),
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={['#FFCF12', '#FF5400']}
                            style={{
                                justifyContent:'center',
                                alignItems:'center',
                                width: DesignConvert.getW(47),
                                height: DesignConvert.getH(24),
                                borderRadius: DesignConvert.getW(16),
                            }} >
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(11),
                                    color: '#FFFFFF'
                                }}
                                onPress={() => {
                                    this._upMic(item.userId)
                                }}
                            >抱上麦</Text>
                        </LinearGradient>



                    </TouchableOpacity>


                }

            </View >
        )
    }
}