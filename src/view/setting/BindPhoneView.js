
/**
 * 设置密码页面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';
import CheckBoxView from '../base/CheckBoxView';
import StringUtil from '../../utils/StringUtil';
import UserInfoCache from "../../cache/UserInfoCache";
import { LINEARGRADIENT_COLOR, THEME_COLOR } from "../../styles";
import _GetCodeButton from "./item/_GetCodeButton";
import _BindPhoneItem from "./item/_BindPhoneItem";


export default class BindPhoneView extends BaseView {
    constructor(props) {
        super(props);

        //如果 0 没绑定手机号则直接绑定，绑定了得先 1 校验后再 2 绑定
        this._type = !UserInfoCache.phoneNumber ? 0 : 1;

        this._phoneNum = this._type == 0 ? "" : UserInfoCache.phoneNumber;
        this._code = "";
        this._bChecked = true;

        this._submitEnable = false;


        this._getCodeBtnRef = null;
        this._oldCode = "";

        //是否显示手机号（单纯显示手机号码）
        this._bShowPhone = this._type == 1;
    }

    //隐藏手机页
    _hideBindPhoneItem = () => {
        this._bShowPhone = false;
        this.forceUpdate();
    }

    _checkSubmitEnable = () => {
        if (this._phoneNum != "" && this._code != "" && this._bChecked) {
            this._submitEnable = true;
        } else {
            this._submitEnable = false;
        }
    }

    _onChangePhoneNum = (s) => {
        this._phoneNum = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeCode = (s) => {
        this._code = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onAgreePress = () => {
        this._bChecked = !this._bChecked;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onUserProtocolPress = () => {
        alert("H5");
    }


    _onGetCodePress = () => {
        if (!StringUtil.isMobile(this._phoneNum)) {
            require("../base/ToastUtil").default.showCenter("手机号码不正确");
            return
        }
        //校验原手机2  绑定新手机(没绑)8
        require("../../model/setting/BindPhoneModel").default.sendGetMsgCode(this._phoneNum, this._type == 1 ? 2 : 8)
            .then(data => {
                if (data) {

                }
                this.forceUpdate()
            })

    }

    _onSubmitPress = () => {
        if (!StringUtil.isMobile(this._phoneNum)) {
            require("../base/ToastUtil").default.showCenter("手机号码不正确");
            return
        }
        if (this._type == 0) {
            //直接绑定新手机号
            require("../../model/setting/BindPhoneModel").default.bindMobile(this._phoneNum, this._code)
                .then(data => {
                    if (data) {
                        require("../../cache/UserInfoCache").default.setPhoneNumber(this._phoneNum);
                        require("../base/ToastUtil").default.showCenter("修改成功");
                        this.popSelf();
                    }
                })
        } else if (this._type == 1) {
            //校验原来手机号
            require("../../model/setting/BindPhoneModel").default.checkMatchSms(this._phoneNum, this._code)
                .then(data => {
                    if (data) {
                        this._oldCode = this._code;
                        this._phoneNum = "";
                        this._code = "";

                        this._type = 2;
                        this._checkSubmitEnable();

                        this._getCodeBtnRef && this._getCodeBtnRef.reset();
                        this.forceUpdate();
                    }
                })
        } else {
            require("../../model/setting/BindPhoneModel").default.changeMobile(this._phoneNum, this._oldCode, this._code)
                .then(data => {
                    if (data) {
                        require("../base/ToastUtil").default.showCenter("修改成功");
                        this.popSelf();
                    }
                })
        }

    }

    _getPhoneNumFormat = () => {
        if (!this._phoneNum) return '';

        return this._phoneNum.substr(0,3) + '****' + this._phoneNum.substr(7,11)
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    alignItems: "center",
                }}
            >
                <BackTitleView
                    titleText={"更换手机号"}
                    onBack={this.popSelf}
                    bgColor={["#260713", "#3B0D1E"]}
                    titleTextStyle={{
                        color: "white",
                    }}
                    backImgStyle={{
                        tintColor: "white",
                    }}
                />

                <Image 
                    source={require('../../hardcode/skin_imgs/lvdong').set_phone_icon()}
                    style={{
                        width: DesignConvert.getW(110),
                        height: DesignConvert.getH(102),
                        marginTop: DesignConvert.getH(50),
                    }}
                />

                <Text
                    style={{
                        fontSize: DesignConvert.getF(18),
                        color: '#000000',
                        fontWeight: 'bold',
                        marginTop: DesignConvert.getH(10),
                    }}
                >
                    {this._getPhoneNumFormat()}
                </Text>

                <TouchableOpacity
                    onPress={()=>{
                        require("../../router/level3_router").showSetPhoneDialog(()=>{
                            this._type = !UserInfoCache.phoneNumber ? 0 : 1;
                            this._phoneNum = this._type == 0 ? "" : UserInfoCache.phoneNumber;
                            this.forceUpdate();
                        });
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={['#FF5245', '#CD0031']}

                        style={{
                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(44),
                            borderRadius: DesignConvert.getW(10),
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginTop: DesignConvert.getH(50),
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(14),
                                marginLeft: DesignConvert.getW(15),
                            }}
                        >{'更换绑定手机号'}</Text>

                        <Image 
                            source={require('../../hardcode/skin_imgs/lvdong').set_arrow_right()}
                            style={{
                                width: DesignConvert.getW(18),
                                height: DesignConvert.getH(18),
                                marginRight: DesignConvert.getW(10),
                            }}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )

        // if (this._bShowPhone) {
        //     return (
        //         <View
        //             style={{
        //                 flex: 1,
        //                 backgroundColor: 'white',
        //             }}>
        //             <BackTitleView
        //                 titleText={"账号绑定"}
        //                 onBack={this.popSelf}
        //             />

        //             <_BindPhoneItem
        //                 onPress={this._hideBindPhoneItem}
        //             />
        //         </View>
        //     )
        // }

        // return (
        //     <View
        //         style={{
        //             flex: 1,
        //             backgroundColor: 'white',
        //         }}
        //     >

        //         <BackTitleView
        //             titleText={this._type == 1 ? "验证已绑定手机号" : "绑定手机号"}
        //             onBack={this.popSelf}
        //             bgColor={LINEARGRADIENT_COLOR}
        //             titleTextStyle={{
        //                 color: "white",
        //             }}
        //             backImgStyle={{
        //                 tintColor: "white",
        //             }}
        //         />

        //         <View
        //             style={{
        //                 flex: 1,
        //                 alignItems: "center",
        //                 marginTop: DesignConvert.getH(60),
        //             }}>

        //             {/* <View
        //                 style={{
        //                     width: DesignConvert.swidth,
        //                     height: DesignConvert.getH(20),
        //                     marginTop: DesignConvert.getH(30),
        //                     paddingLeft: DesignConvert.getW(23),
        //                     paddingRight: DesignConvert.getW(23),
        //                     flexDirection: "row",
        //                     alignItems: "center",
        //                 }}>
        //                 <Image
        //                     source={require("../../hardcode/skin_imgs/registered").ic_phone()}
        //                     style={{
        //                         width: DesignConvert.getW(16),
        //                         height: DesignConvert.getH(20),
        //                     }}></Image>

        //                 <Text
        //                     style={{
        //                         fontSize: DesignConvert.getF(17),
        //                         color: "#333333",
        //                         marginLeft: DesignConvert.getW(8),
        //                     }}
        //                 >手机</Text>
        //             </View> */}
        //             <View
        //                 style={{
        //                     width: DesignConvert.getW(270),
        //                     height: DesignConvert.getH(50),
        //                     paddingHorizontal: DesignConvert.getW(22),
        //                     flexDirection: "row",
        //                     alignItems: "center",
        //                     borderColor: "#F0F0F0",
        //                     borderWidth: DesignConvert.getW(1),
        //                     borderRadius: DesignConvert.getW(25),
        //                 }}>

        //                 <TextInput
        //                     style={{
        //                         flex: 1,
        //                         height: DesignConvert.getH(50),
        //                         color: "#333333",
        //                         fontSize: DesignConvert.getF(15),
        //                     }}
        //                     value={this._phoneNum}
        //                     keyboardType="numeric"
        //                     underlineColorAndroid="transparent"
        //                     placeholder={this._type == 1 ? "请输入您已绑定手机号码" : "请输入您要绑定的手机号码"}
        //                     placeholderTextColor="#999999"
        //                     returnKeyType='next'
        //                     onChangeText={this._onChangePhoneNum}
        //                     maxLength={11}
        //                     selectionColor={THEME_COLOR}
        //                 ></TextInput>
        //             </View>


        //             {/* <View
        //                 style={{
        //                     width: DesignConvert.swidth,
        //                     height: DesignConvert.getH(20),
        //                     marginTop: DesignConvert.getH(24),
        //                     paddingLeft: DesignConvert.getW(23),
        //                     paddingRight: DesignConvert.getW(23),
        //                     flexDirection: "row",
        //                     alignItems: "center",
        //                 }}>
        //                 <Image
        //                     source={require("../../hardcode/skin_imgs/registered").ic_code()}
        //                     style={{
        //                         width: DesignConvert.getW(16),
        //                         height: DesignConvert.getH(20),
        //                     }}></Image>

        //                 <Text
        //                     style={{
        //                         fontSize: DesignConvert.getF(17),
        //                         color: "#333333",
        //                         marginLeft: DesignConvert.getW(8),
        //                     }}
        //                 >验证码</Text>
        //             </View> */}

        //             <View
        //                 style={{
        //                     width: DesignConvert.getW(270),
        //                     height: DesignConvert.getH(50),
        //                     paddingHorizontal: DesignConvert.getW(22),
        //                     flexDirection: "row",
        //                     alignItems: "center",
        //                     borderColor: "#F0F0F0",
        //                     borderWidth: DesignConvert.getW(1),
        //                     borderRadius: DesignConvert.getW(25),
        //                     marginTop: DesignConvert.getH(30),
        //                 }}
        //             >
        //                 <TextInput
        //                     style={{
        //                         flex: 1,
        //                         height: DesignConvert.getH(50),
        //                         color: "#333333",
        //                         fontSize: DesignConvert.getF(15),
        //                         marginRight: DesignConvert.getW(10),
        //                     }}
        //                     value={this._code}
        //                     keyboardType="numeric"
        //                     underlineColorAndroid="transparent"
        //                     placeholder="请输入验证码"
        //                     placeholderTextColor="#999999"
        //                     returnKeyType='next'
        //                     onChangeText={this._onChangeCode}
        //                     maxLength={6}
        //                     selectionColor={THEME_COLOR}
        //                 ></TextInput>

        //                 <_GetCodeButton
        //                     ref={ref => {
        //                         this._getCodeBtnRef = ref;
        //                     }}
        //                     enable={StringUtil.isMobile(this._phoneNum)}
        //                     onPress={this._onGetCodePress}
        //                     containerStyle={{
        //                         height: DesignConvert.getH(50),
        //                     }}
        //                 />
        //             </View>


        //             <SubmitButton
        //                 style={{
        //                     marginTop: DesignConvert.getH(300),
        //                 }}
        //                 enable={this._submitEnable}
        //                 btnText={this._type == 1 ? "下一步" : "完成"}
        //                 onPress={this._onSubmitPress}></SubmitButton>
        //             {/* 
        //             <View
        //                 style={{
        //                     marginTop: DesignConvert.getH(32),
        //                     flexDirection: "row",
        //                     alignItems: "center",
        //                 }}
        //             >
        //                 <CheckBoxView
        //                     bChecked={this._bChecked}
        //                     onPress={this._onAgreePress}></CheckBoxView>

        //                 <Text
        //                     style={{
        //                         color: "#333333",
        //                         fontSize: DesignConvert.getF(11),
        //                         marginLeft: DesignConvert.getW(11),
        //                     }}
        //                 >我已阅读并同意</Text>

        //                 <TouchableOpacity
        //                     style={{
        //                         minWidth: DesignConvert.getW(22),
        //                         minHeight: DesignConvert.getH(22),
        //                         justifyContent: "center",
        //                     }}
        //                     onPress={this._onUserProtocolPress}
        //                 >
        //                     <Text
        //                         style={{
        //                             color: "#333333",
        //                             fontSize: DesignConvert.getF(11),
        //                         }}
        //                     > 《用户许可协议》</Text>
        //                 </TouchableOpacity>
        //             </View>
        //        */}
        //         </View>
        //     </View>
        // )
    }
}
