/**
 * 钻石转赠dialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ImageBackground } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import ToastUtil from "../base/ToastUtil";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_GOLDBELL_INFO } from "../../hardcode/HLogicEvent";
import { COIN_NAME, } from '../../hardcode/HGLobal';
import KeyboardAvoidingViewExt from "../base/KeyboardAvoidingViewExt";
import BackTitleView from "../base/BackTitleView";
import { giftGoldRecord } from "../anchorincome/RecordView";

/**
 * 校验按钮
 */
class VerificationButton extends PureComponent {

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        if (!this.props.enable) {
            return (
                <Text
                    style={{
                        // width: DesignConvert.getW(42),
                        // height: DesignConvert.getH(22),
                        color: "#FFFFFF",
                        fontSize: DesignConvert.getF(12),
                        textAlign: "center",
                    }}
                >校验</Text>
            );
        }

        return (
            <TouchableOpacity
                onPress={this._onPress}
            >
                <Text
                    style={{
                        // width: DesignConvert.getW(42),
                        // height: DesignConvert.getH(22),
                        color: "#FFFFFF",
                        fontSize: DesignConvert.getF(12),
                        textAlign: "center",
                    }}
                >校验</Text>
            </TouchableOpacity>
        )
    }
}
export default class DiamondGiftDialog extends BaseView {
    constructor(props) {
        super(props);

        this._ID = this.props.params.userId ? this.props.params.userId : "";
        this._nickName = "";
        this._amount = "";
        this._payPassword = "";
        this._isVerify = false;
        this._maxAmount = 0;
        this._submitEnable = false;
    }

    _onBackPress = () => {
        this.popSelf();
    }

    _checkSubmitEnable = () => {
        if (this._ID == "" || this._nickName == "" || this._amount == "" || this._payPassword == "" || !this._isVerify) {
            this._submitEnable = false;
        } else {
            this._submitEnable = true;
        }
        this.forceUpdate();
    }

