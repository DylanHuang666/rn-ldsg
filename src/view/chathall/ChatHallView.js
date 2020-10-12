
/**
 * 公聊广场
 */
'user strict';

import React, { PureComponent } from "react";
import BaseView from "../base/BaseView";
import { View, FlatList, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from "react-native-linear-gradient";
import { icon_chathall } from "../../hardcode/skin_imgs/main";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE, EVT_LOGIC_CHAT_HALL } from "../../hardcode/HLogicEvent";
import { ic_logo_circle } from "../../hardcode/skin_imgs/common";
import MedalWidget from "../userinfo/MedalWidget";
import ToastUtil from "../base/ToastUtil";
import ChatHallModel from "../../model/chat/ChatHallModel";
import Config from "../../configs/Config";
import HeadFrameImage from "../userinfo/HeadFrameImage";
import KeyboardAvoidingViewExt from "../base/KeyboardAvoidingViewExt";
import { ic_location } from "../../hardcode/skin_imgs/chat";
import RoomInfoCache from "../../cache/RoomInfoCache";
import SexAgeWidget from "../userinfo/SexAgeWidget";



export default class ChatHallView extends BaseView {

    constructor(props) {
        super(props)

        this._index = 0

        this._chatHallData = []

        this._isInputState = false

        this._flatList

        this._lastId = ''

        this._loadData()
    }

    componentDidMount() {
        super.componentDidMount()
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE, this._changeInputState)
        ModelEvent.addEvent(null, EVT_LOGIC_CHAT_HALL, this._newMessage)
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE, this._changeInputState)
        ModelEvent.removeEvent(null, EVT_LOGIC_CHAT_HALL, this._newMessage)
    }

    _changeInputState = (bool) => {
        this._isInputState = bool
        if (this._isInputState && this._flatList) {

            setTimeout(() => {
                this._flatList.scrollToEnd({ animated: false })
            }, 200);
        }
        this.forceUpdate()
    }

    _newMessage = (data) => {
        this._chatHallData.push(data.message)
        this.forceUpdate()
    }

    _loadData = () => {

        if (this._chatHallData.length > 0) {

            this._lastId = this._chatHallData[0].id
        } else {
            this._lastId = ''
        }

        ChatHallModel.getLatestMessageList(this._lastId, 30)
            .then(data => {
                if (data) {

                    for (let i = 0; i <= data.length - 1; i++) {
                        this._chatHallData.unshift(data[i])

                    }
                    if (this._lastId == '' && this._flatList) {
                        setTimeout(() => {
                            this._flatList.scrollToEnd({ animated: false })
                        }, 500);
                    }
                    this.forceUpdate()

                }
            })

        // const data = [this._index++, this._index++, this._index++, this._index++, this._index++, this._index++, this._index++, this._index++, this._index++, this._index++,]

        // for (let i = 0; i <= data.length - 1; i++) {
        //     this._chatHallData.unshift(data[i])
        // }

    }

    _getFlatList = ref => {
        this._flatList = ref
    }

    _openInput = () => {
        this._changeInputState(true)
    }

    _enterLiveRoom = (roomId) => {

        //在房间
        if (RoomInfoCache.isInRoom && roomId == RoomInfoCache.roomId) {
            require('../../model/room/RoomModel').getRoomDataAndShowView(RoomInfoCache.roomId);
            return;
        }

        require('../../model/room/RoomModel').default.enterLiveRoom(roomId, '')
    }


    _renderItem = ({ item }) => {
        if (!item.userBase) {
            return null
        }

        const headUrl = Config.getHeadUrl(item.userBase.userId, item.userBase.logoTime, item.userBase.thirdIconurl)

        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    minHeight: DesignConvert.getH(67),
                    backgroundColor: 'white',
                    borderRadius: DesignConvert.getW(10),
                    marginTop: DesignConvert.getH(5),
                    marginBottom: DesignConvert.getH(5),
                    marginStart: DesignConvert.getW(15),
                    flexDirection: 'row',
                    padding: DesignConvert.getH(11),
                }}
            >

                <TouchableOpacity
                    style={{
                        width: DesignConvert.getW(45),
                        height: DesignConvert.getH(45),
                        borderRadius: DesignConvert.getW(25),
                        marginEnd: DesignConvert.getW(10),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        require('../../router/level2_router').showUserInfoView(item.userBase.userId);
                    }}
                >

                    <Image
                        style={{
                            width: DesignConvert.getW(45),
                            height: DesignConvert.getH(45),
                            borderRadius: DesignConvert.getW(25),
                        }}
                        source={{ uri: headUrl }}
                    />

                    <SexAgeWidget
                        sex={item.userBase.sex}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: DesignConvert.getW(13),
                        }}
                    />
                    {/* 
                    <HeadFrameImage
                        id={item.userBase.headFrameId}
                        width={45}
                        height={45}
                    /> */}
                </TouchableOpacity>


                <View
                    style={{
                        width: DesignConvert.getW(220)
                    }}
                >


                    <View
                        style={{

                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >

                        {/* <MedalWidget
                            richLv={item.userBase.contributeLv}
                            charmLv={item.userBase.charmLv}
                            width={DesignConvert.getW(34)}
                            height={DesignConvert.getH(14)}
                        /> */}

                        <Text
                            style={{
                                color: '#999999',
                                fontSize: DesignConvert.getF(11)
                            }}
                        >{item.userNickName}:</Text>
                    </View>

                    <View
                        style={{
                            marginTop: DesignConvert.getH(5),
                            minHeight: DesignConvert.getH(24),
                            justifyContent: "center",
                        }}>
                        <Text
                            style={{
                                color: '#333333',
                                fontSize: DesignConvert.getF(13),
                            }}
                        >
                            {item.message}
                        </Text>
                    </View>
                </View>


                {item.currentRoomId ?
                    <TouchableOpacity
                        onPress={() => {
                            this._enterLiveRoom(item.currentRoomId)
                        }}
                        style={{
                            alignItems: 'center',
                            marginStart: DesignConvert.getW(10),
                        }}
                    >

                        <Image
                            source={ic_location()}
                            style={{
                                width: DesignConvert.getW(18),
                                height: DesignConvert.getH(23),
                                resizeMode: 'contain'
                            }}
                        />

                        <Text
                            style={{
                                color: '#333333',
                                fontSize: DesignConvert.getF(11),
                                marginTop: DesignConvert.getH(3.5)
                            }}
                        >
                            {`去找他`}
                        </Text>

                    </TouchableOpacity>
                    : null
                }

            </View>
        )
    }

    render() {
        return (
            <KeyboardAvoidingViewExt
                behavior='height'
                style={{
                    flex: 1,
                }}
            >

                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#F0F0F0',
                    }}
                >

                    <BackTitleView
                        bgColor={['#CB5CFF', '#FF4D91']}
                        onBack={this.popSelf}
                        titleText={'公聊广场'}
                        backImgStyle={{
                            tintColor: 'white'
                        }}
                        titleTextStyle={{
                            color: 'white'
                        }}
                    />

                    <FlatList
                        ref={this._getFlatList}
                        data={this._chatHallData}
                        renderItem={this._renderItem}
                        onRefresh={this._loadData}
                        refreshing={false}
                        onScrollToIndexFailed
                        style={{
                            width: DesignConvert.swidth,
                            flex: 1,
                        }}
                    />

                    {!this._isInputState &&
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                right: DesignConvert.getW(10),
                                bottom: DesignConvert.getH(20) + DesignConvert.addIpxBottomHeight()
                            }}
                            onPress={this._openInput}
                        >

                            <Image
                                style={{
                                    width: DesignConvert.getW(60),
                                    height: DesignConvert.getH(60),
                                    resizeMode: 'contain',
                                }}
                                source={icon_chathall()}
                            />
                        </TouchableOpacity>
                    }

                    {this._isInputState &&
                        <View
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(51),
                            }}
                        />
                    }

                    {this._isInputState &&

                        <_renderInputItem />
                    }

                </View>

            </KeyboardAvoidingViewExt>
        )
    }
}

