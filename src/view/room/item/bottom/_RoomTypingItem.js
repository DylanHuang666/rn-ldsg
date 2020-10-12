'use strict';

import React, { PureComponent } from "react";
import { View, Image, TouchableOpacity, Text, TextInput, Keyboard } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import { ic_chat } from "../../../../hardcode/skin_imgs/room";
import { ic_emoji, ic_photo } from "../../../../hardcode/skin_imgs/chat";


let _content = '';

export default class _RoomTypingItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
        // Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    }

    componentWillUnmount() {
        // Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow)
        // Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide)
    }

    _onChangeText = (txt) => {
        _content = txt;
    }

    _clickEmoji = () => {
        //TODO:
        // alert('点击了表情')
    }

    _clickPicture = () => {
        //TODO:
        // alert('点击了图片')
    }

    _clickSend = () => {
        if (!_content) {
            return;
        }

        this._keyboardDidHide();

        require("../../../../model/chat/ChatModel").sendRoomPublicScreenText(_content);
        _content = "";
    }

    // _keyboardDidShow = (e) => {
    //     if (!e) return;
    //     if (!e.endCoordinates) return;

    //     const _keyboardHeight = e.endCoordinates.height;
    //     if (!_keyboardHeight) return;

    //     this._viewRef && this._viewRef.setNativeProps(
    //         {
    //             style: {
    //                 bottom: _keyboardHeight
    //             }
    //         }
    //     )
    // }

    _keyboardDidHide = () => {
        require('../../../../utils/ModelEvent').default.dispatchEntity(
            null,
            require('../../../../hardcode/HLogicEvent').EVT_LOGIC_UPDATE_ROOM_KEYBOARD_CHANGE,
            false
        )
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    position: 'absolute',
                    bottom: 0,
                }}>

                <TouchableOpacity
                    onPress={this._keyboardDidHide}
                    style={{
                        flex: 1,
                    }}></TouchableOpacity>
                <View
                    ref={ref => this._viewRef = ref}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(40),
                        backgroundColor: '#000000',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={this._clickEmoji}
                        style={{
                            display:'none',
                            marginLeft: DesignConvert.getW(5),
                            marginRight: DesignConvert.getW(5),
                        }}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(30),
                                height: DesignConvert.getH(30),
                            }}
                            source={ic_emoji()}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._clickPicture}
                        style={{
                            display:'none',
                            marginLeft: DesignConvert.getW(5),
                            marginRight: DesignConvert.getW(5),
                        }}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(30),
                                height: DesignConvert.getH(30),
                            }}
                            source={ic_photo()}
                        />
                    </TouchableOpacity>

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <TextInput
                            style={{
                                marginStart:DesignConvert.getW(10),
                                fontSize: DesignConvert.getF(14),
                                color: '#FFFFFF',
                            }}
                            placeholder="输入点什么吧···"
                            placeholderTextColor="#FFFFFF"
                            underlineColorAndroid="transparent"
                            defaultValue={_content}
                            autoFocus={true}
                            onChangeText={this._onChangeText}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={this._clickSend}
                        style={{
                            marginLeft: DesignConvert.getW(15),
                            marginRight: DesignConvert.getW(15),
                            width: DesignConvert.getW(68),
                            height: DesignConvert.getH(30),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: DesignConvert.getW(10),
                            backgroundColor: 'yellow',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(14),
                                color: '#000000',
                            }}
                        >
                            {'发送'}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}