    _onChangeID = (s) => {
        this._ID = s;
        this._isVerify = false;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeNickName = (s) => {
        this._nickName = s;
        this._isVerify = false;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeAmount = (s) => {
        // console.log("验证数字", parseInt(s));
        if (!parseInt(s)) {
            // console.log("true", this._amount);
            this._amount = "";
        } else {
            this._amount = parseInt(s) + "";
        }
        this._amount = this._amount > this._maxAmount ? this._maxAmount + "" : this._amount;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangePayPassword = (s) => {
        this._payPassword = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    componentDidMount() {
        super.componentDidMount()
        this._initData();
    }

    _initData() {
        require("../../model/BagModel").default.getWallet()
            .then(data => {
                this._maxAmount = data.goldShell;
                this.forceUpdate();
            })
    }

    _positivePress = () => {
        require("../../model/mine/MyWalletModel").default.sendGoldShell(this._ID, parseInt(this._amount), this._payPassword, this._nickName)
            .then(data => {
                if (data) {
                    this.popSelf();
                    ToastUtil.showCenter("转赠成功")
                }
            })
    }

    _checkPress = () => {
        require('../../model/anchorincome/ConvertModel').default.getUserInfoList(this._ID)
            .then(data => {
                this._nickName = decodeURI(data.nickName);
                this._ID = data.userId;
                this._isVerify = true;
                this._checkSubmitEnable();
                this.forceUpdate();
            })
            .catch(err => {
                this._nickName = "输入id有误";
                this.forceUpdate();
            })
    }

    _renderSubmitBtn = () => {
        if (this._submitEnable) {
            return (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: DesignConvert.getH(20),
                        alignSelf: "center",
                    }}
                    onPress={this._positivePress}>

                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={["#FFDA7E", "#FFA557"]}
                        style={{
                            width: DesignConvert.getW(100),
                            height: DesignConvert.getW(100),
                            borderRadius: DesignConvert.getW(100),
                            alignItems: "center",
                            justifyContent: "center",
                        }}>

                        <Text
                            style={{
                                color: "#B8000D",
                                fontSize: DesignConvert.getF(16),
                            }}
                        >发送红包</Text>
                    </LinearGradient>
                </TouchableOpacity>
            )
        } else {
            return (
                <View
                    style={{
                        width: DesignConvert.getW(100),
                        height: DesignConvert.getW(100),
                        backgroundColor: "#F9F9F9",
                        borderRadius: DesignConvert.getW(100),
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: DesignConvert.getH(20),
                        alignSelf: "center",
                    }}>

                    <Text
                        style={{
                            color: "#DCDCDC",
                            fontSize: DesignConvert.getF(16),
                        }}
                    >发送红包</Text>
                </View>
            )
        }
    }

    _renderLine = () => {
        return (
            <View
                style={{
                    backgroundColor: "#DDDDDD",
                    width: DesignConvert.getW(315),
                    height: DesignConvert.getH(0.5),
                    position: "absolute",
                    bottom: 0,
                    left: DesignConvert.getW(15),
                    fontWeight: "bold",
                }}></View>
        )
    }

    _onGiftRecordPress = () => {
        require("../../router/level3_router").showRecordView_showOverlay(require("../anchorincome/RecordView").giftGoldRecord);
        // require("../../router/level3_router").showRecordView(giftGoldRecord);
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        position: 'absolute',
                        width: DesignConvert.swidth,
                        height: DesignConvert.sheight
                    }}
                />
                <ImageBackground
                    source={require("../../hardcode/skin_imgs/lvdong").wa_zz_bg()}
                    style={{
                        width: DesignConvert.getW(300),
                        height: DesignConvert.getH(408),
                        alignItems: 'center'
                    }}>
                    <Text
                        onPress={this._onGiftRecordPress}
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(19),
                            left: DesignConvert.getW(15),
                            color: '#FFFFFF',
                            fontSize: DesignConvert.getF(12)
                        }}>
                        转赠记录
                    </Text>
                    <Text
                        style={{
                            fontSize: DesignConvert.getF(17),
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            marginTop: DesignConvert.getH(15),
                            marginBottom: DesignConvert.getH(6)
                        }}
                    >
                        {'转赠'}
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
                    <Text
                        style={{
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: DesignConvert.getF(12),
                            width: DesignConvert.getW(240),
                            paddingBottom: DesignConvert.getH(5),
                            paddingTop: DesignConvert.getH(10)
                        }}>赠送ID</Text>
                    <TextInput
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),
                            borderRadius: DesignConvert.getW(10),
                            color: "#333333",
                            backgroundColor: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),
                            padding: 0,
                            paddingLeft: DesignConvert.getW(10),

                        }}
                        value={this._ID}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        placeholder="请输入赠送用户ID"
                        placeholderTextColor="rgba(198, 198, 198, 1)"
                        returnKeyType='next'
                        onChangeText={this._onChangeID}
                    ></TextInput>
                    <Text
                        style={{
                            width: DesignConvert.getW(240),
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: DesignConvert.getF(12),
                            paddingBottom: DesignConvert.getH(5),
                            paddingTop: DesignConvert.getH(10)
                        }}>赠送用户昵称</Text>
                    <View style={{
                        width: DesignConvert.getW(240),
                        height: DesignConvert.getH(34)
                    }}>
                        <TextInput
                            style={{
                                color: this._nickName == "输入id有误" ? "red" : "#333333",
                                width: DesignConvert.getW(240),
                                height: DesignConvert.getH(34),
                                borderRadius: DesignConvert.getW(10),
                                backgroundColor: '#FFFFFF',
                                fontSize: DesignConvert.getF(14),
                                padding: 0,
                                paddingLeft: DesignConvert.getW(10),

                            }}
                            value={this._nickName}
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            placeholder="请校验赠送用户昵称"
                            placeholderTextColor="rgba(198, 198, 198, 1)"
                            returnKeyType='next'
                            onChangeText={this._onChangeNickName}
                        ></TextInput>
                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(37),
                                height: DesignConvert.getH(23),
                                position: "absolute",
                                right: DesignConvert.getW(10),
                                marginTop: DesignConvert.getH(5.5)
                            }}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                colors={['#FF5245', '#CD0031']}
                                style={{
                                    width: DesignConvert.getW(37),
                                    height: DesignConvert.getH(23),
                                    borderRadius: DesignConvert.getW(6),
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <VerificationButton
                                    onPress={this._checkPress}
                                    enable={this._ID != ""} />
                            </LinearGradient>

                        </TouchableOpacity>
                    </View>


                    <Text
                        style={{
                            width: DesignConvert.getW(240),
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: DesignConvert.getF(12),
                            paddingBottom: DesignConvert.getH(5),
                            paddingTop: DesignConvert.getH(10)
                        }}>转赠数量(金币)</Text>
                    <TextInput
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),
                            borderRadius: DesignConvert.getW(10),
                            color: "#333333",
                            backgroundColor: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),
                            padding: 0,
                            paddingLeft: DesignConvert.getW(10)

                        }}
                        value={this._amount}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        placeholder="请输入转增数量"
                        placeholderTextColor="rgba(198, 198, 198, 1)"
                        returnKeyType='next'
                        onChangeText={this._onChangeAmount}
                    ></TextInput>
                    <Text
                        style={{
                            width: DesignConvert.getW(240),
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: DesignConvert.getF(12),
                            paddingBottom: DesignConvert.getH(5),
                            paddingTop: DesignConvert.getH(10)
                        }}>支付密码</Text>
                    <TextInput
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(34),
                            borderRadius: DesignConvert.getW(10),
                            color: "#333333",
                            backgroundColor: '#FFFFFF',
                            fontSize: DesignConvert.getF(14),
                            padding: 0,
                            paddingLeft: DesignConvert.getW(10),

                        }}
                        value={this._payPassword}
                        keyboardType="numeric"
                        underlineColorAndroid="transparent"
                        placeholder="请输入支付密码"
                        placeholderTextColor="#DCDCDC"
                        returnKeyType='next'
                        onChangeText={this._onChangePayPassword}
                        secureTextEntry={true}
                    ></TextInput>
                    <TouchableOpacity
                        onPress={this._positivePress}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={['rgba(255, 82, 69, 1)', 'rgba(205, 0, 49, 1)']}
                            style={{
                                width: DesignConvert.getW(160),
                                height: DesignConvert.getH(44),
                                borderRadius: DesignConvert.getW(22),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: DesignConvert.getH(26)
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: DesignConvert.getF(14)
                                }}>
                                {"确认转赠"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }

    // render() {
    //     return (
    //         <View
    //             style={{
    //                 width: DesignConvert.swidth,
    //                 height: DesignConvert.sheight,
    //                 backgroundColor: "#DB4356",
    //                 alignItems: "center",
    //             }}>

    //             <BackTitleView
    //                 titleText={"发红包"}
    //                 onBack={this.popSelf}
    //                 bgColor={["#DB435600", "#DB435600"]}
    //                 titleTextStyle={{
    //                     color: "white",
    //                 }}
    //                 backImgStyle={{
    //                     tintColor: "white",
    //                 }}
    //                 rightText={"红包记录"}
    //                 rightTextStyle={{
    //                     color: "#FFDEE4",
    //                 }}
    //                 onRightPress={this._onGiftRecordPress}
    //             />

    //             <View
    //                 style={{
    //                     width: DesignConvert.getW(345),
    //                     height: DesignConvert.getHeight(420),
    //                     borderRadius: DesignConvert.getW(10),
    //                     backgroundColor: "white",
    //                     marginTop: DesignConvert.getH(15),
    //                 }}>

    //                 <View
    //                     style={{
    //                         width: DesignConvert.getW(345),
    //                         height: DesignConvert.getH(58),
    //                         flexDirection: "row",
    //                         alignItems: "center",
    //                     }}>
    //                     <Text
    //                         style={{
    //                             color: "#333333",
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(15),
    //                             fontWeight: "bold",
    //                         }}>发给</Text>

    //                     <TextInput
    //                         style={{
    //                             width: DesignConvert.getW(180),
    //                             height: DesignConvert.getH(40),
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(95),
    //                         }}
    //                         value={this._ID}
    //                         keyboardType="numeric"
    //                         underlineColorAndroid="transparent"
    //                         placeholder="收红包者ID"
    //                         placeholderTextColor="#DCDCDC"
    //                         returnKeyType='next'
    //                         onChangeText={this._onChangeID}
    //                     ></TextInput>

    //                     {this._renderLine()}
    //                 </View>

    //                 <View
    //                     style={{
    //                         width: DesignConvert.getW(345),
    //                         height: DesignConvert.getH(58),
    //                         flexDirection: "row",
    //                         alignItems: "center",
    //                     }}>
    //                     <Text
    //                         style={{
    //                             color: "#333333",
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(15),
    //                             fontWeight: "bold",
    //                         }}>昵称验证</Text>

    //                     <TextInput
    //                         style={{
    //                             color: this._nickName == "输入id有误" ? "red" : "#333333",
    //                             width: DesignConvert.getW(180),
    //                             height: DesignConvert.getH(40),
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(95),
    //                         }}
    //                         value={this._nickName}
    //                         keyboardType="default"
    //                         underlineColorAndroid="transparent"
    //                         placeholder="收红包者昵称"
    //                         placeholderTextColor="#DCDCDC"
    //                         returnKeyType='next'
    //                         onChangeText={this._onChangeNickName}
    //                     ></TextInput>

    //                     <View
    //                         style={{
    //                             position: "absolute",
    //                             right: DesignConvert.getW(15),
    //                         }}>
    //                         <VerificationButton
    //                             onPress={this._checkPress}
    //                             enable={this._ID != ""} />
    //                     </View>

    //                     {this._renderLine()}
    //                 </View>

    //                 <View
    //                     style={{
    //                         width: DesignConvert.getW(345),
    //                         height: DesignConvert.getH(58),
    //                         flexDirection: "row",
    //                         alignItems: "center",
    //                     }}>
    //                     <Text
    //                         style={{
    //                             color: "#333333",
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(15),
    //                             fontWeight: "bold",
    //                         }}>数量</Text>

    //                     <TextInput
    //                         style={{
    //                             width: DesignConvert.getW(115),
    //                             height: DesignConvert.getH(40),
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(95),
    //                         }}
    //                         value={this._amount}
    //                         keyboardType="numeric"
    //                         underlineColorAndroid="transparent"
    //                         placeholder="输入金币数量"
    //                         placeholderTextColor="#DCDCDC"
    //                         returnKeyType='next'
    //                         onChangeText={this._onChangeAmount}
    //                     ></TextInput>

    //                     <Text
    //                         style={{
    //                             color: "#333333",
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             right: DesignConvert.getW(15),
    //                         }}>{COIN_NAME}</Text>

    //                     {this._renderLine()}
    //                 </View>


    //                 <View
    //                     style={{
    //                         width: DesignConvert.getW(345),
    //                         height: DesignConvert.getH(58),
    //                         flexDirection: "row",
    //                         alignItems: "center",
    //                     }}>
    //                     <Text
    //                         style={{
    //                             color: "#333333",
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(15),
    //                             fontWeight: "bold",
    //                         }}>支付密码</Text>

    //                     <TextInput
    //                         style={{
    //                             width: DesignConvert.getW(180),
    //                             height: DesignConvert.getH(40),
    //                             fontSize: DesignConvert.getF(16),
    //                             position: "absolute",
    //                             left: DesignConvert.getW(95),
    //                         }}
    //                         value={this._payPassword}
    //                         keyboardType="numeric"
    //                         underlineColorAndroid="transparent"
    //                         placeholder="请输入支付密码"
    //                         placeholderTextColor="#DCDCDC"
    //                         returnKeyType='next'
    //                         onChangeText={this._onChangePayPassword}
    //                         secureTextEntry={true}
    //                     ></TextInput>

    //                     {this._renderLine()}
    //                 </View>

    //             </View>

    //             <ImageBackground
    //                 source={require("../../hardcode/skin_imgs/mywallet").luck_money_bg()}
    //                 style={{
    //                     width: DesignConvert.swidth,
    //                     height: DesignConvert.getH(472),
    //                     marginTop: DesignConvert.getH(-80),
    //                 }}>

    //                 {this._renderSubmitBtn()}
    //             </ImageBackground>
    //         </View>
    //     )
    // }
}
