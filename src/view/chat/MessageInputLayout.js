/**
 * 消息输入
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList, TextInput, Keyboard, PanResponder, CameraRoll, Platform } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../utils/DesignConvert";
import Config from "../../configs/Config";
import ToastUtil from "../base/ToastUtil";
import StatusBarView from "../base/StatusBarView";
import BaseView from "../base/BaseView";
import { ic_emoji, ic_photo, ic_expand, ic_collapse, ic_voice, ic_keyboard, ic_gift, ic_chat_more } from "../../hardcode/skin_imgs/chat";
import ImagePicker from 'react-native-image-crop-picker';
import DataCardModel from "../../model/chat/DataCardModel";
import EmojiView from "./EmojiView";
import FastReplayView from './FastReplyView';
import { THEME_COLOR } from "../../styles";



class _SendBtn extends PureComponent {

    render() {
        if (this.props.enable) {
            return (
                <TouchableOpacity
                    onPress={this.props.onPress}>
                    <LinearGradient
                        angle={90}
                        colors={["#FF5245", "#CD0031"]}
                        style={{
                            width: DesignConvert.getW(44),
                            height: DesignConvert.getH(24),
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: DesignConvert.getW(12),

                            marginRight: DesignConvert.getW(5)
                        }}>
                        <Text
                            style={{
                                color: "white",
                                fontSize: DesignConvert.getF(14),
                            }}>{this.props.text}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            )
        } else {
            return (
                <LinearGradient
                    angle={90}
                    colors={["#FF5245", "#CD0031"]}
                    style={{
                        width: DesignConvert.getW(44),
                        height: DesignConvert.getH(24),
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: DesignConvert.getW(12),

                        marginRight: DesignConvert.getW(5)
                    }}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(14),
                        }}>{this.props.text}</Text>
                </LinearGradient>
            )
        }
    }
}

const [AUDIO, TEXT] = ["AUDIO", "TEXT"];
export default class MessageInputLayout extends PureComponent {
    constructor(props) {
        super(props);

        this._textMessgae = "";
        this.inputType = TEXT;

        //显示更多功能
        this._showMore = false;

        //显示EmojiView
        this._bShowEmojiView = false;

        //显示快捷用语
        this._showFastReplay = false;

        this._isRecording = false;
        this._maxDy = DesignConvert.getH(70);
        this._panResponder = PanResponder.create({
            // 返回ture时，表示该组件愿意成为触摸事件的响应者，如触摸点击。默认返回false。
            onStartShouldSetPanResponder: () => true,
            // 返回ture时，表示该组件愿意成为触摸(滑屏)事件的响应者，如触摸滑屏，默认返回false。
            onMoveShouldSetPanResponder: () => true,
            // 与onStartShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高
            onStartShouldSetPanResponderCapture: () => true,
            // 与onMoveShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高
            onMoveShouldSetPanResponderCapture: () => true,
            // 手势刚开始触摸(即刚接触屏幕时)时，若响应成功则触发该事件
            onPanResponderGrant: (evt, gestureState) => {
                this._isRecording = true;
                this.forceUpdate();
            },
            // 手势刚开始触摸(即刚接触屏幕时)时，若响应失败则触发该事件，失败原因有可能是其它组件正在响应手势且不肯放权
            onResponderReject: (evt, gestureState) => { },
            // 手势滑动时触发该事件
            onPanResponderMove: (evt, gestureState) => {
                if (-gestureState.dy > this._maxDy) {
                    // console.log("外面啦", gestureState.dx);
                    this._cancelAudio = true;
                } else {
                    // console.log("录音", gestureState.dx);
                    this._cancelAudio = false;
                }
            },
            // 手势松开时触发该事件
            onPanResponderRelease: (evt, gestureState) => {
                if (this._cancelAudio) {
                    // console.log("取消发送");
                } else {
                    // console.log("发送");
                }
                this._isRecording = false;
                this.forceUpdate();
            },
            // 当其它组件需要响应手势时，此时为ture则表示本组件愿意放权给其它组件响应；为false时表示不放权，依然由本组件来响应手势事件
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            // 当组件响应放权后(即由其它组件拿到了手势响应权)触发该事件
            onPanResponderTerminate: (evt, gestureState) => { }
        });


        this._isShowMore = false;
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _onChangeText = (s) => {
        this._textMessgae = s;
        this.forceUpdate();
    }

    _SendMessage = () => {
        if (!this.props.isGroup) {

            DataCardModel.judgeShouldSendDataCard(this.props.id)

            require("../../model/chat/ChatModel").sendC2CMessage(this.props.id, [[1, this._textMessgae]])
                .then(data => {
                    if (data) {
                        //发送成功
                        this._textMessgae = "";
                        this.forceUpdate();
                    } else {
                        //发送失败
                    }
                })
        } else {



            require("../../model/chat/ChatModel").sendGroupMessage(this.props.id, [[1, this._textMessgae]])
                .then(data => {
                    if (data) {
                        //发送成功
                        this._textMessgae = "";
                        this.forceUpdate();
                    } else {
                        //发送失败
                    }
                })
        }


    }

    _onAdioOrKeyBoardChangePress = () => {
        if (this.inputType == TEXT) {
            Keyboard.dismiss();
            this.inputType = AUDIO;
        } else {
            this.inputType = TEXT;
        }
        this.forceUpdate();
    }

    _onMoreChangePress = () => {
        Keyboard.dismiss();
        this._isShowMore = !this._isShowMore;
        this.forceUpdate();
    }

    _openCameralRoll = async () => {
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 300,
                height: 400,
                cropping: false,
            });
            // console.log("找图片", image);
            // let res = await require("../../model/UploadModel").default.uploadImage(image.path);
            /**
             * {    cropRect: { y: 1, height: 215, width: 161, x: 24 },
                    modificationDate: '1588692919000',
                    width: 300,
                    size: 14801,
                    mime: 'image/jpeg',
                    height: 400,
                    path: 'file:///storage/emulated/0/Android/data/com.xstudio.tiaotiaotang2/files/Pictures/728735ad-0046-4b58-a54c-4ed6f34a6486.jpg' 
                }
             */
            let path = image.path.replace("file:///", "//");
            // console.log("新的路径", path);
            if (!this.props.isGroup) {
                require("../../model/chat/ChatModel").sendC2CMessage(this.props.id, [[2, path, 0, image.width, image.height]]);
            } else {
                require("../../model/chat/ChatModel").sendGroupMessage(this.props.id, [[2, path, 0, image.width, image.height]]);
            }
        }
    }

    _onEmptyPress = () => {
        this._bShowEmojiView = false;
        this._showFastReplay = false;
        Keyboard.dismiss();
        this.forceUpdate();
    }

    _showEmoji = () => {
        Keyboard.dismiss();
        this._showMore = false;
        this._showFastReplay = false;
        this._bShowEmojiView = !this._bShowEmojiView;
        this.forceUpdate();
    }

    _addEmoji = s => {
        this._textMessgae = this._textMessgae + s;
        this.forceUpdate();
    }

    _onFocus = () => {
        if (Platform.OS == "ios") {
            return
        }
        this._bShowEmojiView = false;
        this._showMore = false;
        this._showFastReplay = false;
        this.forceUpdate();
    }

    _keyboardDidShow = () => {
        // this._bShowEmojiView = false;
        // this._showMore = false;
        // this._showFastReplay = false;
        // this.forceUpdate();
    }

    _keyboardDidHide = () => {
        //软键盘隐藏
    }

    _renderInput = () => {
        if (this.inputType == TEXT) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",

                        borderRadius: DesignConvert.getW(19),
                        width: DesignConvert.getW(201),
                        height: DesignConvert.getH(34),
                        borderRadius: DesignConvert.getW(30),

                        marginLeft: DesignConvert.getW(15)
                    }}>
                    <TextInput
                        numberOfLines={1}
                        style={{
                            flex: 1,

                            color: "#1A1A1A",
                            // backgroundColor: '#E8E8E899',
                            fontSize: DesignConvert.getF(14),
                            marginLeft: DesignConvert.getW(12),
                            marginRight: DesignConvert.getW(12),
                            padding: 0,
                        }}
                        value={this._textMessgae}
                        keyboardType="default"
                        returnKeyType="send"
                        underlineColorAndroid="transparent"
                        placeholder="说点什么吧…！"
                        placeholderTextColor="rgba(255, 255, 255, 0.32)"
                        onChangeText={this._onChangeText}
                        selectionColor={THEME_COLOR}
                        onSubmitEditing={({ nativeEvent: { text, eventCount, target } }) => {

                            this._SendMessage()
                        }}
                        onFocus={this._onFocus}
                    ></TextInput>

                    <_SendBtn
                        text="发送"
                        onPress={this._SendMessage}
                        enable={this._textMessgae != ""}></_SendBtn>
                </View>
            )
        } else {
            return (
                <View
                    {...this._panResponder.panHandlers}
                    style={{
                        width: DesignConvert.getW(230),
                        height: DesignConvert.getW(36),
                        backgroundColor: this._isRecording ? "#CCCCCC" : "#F5F5F5",
                        borderRadius: DesignConvert.getW(19),
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        left: DesignConvert.getW(20),
                        top: DesignConvert.getH(11),
                    }}>
                    <Text
                        style={{
                            color: "#000000",
                            fontSize: DesignConvert.getF(12),
                        }}>{this._isRecording ? "松开 结束" : "按住 讲话"}</Text>
                </View>
            )
        }
    }



    _showGiftDialog = async () => { 
        Keyboard.dismiss();
        
        // require('../../model/mine/MyWalletModel').default.onWalletSendGoldShell(this.props.id);
        require('../../model/mine/MyWalletModel').default.onLiveSendGoldShell(this.props.id);

    }

    _openMore = () => {
        Keyboard.dismiss();
        this._showMore = !this._showMore;
        this._bShowEmojiView = false;
        this._showFastReplay = false;
        this.forceUpdate();
    }

    _openFastReplay = () => {
        Keyboard.dismiss();
        this._showFastReplay = !this._showFastReplay;
        this._bShowEmojiView = false;
        this._showMore = false;
        this.forceUpdate();
    }

    render() {
        return (
            <View>
                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(2),
                    }}></View>
                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(49),

                        flexDirection: "row",
                        alignItems: "center",

                        marginBottom: DesignConvert.addIpxBottomHeight(),
                    }}>

                    {/* <TouchableOpacity
                        onPress={this._onAdioOrKeyBoardChangePress}
                        style={{
                            marginLeft: DesignConvert.getW(12),
                            marginRight: DesignConvert.getW(12),
                        }}>
                        <Image
                            source={this.inputType == TEXT ? ic_voice() : ic_voice()}
                            style={{
                                width: DesignConvert.getW(36),
                                height: DesignConvert.getH(36),
                            }}></Image>
                    </TouchableOpacity> */}
                    {/* 
                    <TouchableOpacity
                        onPress={this._openFastReplay}
                        style={{
                            width: DesignConvert.getW(52),
                            height: DesignConvert.getH(25),
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginStart: DesignConvert.getW(15),
                            marginEnd: DesignConvert.getW(10),
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#CB5CFF', '#FF4D91']}
                            style={{
                                position: 'absolute',
                                width: DesignConvert.getW(52),
                                height: DesignConvert.getH(25),
                                borderRadius: DesignConvert.getW(3),
                            }}
                        />
                        <Text
                            style={{
                                color: '#FFFFFF',
                                fontSize: DesignConvert.getF(10),
                            }}
                        >
                            {`快捷用语`}
                        </Text>
                    </TouchableOpacity> */}

                    {!this.props.isShowOverlay ? (
                        <TouchableOpacity
                            onPress={this._showGiftDialog}
                            style={{
                                marginLeft: DesignConvert.getW(15),


                            }}>
                            <Image
                                source={ic_gift()}
                                style={{
                                    width: DesignConvert.getW(23),
                                    height: DesignConvert.getH(23),
                                }}></Image>
                        </TouchableOpacity>
                    ) : null}

                    {this._renderInput()}

                    {/* <TouchableOpacity
                        onPress={this._openMore}
                    >
                        <Image
                            source={ic_chat_more()}
                            style={{
                                width: DesignConvert.getW(25),
                                height: DesignConvert.getH(25),
                                marginEnd: DesignConvert.getW(5),
                                marginStart: DesignConvert.getW(15),
                                resizeMode: 'contain',
                            }}
                        />
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        onPress={this._showEmoji}
                        style={{
                            marginHorizontal: DesignConvert.getW(15)

                        }}>
                        <Image
                            source={ic_emoji()}
                            style={{
                                width: DesignConvert.getW(23),
                                height: DesignConvert.getH(23),
                                resizeMode: 'contain',

                            }}></Image>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        onPress={this._onMoreChangePress}
                        style={{}}>
                        <Image
                            source={this._isShowMore ? ic_expand() : ic_expand()}
                            style={{
                                width: DesignConvert.getW(36),
                                height: DesignConvert.getH(36),
                            }}></Image>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={this._openCameralRoll}
                        style={{
                            marginRight: DesignConvert.getW(20)
                        }}>
                        <Image
                            source={ic_photo()}
                            style={{
                                width: DesignConvert.getW(23),
                                height: DesignConvert.getH(23),
                            }}></Image>
                    </TouchableOpacity>
                </View>



                {this._bShowEmojiView || this._showFastReplay ? (
                    <TouchableOpacity
                        opacity={0}
                        onPress={this._onEmptyPress}
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.sheight,
                            position: "absolute",
                            //EmojiView高度+bottomLayout的高度
                            bottom: DesignConvert.getH(300 + 49),
                        }}>

                    </TouchableOpacity>
                ) : null
                }
                {/* 
                {this._showFastReplay ?

                    <FastReplayView
                        id={this.props.id}
                    />
                    :
                    null
                } */}

                <EmojiView
                    callBack={this._addEmoji}
                    containerStyle={{
                        display: this._bShowEmojiView ? "flex" : "none",
                    }} />
            </View>
        )
    }
}