/**
 * 实名认证 上传身份证
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from '../base/BaseView';
import {
    ic_cer_back,
    ic_cer_font,
    ic_pic,
    ic_report,
    ic_selected,
    ic_unselected,
    ic_cer_bg,
} from '../../hardcode/skin_imgs/certification';
import LinearGradient from "react-native-linear-gradient";
import { LINEARGRADIENT_COLOR, THEME_COLOR } from "../../styles";
import { SubmitButton } from "../anchorincome/VerifyPayPasswordView";
import ImagePicker from 'react-native-image-crop-picker';
import ToastUtil from "../base/ToastUtil";
import CertificationInputPage from "./CertificationInputPage";
import _IDCardDescItem from "./item/_IDCardDescItem";
import _CertStatusItem from "./item/_CertStatusItem";
import StringUtil from '../../utils/StringUtil';

/**
 * 进度item
 */
class _Item extends PureComponent {
    render() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(80),
                    alignItems: "center",
                }}>

                <View
                    style={{
                        width: DesignConvert.getW(80),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>


                    <View
                        style={{
                            opacity: this.props.index == 0 ? 0 : 1,
                            flex: 1,
                            height: DesignConvert.getH(1),
                            backgroundColor: "white",
                        }}></View>

                    <Image
                        source={this.props.currentIndex >= this.props.index ? ic_selected() : ic_unselected()}
                        style={{
                            width: DesignConvert.getW(19),
                            height: DesignConvert.getH(19),
                            marginHorizontal: DesignConvert.getW(9),
                        }}>
                    </Image>

                    <View
                        style={{
                            opacity: this.props.index == this.props.maxCount - 1 ? 0 : 1,
                            flex: 1,
                            height: DesignConvert.getH(1),
                            backgroundColor: "white",
                        }}></View>
                </View>

                <Text
                    style={{
                        color: this.props.currentIndex == this.props.index ? "#FFFFFF" : "#FFFFFF80",
                        fontSize: DesignConvert.getF(12),
                        marginTop: DesignConvert.getH(12),
                    }}>
                    {this.props.item}
                </Text>
            </View>
        )
    }
}


//审核状态  0:审核中， 1:认证不通过，2:认证通过 -1 还未实名认证
let _certificationStatus = -1;
export default class CertificationPage extends BaseView {
    constructor(props) {
        super(props);


        this._realName = "";
        this._IDCard = "";

        this._fontPath = "";
        this._backPath = "";

        this._currentIndex = 0;
        this._stepList = ["填写资料", "证件人像面", "证件国徽面", "提交审核"];
    }


    async componentDidMount() {
        super.componentDidMount();

        let status = await require("../../model/anchorincome/AnchorIncomeModel").default.getUserCertificationStatus()
        _certificationStatus = status;
        this._currentIndex = _certificationStatus == -1 ? 0 : 3;
        this.forceUpdate();
    }