export class _renderInputItem extends PureComponent {

    _keyboardDidHide = () => {
        require('../../utils/ModelEvent').default.dispatchEntity(
            null,
            require('../../hardcode/HLogicEvent').EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE,
            false
        )
    }

    _onContent = s => {
        this._content = s
    }

    _onSend = () => {
        if (!this._content) {
            return
        }

        ChatHallModel.sendPublicMessage(this._content)
            .then(data => {
                if (data) {
                    //发送成功
                    this._keyboardDidHide()
                }
            })

    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    position: 'absolute',
                    bottom: 0,
                }}
            >

                <TouchableOpacity
                    style={{
                        flex: 1
                    }}
                    onPress={this._keyboardDidHide}
                />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(51),
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >

                    <View
                        style={{
                            flex: 1,
                            height: DesignConvert.getH(32),
                            borderWidth: DesignConvert.getW(1),
                            borderColor: '#F0F0F0',
                            borderWidth: DesignConvert.getW(1),
                            borderRadius: DesignConvert.getW(20),
                            justifyContent: 'center',
                            marginStart: DesignConvert.getW(15),
                            marginEnd: DesignConvert.getW(10),
                        }}
                    >
                        <TextInput
                            style={{
                                width: DesignConvert.getW(248),
                                padding: 0,
                                fontSize: DesignConvert.getF(12),
                                paddingStart: DesignConvert.getW(15),
                                paddingEnd: DesignConvert.getW(15),
                            }}
                            maxLength={20}
                            placeholder='文明聊天，禁涉黄涉政否者封号(限20字)'
                            placeholderTextColor='#D0D0D0'
                            autoFocus={true}
                            onChangeText={this._onContent}
                        />



                    </View>


                    <TouchableOpacity
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(32),
                            backgroundColor: '#FD7687',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: DesignConvert.getW(20),
                            marginEnd: DesignConvert.getW(15),
                        }}
                        onPress={this._onSend}
                    >
                        <Text
                            style={{
                                color: '#FFFFFF'
                            }}
                        >{`发送`}
                        </Text>
                    </TouchableOpacity>

                </View>

            </View >
        )
    }
}