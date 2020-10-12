/**
 * 手机号绑定显示页
 */

'use strict';

import React, { PureComponent } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView } from "react-native";
import DesignConvert from '../../../utils/DesignConvert';
import { ic_bind_phone, } from '../../../hardcode/skin_imgs/setting';
import { LINEARGRADIENT_COLOR, THEME_COLOR } from '../../../styles';
import UserInfoCache from '../../../cache/UserInfoCache';
import { SubmitButton } from '../../anchorincome/VerifyPayPasswordView';

export default class _BindPhoneItem extends PureComponent {
    constructor(props) {
        super(props);

        let phone = UserInfoCache.phoneNumber;
        this._phoneNum = phone.slice(0, 3) + "******" + phone.slice(phone.length - 3);
    }

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(450),
                }}>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(0.5),
                        backgroundColor: "#979797",
                    }}></View>

                <Image
                    source={ic_bind_phone()}
                    style={{
                        width: DesignConvert.getW(67),
                        height: DesignConvert.getH(100),
                        marginTop: DesignConvert.getH(54),
                        alignSelf: "center",
                    }}></Image>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(14),
                        marginTop: DesignConvert.getH(45),
                        alignSelf: "center",
                    }}>
                    {`您已绑定手机号码${this._phoneNum}，`}
                </Text>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(14),
                        alignSelf: "center",
                    }}>
                    {`点击下方换绑按钮可更换绑定手机号；`}
                </Text>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(11),
                        marginLeft: DesignConvert.getW(27),
                        marginTop: DesignConvert.getH(40),
                    }}>
                    {`温馨提示：`}
                </Text>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(11),
                        marginHorizontal: DesignConvert.getW(27),
                        marginTop: DesignConvert.getH(5),
                    }}>
                    {`1.无法解绑手机号：手机号一旦换绑，则所关联的实名认证手机号、提现手机号将全部更换为新手机号。`}
                </Text>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(11),
                        marginHorizontal: DesignConvert.getW(27),
                        marginTop: DesignConvert.getH(2),
                    }}>
                    {`2.若您的账号使用手机号登录，换绑后，将仍用原手机号作为登录手机号。`}
                </Text>


                <SubmitButton
                    style={{
                        marginTop: DesignConvert.getH(100),
                    }}
                    enable={true}
                    btnText={"更换手机号码"}
                    onPress={this._onPress}></SubmitButton>
            </View>
        )
    }
}