    _clickFontPic = async () => {
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 400,
                height: 300,
                cropping: true,
            });
            // console.log("拍照", image);
            let res = await require("../../model/UploadModel").default.uploadCertificationImage(image.path, true);
            // console.log("上传身份证正面", res.url);
            this._fontPath = image.path;
            this.forceUpdate();
        }
    }

    _clickBackPic = async () => {
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 400,
                height: 300,
                cropping: true,
            });
            // console.log("拍照", image);
            let res = await require("../../model/UploadModel").default.uploadCertificationImage(image.path, false);
            // console.log("上传身份证反面", res.url);
            this._backPath = image.path;
            this.forceUpdate();
        }
    }

    _getSubmitEnable = () => {
        switch (this._currentIndex) {
            case 1:
                return this._fontPath && true
            case 2:
                return this._backPath && true
            case 3:
                return true
        }
    }

    _getSubmitTxt = () => {
        switch (this._currentIndex) {
            case 1:
                return "下一步"
            case 2:
                return "确认提交"
            case 3:
                // 0:审核中， 1:认证不通过，2:认证通过
                if (_certificationStatus == 1) {
                    return "重新提交审核"
                }
                return "确认"
        }
    }

    _commitAudit = () => {
        // switch (this._currentIndex) {
        //     case 1:
        //         this._currentIndex = 2;
        //         this.forceUpdate();
        //         return
        //     case 3:
        //         if (_certificationStatus == 1) {
        //             this._currentIndex = 0;
        //             this.forceUpdate();
        //             return
        //         }
        //         this.popSelf();
        //         return
        // }

        if (!this._fontPath) {
            ToastUtil.showCenter("请上传正面身份证")
            return
        }
        if (!this._backPath) {
            ToastUtil.showCenter("请上传反面身份证")
            return
        }
        if (!this._IDCard) {
            ToastUtil.showCenter("请填写身份证")
            return
        }
        if (!this._realName) {
            ToastUtil.showCenter("请填写真实姓名")
            return
        }
        require("../../model/anchorincome/CertificationModel").default.saveUserCertification(this._IDCard, this._realName)
            .then(data => {
                if (data) {
                    // _certificationStatus = 0;
                    // this._currentIndex = 3;
                    // this.forceUpdate();
                    ToastUtil.showCenter("提交成功")
                    this.popSelf();
                }
            });
    }

    //更新页面
    _getRealNameIDCard = (realName, IDCard) => {
        this._currentIndex = 1;
        this._realName = realName;
        this._IDCard = IDCard;
        this.forceUpdate();
    }

    _checkSubmitEnable = () => {
        this._submitEnable = this._realName && this._IDCard && StringUtil.isIDCardNO(this._IDCard);
    }

    _onChangeRealName = (s) => {
        this._realName = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onChangeIDCard = (s) => {
        this._IDCard = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _cert_not = () => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    alignItems: "center",
                }}
            >
                <BackTitleView
                    titleText={"实名认证"}
                    onBack={this.popSelf}
                    bgColor={["#260713", "#3B0D1E"]}
                    titleTextStyle={{
                        color: "white",
                    }}
                    backImgStyle={{
                        tintColor: "white",
                    }}
                />

                <Text
                    style={{
                        width: DesignConvert.swidth,
                        fontSize: DesignConvert.getF(15),
                        color: '#252525',
                        marginTop: DesignConvert.getH(20),
                        paddingLeft: DesignConvert.getW(15),
                    }}
                >
                    {'上传身份证照片'}
                </Text>
                
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(30),
                    }}
                >
                    <TouchableOpacity
                        onPress={this._clickFontPic}
                    >
                        <Image 
                            source={this._fontPath ? {uri: this._fontPath} : require('../../hardcode/skin_imgs/lvdong').cert_font_pic()}
                            style={{
                                width: DesignConvert.getW(155),
                                height: DesignConvert.getH(85),
                                borderRadius: DesignConvert.getW(12),
                            }}
                        />
                    </TouchableOpacity>

                    <View
                        style={{
                            marginLeft: DesignConvert.getW(25),
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(14),
                                color: '#252525',
                                lineHeight: DesignConvert.getH(20),
                            }}
                        >
                            {'上传身份证人像面'}
                        </Text>

                        <Text
                            style={{
                                width: DesignConvert.getW(165),
                                fontSize: DesignConvert.getF(12),
                                color: '#828282',
                                marginTop: DesignConvert.getH(10),
                                lineHeight: DesignConvert.getH(16.5),
                            }}
                        >
                            {'请保持照片中身份证显示完成字体清晰可见，亮度均匀'}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(30),
                    }}
                >
                    <TouchableOpacity
                        onPress={this._clickBackPic}
                    >
                        <Image 
                            source={this._backPath ? {uri: this._backPath} : require('../../hardcode/skin_imgs/lvdong').cert_back_pic()}
                            style={{
                                width: DesignConvert.getW(155),
                                height: DesignConvert.getH(85),
                                borderRadius: DesignConvert.getW(12),
                            }}
                        />
                    </TouchableOpacity>

                    <View
                        style={{
                            marginLeft: DesignConvert.getW(25),
                        }}
                    >
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(14),
                                color: '#252525',
                                lineHeight: DesignConvert.getH(20),
                            }}
                        >
                            {'上传身份证国徽面'}
                        </Text>

                        <Text
                            style={{
                                width: DesignConvert.getW(165),
                                fontSize: DesignConvert.getF(12),
                                color: '#828282',
                                marginTop: DesignConvert.getH(10),
                                lineHeight: DesignConvert.getH(16.5),
                            }}
                        >
                            {'请保持照片中身份证显示完整字体清晰可见，亮度均匀'}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(40),
                    }}>

                    <Text
                        style={{
                            color: "#222222",
                            fontSize: DesignConvert.getF(14),
                            marginLeft: DesignConvert.getW(25),
                            marginRight: DesignConvert.getW(5),
                        }}>
                        {"真实姓名："}
                    </Text>

                    <TextInput
                        style={{
                            width: DesignConvert.getW(230),
                            height: DesignConvert.getH(27),
                            borderRadius: DesignConvert.getW(5),
                            backgroundColor: '#F3F3F3',
                            padding: 0,
                            textAlign: 'center',
                            color: "#222222",
                            fontSize: DesignConvert.getF(11),
                        }}
                        value={this._realName}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        placeholder="请输入您的真实姓名"
                        placeholderTextColor="rgba(0, 0, 0, 0.26)"
                        returnKeyType='next'
                        onChangeText={this._onChangeRealName}
                    ></TextInput>
                </View>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: DesignConvert.getH(25),
                    }}
                >
                    <Text
                        style={{
                            color: "#222222",
                            fontSize: DesignConvert.getF(14),
                            marginLeft: DesignConvert.getW(25),
                            marginRight: DesignConvert.getW(5),
                        }}>
                        {"身份证号："}
                    </Text>

                    <TextInput
                        style={{
                            width: DesignConvert.getW(230),
                            height: DesignConvert.getH(27),
                            borderRadius: DesignConvert.getW(5),
                            backgroundColor: '#F3F3F3',
                            padding: 0,
                            textAlign: 'center',
                            color: "#222222",
                            fontSize: DesignConvert.getF(11),
                        }}
                        value={this._IDCard}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        placeholder="请输入与您姓名一致的身份证号码"
                        placeholderTextColor="rgba(0, 0, 0, 0.26)"
                        returnKeyType="done"
                        onChangeText={this._onChangeIDCard}
                    ></TextInput>
                </View>
                
                <TouchableOpacity
                    onPress={this._commitAudit}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={['#FF5245', '#CD0031']}

                        style={{
                            width: DesignConvert.getW(245),
                            height: DesignConvert.getH(40),
                            borderRadius: DesignConvert.getW(20),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: DesignConvert.getH(150),
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(15),
                            }}
                        >{'提交审核'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }

    _cert_status = () => {
        let _text1 = '';
        let _text2 = '';
        let _btnText = '';
        let _img = null;
        switch(_certificationStatus) {
            case 0:
                _text1 = '审核中...';
                _text2 = '预计24小时内审核完成\n如有疑问，请联系官方客服';
                _img = require('../../hardcode/skin_imgs/lvdong').cert_ing;
                _btnText = '认证中...';
                break;
            case 1:
                _text1 = '认证失败';
                _text2 = '请重新进行实名认证';
                _img = require('../../hardcode/skin_imgs/lvdong').cert_fail;
                _btnText = '重新认证';
                break;
            case 2:
                _text1 = '认证成功';
                _text2 = '恭喜您已认证成功';
                _img = require('../../hardcode/skin_imgs/lvdong').cert_suc;
                _btnText = '完成';
                break;
        }

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    alignItems: "center",
                }}
            >
                <BackTitleView
                    titleText={"实名认证"}
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
                    source={_img()}
                    style={{
                        width: DesignConvert.getW(145),
                        height: DesignConvert.getH(120),
                        marginTop: DesignConvert.getH(81),
                    }}
                />

                <Text
                    style={{
                        fontSize: DesignConvert.getF(18),
                        color: '#222222',
                        marginTop: DesignConvert.getH(50),
                        fontWeight: 'bold',
                    }}
                >
                    {_text1}
                </Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(13),
                        color: '#9B9B9B',
                        marginTop: DesignConvert.getH(20),
                        textAlign: 'center',
                    }}
                >
                    {_text2}
                </Text>

                <TouchableOpacity
                    onPress={()=>{
                        if (_certificationStatus == 2 || _certificationStatus == 0) {
                            this.popSelf()
                        } else if (_certificationStatus == 1) {
                            _certificationStatus = -1;
                            this.forceUpdate();
                        }
                    }}
                    style={{
                        position: 'absolute',
                        bottom: DesignConvert.getH(110) + DesignConvert.addIpxBottomHeight(),
                        left: DesignConvert.getW(65),
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={['#FF5245', '#CD0031']}

                        style={{
                            width: DesignConvert.getW(245),
                            height: DesignConvert.getH(40),
                            borderRadius: DesignConvert.getW(20),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(15),
                            }}
                        >{_btnText}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        switch(_certificationStatus) {
            case -1:
                return this._cert_not();
            default:
                return this._cert_status();
        }

        // if (this._currentIndex == 3) {
        //     return (
        //         <View
        //             style={{
        //                 flex: 1,
        //                 backgroundColor: "#FFFFFF",
        //                 alignItems: "center",
        //             }}>

        //             <LinearGradient
        //                 start={{ x: 1, y: 0 }}
        //                 end={{ x: 0, y: 0 }}
        //                 colors={LINEARGRADIENT_COLOR}>

        //                 <BackTitleView
        //                     titleText={"实名认证"}
        //                     onBack={this.popSelf}
        //                     bgColor={["#DB435600", "#DB435600"]}
        //                     titleTextStyle={{
        //                         color: "white",
        //                     }}
        //                     backImgStyle={{
        //                         tintColor: "white",
        //                     }}
        //                 />

        //                 <View
        //                     style={{
        //                         width: DesignConvert.swidth,
        //                         height: DesignConvert.getH(102),
        //                         flexDirection: "row",
        //                         justifyContent: "center",
        //                         alignItems: "center",
        //                     }}>

        //                     {this._stepList.map((item, index) => (
        //                         <_Item
        //                             currentIndex={this._currentIndex}
        //                             index={index}
        //                             item={item}
        //                             maxCount={this._stepList.length}
        //                         />
        //                     ))}
        //                 </View>
        //             </LinearGradient>

        //             <_CertStatusItem
        //                 status={_certificationStatus}
        //             />

        //             <SubmitButton
        //                 style={{
        //                     marginTop: DesignConvert.getH(30)
        //                 }}
        //                 enable={this._getSubmitEnable()}
        //                 btnText={this._getSubmitTxt()}
        //                 onPress={this._commitAudit}></SubmitButton>

        //         </View>

        //     )
        // }
        // return (
        //     <View
        //         style={{
        //             flex: 1,
        //             backgroundColor: "#FFFFFF",
        //             alignItems: "center",
        //         }}>

        //         <LinearGradient
        //             start={{ x: 1, y: 0 }}
        //             end={{ x: 0, y: 0 }}
        //             colors={LINEARGRADIENT_COLOR}>

        //             <BackTitleView
        //                 titleText={"实名认证"}
        //                 onBack={this.popSelf}
        //                 bgColor={["#DB435600", "#DB435600"]}
        //                 titleTextStyle={{
        //                     color: "white",
        //                 }}
        //                 backImgStyle={{
        //                     tintColor: "white",
        //                 }}
        //             />

        //             <View
        //                 style={{
        //                     width: DesignConvert.swidth,
        //                     height: DesignConvert.getH(102),
        //                     flexDirection: "row",
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                 }}>

        //                 {this._stepList.map((item, index) => (
        //                     <_Item
        //                         currentIndex={this._currentIndex}
        //                         index={index}
        //                         item={item}
        //                         maxCount={this._stepList.length}
        //                     />
        //                 ))}
        //             </View>
        //         </LinearGradient>

        //         <CertificationInputPage
        //             getRealNameIDCard={this._getRealNameIDCard}
        //             style={{
        //                 display: this._currentIndex == 0 ? "flex" : "none",
        //             }} />

        //         <View
        //             style={{
        //                 alignItems: "center",
        //                 display: this._currentIndex == 1 || this._currentIndex == 2 ? "flex" : "none",
        //             }}>

        //             <ImageBackground
        //                 source={ic_cer_bg()}
        //                 style={{
        //                     width: DesignConvert.getW(335),
        //                     height: DesignConvert.getH(215),
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                 }}>

        //                 {this._currentIndex == 1 ? (
        //                     <TouchableOpacity
        //                         onPress={this._clickFontPic}>
        //                         <ImageBackground
        //                             source={{ uri: !this._fontPath ? null : this._fontPath }}
        //                             style={{
        //                                 width: DesignConvert.getW(270),
        //                                 height: DesignConvert.getH(155),
        //                                 justifyContent: "center",
        //                                 alignItems: "center",
        //                             }}>

        //                             <Image
        //                                 source={ic_pic()}
        //                                 style={{
        //                                     width: DesignConvert.getW(60),
        //                                     height: DesignConvert.getH(60),
        //                                 }} />

        //                             {!this._fontPath ? (
        //                                 <Text
        //                                     style={{
        //                                         color: "#999999",
        //                                         fontSize: DesignConvert.getF(11),
        //                                         marginTop: DesignConvert.getH(12),
        //                                     }}>
        //                                     {"点击上传证件"}

        //                                     <Text
        //                                         style={{
        //                                             color: THEME_COLOR,
        //                                         }}>
        //                                         {"人像面"}
        //                                     </Text>
        //                                 </Text>
        //                             ) : (
        //                                     <Text
        //                                         style={{
        //                                             color: "white",
        //                                             fontSize: DesignConvert.getF(11),
        //                                             marginTop: DesignConvert.getH(12),
        //                                         }}>
        //                                         {"点击更换"}
        //                                     </Text>
        //                                 )}
        //                         </ImageBackground>
        //                     </TouchableOpacity>
        //                 ) : (
        //                         <TouchableOpacity
        //                             onPress={this._clickBackPic}>
        //                             <ImageBackground
        //                                 source={{ uri: !this._backPath ? null : this._backPath }}
        //                                 style={{
        //                                     width: DesignConvert.getW(270),
        //                                     height: DesignConvert.getH(155),
        //                                     justifyContent: "center",
        //                                     alignItems: "center",
        //                                 }}>

        //                                 <Image
        //                                     source={ic_pic()}
        //                                     style={{
        //                                         width: DesignConvert.getW(60),
        //                                         height: DesignConvert.getH(60),
        //                                     }} />

        //                                 {!this._backPath ? (
        //                                     <Text
        //                                         style={{
        //                                             color: "#999999",
        //                                             fontSize: DesignConvert.getF(11),
        //                                             marginTop: DesignConvert.getH(12),
        //                                         }}>
        //                                         {"点击上传证件"}

        //                                         <Text
        //                                             style={{
        //                                                 color: THEME_COLOR,
        //                                             }}>
        //                                             {"国徽面"}
        //                                         </Text>
        //                                     </Text>
        //                                 ) : (
        //                                         <Text
        //                                             style={{
        //                                                 color: "white",
        //                                                 fontSize: DesignConvert.getF(11),
        //                                                 marginTop: DesignConvert.getH(12),
        //                                             }}>
        //                                             {"点击更换"}
        //                                         </Text>
        //                                     )}
        //                             </ImageBackground>
        //                         </TouchableOpacity>
        //                     )}
        //             </ImageBackground>

        //             <_IDCardDescItem />

        //             <SubmitButton
        //                 style={{
        //                     marginTop: DesignConvert.getH(30)
        //                 }}
        //                 enable={this._getSubmitEnable()}
        //                 btnText={this._getSubmitTxt()}
        //                 onPress={this._commitAudit}></SubmitButton>

        //         </View>

        //     </View>
        // )
    }
}