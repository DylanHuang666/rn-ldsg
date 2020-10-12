/**
 * 1V1语音房 输入
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard } from 'react-native';
import DesignConvert from "../../../utils/DesignConvert";
import {
    ic_emoji,
    ic_photo,
    ic_gift,
} from "../../../hardcode/skin_imgs/chatroom";
import ImagePicker from 'react-native-image-crop-picker';
import { THEME_COLOR } from "../../../styles";
import LinearGradient from "react-native-linear-gradient";
import EmojiView from "../../chat/EmojiView";
import UploadModel from "../../../model/UploadModel";
import _ChatMicItem from "./_ChatMicItem";


class _SendBtn extends PureComponent {

    render() {
        if (this.props.enable) {
            return (
                <TouchableOpacity
                    onPress={this.props.onPress}>
                    <LinearGradient
                        angle={90}
                        colors={[THEME_COLOR, THEME_COLOR]}
                        style={{
                            width: DesignConvert.getW(50),
                            height: DesignConvert.getH(32),
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: DesignConvert.getW(16),
                        }}>
                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(13),
                            }}>{this.props.text}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            )
        } else {
            return (
                <LinearGradient
                    angle={90}
                    colors={["rgba(253, 118, 135, 0.8)", "rgba(253, 118, 135, 0.8)"]}
                    style={{
                        width: DesignConvert.getW(50),
                        height: DesignConvert.getH(32),
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: DesignConvert.getW(16),
                    }}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(13),
                        }}>{this.props.text}</Text>
                </LinearGradient>
            )
        }
    }
}

export default class ChatRoomInputView extends PureComponent {
    constructor(props) {
        super(props);

        this._textMessgae = "";
        //显示EmojiView
        this._bShowEmojiView = false;
    }

    _showEmoji = () => {
        Keyboard.dismiss();
        this._bShowEmojiView = !this._bShowEmojiView;
        this.forceUpdate();
    }

    _onEmptyPress = () => {
        this._bShowEmojiView = false;
        Keyboard.dismiss();
        this.forceUpdate();
    }

    _openCameralRoll = async () => {
        let data = await require("../../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 300,
                height: 400,
                cropping: false,
            });
            let timeStamp = Date.now();
            await UploadModel.uploadRoomChatPicFile(image.path, timeStamp)
            let photo = {
                key: `${timeStamp}`,
                width: 300,
                height: 400,
            }

            await require("../../../model/chat/ChatModel").sendRoomPublicScreenPhoto(photo);
        }
    }

    _onGiftPress = () => {
        require("../../../router/level3_router").showRoomGiftPanelView("");
    }

    _SendMessage = () => {
        if (!this._textMessgae) {
            return;
        }

        require("../../../model/chat/ChatModel").sendRoomPublicScreenText(this._textMessgae);
        this._textMessgae = "";
        this._onEmptyPress();
    }

    _onChangeText = (s) => {
        this._textMessgae = s;
        this.forceUpdate();
    }


    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        // this._bShowEmojiView = false;
        // this._isKeyboardDidShow = true;
        // this.forceUpdate();
    }

    _onFocus = () => {
        if (Platform.OS == "ios") {
            return
        }
        this._bShowEmojiView = false;
        this._isKeyboardDidShow = true;
        this.forceUpdate();
    }

    _keyboardDidHide = () => {
        //软键盘隐藏
        this._isKeyboardDidShow = false;
        this.forceUpdate();
    }

    _getRef = ref => {
        this.textInputRef = ref;
    }

    _onInputPress = () => {
        this.textInputRef && this.textInputRef.focus();
    }

    _addEmoji = s => {
        this._textMessgae = this._textMessgae + s;
        this.forceUpdate();
    }


    render() {
        return (
            <View>

                {this._isKeyboardDidShow || this._bShowEmojiView ? (
                    <TouchableOpacity
                        opacity={0}
                        onPress={this._onEmptyPress}
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.sheight,
                            position: "absolute",
                            //EmojiView高度+bottomLayout的高度
                            bottom: DesignConvert.getH(300 + 51),
                        }}>

                    </TouchableOpacity>
                ) : null
                }


                <View
                    style={{
                        width: DesignConvert.swidth,
                        paddingBottom: DesignConvert.addIpxBottomHeight(),
                        backgroundColor: "#27002C",
                    }}>

                    <View
                        style={{
                            flexDirection: "row",
                            height: DesignConvert.getH(51),
                            alignItems: "center",
                            paddingHorizontal: DesignConvert.getW(15),
                        }}>

                        {/* emoji */}
                        <TouchableOpacity
                            onPress={this._showEmoji}
                            style={{
                                marginRight: DesignConvert.getW(10),
                            }}>
                            <Image
                                style={{
                                    width: DesignConvert.getW(27),
                                    height: DesignConvert.getH(27),
                                }}
                                source={ic_emoji()}
                            />
                        </TouchableOpacity>


                        {/* 文本输入获取焦点 */}
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                height: DesignConvert.getH(51),
                                alignItems: "center",
                                display: this._isKeyboardDidShow || this._bShowEmojiView ? "flex" : "none",
                            }}>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}>

                            </View>

                        </View>

                        {/* 发送图片 */}
                        {this._isKeyboardDidShow || this._bShowEmojiView ? null : (
                            <TouchableOpacity
                                onPress={this._openCameralRoll}
                                style={{
                                    marginRight: DesignConvert.getW(10),
                                }}>
                                <Image
                                    style={{
                                        width: DesignConvert.getW(27),
                                        height: DesignConvert.getH(27),
                                    }}
                                    source={ic_photo()}
                                />
                            </TouchableOpacity>
                        )}

                        <View
                            style={{
                                width: DesignConvert.getW(this._isKeyboardDidShow || this._bShowEmojiView ? 248 : 192),
                                height: DesignConvert.getH(32),
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: DesignConvert.getW(16),
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: DesignConvert.getW(10),
                                paddingHorizontal: DesignConvert.getW(10),
                            }}>
                            <TextInput
                                ref={this._getRef}
                                style={{
                                    flex: 1,
                                    height: DesignConvert.getH(32),
                                    color: "white",
                                    fontSize: DesignConvert.getF(12),
                                    padding: 0,
                                }}
                                value={this._textMessgae}
                                keyboardType="default"
                                returnKeyType="send"
                                underlineColorAndroid="transparent"
                                placeholder="有些话，文字聊更方便"
                                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                                onChangeText={this._onChangeText}
                                selectionColor={THEME_COLOR}
                                onSubmitEditing={({ nativeEvent: { text, eventCount, target } }) => {
                                    this._SendMessage()
                                }}
                                numberOfLines={1}
                                onFocus={this._onFocus}
                            ></TextInput>
                        </View>

                        {this._isKeyboardDidShow || this._bShowEmojiView ? (
                            <_SendBtn
                                text="发送"
                                onPress={this._SendMessage}
                                enable={this._textMessgae != ""}></_SendBtn>
                        ) : null}

                        {/* 麦克疯 */}
                        {this._isKeyboardDidShow || this._bShowEmojiView ? null : (
                            <_ChatMicItem
                                style={{
                                    marginLeft: DesignConvert.getW(10),
                                }}
                            />
                        )}


                        {/* 发送礼物 */}
                        {this._isKeyboardDidShow || this._bShowEmojiView ? null : (
                            <TouchableOpacity
                                onPress={this._onGiftPress}
                                style={{
                                    marginLeft: DesignConvert.getW(10),
                                }}>
                                <Image
                                    style={{
                                        width: DesignConvert.getW(27),
                                        height: DesignConvert.getH(27),
                                    }}
                                    source={ic_gift()}
                                />
                            </TouchableOpacity>
                        )}


                    </View>

                    <EmojiView
                        callBack={this._addEmoji}
                        containerStyle={{
                            display: this._bShowEmojiView ? "flex" : "none",
                        }} />
                </View >
            </View >
        )
    }
}